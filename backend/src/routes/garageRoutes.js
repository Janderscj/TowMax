const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const authenticateUser = require('../middleware/authenticateUser');
const decodeVin = require('../utils/vinDecoder');

function isValidVin(vin) {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}

// GET /api/garage
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.role === 'dealer') {
      return res.status(403).json({ error: 'Dealers do not use garage endpoints' });
    }

    const { data: garage, error } = await supabase
      .from('garage')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching garage:', error);
      return res.status(500).json({ error: 'Failed to fetch garage' });
    }

    res.json(garage);
  } catch (err) {
    console.error('Garage fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add', authenticateUser, async (req, res) => {
  try {
    const vin = req.body.vin?.toUpperCase();

    if (!vin) {
      return res.status(400).json({ error: 'VIN is required' });
    }

    if (!isValidVin(vin)) {
      return res.status(400).json({ error: 'Invalid VIN format' });
    }

    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, garage_limit')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Dealers cannot save vehicles
    if (profile.role === 'dealer') {
      return res.status(403).json({
        error: 'Dealers do not use garage endpoints',
      });
    }

    // Check for duplicate VIN
    const { data: existingVin } = await supabase
      .from('garage')
      .select('id')
      .eq('user_id', userId)
      .eq('vin', vin);

    if (existingVin && existingVin.length > 0) {
      return res.status(400).json({ error: 'VIN already exists in garage' });
    }

    const decoded = await decodeVin(vin);

    if (!decoded || !decoded.year || !decoded.make || !decoded.model) {
      return res.status(400).json({ error: 'VIN decode failed' });
    }

    const { count: vehicleCount, error: countError } = await supabase
      .from('garage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      return res.status(500).json({ error: 'Failed to check garage limit' });
    }

    if (profile.garage_limit != null && vehicleCount >= profile.garage_limit) {
      return res.status(403).json({
        error: `Garage limit reached (${profile.garage_limit} vehicles).`,
      });
    }

    // Insert vehicle
    const { data: saved, error: insertError } = await supabase
      .from('garage')
      .insert({
        user_id: userId,
        vin,
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        trim: decoded.series || null,
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    res.json({ success: true, vehicle: saved });
  } catch (err) {
    console.error('Garage add error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// POST /api/garage/remove
router.post('/remove', authenticateUser, async (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ error: 'Vehicle ID is required' });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.role === 'dealer') {
      return res.status(403).json({ error: 'Dealers do not use garage endpoints' });
    }

    // Check if vehicle exists and belongs to user
    const { data: vehicle, error: vehicleError } = await supabase
      .from('garage')
      .select('id')
      .eq('id', vehicleId)
      .eq('user_id', req.user.id)
      .single();

    if (vehicleError || !vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // For free users, check if this is their only vehicle
    if (profile.role === 'free') {
      const { count: garageCount, error: garageError } = await supabase
        .from('garage')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', req.user.id);

      if (garageError) {
        return res.status(500).json({ error: 'Failed to check garage' });
      }

      if ((garageCount || 0) <= 1) {
        return res.status(403).json({ error: 'Free users cannot remove their only vehicle' });
      }
    }

    const { error } = await supabase
      .from('garage')
      .delete()
      .eq('id', vehicleId)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Error removing vehicle:', error);
      return res.status(500).json({ error: 'Failed to remove vehicle' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Remove vehicle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

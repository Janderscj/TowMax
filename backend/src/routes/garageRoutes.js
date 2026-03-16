const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware to verify JWT token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

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

// POST /api/garage/add
router.post('/add', authenticateUser, async (req, res) => {
  const { vin, year, make, model, trim } = req.body;

  if (!vin || !year || !make || !model) {
    return res.status(400).json({ error: 'VIN, year, make, and model are required' });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, garage_limit')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.role === 'dealer') {
      return res.status(403).json({ error: 'Dealers do not use garage endpoints' });
    }

    // Check current garage count
    const { data: garage, error: garageError } = await supabase
      .from('garage')
      .select('id')
      .eq('user_id', req.user.id);

    if (garageError) {
      return res.status(500).json({ error: 'Failed to check garage' });
    }

    const currentCount = garage.length;

    if (profile.role === 'free' && currentCount >= 1) {
      return res.status(403).json({ error: 'Free users can only have 1 vehicle' });
    }

    if (
      profile.role === 'premium' &&
      profile.garage_limit &&
      currentCount >= profile.garage_limit
    ) {
      return res
        .status(403)
        .json({ error: `Premium users can have up to ${profile.garage_limit} vehicles` });
    }

    // Check if VIN already exists in garage
    const { data: existingVin, error: vinError } = await supabase
      .from('garage')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('vin', vin);

    if (vinError) {
      return res.status(500).json({ error: 'Failed to check VIN' });
    }

    if (existingVin.length > 0) {
      return res.status(400).json({ error: 'VIN already exists in garage' });
    }

    const { data: newVehicle, error } = await supabase
      .from('garage')
      .insert({
        user_id: req.user.id,
        vin,
        year,
        make,
        model,
        trim,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding vehicle:', error);
      return res.status(500).json({ error: 'Failed to add vehicle' });
    }

    res.json(newVehicle);
  } catch (err) {
    console.error('Add vehicle error:', err);
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
      const { data: garage, error: garageError } = await supabase
        .from('garage')
        .select('id')
        .eq('user_id', req.user.id);

      if (garageError) {
        return res.status(500).json({ error: 'Failed to check garage' });
      }

      if (garage.length <= 1) {
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

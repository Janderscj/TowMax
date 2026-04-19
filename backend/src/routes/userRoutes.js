import express from 'express';
import supabase from '../utils/supabaseClient.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();
const defaultProfile = {
  role: 'free',
  garage_limit: 1,
  can_replace_free_vehicle: false,
};

// GET /api/user/profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    if (!profile) {
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: req.user.id, ...defaultProfile })
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating missing profile:', createError);
        return res.status(500).json({ error: 'Failed to create profile' });
      }

      return res.json(createdProfile);
    }

    res.json(profile);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/role/update
router.post('/role/update', authenticateUser, async (req, res) => {
  const { role } = req.body;

  if (!['free', 'premium', 'dealer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    let garageLimit = null;
    let canReplaceFreeVehicle = false;

    if (role === 'free') {
      garageLimit = 1;
      canReplaceFreeVehicle = false;
    } else if (role === 'premium') {
      garageLimit = null;
      canReplaceFreeVehicle = true;
    } else if (role === 'dealer') {
      garageLimit = null;
      canReplaceFreeVehicle = true;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        role,
        garage_limit: garageLimit,
        can_replace_free_vehicle: canReplaceFreeVehicle,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({ error: 'Failed to update role' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

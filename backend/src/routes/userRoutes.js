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
  return res.status(403).json({
    error: 'Role updates are managed server-side only',
  });
});

export default router;

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Supabase client (using service role for server-side operations)
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

// GET /api/user/profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
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
      garageLimit = 5;
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

module.exports = router;

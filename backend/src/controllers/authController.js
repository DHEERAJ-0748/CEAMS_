import bcrypt from 'bcrypt';
import supabase from '../config/supabaseClient.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, role, club_name, institution_id, department } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const { data: userExists } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (userExists) {
      console.log(`Registration failed: User already exists - ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role,
          club_name: role === 'club' ? club_name : null,
          institution_id: role === 'principal' ? institution_id : null,
          department: role === 'principal' ? department : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Registration Error:', error);
      return res.status(400).json({ message: error.message });
    }

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        club_name: user.club_name,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check for user email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.log(`Login failed: User not found or Supabase error - ${email}`, error);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        club_name: user.club_name,
        token: generateToken(user.id, user.role),
      });
    } else {
      console.log(`Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Auth Controller Error:', error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ 
      message: error.message || 'Internal Server Error' 
    });
  }

};

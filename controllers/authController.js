// controllers/authController.js
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import csurf from 'csurf';

const csrfProtection = csurf({ cookie: true });
const User = db.User;

/**
 * GET /api/auth/csrf-token
 * Exposes a CSRF token to the client.
 */
export const getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

/**
 * POST /api/auth/register
 * Registers a new user. CSRF token is validated via csurf middleware.
 */
export const register = async (req, res) => {
  try {
    // At this point, the CSRF token has already been validated.
    const { username, fullName, email, password, role } = req.body;

    // Validate required fields.
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if username already exists.
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username is already taken.' });
    }

    // Check if email already exists.
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    // Create the new user (the model hook will hash the password).
    const newUser = await User.create({ username, fullName, email, password, role });

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * POST /api/auth/login
 * Logs in a user. CSRF token is validated via csurf middleware.
 */
export const login = async (req, res) => {
  try {
    // CSRF token is validated automatically.
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate a JWT token with the user's id and role.
    const token = generateToken({ id: user.id, role: user.role });

    // Set the JWT token as an HTTP-only cookie.
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * POST /api/auth/logout
 * Clears the authentication cookie.
 */
export const logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logout successful.' });
};

export { csrfProtection };

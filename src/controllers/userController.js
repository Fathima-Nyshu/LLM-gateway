const { createUser } = require('../services/userService');

async function signup(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'A valid "email" string is required.' });
    }

    const user = await createUser(email);

    res.status(201).json({
      message: 'User created successfully. Save your API key — it will not be shown again.',
      email: user.email,
      apiKey: user.apiKey,
    });
  } catch (error) {
    if (error.message === 'A user with this email already exists.') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
}

module.exports = { signup };
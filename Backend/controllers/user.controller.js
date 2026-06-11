import { User } from '../models/user.model.js';

// Sync Clerk user with MongoDB
export const syncUser = async (req, res) => {
  try {
    const { clerkId, name, email, phone, avatar } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ success: false, message: 'clerkId and email are required' });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        name: name || '',
        email,
        phone: phone || '',
        avatar: avatar || '',
      },
      { returnDocument: 'after', upsert: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, message: 'Failed to sync user' });
  }
};

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@propertyhub.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      console.log('Email: admin@propertyhub.com');
      console.log('Password: Admin@123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@propertyhub.com',
      password: 'Admin@123',
      phone: '+1234567890',
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created successfully!');
    console.log('----------------------------------------');
    console.log('Email: admin@propertyhub.com');
    console.log('Password: Admin@123');
    console.log('----------------------------------------');
    console.log('Please use these credentials to login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();

# Admin Dashboard Setup Guide

## Creating Admin User

To create an admin user for testing the admin dashboard, run the following command:

```bash
cd server
npm run create-admin
```

This will create an admin user with the following credentials:

**Email:** admin@propertyhub.com
**Password:** Admin@123

## Accessing Admin Dashboard

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login`

4. Login with the admin credentials above

5. You will be automatically redirected to `/admin` dashboard

## Admin Features

The admin dashboard includes:

- **Dashboard Overview**: View statistics for users, properties, and activities
- **User Management**: Manage all users, roles, and permissions
- **Property Management**: View and manage all property listings
- **Agents & Owners**: View agents and owners with their properties
- **Statistics**: Detailed analytics and reports
- **Profile Sidebar**: Access profile settings and logout

## User Roles

When logging in, users are redirected based on their role:
- **Admin** → `/admin`
- **Agent** → `/dashboard/agent`
- **Buyer/Owner** → `/dashboard`

## Logout

Click on your profile avatar in the top-right corner to access:
- Profile settings
- Account settings
- Activity log
- Notifications
- **Logout button** (at the bottom of the sidebar)

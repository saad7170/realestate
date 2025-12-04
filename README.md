# Property Listing Platform

A full-stack property listing platform built with MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
prototype/
├── server/          # Backend API (Node.js + Express)
└── client/          # Frontend (React + Vite)
```

## Features

- User authentication (Register, Login, JWT)
- Property listings (Buy, Rent, Projects)
- Property categories (Homes, Plots, Commercial)
- Advanced search and filters
- User dashboard
- Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Node.js & Express 5.x
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- Express Validator
- Bcrypt.js

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/property-listing
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the server:
```bash
npm run dev
```

The API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile
- `PUT /api/auth/updatepassword` - Change password

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### Cities
- `GET /api/cities` - Get all cities
- `GET /api/cities/:id` - Get city by ID

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries` - Get all inquiries (protected)
- `GET /api/inquiries/received` - Get received inquiries
- `GET /api/inquiries/sent` - Get sent inquiries

## Development Status

### Completed (Phase 1.1 & 1.2)
- ✅ Backend setup with Express 5.x
- ✅ MongoDB connection
- ✅ MVC pattern structure
- ✅ Environment variables
- ✅ Middleware (CORS, body-parser, auth, error handling)
- ✅ React app with Vite
- ✅ React Router v6
- ✅ Tailwind CSS configuration
- ✅ Frontend folder structure
- ✅ API service layer
- ✅ Auth context and hooks
- ✅ Layout components (Navbar, Footer)
- ✅ Base pages (Home, Login, Register, Properties, Dashboard, 404)

### Next Steps (Phase 2)
- Backend APIs implementation
- Property management CRUD
- Search and filter functionality
- Image upload with Cloudinary
- User favorites/wishlist

## Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT

# Property Listing Platform - Backend API

A comprehensive REST API for a real estate property listing platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Property CRUD operations with advanced filters
- Image upload with Cloudinary
- Pakistani cities with popular areas
- User favorites system
- Inquiry/contact system
- Role-based access control (buyer, seller, agent, admin)

## Tech Stack

- Node.js & Express 5.x
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary for image storage
- Bcrypt for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the server directory:
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

3. Start MongoDB locally or use MongoDB Atlas

4. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "03001234567",
  "role": "buyer" // or "seller", "agent", "admin"
}
```

#### Login
- **POST** `/api/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

#### Update Password
- **PUT** `/api/auth/update-password`
- **Access**: Private
- **Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Property Routes (`/api/properties`)

#### Get All Properties (with filters)
- **GET** `/api/properties`
- **Access**: Public
- **Query Parameters**:
  - `purpose`: buy | rent
  - `propertyType`: home | plot | commercial
  - `subType`: house | flat | upper-portion | etc
  - `city`: City name (case-insensitive)
  - `area`: Area name (case-insensitive)
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `minArea`: Minimum area value
  - `maxArea`: Maximum area value
  - `areaUnit`: marla | kanal | sq-ft | sq-yard | sq-meter
  - `bedrooms`: Number (or "5+" for 5 or more)
  - `bathrooms`: Number
  - `status`: active | sold | rented | inactive
  - `featured`: true | false
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12)
  - `sort`: price-asc | price-desc | area-asc | area-desc | newest | oldest

**Example**:
```
GET /api/properties?city=Islamabad&propertyType=home&minPrice=5000000&maxPrice=10000000&bedrooms=3&sort=price-asc
```

#### Get Single Property
- **GET** `/api/properties/:id`
- **Access**: Public
- **Note**: Automatically increments view count

#### Get Similar Properties
- **GET** `/api/properties/:id/similar`
- **Access**: Public
- **Returns**: Up to 6 similar properties (same type, city, similar price range)

#### Create Property
- **POST** `/api/properties`
- **Access**: Private (Authenticated users)
- **Body**:
```json
{
  "title": "Beautiful 3 Bedroom House in F-7",
  "description": "Spacious house with modern amenities...",
  "purpose": "buy",
  "propertyType": "home",
  "subType": "house",
  "price": 8500000,
  "area": {
    "value": 10,
    "unit": "marla"
  },
  "location": {
    "city": "Islamabad",
    "area": "F-7",
    "address": "Street 25, F-7/2",
    "coordinates": {
      "lat": 33.7294,
      "lng": 73.0931
    }
  },
  "features": {
    "bedrooms": 3,
    "bathrooms": 3,
    "parking": 2,
    "furnished": true
  },
  "images": ["cloudinary_url_1", "cloudinary_url_2"]
}
```

#### Update Property
- **PUT** `/api/properties/:id`
- **Access**: Private (Owner or Admin)
- **Body**: Same as create (partial updates supported)

#### Delete Property
- **DELETE** `/api/properties/:id`
- **Access**: Private (Owner or Admin)

### Upload Routes (`/api/upload`)

#### Upload Single Image
- **POST** `/api/upload/image`
- **Access**: Private
- **Body**: FormData with `image` field
- **Returns**: Cloudinary URL and public ID

#### Upload Multiple Images
- **POST** `/api/upload/images`
- **Access**: Private
- **Body**: FormData with `images` field (max 20)
- **Returns**: Array of Cloudinary URLs and public IDs

#### Delete Image
- **DELETE** `/api/upload/image`
- **Access**: Private
- **Body**:
```json
{
  "publicId": "cloudinary_public_id"
}
```

### City Routes (`/api/cities`)

#### Get All Cities
- **GET** `/api/cities`
- **Access**: Public
- **Returns**: All active Pakistani cities

#### Get Single City
- **GET** `/api/cities/:identifier`
- **Access**: Public
- **Note**: Can use city ID or slug

#### Get City Areas
- **GET** `/api/cities/:identifier/areas`
- **Access**: Public
- **Returns**: Popular areas for the city

#### Seed Cities (Admin)
- **POST** `/api/cities/seed`
- **Access**: Private (Admin only)
- **Note**: Populates database with Pakistani cities

### User Routes (`/api/users`)

#### Get User Profile
- **GET** `/api/users/profile`
- **Access**: Private

#### Update User Profile
- **PUT** `/api/users/profile`
- **Access**: Private
- **Body**:
```json
{
  "name": "Updated Name",
  "phone": "03001234567",
  "avatar": "cloudinary_url"
}
```

#### Get User's Properties
- **GET** `/api/users/properties`
- **Access**: Private
- **Query**: `status`, `page`, `limit`

#### Get Favorite Properties
- **GET** `/api/users/favorites`
- **Access**: Private

#### Add to Favorites
- **POST** `/api/users/favorites/:propertyId`
- **Access**: Private

#### Remove from Favorites
- **DELETE** `/api/users/favorites/:propertyId`
- **Access**: Private

### Inquiry Routes (`/api/inquiries`)

#### Submit Inquiry
- **POST** `/api/inquiries`
- **Access**: Private
- **Body**:
```json
{
  "property": "property_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "03001234567",
  "message": "I'm interested in this property..."
}
```

#### Get Property Inquiries (Owner)
- **GET** `/api/inquiries/property/:propertyId`
- **Access**: Private (Property owner or Admin)

#### Get Sent Inquiries
- **GET** `/api/inquiries/sent`
- **Access**: Private
- **Returns**: Inquiries sent by current user

#### Get Received Inquiries
- **GET** `/api/inquiries/received`
- **Access**: Private
- **Returns**: Inquiries for current user's properties

#### Update Inquiry Status
- **PUT** `/api/inquiries/:id`
- **Access**: Private (Property owner or Admin)
- **Body**:
```json
{
  "status": "contacted" // or "new", "closed"
}
```

#### Delete Inquiry
- **DELETE** `/api/inquiries/:id`
- **Access**: Private (Sender or Admin)

## Database Models

### User
- name, email, password, phone, role, avatar, isVerified, savedProperties

### Property
- title, description, purpose, propertyType, subType, price, area, location, features, images, owner, status, featured, views

### City
- name, slug, popularAreas, isActive

### Inquiry
- property, sender, name, email, phone, message, status

## Property Sub-Types by Category

### Homes
- House
- Flat
- Upper Portion
- Lower Portion
- Farm House
- Room
- Penthouse

### Plots
- Residential Plot
- Commercial Plot
- Agricultural Land
- Industrial Land

### Commercial
- Office
- Shop
- Warehouse
- Building
- Factory
- Other

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 12,
  "total": 150,
  "page": 1,
  "pages": 13,
  "data": [ /* items */ ]
}
```

## Authentication

Protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access

- **buyer**: Default role, can browse and inquire
- **seller**: Can list properties
- **agent**: Professional listings
- **admin**: Full access to all features

## Development

### Project Structure
```
server/
├── config/          # Database and Cloudinary config
├── controllers/     # Request handlers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Auth and upload middleware
├── utils/           # Helper functions and seeders
├── .env            # Environment variables
├── server.js       # Entry point
└── package.json
```

### Testing Endpoints

Use tools like Postman or Thunder Client to test the API endpoints.

## License

ISC

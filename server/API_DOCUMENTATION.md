# Property Listing Platform - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+92 300 1234567",
  "role": "buyer" // buyer, seller, agent
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "jwt_token_here"
  }
}
```

### Get Current User
**GET** `/auth/me` 🔒

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "savedProperties": [...]
  }
}
```

### Update Password
**PUT** `/auth/update-password` 🔒

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Update Profile
**PUT** `/auth/update-profile` 🔒

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+92 300 9876543",
  "avatar": "https://cloudinary.com/image.jpg"
}
```

---

## Property Endpoints

### Get All Properties
**GET** `/properties`

**Query Parameters:**
- `purpose` - buy | rent
- `propertyType` - home | plot | commercial
- `subType` - house, flat, upper-portion, etc.
- `city` - City name
- `area` - Area/location name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minArea` - Minimum area value
- `maxArea` - Maximum area value
- `areaUnit` - marla | kanal | sq-ft | sq-yard | sq-meter
- `bedrooms` - Number of bedrooms (or "5+" for 5 or more)
- `bathrooms` - Number of bathrooms
- `status` - active | sold | rented | inactive (default: active)
- `featured` - true | false
- `sort` - newest | oldest | price-asc | price-desc | area-asc | area-desc
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```
GET /properties?purpose=buy&propertyType=home&city=Islamabad&minPrice=5000000&maxPrice=10000000&bedrooms=3&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 150,
  "page": 1,
  "pages": 13,
  "data": [
    {
      "_id": "...",
      "title": "Beautiful 3 Bedroom House",
      "price": 7500000,
      "area": {
        "value": 5,
        "unit": "marla"
      },
      "location": {
        "city": "Islamabad",
        "area": "F-11"
      },
      "images": [...],
      "owner": {...}
    }
  ]
}
```

### Get Featured Properties
**GET** `/properties/featured`

**Query Parameters:**
- `limit` - Number of results (default: 6)

### Get Property Statistics
**GET** `/properties/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalProperties": 500,
      "totalForSale": 300,
      "totalForRent": 200,
      "totalHomes": 250,
      "totalPlots": 150,
      "totalCommercial": 100,
      "avgPrice": 5500000,
      "minPrice": 500000,
      "maxPrice": 50000000
    },
    "topCities": [
      { "_id": "Islamabad", "count": 200 },
      { "_id": "Lahore", "count": 150 }
    ]
  }
}
```

### Get Single Property
**GET** `/properties/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Beautiful House",
    "description": "...",
    "purpose": "buy",
    "propertyType": "home",
    "subType": "house",
    "price": 7500000,
    "area": {
      "value": 5,
      "unit": "marla"
    },
    "location": {
      "city": "Islamabad",
      "area": "F-11",
      "address": "Street 123"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parking": 1,
      "furnished": false
    },
    "images": [...],
    "owner": {...},
    "views": 45,
    "postedAgo": "2 days ago"
  }
}
```

### Get Similar Properties
**GET** `/properties/:id/similar`

Returns up to 6 similar properties (same type, city, similar price range).

### Get My Properties
**GET** `/properties/user/my-properties` 🔒

**Query Parameters:**
- `status` - active | sold | rented | inactive
- `page` - Page number
- `limit` - Items per page

### Create Property
**POST** `/properties` 🔒

**Body:**
```json
{
  "title": "Beautiful 3 Bedroom House in F-11",
  "description": "Spacious house with modern amenities...",
  "purpose": "buy",
  "propertyType": "home",
  "subType": "house",
  "price": 7500000,
  "area": {
    "value": 5,
    "unit": "marla"
  },
  "location": {
    "city": "Islamabad",
    "area": "F-11",
    "address": "Street 123, House 456"
  },
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "parking": 1,
    "furnished": false
  },
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

### Update Property
**PUT** `/properties/:id` 🔒

Only owner or admin can update.

### Delete Property
**DELETE** `/properties/:id` 🔒

Only owner or admin can delete.

---

## User Endpoints

### Get User Profile
**GET** `/users/profile` 🔒

### Update User Profile
**PUT** `/users/profile` 🔒

**Body:**
```json
{
  "name": "Updated Name",
  "phone": "+92 300 1234567",
  "avatar": "https://cloudinary.com/avatar.jpg"
}
```

### Get User's Properties
**GET** `/users/properties` 🔒

### Get Favorites
**GET** `/users/favorites` 🔒

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Add to Favorites
**POST** `/users/favorites/:propertyId` 🔒

### Remove from Favorites
**DELETE** `/users/favorites/:propertyId` 🔒

---

## City Endpoints

### Get All Cities
**GET** `/cities`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "name": "Islamabad",
      "slug": "islamabad",
      "popularAreas": ["F-11", "F-10", "G-13", "Bahria Town"]
    }
  ]
}
```

### Get Single City
**GET** `/cities/:identifier`

Identifier can be either city ID or slug.

### Get City Areas
**GET** `/cities/:identifier/areas`

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": ["F-11", "F-10", "G-13", "Bahria Town", ...]
}
```

### Seed Cities (Admin Only)
**POST** `/cities/seed` 🔒 (Admin)

---

## Inquiry Endpoints

### Submit Inquiry
**POST** `/inquiries` 🔒

**Body:**
```json
{
  "property": "property_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "message": "I'm interested in this property..."
}
```

### Get Sent Inquiries
**GET** `/inquiries/sent` 🔒

Returns all inquiries sent by the current user.

### Get Received Inquiries
**GET** `/inquiries/received` 🔒

Returns all inquiries received for user's properties.

### Get Property Inquiries
**GET** `/inquiries/property/:propertyId` 🔒

Only property owner can view.

### Update Inquiry Status
**PUT** `/inquiries/:id` 🔒

**Body:**
```json
{
  "status": "contacted" // pending | contacted | closed
}
```

### Delete Inquiry
**DELETE** `/inquiries/:id` 🔒

Only sender or admin can delete.

---

## Upload Endpoints

### Upload Single Image
**POST** `/upload/image` 🔒

**Form Data:**
- `image` - Image file (max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://cloudinary.com/image.jpg",
    "publicId": "property-listings/abc123"
  }
}
```

### Upload Multiple Images
**POST** `/upload/images` 🔒

**Form Data:**
- `images` - Multiple image files (max 20 images, 5MB each)

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "count": 3,
  "data": [
    {
      "url": "https://cloudinary.com/image1.jpg",
      "publicId": "property-listings/abc123"
    },
    ...
  ]
}
```

### Delete Image
**DELETE** `/upload/image` 🔒

**Body:**
```json
{
  "publicId": "property-listings/abc123"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Validation Rules

### User Registration
- Name: 2-50 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Phone: Valid phone format
- Role: buyer | seller | agent

### Property Creation
- Title: 10-200 characters
- Description: 50-2000 characters
- Purpose: buy | rent
- Property Type: home | plot | commercial
- Price: Non-negative number
- Area value: Greater than 0
- Area unit: marla | kanal | sq-ft | sq-yard | sq-meter
- Images: Maximum 20 images

### Inquiry
- Message: 10-500 characters
- Email: Valid email format
- Property ID: Valid MongoDB ObjectId

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+92 300 1234567",
    "role": "seller"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Properties
```bash
curl http://localhost:5000/api/properties?purpose=buy&city=Islamabad
```

### Create Property (with auth)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Beautiful House",
    "description": "A beautiful house with modern amenities and great location...",
    "purpose": "buy",
    "propertyType": "home",
    "subType": "house",
    "price": 7500000,
    "area": {"value": 5, "unit": "marla"},
    "location": {
      "city": "Islamabad",
      "area": "F-11"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2
    }
  }'
```

---

## Notes

- 🔒 indicates protected routes requiring authentication
- All dates are returned in ISO 8601 format
- All prices are in PKR (Pakistani Rupees)
- Pagination starts from page 1
- Default timezone is UTC

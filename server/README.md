# Lâl - Backend Server

Node.js/Express backend API for the Lâl luxury jewelry e-commerce platform.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Auth Library** - OAuth integration

## 📁 Structure

```
server/
├── models/              # Mongoose schemas
│   ├── Order.js         # Order model
│   ├── Product.js       # Product model
│   └── User.js          # User model
│
├── routes/              # Express route handlers
│   ├── authRoutes.js    # Authentication endpoints
│   ├── productRoutes.js # Product endpoints
│   └── orderRoutes.js   # Order endpoints
│
├── middleware/          # Custom middleware
│   └── authMiddleware.js # JWT verification
│
├── seed.js              # Database seeder
├── server.js            # App entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Seed the database
node seed.js

# Start the server
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lal_jewelry

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Server Port
PORT=5001
```

## 📡 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/google` | Google OAuth login | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update user profile | ✅ |

### Products (`/products`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products | ❌ |
| GET | `/products/:id` | Get product by ID | ❌ |
| GET | `/products/featured/list` | Get featured products | ❌ |

### Orders (`/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create new order | ✅ |
| GET | `/orders/myorders` | Get user's orders | ✅ |
| GET | `/orders/:id` | Get order by ID | ✅ |

### Countries (`/countries`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/countries` | Get all countries | ❌ |
| GET | `/countries/:code/cities` | Get cities by country | ❌ |

## 📊 Data Models

### User
```javascript
{
  name: String,           // First name
  surname: String,        // Last name
  email: String,          // Unique email
  password: String,       // Hashed password
  phone: String,
  gender: String,
  birthDate: Date,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  isAdmin: Boolean
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,       // Necklaces, Rings, Earrings, Bracelets
  images: [String],
  isFeatured: Boolean,
  stock: Number
}
```

### Order
```javascript
{
  user: ObjectId,
  orderItems: [{
    name: String,
    qty: Number,
    image: String,
    price: Number,
    product: ObjectId
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date
}
```

## 🌱 Database Seeding

Run the seed script to populate the database with sample data:

```bash
node seed.js
```

This will create:
- 11 sample products (jewelry items)
- 4 test users with different roles

### Test Users

| Email | Password | Role |
|-------|----------|------|
| `cagatay@example.com` | `123456` | User |
| `john@example.com` | `123456` | User |
| `jane@example.com` | `123456` | User |
| `admin@lal.com` | `admin123` | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server returns JWT token
3. Client includes token in `Authorization` header
4. Protected routes verify token via middleware

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Payload
```javascript
{
  id: "user_id",
  isAdmin: false,
  iat: 1234567890,
  exp: 1234571490  // 1 hour expiry
}
```

## 🚦 Error Handling

All endpoints return consistent error responses:

```javascript
{
  "message": "Error description here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `node seed.js` | Seed database |

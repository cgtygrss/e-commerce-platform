# ✨ Selené - Luxury Jewelry E-Commerce

<div align="center">

![Selené Logo](https://img.shields.io/badge/Selené-Luxury%20Jewelry-D4AF37?style=for-the-badge&logo=sparkles&logoColor=white)

A modern, full-stack e-commerce platform for luxury jewelry, built with the MERN stack.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

</div>

---

## 🌟 Features

### Shopping Experience
- 🛍️ **Product Catalog** - Browse jewelry by categories (Necklaces, Rings, Earrings, Bracelets)
- 🔍 **Product Details** - High-quality images with detailed descriptions
- 🛒 **Shopping Cart** - Add, remove, and update quantities
- 💳 **Checkout** - Multi-step checkout with shipping and payment
- 📦 **Order Tracking** - View order history in user profile

### User Features
- 👤 **User Authentication** - Register, login, and profile management
- 🔐 **Google OAuth** - Sign in with Google
- 📍 **Address Management** - Save shipping addresses
- 📱 **Responsive Design** - Optimized for all devices

### Design & UX
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 🎨 **Elegant UI** - Gold-accented luxury theme
- 🌙 **Modern Aesthetics** - Clean, minimalist design
- 🔄 **Loading States** - Skeleton loaders and smooth transitions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router 6 | Navigation |
| Framer Motion | Animations |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |

---

## 📁 Project Structure

```
bijuteri-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── pages/          # Page components
│   │   └── services/       # API service layer
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth middleware
│   ├── seed.js             # Database seeder
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cgtygrss/bijuteri-website.git
   cd bijuteri-website
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```

3. **Create environment file** (`server/.env`)
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   PORT=5001
   ```

4. **Seed the database**
   ```bash
   npm run seed
   # or
   node seed.js
   ```

5. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server** (from `/server`)
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5001`

2. **Start the client** (from `/client`)
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:5174`

---

## 👥 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `cagatay@example.com` | `123456` | User |
| `john@example.com` | `123456` | User |
| `jane@example.com` | `123456` | User |
| `admin@selene.com` | `admin123` | Admin |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/google` | Google OAuth |
| GET | `/auth/profile` | Get user profile |
| PUT | `/auth/profile` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| GET | `/products/featured/list` | Get featured products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/myorders` | Get user's orders |
| GET | `/orders/:id` | Get order by ID |

---

## 🎨 Screenshots

### Home Page
Elegant hero section with featured products carousel

### Shop Page
Product grid with category filtering

### Checkout
Multi-step checkout process with order summary

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 👨‍💻 Author

**Çağatay Gürses**

- GitHub: [@cgtygrss](https://github.com/cgtygrss)

---

<div align="center">

Made with ❤️ and ☕

</div>

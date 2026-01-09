# Lâl - Frontend Client

React-based frontend application for the Lâl luxury jewelry e-commerce platform.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Framer Motion** - Animations and transitions
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **JWT Decode** - Token handling

## 📁 Structure

```
src/
├── components/         # Reusable UI components
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ScrollReveal.jsx
│
├── context/           # React Context providers
│   ├── AuthContext.jsx    # User authentication state
│   └── CartContext.jsx    # Shopping cart state
│
├── pages/             # Page components
│   ├── About.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Contact.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── OrderSuccess.jsx
│   ├── ProductDetail.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── Shop.jsx
│
├── services/          # API service layer
│   └── api.js
│
├── App.jsx            # Main app component with routes
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment

The client connects to the backend API at `http://localhost:5001`. To change this, update the `API_URL` in `src/services/api.js`.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5174 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Styling

The application uses:
- CSS custom properties (CSS variables) for theming
- Inline styles with JSX for component-specific styles
- Global animations defined in `index.css`

### Theme Colors

```css
--color-gold: #D4AF37;
--color-text: #1a1a1a;
--color-text-muted: #666;
--color-surface: #ffffff;
--color-background: #fafafa;
```

## 🔐 Authentication

Authentication is managed through `AuthContext`:
- JWT tokens stored in localStorage
- Automatic token refresh handling
- Protected route redirection

## 🛒 Cart Management

Cart state is managed through `CartContext`:
- Persistent cart (localStorage)
- Add/remove/update items
- Shipping address storage

## 📱 Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

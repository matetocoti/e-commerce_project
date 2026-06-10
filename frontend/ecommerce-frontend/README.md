# E-Commerce Frontend

A presentation layer for a full-stack e-commerce platform built with **React 19**, **TypeScript**, and **Vite**. This frontend serves as an abstraction and interaction layer that communicates with a backend API for business logic, data persistence, and security operations.

> **Portfolio Project**: This is a learning project designed to explore modern React patterns, TypeScript practices, and architectural separation of concerns. The frontend intentionally maintains responsibility separation—the backend handles all security, validation, and business rules.

## 📋 Table of Contents

- [Project Philosophy](#project-philosophy)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Patterns & Learnings](#key-patterns--learnings)
- [Build & Deployment](#build--deployment)
- [Development](#development)

## 🎯 Project Philosophy

This frontend is intentionally built as a **thin presentation layer**:

- **Business Logic Layer**: All business rules, validations, and critical operations are delegated to the backend
- **Presentation Focus**: The frontend focuses on UI/UX, state management, and API integration
- **Type Safety**: Comprehensive TypeScript usage ensures type-safe communication between frontend and backend
- **Learning Focus**: Explores React hooks patterns, Context API, form handling, and real-time status updates

The architecture demonstrates **separation of concerns**, where each layer has a single responsibility—the frontend displays, the backend decides.

## ✨ Features

### User Features
- **Authentication**: Registration, login with JWT tokens, automatic session expiration handling
- **Product Browsing**: Catalog with product details, images, pricing (physical and digital products)
- **Shopping Cart**: Persistent cart state management via Context API, quantity controls
- **Checkout Flow**: Separate workflows for physical orders (with address) and digital orders (email/phone)
- **Payment Integration**: PIX payment support with QR code generation and real-time status polling
- **Order Management**: View order history, track order status, cancel orders
- **User Accounts**: Profile viewing and editing, authentication state persistence

### Admin Features
- **Product Management**: Create, edit, delete products with stock control
- **Admin Dashboard**: Product listing with filtering and management controls
- **Order Monitoring**: Access to order details and payment information

### Technical Features
- **Real-Time Status Updates**: Polling mechanism for order status and payment confirmations
- **Type-Safe API Client**: Custom HTTP client with Bearer token authentication and error handling
- **Error Handling**: Global error states, user-friendly error messages via toast notifications
- **Responsive Design**: Mobile-first approach, optimized for all screen sizes
- **Session Management**: Automatic logout on token expiration with user notification

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.2.4 | UI library with hooks |
| **Language** | TypeScript 6.0.2 | Type safety and DX |
| **Build** | Vite 8.0.4 | Fast bundler with HMR |
| **Styling** | Tailwind CSS 3.4.19 | Utility-first CSS |
| **Routing** | React Router 7.14.0 | Client-side routing |
| **HTTP** | Native Fetch API | API communication |
| **State** | React Context API | Global state (cart, auth) |
| **Icons** | Lucide React 1.8.0 | Icon library |
| **Notifications** | Sonner 2.0.7 | Toast notifications |
| **QR Codes** | qrcode.react 4.2.0 | PIX payment QR generation |
| **Utilities** | clsx 2.1.1, tailwind-merge 3.5.0 | CSS class management |
| **Code Quality** | ESLint 9.39.4 | Linting |
| **Dev** | TypeScript ESLint 8.58.0 | Type-aware linting |

## 🏗 Architecture

### Presentation Layer Flow

```
App (Root Provider)
  └── CartProvider (Context)
      └── AppRoutes (Router)
          ├── DefaultLayout
          │   ├── Public Pages (Home, ProductDetail, Login, Register)
          │   └── Protected Pages (Cart, Orders, Account)
          └── AdminLayout
              └── Admin Pages (ProductManagement, etc.)
```

### API Communication Pattern

```typescript
Component
  ↓
Hook (useCheckout, useProduct, etc.)
  ↓
API Module (orderApi.ts, productApi.ts, etc.)
  ↓
HTTP Client (client.ts - apiFetch)
  ↓
Backend API
```

### State Management

- **Global State**: Cart data via Context API with reloading capability
- **Auth State**: JWT token and user data in localStorage, retrieved on app load
- **Component State**: Form states, UI toggles managed via useState
- **Server State**: Order status via polling hooks (useOrderStatusPolling)

## 📦 Prerequisites

- **Node.js**: >= 18.x (tested with latest LTS)
- **npm**: >= 9.x or **yarn** >= 3.x
- **Backend API**: Running on the URL specified in environment variables

## 🚀 Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd ecommerce-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   Or with Yarn:
   ```bash
   yarn install
   ```

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:5056
```

**Configuration Notes:**
- `VITE_API_URL`: Backend API base URL (no trailing slash)
- Default fallback: `http://localhost:5056`
- Used in `src/api/client.ts` for all API requests

Example for different environments:

```env
# Development
VITE_API_URL=http://localhost:5056

# Production
VITE_API_URL=https://api.example.com
```

## 🏃 Running the Application

### Development Server

```bash
npm run dev
```

Or with Yarn:
```bash
yarn dev
```

The application will start at `http://localhost:5173` with Hot Module Replacement (HMR) enabled.

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## 📁 Project Structure

```
src/
├── api/                          # API client modules
│   ├── client.ts                 # HTTP client with token auth
│   ├── accountApi.ts             # User account endpoints
│   ├── authApi.ts                # Auth endpoints
│   ├── cartApi.ts                # Cart endpoints
│   ├── orderApi.ts               # Order endpoints
│   ├── paymentApi.ts             # Payment endpoints
│   ├── productApi.ts             # Product endpoints
│   └── adminApi.ts               # Admin endpoints
│
├── components/                   # Reusable React components
│   ├── account/                  # User account UI (UserCard, UserEditForm)
│   ├── admin/                    # Admin panel UI
│   ├── auth/                     # Auth UI (PasswordField)
│   ├── cart/                     # Cart UI (CartItemRow, CartSummary, QuantityControl)
│   ├── order/                    # Order management UI
│   │   ├── OrderActions.tsx      # Order control buttons
│   │   ├── OrderAddressSection.tsx
│   │   ├── OrderHeader.tsx
│   │   ├── OrderItemsSection.tsx # Line items display
│   │   ├── OrderModals.tsx
│   │   ├── OrderPaymentSection.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── DigitalOrderForm.tsx
│   │   └── PhysicalOrderForm.tsx
│   ├── payment/                  # Payment UI components
│   │   ├── PixPaymentModal.tsx   # PIX payment modal
│   │   ├── PaymentMethodModal.tsx
│   │   ├── PaymentDataModal.tsx
│   │   ├── PaymentProgress.tsx
│   │   ├── PaymentLoadingModal.tsx
│   │   └── Qrcode.tsx            # QR code component
│   ├── product/                  # Product display components
│   │   ├── ProductCard.tsx
│   │   ├── ProductImage.tsx
│   │   ├── ProductInfoCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductPrice.tsx
│   │   └── admin/
│   └── ui/                       # Shared UI building blocks
│       ├── Button.tsx            # Styled button component
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Modal components
│       ├── Loading.tsx
│       ├── Pagination.tsx
│       ├── FilterBar.tsx
│       └── AppToaster.tsx        # Global toast notification container
│
├── contexts/                     # React Context providers
│   ├── CartContext.tsx           # Cart state provider
│   ├── CartContextDef.ts         # Cart context type definitions
│   └── useSharedCart.ts          # Hook to access cart context
│
├── hooks/                        # Custom React hooks
│   ├── auth/
│   │   ├── useAuth.ts            # Auth state and logout
│   │   ├── useAutoLogout.ts      # Auto-logout on token expiration
│   │   ├── useLogin.ts           # Login logic
│   │   ├── useLoginForm.ts       # Login form state
│   │   ├── useRegister.ts        # Registration logic
│   │   └── useRegisterForm.ts    # Registration form state
│   ├── cart/
│   │   └── useCart.ts            # Cart operations
│   ├── order/
│   │   ├── useCheckout.ts        # Checkout submission
│   │   ├── useOrder.ts           # Single order details
│   │   ├── useOrders.ts          # Orders list
│   │   ├── useOrderStatusPolling.ts      # Real-time status updates
│   │   ├── useOrdersStatusPolling.ts     # Multiple order polling
│   │   ├── useCancel.ts          # Order cancellation
│   │   └── useOrderPaymentFlow.ts        # Payment flow orchestration
│   ├── payment/
│   │   └── Payment-related hooks
│   ├── product/
│   │   └── Product-related hooks
│   ├── account/
│   │   ├── useAccount.ts         # Account data fetching
│   │   └── useAccountActions.ts  # Account update operations
│   └── admin/
│       ├── useProduct.ts         # Single product management
│       ├── useProductActions.ts  # Product CRUD
│       └── useProducts.ts        # Product listing
│
├── layouts/                      # Page layout components
│   ├── DefaultLayout.tsx         # Main layout with header/footer
│   └── AdminLayout.tsx           # Admin dashboard layout
│
├── pages/                        # Page/route components
│   ├── Home.tsx                  # Product listing page
│   ├── ProductDetail.tsx         # Product detail page
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── customer/
│   │   ├── Cart.tsx              # Shopping cart page
│   │   ├── Orders.tsx            # Orders listing page
│   │   ├── OrderDetail.tsx       # Order details and tracking
│   │   ├── Account.tsx           # User profile page
│   │   └── AccountEdit.tsx       # Profile editing page
│   └── admin/
│       ├── AdminProducts.tsx     # Product management
│       ├── AdminCreateProduct.tsx
│       └── AdminEditProduct.tsx
│
├── routes/                       # Routing configuration
│   ├── AppRoutes.tsx             # Route definitions and layout structure
│   └── guards/
│       ├── RequireAuth.tsx       # Protected route guard
│       └── RequireAdmin.tsx      # Admin route guard
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Auth DTOs and types
│   ├── cart.ts                   # Cart types
│   ├── order.ts                  # Order DTOs (OrderDto, CreatePhysicalOrderDto, etc.)
│   ├── payment.ts                # Payment types and enums
│   ├── product.ts                # Product DTOs (ProductDto, AdminProductDto, etc.)
│   ├── pagination.ts             # Pagination types
│   └── user.ts                   # User profile types
│
├── utils/                        # Utility functions
│   ├── auth/                     # Auth-related utilities
│   ├── currency/
│   │   └── formatPrice.ts        # Currency formatting (BRL)
│   ├── date/
│   │   └── formatDate.ts         # Date and time formatting
│   ├── data/                     # Data transformation utilities
│   └── order/                    # Order-related utilities
│
├── main.tsx                      # Application entry point
├── App.tsx                       # Root component (providers)
├── index.css                     # Global styles
├── fonts.css
├── theme.css
└── vite-env.d.ts                 # Vite environment type definitions
```

## 🔑 Key Patterns & Learnings

### 1. **Custom HTTP Client with Authentication**
The `apiFetch` function in `src/api/client.ts` implements:
- Automatic Bearer token injection from localStorage
- Global token expiration handling via custom events
- Error parsing and user-friendly messaging
- Support for empty responses (204 No Content)

```typescript
// Token is automatically added to all requests
const data = await apiFetch<UserDto>("/api/users/profile");
```

### 2. **Context API for Global State**
`CartProvider` demonstrates managing complex state:
- Cart data fetching and caching
- Reload capability for manual refresh
- Error and loading states
- Memoization for performance

### 3. **Real-Time Status Updates**
`useOrderStatusPolling` shows advanced patterns:
- Polling mechanism with configurable intervals
- Document visibility detection (stops polling when tab is hidden)
- Proper cleanup and memory leak prevention
- Integration with component lifecycle

### 4. **Form State Management**
Custom hooks like `useLoginForm` and `useRegisterForm` handle:
- Form field state
- Validation errors
- Submission handling
- Server error display

### 5. **Type-Safe API Integration**
All API modules use DTOs for type safety:
- Frontend expects specific shapes from backend
- Breaking changes are caught at compile time
- Separate DTOs for different operations (Create, Update, Admin views)

### 6. **Route Guards**
`RequireAuth` and `RequireAdmin` wrappers ensure:
- Only authenticated users access protected routes
- Admins-only access to admin panel
- Redirect to login on unauthorized access

### 7. **Error Handling Strategy**
- API errors are parsed and displayed to users via toast notifications
- Component-level error states for forms
- Global error event dispatch for session expiration
- Fallback error messages for unexpected cases

### 8. **Responsive Design**
- Mobile-first Tailwind approach
- Conditional rendering for mobile/desktop UI
- Touch-friendly interactive elements
- CSS Grid and Flexbox layouts

## 🔨 Build & Deployment

### Development Build

```bash
npm run build
```

Creates an optimized production bundle in `dist/`:
- TypeScript compilation via `tsc -b`
- Vite bundling and minification
- Code splitting for better caching

### ESLint Configuration

Run code quality checks:

```bash
npm run lint
```

The project uses modern ESLint flat config with:
- TypeScript language support
- React hooks rules
- React refresh rules

## 👨‍💻 Development

### Development Server Features
- **Hot Module Replacement**: Changes reflect instantly without refresh
- **TypeScript Checking**: Compile errors appear in terminal
- **Fast Refresh**: Preserves component state while updating

### Code Style
- **TypeScript**: Strict mode enabled, all code typed
- **Tailwind CSS**: Utility-first approach with custom theme variables
- **Component Patterns**: Functional components with hooks, readonly props
- **Error Handling**: Try-catch with user feedback

### Adding New Features

1. **Create API module** in `src/api/` with typed endpoints
2. **Define types** in `src/types/`
3. **Create custom hook** in `src/hooks/` for business logic
4. **Build UI components** in `src/components/`
5. **Add route** in `src/routes/AppRoutes.tsx` if new page
6. **Test** with `npm run dev`

### Performance Considerations

- **Code Splitting**: Routes are lazy-loaded via Suspense
- **Memoization**: Context values use useMemo to prevent unnecessary renders
- **Polling Optimization**: Stops when tab is hidden via visibility API
- **Image Optimization**: Use ProductImage component for lazy loading

## 📚 Further Learning

This project explores several React and TypeScript patterns useful for production applications:

- **Context API over Redux**: Demonstrates when Context is sufficient
- **Custom Hooks Composition**: Building complex logic from simple hooks
- **Type-Driven Development**: Using TypeScript to define contracts
- **Error Boundaries**: Graceful error handling in UI
- **Performance Optimization**: React.memo, useMemo, useCallback patterns

## 📝 Notes

- **This is the frontend layer only**. All business logic, security, and data persistence is handled by the backend
- The frontend is intentionally "dumb"—it receives data from the backend and renders it, nothing more
- For security improvements and optimization recommendations, consult the backend project

---

**Status**: Portfolio project in active development  
**Target Audience**: Learning resource for React + TypeScript patterns  
**Future Work**: Security audits, performance monitoring, accessibility improvements

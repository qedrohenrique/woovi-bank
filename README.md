# Woovi Bank

## 📋 About the Project

Woovi Playground is a banking platform that allows users to manage their accounts, perform transactions, and track their financial history through an intuitive and modern interface. The application was built following the best development practices, utilizing a monorepo architecture to facilitate maintenance and scalability.

TLDR: Woovi technical challenge 🤣

## ✨ Features

### Authentication and Account
- **User registration** with email validation
- **Login** via CPF or email
- **Account confirmation** via email
- **Session management** with JWT tokens

### Transactions
- **Transaction creation** between accounts
- **Idempotency key** to ensure unique transactions
- **Complete transaction history**
- **Real-time balance** display

### Dashboard
- **Interactive charts** for transactions
- **Transaction table** with filters and sorting
- **Total balance card** in the sidebar
- **Responsive and modern interface**

## 🛠️ Technologies

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **React Relay** - GraphQL state management
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Recharts** - Charts and data visualization
- **TypeScript** - Static typing

### Backend
- **Koa.js** - Node.js web framework
- **GraphQL** - API query language
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **GraphQL Subscriptions** - Real-time updates
- **JWT** - Authentication

### Infrastructure
- **Turbo** - Build system for monorepo
- **Docker** - Containerization
- **pnpm** - Package manager

## 🚀 How to Run

### Prerequisites

- Node.js 20+
- pnpm 10.0.0
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd woovi-playground
````

2.  Install dependencies:

<!-- end list -->

```bash
pnpm install
```

3.  Configure environment variables:

<!-- end list -->

```bash
cd apps/server
pnpm config:local
# Edit the .env file with your settings
```

4.  Start the database (Docker):

<!-- end list -->

```bash
pnpm compose:up
```

5.  Run the development server:

<!-- end list -->

```bash
pnpm dev
```

The application will be available at:

  - Frontend: http://localhost:3000
  - GraphQL Backend: http://localhost:4000/graphql

## 📸 Screenshots

<img width="1300" height="736" alt="Screenshot from 2025-12-11 04-40-13" src="https://github.com/user-attachments/assets/71a4f20f-9300-41d6-a8ca-254e3d81bf16" />
<img width="1300" height="736" alt="Screenshot from 2025-12-11 04-38-42" src="https://github.com/user-attachments/assets/a60bf3c7-b0dd-49b4-8e4f-55a01e71e629" />

## 🧪 Available Scripts

  - `pnpm dev` - Starts the development server
  - `pnpm build` - Production build
  - `pnpm lint` - Runs the linter
  - `pnpm format` - Formats code with Prettier
  - `pnpm relay` - Compiles Relay files
  - `pnpm schema` - Updates the GraphQL schema
  - `pnpm compose:up` - Starts Docker containers
  - `pnpm compose:down` - Stops Docker containers

## 🔐 Authentication

The application uses JWT for authentication. After logging in, the token is stored in HTTP-only cookies for security.

## 📊 GraphQL API

The GraphQL API offers the following operations:

### Queries

  - `me` - Returns authenticated user information
  - `transactions` - Lists all user transactions

### Mutations

  - `LoginMutation` - User authentication
  - `RegisterMutation` - New user registration
  - `CreateTransactionMutation` - Transaction creation
  - `CreateIdempotencyKeyMutation` - Idempotency key generation


# Blog API

A full-stack blog application built as part of The Odin Project's Node.js curriculum. This project demonstrates the power of API-first architecture by implementing a REST API backend with two separate frontend applications.

## Project Structure

This monorepo contains three main applications:
- API Backend (/packages/api)
- Admin Frontend (/packages/blog-admin) 
- Client Frontend (/packages/blog-client)

## Features

### API Backend
- RESTful API built with Express.js
- Prisma ORM for database management
- JWT-based authentication
- Protected routes for post management
- Comment management system

### Admin Frontend
- Secure dashboard for blog management
- Post creation and editing interface
- Comment moderation tools
- Post publication controls
- Authentication system

### Client Frontend
- Public blog viewing interface
- Comment submission for readers
- Responsive design

## Technical Specifications

### Authentication
- JWT (JSON Web Tokens) for secure authentication
- Bearer token implementation
- Protected routes for admin operations

### Data Models

The application uses three main models:

- **User**: Manages user accounts with roles (admin/user), authentication details, and relationships to posts and comments
- **Post**: Handles blog post data including title, content, publication status, and author information
- **Comment**: Stores reader comments with relationships to posts and authors

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- pnpm (recommended for monorepo management)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blog-api
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```
DATABASE_URL="postgresql://username:password@localhost:5432/blogdb"
JWT_SECRET="your-secret-key"
```

4. Initialize the database
```bash
cd packages/api
npx prisma migrate dev
npx prisma generate
```

### Running the Application

1. Start the API backend:
```bash
cd packages/api
node app.js
```

2. Start the Admin frontend:
```bash
cd packages/blog-admin
npm run dev
```

3. Start the Client frontend:
```bash
cd packages/blog-client
npm run dev
```

## Development

### Database Management
- Run migrations: `npx prisma migrate dev`
- Reset database: `npx prisma migrate reset`
- View data: `npx prisma studio`

### API Documentation
The API endpoints will be available at `http://localhost:3000/api`




# JK Tech Blog Backend Assignment


This repository contains the backend service for the JKTech Blog platform. It provides user authentication via Google and Facebook, post management features, secure API access using JWT, and is built using NestJS, MongoDB for database, NestJs and winston Logging, Jest for testing, Docker for containerization and Kubernetes for orchestration

## Features

- JWT-based Authentication with Google and Facebook OAuth2

- Post CRUD operations with user-level access control

- Unit Testing with Jest

- Seed script for generating test data (1000+ users and 5000+ posts)

- Docker-ready setup

- Secure endpoints (only login & auth routes are public)


##  Tech Stack

- NestJS – Node.js framework for scalable backend applications

- MongoDB – NoSQL database for storing users and blog posts

- PassportJS – Authentication with strategies for Google & Facebook

- JWT – Token-based auth for secure access

- TypeScript – Strictly typed language for reliability

- Docker – Containerization support

- Jest – Testing framework for unit tests

- Kubernetes: for container orchestration


## Architecture
- `Auth module`: Handles OAuth and JWT logic.
- `Posts module`: Post-related CRUD operations.
- `Users module`: Manages user data and roles.


# Create a .env file in the root
```bash
MONGO_URI=mongodb://localhost:27017/jktech-blog
JWT_SECRET=your jwt secret
GOOGLE_CLIENT_ID=your google client ID
GOOGLE_CLIENT_SECRET=your google client secret
FACEBOOK_CLIENT_ID=your facebook client ID
FACEBOOK_CLIENT_SECRET=your facebook client secret
```

## Google OAuth Setup

1) Go to Google Cloud Console. https://console.cloud.google.com/
2) Create a project and enable the People API.
3) Set up an OAuth consent screen (External).
4) Create OAuth 2.0 credentials (Web Application) with redirect URI: http://localhost:5002/auth/google/callback.
5) Copy **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET** to .env.

## Facebook OAuth Setup

1) Go to Facebook Developer Portal. https://developers.facebook.com/
2) Create an app and add Facebook Login product.
3) Configure redirect URI: http://localhost:5002/auth/facebook/callback.
4) Copy **FACEBOOK_CLIENT_ID** and **FACEBOOK_CLIENT_SECRET** to .env.


# Clone Repo
```bash
git clone https://github.com/prakhartiwari24/jktech-blog-backend.git
cd jktech-blog-backend
```

## Installing Dependencies
```bash
npm install
```

# Running App
```bash
npm run start:dev
```
## API Endpoint


- GET /health – Health check API

- GET /auth/google – Start Google OAuth

- GET /auth/google/callback – Google OAuth callback

- GET /auth/facebook – Start Facebook OAuth

- GET /auth/facebook/callback – Facebook OAuth callback

- POST /auth/login – Email/password login

- POST /posts - Create a New Post

- GET /posts - GET all Posts

- GET /posts/:id - GET POST by ID

## Example Requests

### create post
```bash curl -X POST http://localhost:3000/posts \
-H "Authorization: Bearer <jwt-token>" \
-H "Content-Type: application/json" \
-d '{"title": "Test Post", "body": "This is test body"}'
```

### Response
`201 Created, { _id, title, body, userId, createdAt, updatedAt }`

### Get Post:
```bash
curl http://localhost:3000/posts/<post-id>
```
### Response
`200 OK, { _id, title, body, userId, createdAt, updatedAt }`

## Testing
### This backend uses Jest for writing and running unit test cases.
```bash
npm run test
```

## Test Data (Seeder)
```bash
npx ts-node src/seed.ts
```

## Docker Setup
```bash
docker build -t jktech-blog-backend .
```

## RUN Container
```bash
docker run -p 5002:5002 --env-file .env jktech-blog-backend
```

## Author
```bash
Prakhar Tiwari
Email: prakhartiwari20@gmail.com
```

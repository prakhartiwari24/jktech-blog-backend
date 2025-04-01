## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Installation
git clone https://github.com/prakhartiwari24/jktech-blog-backend.git
cd jktech-blog-backend
npm install

npm run start:dev

Create a .env file in the root
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

GET /health – Health API

GET /auth/google – Start Google OAuth

GET /auth/google/redirect – Google OAuth callback

GET /auth/facebook – Start Facebook OAuth

GET /auth/facebook/redirect – Facebook OAuth callback

POST /auth/login – Email/password login

GET /auth/profile – Get logged-in user profile (JWT required)

POST /posts - Create a New Post

GET /posts - GET all Posts

GET /posts/:id - GET POST by ID

Testing
This backend uses Jest for writing and running unit test cases.

npm run test

Test Data (Seeder)
npx ts-node src/seed.ts

Docker Setup
docker build -t jktech-blog-backend .

RUN Container
docker run -p 5002:5002 --env-file .env jktech-blog-backend

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

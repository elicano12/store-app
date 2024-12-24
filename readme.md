## E-Commerce Payment Application

### Overview

This is a responsive e-commerce application designed for mobile-first experiences. Users can browse products, add them to their cart, and complete transactions securely. The application includes a frontend built with ReactJS, a backend using NestJS, and follows best practices for modern web application development.

### Features

#### Frontend

Built as a Single Page Application (SPA) using ReactJS.
Uses Redux for state management, adhering to Flux architecture.
Secure storage of transaction data in state or localStorage.
Customizable UX and responsive UI designed with Tailwind CSS.

#### Backend

Developed using NestJS, following XXX Architecture.
Handles business logic in a separate service layer.
Uses PostgreSQL for data storage with preloaded sample products.
Provides RESTful APIs for product management, transactions, and user-product assignments.
Unit testing implemented with Jest.

### Tech Stack

#### Frontend

* Framework: ReactJS
* State Management: Redux
* Styling: Tailwind CSS
* Routing: React Router
* Testing: Jest + React Testing Library

#### Backend

* Framework: NestJS
* Language: TypeScript
* Database: PostgreSQL
* ORM: TypeORM
* Testing: Jest + Supertest
* Deployment: AWS (S3, RDS, ECS)

### Project Structure

#### Frontend

client/
├── public/           # Static files (e.g., index.html)
├── src/              # Source code
│   ├── components/   # Reusable components
│   ├── pages/        # Page-level components
│   ├── redux/        # Redux store, reducers, actions
│   ├── utils/        # Utility functions
│   └── App.jsx       # Main application component
├── package.json      # Dependencies
├── tailwind.config.js# Tailwind CSS configuration
└── vite.config.js    # Vite configuration

#### Backend

api/
├── src/              # Source code
│   ├── modules/      # Feature modules (e.g., products, transactions)
│   ├── entities/     # Database entities
│   ├── services/     # Business logic
│   ├── controllers/  # Route handlers
│   └── main.ts       # Application entry point
├── test/             # Unit and integration tests
├── .env              # Environment variables
├── package.json      # Dependencies
├── docker-compose.yml# Docker configuration
└── tsconfig.json     # TypeScript configuration

### Database Model

#### Entities

##### Customer
---------
| id       | <-- Primary Key
| name     |
| email    |
| address  |
| createdAt|
| updatedAt|

##### Transaction
------------
| id         | <-- Primary Key
| customerId | <-- Foreign Key (Customer)
| productId  | <-- Foreign Key (Product)
| amount     |
| installments|
| status     |
| createdAt  |

##### Product
---------
| id         | <-- Primary Key
| name       |
| description|
| price      |
| stock      |
| imageUrl   |
| createdAt  |
| updatedAt  |


### Setup Instructions
#### Frontend

1. Navigate to the Frontend Directory:
    ```bash
    cd client

2. Install Dependencies
    ```bash
    npm install

3. Start Development Server:
    ```bash
    npm run dev

4. Build for Production:
    ```bash
    npm run build

5. Run Tests:
    ```bash
    npm test

#### Backend

1. Navigate to the Backend Directory:

    ```bash
    cd api

2. Install Dependencies:

    ```bash
    npm install

3. Set up the Database:
    
    ```bash
    Create a PostgreSQL database named ecommerce.
    Use the seed script to load sample data:
    
    npm run seed
    
4. Start Development Server:

    ```bash
    npm run start:dev

5. Run Tests:

    ```bash
    npm test

#### API Documentation:

You can explore the complete API documentation, including schemas, parameters, and example responses, using Swagger.

* [Local Swagger Documentation](http://localhost:3000/docs)
* [API Swagger Documentation Deployed](http://ec2-3-90-16-254.compute-1.amazonaws.com:3000/docs)



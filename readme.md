## E-Commerce Payment Application

### Overview

This is a responsive e-commerce application designed for mobile-first experiences. Users can browse products, add them to their cart, and complete transactions securely. The application includes a frontend built with ReactJS, a backend using NestJS, and follows best practices for modern web application development.

### Features

#### Frontend

Built as a Single Page Application (SPA) using ReactJS.
Uses Redux for state management, adhering to Flux architecture.
Storage of transaction data in state or localStorage.
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
├── dist/                   # Build output (generated by Vite)
├── node_modules/           # Dependencies
├── public/                 # Static files (e.g., favicon, manifest)
│   └── index.html          # HTML template
├── src/                    # Source code
│   ├── api/                # API service configurations (e.g., Axios instance)
│   │   └── api.js
│   ├── assets/             # Static assets (e.g., images, fonts)
│   │   └── logo.png
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── Header.jsx
│   ├── pages/              # Page-level components
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Checkout.jsx
│   ├── redux/              # Redux store and slices
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── productSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── userSlice.js
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point for the React app
│   ├── index.css           # Global styles
├── .env                    # Environment variables
├── .eslint.js              # Linter configuration
├── .gitignore              # Ignored files and directories for Git
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.cjs      # PostCSS configuration
└── vite.config.js          # Vite configuration


#### Backend

api/
├── coverage/             # Coverage reports for tests
├── dist/                 # Compiled files (generated by TypeScript)
├── node_modules/         # Dependencies
├── postgres_data/        # Database volume data for Docker (optional)
├── src/                  # Source code
│   ├── customers/        # Customers feature module
│   │   ├── controllers/  # Customer controllers
│   │   │   └── customer.controller.ts
│   │   ├── entities/     # Customer entities
│   │   │   └── customer.entity.ts
│   │   ├── services/     # Business logic for customers
│   │   │   └── customer.service.ts
│   │   └── customer.module.ts # NestJS module for customers
│   ├── products/         # Products feature module
│   │   ├── controllers/  # Product controllers
│   │   │   └── product.controller.ts
│   │   ├── entities/     # Product entities
│   │   │   └── product.entity.ts
│   │   ├── services/     # Business logic for products
│   │   │   └── product.service.ts
│   │   └── product.module.ts # NestJS module for products
│   ├── transactions/     # Transactions feature module
│   │   ├── controllers/  # Transaction controllers
│   │   │   └── transaction.controller.ts
│   │   ├── entities/     # Transaction entities
│   │   │   └── transaction.entity.ts
│   │   ├── services/     # Business logic for transactions
│   │   │   └── transaction.service.ts
│   │   └── transaction.module.ts # NestJS module for transactions
│   ├── database/         # Database configuration and migrations
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── util/             # Utility functions/helpers
│   │   └── logger.util.ts
│   ├── app.module.ts     # Main module
│   ├── config.ts         # Configuration for environment variables
│   ├── main.ts           # Entry point for the application
│   └── seed.ts           # Database seeding script
├── test/                 # Unit and integration tests
│   ├── customers/        # Tests for customer module
│   │   └── customer.service.spec.ts
│   ├── products/         # Tests for product module
│   │   └── product.service.spec.ts
│   ├── transactions/     # Tests for transaction module
│   │   └── transaction.service.spec.ts
│   └── app.e2e-spec.ts   # End-to-end tests
├── .env                  # Environment variables
├── .eslint.js            # Linter configuration
├── .gitignore            # Ignored files and directories for Git
├── docker-compose.yml    # Docker configuration (e.g., for PostgreSQL)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── tsconfig.build.json   # TypeScript configuration for production builds

### Database Model

#### Entities

<img width="626" alt="image" src="https://github.com/user-attachments/assets/17e1fb2d-547e-4e36-8515-befcb953e1f1" />


### Environment Variables
To ensure the application runs properly, you need to set the required environment variables for both the Frontend and Backend. Below is a description of the variables needed for each part of the application:

#### Frontend Environment Variables
The frontend uses Vite, and all environment variables must start with the prefix VITE_. These variables are used to configure the API base URL and other external services.

* ##### .env file for the Frontend
    ```bash
    VITE_API_BASE_URL=http://ec2-3-90-16-254.compute-1.amazonaws.com:3000/api
    VITE_APP_WOMPI_URL=https://api-sandbox.co.uat.wompi.dev/v1
    VITE_WOMPI_PUBLIC_KEY=your-public-key

#### Backend Environment Variables
The backend uses NestJS, and the environment variables are used for database configuration, authentication, and third-party service integration.

* ##### .env file for the Backend
    ```bash
    PORT=3000
    DATABASE_HOST=your-database-host
    DATABASE_PORT=5432
    DATABASE_NAME=ecommerce
    DATABASE_USER=your-database-username
    DATABASE_PASSWORD=your-database-password
    WOMPI_PUBLIC_KEY=your-wompi-public-key
    WOMPI_PRIVATE_KEY=your-wompi-private-key
    WOMPI_INTEGRITY_KEY=your-wompi-integrity-key
    WOMPI_API_URL=https://api-sandbox.co.uat.wompi.dev/v1
    NODE_ENV=production

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
    For local work purposes run the following file:
    
        docker-compose up -d
    
    To run the migration for the first time make sure that the init file is created in the folder if not then run it:

    Create a migration data in PostgreSQL database:

        npm run migrations:generate <path/a/guardar>
        npm run migrations:run
    
    Create a PostgreSQL database named ecommerce.
    Use the seed script to load sample data:
    
        npm run seed
    
4. Start Development Server:

    ```bash
    npm run start:dev

5. Run Tests:

    ```bash
    npm test

### API Documentation:

You can explore the complete API documentation, including schemas, parameters, and example responses, using Swagger.

* [Local Swagger Documentation](http://localhost:3000/docs)
* [API Swagger Documentation Deployed](http://ec2-3-90-16-254.compute-1.amazonaws.com:3000/docs)

### Deployed Application

The application is live and deployed on AWS. You can access it at the following link:

##### Deployment Details

* ##### Frontend Application: 
    Hosted on AWS S3 with CloudFront for Content Delivery.
    - URL: [Web Site on AWS S3](http://store-app-test.s3-website-us-east-1.amazonaws.com/.com)

* ##### Backend API: 
    Hosted on AWS ECS (Elastic Container Service) connected to AWS RDS for the database.
    - URL: [API on AWS EC2](
http://ec2-3-90-16-254.compute-1.amazonaws.com:3000/api/products)


* ##### Database:
    The application uses AWS RDS PostgreSQL for data storage.

# Task Management App Backend

This is the backend for the **Task Management App**, built with **Node.js**, **Express**, and **MongoDB**. It provides authentication and task management features, including JWT authentication, task creation, updating, and deletion.

## Features

- User registration and login using **JWT** (JSON Web Tokens).
- Task management with **CRUD** operations (Create, Read, Update, Delete).
- Error handling and JWT authentication middleware.

## Installation

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Muzammil8989/task_management_app_backend.git

cd task_management_app_backend
npm install

### 2. Environment variable
NODE_ENV=development
CLIENT_URL=<your_frontend_url>
MONGO_URI=<your_mongo_database_connection_string>
JWT_SECRET=<your_jwt_secret_key>
PORT=5000

npm start

### 3. API endpoints
POST /api/auth/register: Register a new user.

POST /api/auth/login: Log in and receive a JWT token.

GET /api/tasks: Get all tasks (authentication required).

POST /api/tasks: Create a new task (authentication required).

PUT /api/tasks/:id: Update an existing task (authentication required).

DELETE /api/tasks/:id: Delete a task (authentication required).

### 4. Middleware
verifyJWT: Verifies JWT token to ensure the user is authenticated.

errorHandler: Handles errors and sends standardized error responses.

Deployment
You can deploy the backend app on Vercel or any other platform of your choice. Make sure to set the environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL) in the dashboard.



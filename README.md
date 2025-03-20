# Job Portal & Real-Time Notification System

This project is a full-featured backend application for a job portal. Employers can post jobs, review and manage applications, and schedule interviews, while job seekers can apply for jobs and track their application status. The system uses real-time notifications via Socket.IO to keep users updated and includes JWT-based authentication and CSRF protection.

## Table of Contents

- [Job Portal \& Real-Time Notification System](#job-portal--real-time-notification-system)
  - [Table of Contents](#table-of-contents)
  - [⚠️Disclaimer](#️disclaimer)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Running Locally](#running-locally)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Configure Environment Variables](#3-configure-environment-variables)
    - [4. Start the Application](#4-start-the-application)
    - [5. Access the Application](#5-access-the-application)
  - [API Routes Documentation](#api-routes-documentation)
    - [Base URL](#base-url)
    - [Auth Routes (`/api/auth`)](#auth-routes-apiauth)
      - [1. Get CSRF Token](#1-get-csrf-token)
      - [2. Register a New User](#2-register-a-new-user)
      - [3. User Login](#3-user-login)
      - [4. User Logout](#4-user-logout)
    - [Job Routes (`/api`)](#job-routes-api)
      - [1. Post a Job (Employers Only)](#1-post-a-job-employers-only)
      - [2. List All Jobs](#2-list-all-jobs)
      - [3. Get Job Details](#3-get-job-details)
      - [4. Apply for a Job (Job Seekers Only)](#4-apply-for-a-job-job-seekers-only)
    - [Employer Routes (`/api/employer`)](#employer-routes-apiemployer)
      - [1. Get Employer Jobs](#1-get-employer-jobs)
      - [2. Get Applications for a Specific Job](#2-get-applications-for-a-specific-job)
    - [Application Routes (`/api/application`)](#application-routes-apiapplication)
      - [1. Reject an Application (Employers Only)](#1-reject-an-application-employers-only)
      - [2. Schedule an Interview (Employers Only)](#2-schedule-an-interview-employers-only)
      - [3. Get My Applications (Job Seekers Only)](#3-get-my-applications-job-seekers-only)
  - [Future Enhancements \& Improvements](#future-enhancements--improvements)
    - [1. Performance \& Scalability](#1-performance--scalability)
    - [2. Real-Time Notifications Enhancements](#2-real-time-notifications-enhancements)
    - [3. Security Enhancements](#3-security-enhancements)
    - [4. Database \& Data Management](#4-database--data-management)
    - [5. Developer Experience \& Documentation](#5-developer-experience--documentation)



---

## ⚠️Disclaimer

**Custom Authentication:**  
The authentication implemented in this project is a simple, custom solution designed for demonstration purposes. For production-grade applications, it is highly recommended to use established third-party authentication providers. These providers offer advanced features like multi-factor authentication, robust session management, and enhanced security. Some popular options include:

- **Auth0**
- **Okta**
- **Firebase Authentication**

**Pagination:**  
The current implementation for listing jobs does not include pagination. In a production environment, implementing pagination using techniques such as offset and limit is essential to efficiently handle large datasets and improve overall performance and usability.

**Real-Time Notifications:**  
This project uses a basic WebSocket (Socket.IO) implementation for real-time notifications. Currently, notifications are delivered only to users who are online and logged in at the time of the event. For more robust notification systems—especially to handle offline notifications—consider using dedicated third-party services or message queuing systems. Popular services that can offer enhanced real-time and offline notifications include:

- **Firebase Cloud Messaging (FCM)**
- **Pusher**
- **OneSignal**

These providers can help ensure that notifications are delivered reliably, even when users are not actively connected to your application.


--- 

## Features

- **User Authentication**: Secure JWT-based authentication for both HTTP and WebSocket connections.
- **Job Posting & Application**: Employers can post jobs; job seekers can view and apply for jobs.
- **Application Management**: Employers can reject applications or schedule interviews, with notifications sent to the candidates.
- **Real-Time Notifications**: Socket.IO integration for sending instant notifications to job seekers and employers.
- **Database Integration**: Uses MySQL with a connection pool for robust data storage.
- **CSRF Protection**: Implements CSRF tokens for secure form submissions.
- **Static File Serving**: Serves frontend pages and assets from the `/public` folder.
- **IndexedDB Integration (Client-Side)**: Stores notifications on the client side for persistent local display.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO
- **Database**: MySQL (via `mysql2` with connection pooling)
- **Authentication**: JWT, CSRF (via cookies)
- **Frontend**: HTML, TailwindCSS for styling, Vanilla JavaScript
- **Other**: ES modules, dotenv for environment variables

## Project Structure

```plaintext
.
├── .env
├── .gitignore
├── app.js
├── index.html
├── package-lock.json
├── package.json
├── server.js
├── config
│   └── config.js
├── controllers
│   ├── applicationController.js
│   ├── authController.js
│   ├── jobController.js
│   └── userController.js
├── middlewares
│   └── authMiddleware.js
├── models
│   ├── application.js
│   ├── index.js
│   ├── interview.js
│   ├── job.js
│   └── user.js
├── public
│   ├── applied-jobs.html
│   ├── employer-jobs.html
│   ├── job-detail.html
│   ├── list-applications.html
│   ├── list-jobs.html
│   ├── login.html
│   ├── post-job.html
│   ├── register.html
│   ├── css
│   │   ├── animate.css
│   │   ├── input.css
│   │   └── output.css
│   └── js
│       ├── auth_common.js
│       ├── emp_soc.js
│       ├── js_soc.js
│       └── notify.js
├── routes
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── employerRoutes.js
│   ├── jobRoutes.js
│   └── userRoutes.js
├── services
│   └── notification.js
└── utils
    └── jwt.js
```



## Running Locally

To run the application on your local machine, follow these steps:

### 1. Clone the Repository

Clone the repository from GitHub:

```bash
git clone https://github.com/yourusername/job-portal-notifications.git
cd job-portal-notifications
```

### 2. Install Dependencies

Install all required packages by running:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project. This file should not be committed to version control as it contains sensitive information.

Below is an example configuration:

```dotenv
PORT=3000
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=job_portal_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

- **PORT**: The port on which the server will run.
- **DB_HOST, DB_USER, DB_PASS, DB_NAME**: Your MySQL database connection details.
- **JWT_SECRET**: A secret key for JWT token generation.
- **CLIENT_URL**: The URL for your frontend, used for CORS and WebSocket configuration.
- **NODE_ENV**: Set to `development` when running locally.

### 4. Start the Application

Start the server using:

```bash
npm start
```

For development with auto-reloading, you can use nodemon (if configured):

```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to `http://localhost:3000/login.html` to view your application.

---




## API Routes Documentation

### Base URL

All endpoints are prefixed with `/api`. For example, if your server is running on `http://localhost:3000`, then the full URL for a route would be `http://localhost:3000/api/<endpoint>`.


### Auth Routes (`/api/auth`)

#### 1. Get CSRF Token
- **Endpoint:** `GET /api/auth/csrf-token`
- **Description:** Exposes a CSRF token to the client for use in form submissions.
- **Response Example:**
  ```json
  {
    "csrfToken": "generated_csrf_token_here"
  }
  ```

#### 2. Register a New User
- **Endpoint:** `POST /api/auth/register`
- **CSRF Protected:** Yes
- **Expected Request Body:**
  ```json
  {
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "password": "yourSecurePassword",
    "role": "jobseeker"  // or "employer"
  }
  ```
- **Response Example (Success – Status 201):**
  ```json
  {
    "message": "User registered successfully.",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "jobseeker"
    }
  }
  ```

#### 3. User Login
- **Endpoint:** `POST /api/auth/login`
- **CSRF Protected:** Yes
- **Expected Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "yourSecurePassword"
  }
  ```
- **Response Example (Success – Status 200):**
  ```json
  {
    "message": "Login successful.",
    "user": {
      "id": 1,
      "role": "jobseeker"
    }
  }
  ```
  *Note: On success, an HTTP-only cookie named `token` will be set with the JWT.*

#### 4. User Logout
- **Endpoint:** `POST /api/auth/logout`
- **CSRF Protected:** Yes
- **Expected Request Body:** _None_
- **Response Example (Success – Status 200):**
  ```json
  {
    "message": "Logout successful."
  }
  ```

---

### Job Routes (`/api`)

#### 1. Post a Job (Employers Only)
- **Endpoint:** `POST /api/job`
- **Authentication:** JWT required; role must be `"employer"`.
- **Expected Request Body:**
  ```json
  {
    "title": "Software Engineer",
    "description": "Develop and maintain web applications.",
    "location": "New York",      // Optional
    "salary": "100k"             // Optional
  }
  ```
- **Response Example (Success – Status 201):**
  ```json
  {
    "message": "Job posted successfully.",
    "job": {
      "id": 10,
      "title": "Software Engineer",
      "description": "Develop and maintain web applications.",
      "location": "New York",
      "salary": "100k",
      "employerId": 2,
      "createdAt": "2025-02-20T14:00:00.000Z",
      "updatedAt": "2025-02-20T14:00:00.000Z"
    }
  }
  ```
- **Real-Time Action:**  
  A notification is emitted to all job seekers via Socket.IO with event `job:posted`.

#### 2. List All Jobs
- **Endpoint:** `GET /api/jobs`
- **Authentication:** JWT required.
- **Description:** Retrieves all jobs along with minimal employer details.
- **Response Example:**
  ```json
  {
    "jobs": [
      {
        "id": 10,
        "title": "Software Engineer",
        "description": "Develop and maintain web applications.",
        "location": "New York",
        "salary": "100k",
        "createdAt": "2025-02-20T14:00:00.000Z",
        "employer": {
          "username": "employer123",
          "fullName": "Tech Corp"
        }
      },
      ...
    ]
  }
  ```

#### 3. Get Job Details
- **Endpoint:** `GET /api/job/:jobId`
- **Authentication:** JWT required.
- **Description:** Retrieves detailed information about a specific job along with employer details and an indicator (`alreadyApplied`) if the job seeker has already applied.
- **Response Example:**
  ```json
  {
    "job": {
      "id": 10,
      "title": "Software Engineer",
      "description": "Develop and maintain web applications.",
      "location": "New York",
      "salary": "100k",
      "employer": {
        "username": "employer123",
        "fullName": "Tech Corp"
      }
    },
    "alreadyApplied": false
  }
  ```

#### 4. Apply for a Job (Job Seekers Only)
- **Endpoint:** `POST /api/job/:jobId/apply`
- **Authentication:** JWT required; role must be `"jobseeker"`.
- **Expected Request Body:**
  ```json
  {
    "coverLetter": "I am excited to apply for this position because..."
  }
  ```
- **Response Example (Success – Status 201):**
  ```json
  {
    "message": "Application submitted successfully.",
    "application": {
      "id": 15,
      "jobId": 10,
      "jobSeekerId": 1,
      "coverLetter": "I am excited to apply for this position because...",
      "status": "pending",
      "createdAt": "2025-02-21T10:00:00.000Z",
      "updatedAt": "2025-02-21T10:00:00.000Z"
    }
  }
  ```
- **Real-Time Action:**  
  A notification is emitted to the employer (in room `employee:<employerId>`) with event `application:received`.

---

### Employer Routes (`/api/employer`)

#### 1. Get Employer Jobs
- **Endpoint:** `GET /api/employer/jobs`
- **Authentication:** JWT required; role must be `"employer"`.
- **Response Example:**
  ```json
  {
    "jobs": [
      {
        "id": 10,
        "title": "Software Engineer",
        "description": "Develop and maintain web applications.",
        "location": "New York",
        "salary": "100k",
        "createdAt": "2025-02-20T14:00:00.000Z"
      },
      ...
    ]
  }
  ```

#### 2. Get Applications for a Specific Job
- **Endpoint:** `GET /api/employer/jobs/:jobId/applications`
- **Authentication:** JWT required; role must be `"employer"`.
- **Description:** Retrieves all applications for the job posted by the logged-in employer.
- **Response Example:**
  ```json
  {
    "applications": [
      {
        "id": 15,
        "jobId": 10,
        "jobSeekerId": 1,
        "coverLetter": "I am excited to apply for this position because...",
        "status": "pending",
        "createdAt": "2025-02-21T10:00:00.000Z",
        "jobSeeker": {
          "id": 1,
          "username": "johndoe",
          "fullName": "John Doe",
          "email": "johndoe@example.com"
        }
      },
      ...
    ]
  }
  ```

---

### Application Routes (`/api/application`)

#### 1. Reject an Application (Employers Only)
- **Endpoint:** `POST /api/application/:applicationId/reject`
- **Authentication:** JWT required; employer must be the owner of the job.
- **Expected Request Data:** _None required in the body (applicationId is provided as a URL parameter)._
- **Response Example (Success – Status 200):**
  ```json
  {
    "message": "Application rejected successfully.",
    "application": {
      "id": 15,
      "status": "rejected",
      "jobId": 10,
      "jobSeekerId": 1,
      "updatedAt": "2025-02-21T11:00:00.000Z"
    }
  }
  ```
- **Real-Time Action:**  
  A notification is emitted to the specific job seeker (room: `user:<jobSeekerId>`) with event `application:rejected`.

#### 2. Schedule an Interview (Employers Only)
- **Endpoint:** `POST /api/application/:applicationId/schedule`
- **Authentication:** JWT required; employer must be the owner of the job.
- **Expected Request Body:**
  ```json
  {
    "scheduledAt": "2025-03-10T10:00:00Z",
    "notes": "Please join the meeting on time."
  }
  ```
- **Response Example (Success – Status 200):**
  ```json
  {
    "message": "Interview scheduled successfully.",
    "interview": {
      "id": 5,
      "applicationId": 15,
      "scheduledAt": "2025-03-10T10:00:00.000Z",
      "notes": "Please join the meeting on time."
    }
  }
  ```
- **Real-Time Action:**  
  A notification is emitted to the specific job seeker (room: `user:<jobSeekerId>`) with event `interview:scheduled`.

#### 3. Get My Applications (Job Seekers Only)
- **Endpoint:** `GET /api/application/applied`
- **Authentication:** JWT required; role must be `"jobseeker"`.
- **Response Example:**
  ```json
  {
    "applications": [
      {
        "id": 15,
        "jobId": 10,
        "coverLetter": "I am excited to apply for this position because...",
        "status": "pending",
        "createdAt": "2025-02-21T10:00:00.000Z",
        "job": {
          "title": "Software Engineer",
          "description": "Develop and maintain web applications.",
          "location": "New York",
          "salary": "100k"
        },
        "interview": null
      },
      ...
    ]
  }
  ```


---

## Future Enhancements & Improvements

While the current implementation meets the core requirements of the assessment, there are several ways the system could be improved and extended in the future:

### 1. Performance & Scalability

- **Rate Limiting:**  
  Implement middleware (e.g., [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)) to limit repeated requests to API endpoints. This helps mitigate brute-force attacks and reduces the risk of overloading the server.

- **Load Balancing & Clustering:**  
  For handling higher traffic, consider clustering your Node.js processes and using a load balancer with sticky sessions (or a Redis adapter for Socket.IO) to distribute the WebSocket connections across multiple server instances.

- **Caching:**  
  Use caching mechanisms like Redis to cache frequently requested data (e.g., job listings) and reduce database load.

### 2. Real-Time Notifications Enhancements

- **Persistent Offline Notifications:**  
  Instead of relying solely on in-memory real-time notifications, consider integrating a dedicated notification service that can store messages for offline users. Options include:
  - **Push Notifications:** Integrate services such as Firebase Cloud Messaging (FCM) for mobile devices.
  - **Email/SMS Notifications:** Use services like SendGrid, Mailgun, or Twilio to notify users via email or SMS when they are offline.
  - **Message Queues:** Implement message queues (e.g., RabbitMQ or Apache Kafka) to decouple notification processing from the main application logic, ensuring that notifications are reliably queued and delivered.

- **Notification Service Microservice:**  
  As the application scales, it might be beneficial to separate the notification logic into its own microservice. This service could handle different channels (web, mobile, email) and scale independently from the core API.

### 3. Security Enhancements

- **Enhanced Input Validation:**  
  Use libraries like `Joi` or `express-validator` to validate incoming data more robustly, ensuring better security and data integrity.

- **Advanced Authentication & Session Management:**  
  Consider implementing multi-factor authentication (MFA) and using secure session management practices to further protect user data.

- **Security Headers:**  
  Use libraries like `helmet` to set various HTTP headers for added security.

### 4. Database & Data Management

- **Database Migrations:**  
  Instead of using `sequelize.sync()`, use a dedicated migration tool (such as Sequelize CLI migrations) to manage database schema changes in production.

- **Data Analytics & Reporting:**  
  Incorporate data analytics to track job application trends, user activity, and system performance, which could be useful for both employers and platform administrators.


### 5. Developer Experience & Documentation

- **API Documentation:**  
  Generate interactive API documentation using Swagger/OpenAPI, making it easier for developers to understand and test the endpoints.

- **Modular Architecture:**  
  Continue refactoring the codebase into smaller, more manageable modules and services to enhance maintainability and scalability.


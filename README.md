# Quizora - Backend Service

## 📖 Project Overview
A robust, headless **RESTful API** built with **Express.js**, serving as the core engine for a decoupled full-stack ecosystem. This project demonstrates a secure approach to backend architecture, engineered to handle cross-origin requests from a **Next.js** frontend while ensuring data integrity and strict access control.

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose (Schema-based approach)
* **Authentication:** JSON Web Tokens (JWT) with Redis Session Store
* **Caching:** Redis (for data and session management)
* **Deployment:** Vercel

## 🚀 Key Features
* **Security & Identity:** Implemented **JWT** for stateless authentication, paired with a granular **Role-Based Access Control (RBAC)** system.
* **Cross-Origin Communication:** Configured with secure **CORS** policies to facilitate seamless data exchange with the frontend application across different origins.
* **Data Modeling:** Leveraged **Mongoose ODM** with a strict schema-based approach to manage MongoDB collections and enforce data validation.
* **Reliability:** Integrated a **centralized global error-handling** middleware to ensure consistent, predictable API responses.
* **Deployment Approach:** Optimized for a serverless environment on **Vercel**, utilizing environment variables for secure database connectivity and secret management.

## 🔗 Related Projects
* **Frontend Repository:** https://github.com/Kirima-KK/Quizora
- Sessions are stored in Redis instead of relying solely on JWT tokens
- Session ID is stored in an `httpOnly`, `secure` cookie
- Sessions are automatically refreshed on each authenticated request
- Logout destroys the session in Redis

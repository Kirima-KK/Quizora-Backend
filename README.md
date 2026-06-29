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

## 📦 Redis Setup

### Local Development
1. **Install Redis:**
   - **macOS:** `brew install redis`
   - **Windows:** Download from https://github.com/microsoftarchive/redis/releases or use WSL
   - **Linux:** `apt-get install redis-server`

2. **Start Redis:**
   ```bash
   redis-server
   ```

3. **Set Environment Variables** (in `.env`):
   ```
   REDIS_URL=redis://localhost:6379
   CACHE_TTL_QUIZ=1800
   CACHE_TTL_USER=900
   CACHE_TTL_HISTORY=600
   SESSION_TTL=86400
   ```

### Production Deployment
- Use **Redis Cloud**, **AWS ElastiCache**, or **Azure Cache for Redis**
- Set `REDIS_URL` to your remote Redis instance URL in Vercel environment variables
- Example: `redis://:<password>@host:port`

### Cache Configuration
- **Quiz Data TTL:** 30 minutes (1800s) - adjust if quiz updates are frequent
- **User Profile TTL:** 15 minutes (900s) - cache user account data
- **Quiz History TTL:** 10 minutes (600s) - cache user quiz results
- **Session TTL:** 24 hours (86400s) - user login sessions

### Redis Session Management
- Sessions are stored in Redis instead of relying solely on JWT tokens
- Session ID is stored in an `httpOnly`, `secure` cookie
- Sessions are automatically refreshed on each authenticated request
- Logout destroys the session in Redis

<div align="center">

<br/>

# 🌊 Pluse

### A Modern Social Media Platform — Backend REST API

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> **Pluse** is a fully-featured, production-ready REST API powering a social media platform — complete with JWT authentication, Two-Factor Authentication, real-time-ready notifications, media uploads, a follow system, posts, comments, likes, and more.

<br/>

[📖 API Docs](#-api-reference) · [🚀 Getting Started](#-getting-started) · [🔐 Security](#-security) · [🤝 Contributing](#-contributing)

<br/>

---

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📁 Project Structure](#-project-structure)
- [📖 API Reference](#-api-reference)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure cookie-based & Bearer token support
- 📧 **Email Verification** — Account verification on signup with 24-hour expiry tokens
- 🛡️ **Two-Factor Authentication (2FA)** — OTP via email with 10-minute expiry
- 🔑 **Password Reset** — Secure email-based reset flow with 10-minute expiry tokens
- 👥 **Follow System** — Follow/unfollow users; follow requests for private accounts
- 📸 **Posts** — Create, edit, delete posts with image/video uploads via Cloudinary
- 📰 **Personalized Feed** — See posts from accounts you follow
- ❤️ **Likes** — Like/unlike posts and individual comments
- 💬 **Comments & Nested Replies** — Full threaded discussion on every post
- 🔔 **Notifications** — Real-time-ready notification system with read/unread tracking
- 👤 **User Profiles** — Avatar upload, bio, and profile management
- 🔍 **User Search** — Search users by name or username
- 🔒 **Role-Based Access Control** — `user` and `admin` roles
- 🌐 **Global Error Handling** — Custom `AppError` class with environment-aware stack traces
- 📬 **Environment-Aware Email** — Mailtrap in development, SendGrid in production

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express v5 |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) + Bcrypt |
| **Media Storage** | Cloudinary + Multer + Sharp |
| **Email** | Nodemailer (Mailtrap / SendGrid) |
| **Security** | Bcrypt, cookie-parser, CORS |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) `v9+`
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)
- A [Cloudinary](https://cloudinary.com/) account
- A [Mailtrap](https://mailtrap.io/) account (for development) and/or [SendGrid](https://sendgrid.com/) (for production)

---

### 1. Clone the Repository

```bash
git clone https://github.com/pokie-heisenberg/Pluse.git
cd Pluse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `config.env` file in the project root. See the [Environment Variables](#️-environment-variables) section below for all required keys.

```bash
cp config.env.example config.env
# Then fill in your values
```

### 4. Run the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

> The API will be available at `http://localhost:8000/api/v1` by default.

---

## ⚙️ Environment Variables

Create a `config.env` file in the project root with the following variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/pluse` |
| `DATABASE_PASSWORD` | MongoDB password (injected into connection string) | `yourSecurePassword` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `PORT` | Port the server listens on | `8000` |
| `JWT_SECRET` | Secret key for signing JWTs | `a-long-random-secret-string` |
| `JWT_EXPIRES_IN` | JWT token lifespan | `5d` |
| `JWT_COOKIE_EXPIRES_IN` | JWT cookie lifespan in days | `90` |
| `EMAIL_HOST` | SMTP host for dev email | `sandbox.smtp.mailtrap.io` |
| `EMAIL_PORT` | SMTP port for dev email | `2525` |
| `EMAIL_FROM` | Sender email address | `noreply@pluse.dev` |
| `EMAIL_USERNAME` | SMTP username (Mailtrap) | `your_mailtrap_username` |
| `EMAIL_PASSWORD` | SMTP password (Mailtrap) | `your_mailtrap_password` |
| `SENDGRID_USERNAME` | SendGrid username (prod) | `apikey` |
| `SENDGRID_PASSWORD` | SendGrid API key (prod) | `SG.xxxxxxxxxxxxxxxxxxxx` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnopqrstuvwxyz` |
| `FRONTEND_URL` | URL of the frontend app (for CORS & email links) | `http://localhost:5173` |

<details>
<summary>📋 <strong>Click to view full <code>config.env</code> template</strong></summary>

```env
# ─── Database ───────────────────────────────────────────────
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/pluse
DATABASE_PASSWORD=yourSecurePassword

# ─── Server ─────────────────────────────────────────────────
NODE_ENV=development
PORT=8000

# ─── JWT ────────────────────────────────────────────────────
JWT_SECRET=your-super-long-random-secret-key-here
JWT_EXPIRES_IN=5d
JWT_COOKIE_EXPIRES_IN=90

# ─── Email (Development — Mailtrap) ─────────────────────────
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_FROM=noreply@pluse.dev
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password

# ─── Email (Production — SendGrid) ──────────────────────────
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=SG.your_sendgrid_api_key

# ─── Cloudinary ──────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Frontend ────────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173
```

</details>

---

## 📁 Project Structure

```
PLUSE/
├── controllers/                # Route handlers (business logic)
│   ├── authController.js       # Signup, login, 2FA, password reset
│   ├── postController.js       # Post CRUD, feed, media upload
│   ├── userController.js       # Profile, search, update
│   ├── commentController.js    # Comments and nested replies
│   ├── likeController.js       # Like/unlike posts and comments
│   ├── followController.js     # Follow, unfollow, requests
│   └── notificationController.js  # Notifications management
│
├── models/                     # Mongoose schemas & data models
│
├── routes/                     # Express routers (API route definitions)
│
├── utils/                      # Shared utilities
│   ├── email.js                # Nodemailer email sender (Mailtrap/SendGrid)
│   ├── cloudinary.js           # Cloudinary upload helpers
│   └── appError.js             # Custom AppError class
│
├── app.js                      # Express app configuration & middleware
├── server.js                   # Server entry point
└── config.env                  # Environment variables (never commit this!)
```

---

## 📖 API Reference

**Base URL:** `http://localhost:8000/api/v1`

All protected routes require either:
- An `Authorization: Bearer <token>` header, **or**
- A `jwt` cookie set on login

---

<details>
<summary>🔐 <strong>Auth & Users</strong> — <code>/api/v1/users</code></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/signup` | Register a new account (sends verification email) | ❌ |
| `GET` | `/verify/:token` | Verify email address using token | ❌ |
| `POST` | `/login` | Login — returns `otp_required: true` if 2FA is enabled | ❌ |
| `POST` | `/verify-otp` | Submit 2FA OTP to complete login | ❌ |
| `PATCH` | `/toggle-2fa` | Enable or disable Two-Factor Authentication | ✅ |
| `POST` | `/forgotPassword` | Send a password reset link to email | ❌ |
| `PATCH` | `/resetPassword/:token` | Reset password using email token | ❌ |
| `GET` | `/logout` | Logout (clears JWT cookie) | ✅ |
| `GET` | `/me` | Get the currently authenticated user's profile | ✅ |
| `PATCH` | `/updateMe` | Update profile info and/or avatar photo | ✅ |
| `PATCH` | `/updatePassword` | Change password (requires current password) | ✅ |
| `GET` | `/search?searched=query` | Search for users by name or username | ❌ |
| `GET` | `/:id` | Get a user's public profile by ID | ❌ |
| `POST` | `/follow/:id` | Follow a user (or send a follow request if private) | ✅ |
| `DELETE` | `/follow/:id` | Unfollow a user | ✅ |
| `POST` | `/follow/:id/accept` | Accept an incoming follow request | ✅ |
| `POST` | `/follow/:id/decline` | Decline an incoming follow request | ✅ |

</details>

---

<details>
<summary>📸 <strong>Posts</strong> — <code>/api/v1/posts</code></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/` | Retrieve all posts | ❌ |
| `POST` | `/` | Create a new post (supports image/video upload) | ✅ |
| `GET` | `/feed` | Get the personalized feed (posts from followed users) | ✅ |
| `GET` | `/user/:userId` | Get all posts by a specific user | ❌ |
| `PATCH` | `/:id` | Update an existing post | ✅ |
| `DELETE` | `/:id` | Delete a post | ✅ |
| `POST` | `/:id/likes` | Toggle like/unlike on a post | ✅ |

</details>

---

<details>
<summary>💬 <strong>Comments & Replies</strong></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/posts/:postId/comments` | Get all comments on a post | ❌ |
| `POST` | `/posts/:postId/comments` | Add a comment to a post | ✅ |
| `PATCH` | `/comments/:id` | Update a comment | ✅ |
| `DELETE` | `/comments/:id` | Delete a comment | ✅ |
| `POST` | `/comments/:id/likes` | Toggle like/unlike on a comment | ✅ |
| `GET` | `/comments/:id/reply` | Get all replies to a comment | ❌ |
| `POST` | `/comments/:id/reply` | Add a reply to a comment | ✅ |

</details>

---

<details>
<summary>🔔 <strong>Notifications</strong> — <code>/api/v1/notifications</code></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/` | Get all notifications for the current user | ✅ |
| `PATCH` | `/read-all` | Mark all notifications as read | ✅ |
| `PATCH` | `/:id/read` | Mark a single notification as read | ✅ |
| `DELETE` | `/:id` | Delete a notification | ✅ |

</details>

---

## 🔐 Security

Pluse is built with security as a first-class concern. Here's an overview of the key measures in place:

### 🔑 JSON Web Tokens (JWT)
- Tokens are signed with a strong `JWT_SECRET` and expire after a configurable period (`JWT_EXPIRES_IN`)
- Tokens are delivered as **HttpOnly cookies** (immune to XSS) and optionally via `Authorization: Bearer` header
- Logout invalidates the cookie immediately by setting a past expiry date

### 🛡️ Two-Factor Authentication (2FA)
- Users can enable 2FA from their account settings via `PATCH /toggle-2fa`
- On login with 2FA enabled, a **one-time password (OTP)** is sent to the user's registered email
- OTPs are **hashed before storage** and expire after **10 minutes**
- Login is only completed after successful OTP verification via `POST /verify-otp`

### 📧 Email Verification
- Every new account must verify their email before gaining full access
- Verification tokens are cryptographically generated, **hashed in the database**, and expire after **24 hours**
- Unverified accounts cannot perform protected actions

### 🔒 Password Security
- All passwords are hashed using **Bcrypt** with a high salt round before storage
- Plain-text passwords are never stored or logged
- Password reset tokens are short-lived (**10 minutes**), single-use, and hashed in the database

### 🚧 Role-Based Access Control
- The platform supports `user` and `admin` roles
- Admin-only routes are protected by middleware that verifies the user's role before granting access
- Users can only modify or delete their own resources

### 🌐 Global Error Handling
- A custom `AppError` class provides consistent, structured error responses
- In `development`, full stack traces are returned for debugging
- In `production`, only safe, user-friendly error messages are exposed

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/Pluse.git
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```
4. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push** to your branch:
   ```bash
   git push origin feature/your-amazing-feature
   ```
6. **Open a Pull Request** on GitHub and describe your changes

> Please make sure your code follows the existing style and that all endpoints are properly tested before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **[Aman Yadav](https://github.com/pokie-heisenberg)**

⭐ Star this repo if you found it helpful!

[![GitHub](https://img.shields.io/badge/GitHub-pokie--heisenberg-181717?style=for-the-badge&logo=github)](https://github.com/pokie-heisenberg/Pluse)

</div>

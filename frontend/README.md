Aap is code ko copy karke apni README.md file mein paste kar dein:

markdown
# 📸 SocialHub - Full-Stack Instagram Clone

A feature-rich, full-stack social media application inspired by Instagram. Built with the MERN stack, this platform allows users to share posts, interact through likes and comments, discover new content, and communicate in real-time using Socket.io.

## 🚀 Project Repository
[GitHub Repo](https://github.com/missionkuamar/instagram-clone) *(Apna actual repo link daalein)*

---

## 📸 Screenshots

### 🏠 Authentication
<img src="frontend/public/login.png" alt="Login Page" width="800" />
<img src="frontend/public/register.png" alt="Register Page" width="800" />

### 📱 Main App Interface
<img src="frontend/public/home.png" alt="Home Feed" width="800" />
<img src="frontend/public/explore.png" alt="Explore Page" width="800" />
<img src="frontend/public/profile.png" alt="User Profile" width="800" />

### 🔍 Search & Messaging
<img src="frontend/public/search-user.png" alt="Search Users" width="800" />
<img src="frontend/public/search-post.png" alt="Search Posts" width="800" />
<img src="frontend/public/message.png" alt="Chat & Messages" width="800" />

### 📝 Posts & Notifications
<img src="frontend/public/create-post.png" alt="Create Post" width="800" />
<img src="frontend/public/post-detail.png" alt="Post Details" width="800" />
<img src="frontend/public/notification.png" alt="Notifications" width="800" />
<img src="frontend/public/bookmark-section.png" alt="Saved Bookmarks" width="800" />

---

## ✨ Key Features

- **🔐 Secure Authentication:** User login and signup using JWT and secure password hashing.
- **📸 Post Creation:** Upload images with captions using Cloudinary.
- **❤️ Interactions:** Like, comment, and save posts to bookmarks.
- **💬 Real-Time Chat:** Instant messaging with online/offline status using Socket.io.
- **🔍 Explore & Search:** Discover trending posts, search for users, and filter content.
- **🔔 Notifications:** Real-time alerts for likes, comments, and new followers.
- **👤 User Profiles:** View posts, followers, following, and edit profile details.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)** - UI Library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State Management
- **Socket.io-client** - Real-time Communication
- **Axios** - API Requests

### Backend
- **Node.js + Express.js** - Server & API
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Socket.io** - WebSockets for Chat
- **Cloudinary** - Image Storage
- **Multer** - File Uploads

---

## 📁 Project Structure

```text
instagram-clone/
├── backend/                 # Node.js + Express Backend
│   ├── controllers/         # Business logic (auth, post, user, message)
│   ├── middlewares/         # Auth checks, file uploads
│   ├── models/              # MongoDB Schemas
│   ├── node_modules/
│   ├── routes/              # Express routes
│   ├── socket/              # Socket.io setup
│   ├── utils/               # Helper functions (Cloudinary, JWT)
│   ├── .env                 # Backend Environment Variables
│   ├── index.js             # Server entry point
│   ├── package-lock.json
│   └── package.json
├── frontend/                # React Frontend
│   ├── public/              # Static assets & Screenshots
│   ├── src/
│   │   ├── components/      # Reusable UI (Sidebar, Posts, Modals)
│   │   ├── pages/           # Home, Login, Profile, Chat, Explore
│   │   ├── redux/           # Slices & Store config
│   │   ├── utils/           # Axios instance & helpers
│   │   └── App.jsx
│   ├── .env                 # Frontend Environment Variables
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
⚡ Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/missionkuamar/instagram-clone.git
cd instagram-clone
2. Backend Setup (backend folder)
bash
cd backend
npm install
Create a .env file in the backend folder and add the following variables (as per your screenshot):

env
# Server Config
PORT=8000
URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://mission:mission@cluster0.icne0un.mongodb.net/?appName=Cluster0

# Authentication
SECRET_KEY=mission

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=drxa8u19w
CLOUDINARY_API_KEY=353833735798823
CLOUDINARY_API_SECRET=18fkp5rAk9wUmk4WOkAgLGPbf2g
CLOUDINARY_URL=cloudinary://353833735798823:18fkp5rAk9wUmk4WOkAgLGPbf2g@drxa8u19w

# API & Socket URLs
VITE_API_URL_API=http://localhost:5173/api/v1
VITE_SOCKET_URL=http://localhost:5173
Start the backend server:

bash
npm run dev
(The server will run on http://localhost:8000)

3. Frontend Setup (frontend folder)
Open a new terminal and navigate to the frontend folder:

bash
cd frontend
npm install
Create a .env file in the frontend folder:

env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
Start the frontend server:

bash
npm run dev
(The frontend will run on http://localhost:5173)

🔌 API Endpoints (Overview)
Authentication (/api/v1/auth)
POST /register - Register a new user

POST /login - Login user & get token

GET /logout - Logout user

User (/api/v1/user)
GET /:id/profile - Get user profile details

PUT /profile/edit - Update user details

GET /suggested - Get suggested users to follow

Posts (/api/v1/post)
POST /create - Create a new post (with Cloudinary image)

GET /all - Get all posts for the feed

GET /:id - Get single post details

PUT /:id/like - Like/Unlike a post

POST /:id/comment - Add a comment

Messages (/api/v1/message)
POST /send/:id - Send a message to a user

GET /:id - Get conversation with a specific user

GET / - Get all recent chats

📦 Key Dependencies
Backend:

text
express, mongoose, bcryptjs, jsonwebtoken,
socket.io, cloudinary, multer, cors, dotenv
Frontend:

text
react, react-redux, @reduxjs/toolkit, react-router-dom,
axios, socket.io-client, tailwindcss, react-hot-toast
👨‍💻 Author
Mission Kumar

GitHub: @missionkuamar

Repository: Instagram Clone

⭐ Star this repository if you found it helpful!

text

### 💡 Ek important note:
Aapke `.env` file mein `SECRET_KEY=mission` aur `MONGODB_URI` mein aapka actual password (`mission:mission`) dikh raha hai. Jab aap isko GitHub par push karein, toh dhyan rakhein ki **`.env` file `.gitignore` mein ho** taaki aapki database aur cloudinary ki keys leak na ho! 
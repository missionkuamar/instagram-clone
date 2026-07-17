Social Media App - README.md
markdown
# Social Media Application

A full-featured social media platform built with the MERN stack, featuring real-time messaging, post management, user authentication, and advanced search functionality.

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Library
- **Redux Toolkit** - State Management
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time Features
- **React Router DOM** - Navigation
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Socket.io** - Real-time Server
- **JWT** - Authentication
- **Cloudinary** - Image Storage

---

## ✨ Features

### Authentication
- User Registration & Login
- JWT Token Authentication
- Protected Routes
- Persistent Sessions

### Posts
- Create Posts with Images
- Like/Unlike Posts
- Comment on Posts
- Delete Own Posts
- Bookmark Posts
- Real-time Updates

### Search
- Search Posts by Caption/Author
- Search Users by Username/Name
- Search Hashtags
- Advanced Filters (Date, Likes, Comments)
- Trending Topics
- Recent Searches
- Pagination Support

### Chat
- Real-time Messaging
- Message History
- Online Status
- Typing Indicators
- Socket.io Integration

### User Profile
- Edit Profile
- Follow/Unfollow Users
- View Followers/Following
- Post History
- Bookmarked Posts

### Responsive Design
- Mobile-First Approach
- Dark/Light Mode Support
- All Screen Sizes

---

## 📁 Project Structure
social-media-app/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── authController.js
│ │ │ ├── postController.js
│ │ │ ├── commentController.js
│ │ │ ├── searchController.js
│ │ │ └── userController.js
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Post.js
│ │ │ ├── Comment.js
│ │ │ ├── Message.js
│ │ │ ├── Conversation.js
│ │ │ └── Hashtag.js
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── postRoutes.js
│ │ │ ├── commentRoutes.js
│ │ │ ├── searchRoutes.js
│ │ │ ├── userRoutes.js
│ │ │ └── messageRoutes.js
│ │ ├── middleware/
│ │ │ └── auth.js
│ │ ├── socket/
│ │ │ └── socket.js
│ │ └── utils/
│ │ ├── cloudinary.js
│ │ └── datauri.js
│ ├── .env
│ ├── package.json
│ └── server.js
│
└── frontend/
├── src/
│ ├── components/
│ │ ├── ui/
│ │ │ ├── avatar.jsx
│ │ │ ├── button.jsx
│ │ │ ├── dialog.jsx
│ │ │ ├── input.jsx
│ │ │ ├── label.jsx
│ │ │ ├── select.jsx
│ │ │ ├── skeleton.jsx
│ │ │ ├── alert-dialog.jsx
│ │ │ └── dropdown-menu.jsx
│ │ ├── search/
│ │ │ ├── PostsSearch.jsx
│ │ │ ├── UsersSearch.jsx
│ │ │ └── HashtagsSearch.jsx
│ │ ├── chat/
│ │ │ ├── ChatList.jsx
│ │ │ ├── ChatWindow.jsx
│ │ │ └── MessageInput.jsx
│ │ └── common/
│ │ ├── Navbar.jsx
│ │ └── Footer.jsx
│ ├── features/
│ │ ├── auth/
│ │ │ └── authSlice.js
│ │ ├── post/
│ │ │ └── postSlice.js
│ │ ├── search/
│ │ │ └── searchSlice.js
│ │ └── chat/
│ │ └── chatSlice.js
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Profile.jsx
│ │ ├── PostDetail.jsx
│ │ ├── Search.jsx
│ │ └── Messages.jsx
│ ├── services/
│ │ └── axiosInstance.js
│ ├── utils/
│ │ └── socket.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js

text

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary Account

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app/backend

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables
echo "PORT=5000" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/social_media" >> .env
echo "SECRET_KEY=your_secret_key" >> .env
echo "CLOUDINARY_CLOUD_NAME=your_cloud_name" >> .env
echo "CLOUDINARY_API_KEY=your_api_key" >> .env
echo "CLOUDINARY_API_SECRET=your_api_secret" >> .env

# Start server
npm run dev
Frontend Setup
bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables
echo "VITE_API_URL=http://localhost:5000" >> .env

# Start development server
npm run dev
📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/register	Register new user
POST	/login	Login user
POST	/logout	Logout user
GET	/profile/:id	Get user profile
Posts
Method	Endpoint	Description
GET	/posts/all	Get all posts
POST	/post/add	Create new post
GET	/post/:id/like	Like a post
GET	/post/:id/dislike	Unlike a post
POST	/post/:id/comment	Add comment
DELETE	/post/delete/:id	Delete post
Search
Method	Endpoint	Description
GET	/search/posts	Search posts
GET	/search/users	Search users
GET	/search/hashtags	Search hashtags
POST	/search/advanced	Advanced search
GET	/search/trending	Get trending
Messages
Method	Endpoint	Description
POST	/message/send/:id	Send message
GET	/message/get/:id	Get messages
🔌 Socket.io Events
Server Events
Event	Description
connection	New client connection
disconnect	Client disconnection
Client Events
Event	Description
newMessage	New message received
notification	New notification
typing	User typing indicator
🎨 UI Components
Core Components
Avatar - User profile pictures

Button - Reusable buttons with variants

Dialog - Modal dialogs

Input - Form inputs with validation

Select - Dropdown selectors

Skeleton - Loading placeholders

AlertDialog - Confirmation dialogs

Search Components
PostsSearch - Search posts with filters

UsersSearch - Search users

HashtagsSearch - Search hashtags

Chat Components
ChatList - List of conversations

ChatWindow - Message display

MessageInput - Send messages

🎯 Redux State Management
Auth Slice
javascript
{
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
}
Post Slice
javascript
{
    posts: [],
    loading: false,
    error: null
}
Search Slice
javascript
{
    posts: [],
    users: [],
    hashtags: [],
    postsLoading: false,
    usersLoading: false,
    activeTab: 'posts',
    postsPagination: { currentPage, totalPages, totalItems },
    usersPagination: { currentPage, totalPages, totalItems },
    trendingTopics: []
}
Chat Slice
javascript
{
    conversations: [],
    messages: [],
    currentChatUser: null,
    loading: false,
    onlineUsers: []
}
🚀 Deployment
Backend (Render/Vercel)
bash
# Build for production
npm run build

# Start production server
npm start
Frontend (Vercel/Netlify)
bash
# Build for production
npm run build

# Preview build
npm run preview
📦 Dependencies
Backend
json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "socket.io": "^4.6.0",
    "cloudinary": "^1.37.0",
    "sharp": "^0.32.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
Frontend
json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "socket.io-client": "^4.6.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.260.0",
    "sonner": "^1.0.0",
    "react-hook-form": "^7.43.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Your Name

GitHub: @yourusername

LinkedIn: @yourusername

🙏 Acknowledgments
MongoDB for database

Cloudinary for image hosting

Socket.io for real-time features

Tailwind CSS for styling

Redux Toolkit for state management

📞 Support
For support, email support@example.com or create an issue in the repository.

⭐ Star this repository if you found it helpful!

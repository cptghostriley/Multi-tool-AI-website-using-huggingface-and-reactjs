# Nexus AI - AI Tools Platform

A modern full-stack web application that provides AI-powered tools for text generation, image creation, and voice synthesis. Built with React, Node.js, Express, and PostgreSQL, featuring a secure authentication system and real-time AI capabilities.

## 🚀 Features

### 🔐 Authentication System
- User registration and login with secure JWT authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Session management

### 🤖 AI-Powered Tools

#### 📝 Text Generator
- **Model**: Hugging Face GPT (openai/gpt-oss-20b:fireworks-ai)
- Generate comprehensive text responses from prompts
- Structured paragraph formatting
- Real-time processing

#### 🎨 Image Generator
- **Model**: FLUX.1-schnell (black-forest-labs)
- Create high-quality images from text descriptions
- Base64 encoding for instant web display
- No local file storage required

#### 🔊 Voice Generator
- **Primary**: Hugging Face Kokoro-82M TTS model
- **Fallback**: Google Text-to-Speech (gTTS)
- Convert text to natural-sounding speech
- Base64 audio encoding for web playback
- Automatic fallback system for reliability

### 📊 User Dashboard
- Overview of all AI tools
- Recent activity tracking
- User profile management
- Usage history

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Beautiful gradient backgrounds and animations
- Toast notifications for user feedback
- Loading states and interactive components
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hook Form** with validation
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** database (NeonDB)
- **bcryptjs** for password hashing
- **Joi** for request validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### AI Integration
- **Hugging Face Hub** API
- **Python** integration for AI processing
- **Child Process** spawning for Python scripts
- **Base64** encoding for media transfer

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **npm** or **yarn**
- **NeonDB** account (PostgreSQL database)
- **Hugging Face** API key

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repository-url>
cd MultiApp
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Python Environment Setup
```bash
cd server/Engine
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install requests python-dotenv huggingface-hub gtts
```

### 3. Environment Configuration
Create `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (NeonDB)
DATABASE_URL=postgresql://username:password@host/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI API Keys
HUGGINGFACE_API_KEY=your-hf-api-key

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup
- Create a [NeonDB](https://neon.tech) account
- Create a new project and database
- Copy the connection string to your `.env` file
- Tables will be created automatically on first run

### 5. Get Your Hugging Face API Key
1. Create account at [huggingface.co](https://huggingface.co)
2. Go to Settings → Access Tokens
3. Create a new token with read permissions
4. Add to your `.env` file

### 6. Run the Application
```bash
# Start backend server (from root directory)
npm run server

# Start frontend (new terminal, from root directory)
npm run client

# Or start both simultaneously
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
MultiApp/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Layout.tsx      # Main layout wrapper
│   │   ├── contexts/           # React Context providers
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── Login.tsx       # User login
│   │   │   ├── Register.tsx    # User registration
│   │   │   ├── TextGenerator.tsx
│   │   │   ├── ImageGenerator.tsx
│   │   │   ├── VoiceGenerator.tsx
│   │   │   └── Profile.tsx     # User profile
│   │   ├── App.tsx             # Main app component
│   │   └── index.tsx           # React entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # Node.js Backend
│   ├── Engine/                 # Python AI Scripts
│   │   ├── venv/              # Python virtual environment
│   │   ├── text.py            # Text generation
│   │   ├── image.py           # Image generation
│   │   └── voice.py           # Voice synthesis
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── ai.js              # AI tool routes
│   ├── services/
│   │   └── ai.js              # AI service integration
│   ├── index.js               # Server entry point
│   ├── package.json
│   └── env.example            # Environment variables template
├── package.json               # Root package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/activity` - Get user activity (protected)

### AI Tools
- `POST /api/ai/text` - Generate text content
- `POST /api/ai/image` - Generate images from prompts
- `POST /api/ai/voice` - Convert text to speech

### Request Examples

#### Text Generation
```bash
curl -X POST http://localhost:5000/api/ai/text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain artificial intelligence"}'
```

#### Image Generation
```bash
curl -X POST http://localhost:5000/api/ai/image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic city skyline"}'
```

#### Voice Generation
```bash
curl -X POST http://localhost:5000/api/ai/voice \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, welcome to MultiApp!"}'
```

## 🔒 Security Features

- **Environment Variables**: All API keys secured in `.env` files
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schemas for all endpoints
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers middleware
- **No File Storage**: All media handled in-memory with base64

## 🎯 Usage Guide

### 1. **User Registration/Login**
- Navigate to the homepage
- Create a new account or login with existing credentials
- Access protected AI tools after authentication

### 2. **Text Generation**
- Enter your prompt describing what you want to generate
- Click "Generate" to create comprehensive text responses
- Copy the generated content for your use

### 3. **Image Creation**
- Describe the image you want in the prompt field
- Generate high-quality images using FLUX.1-schnell
- Images display instantly without downloads

### 4. **Voice Synthesis**
- Enter text you want converted to speech
- System tries Kokoro-82M first, falls back to gTTS if needed
- Play audio directly in browser

### 5. **Profile Management**
- View your account information
- See usage history and activity
- Track your AI generations

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: connect ENOTFOUND
```
- Verify your NeonDB connection string in `.env`
- Check database URL format and credentials
- Ensure database is accessible from your IP

**Python Virtual Environment Issues**
```
ModuleNotFoundError: No module named 'requests'
```
- Activate virtual environment: `venv\Scripts\activate` (Windows)
- Install dependencies: `pip install -r requirements.txt`

**Hugging Face API Errors**
```
401 Unauthorized
```
- Verify `HUGGINGFACE_API_KEY` in `.env` file
- Check API key permissions on Hugging Face
- Ensure token has access to required models

**Port Already in Use**
```
EADDRINUSE: address already in use :::5000
```
- Kill existing process: `npx kill-port 5000`
- Or change port in `.env`: `PORT=5001`

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Use production database URL
3. Set `NODE_ENV=production`
4. Configure CORS for production domain

### Build Process
```bash
# Build React frontend
cd client && npm run build

# Start production server
cd ../server && npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for AI model APIs and inference endpoints
- **NeonDB** for PostgreSQL database hosting
- **FLUX.1-schnell** for high-quality image generation
- **Kokoro-82M** for natural voice synthesis
- **React** and **Node.js** communities for excellent frameworks

## 📞 Support

For support, questions, or contributions:
- Open an issue in this repository
- Contact the development team
- Check documentation for common solutions

---

**Built with ❤️ for the AI community** 🚀

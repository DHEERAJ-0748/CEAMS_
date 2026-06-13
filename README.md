# CEAMS - Centralized Event Approval & Management System

An AI-powered full-stack web application for managing and approving institutional events through a structured workflow.

## 🚀 Features

- Multi-role authentication (Club, Faculty, Admin, Principal)
- Event creation and approval workflow
- Venue management system
- Academic calendar with blocked dates
- Gmail-style notifications
- Analytics dashboard
- Budget monitoring
- AI assistant **Jarvis**
- Role-based access control
- Real-time status tracking

### Approval Workflow

```text
Club → Faculty → Admin → Principal
```

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- Supabase (PostgreSQL)

### Authentication
- JWT Authentication

### AI Integration
- Google Gemini API

### Deployment
- Render
- Vercel

## 🔒 Security

- JWT-based authentication
- Password hashing using bcrypt/bcryptjs
- Protected routes
- Role-based authorization

## 🏗 Architecture

```text
React Frontend
      ↓
Node.js Backend
      ↓
Supabase Database
      ↓
Gemini AI (Jarvis)
```

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
cd CEAMS_
```

Install dependencies:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🌟 Future Enhancements

- Mobile application (React Native)
- Push notifications
- Voice-enabled Jarvis
- AI conflict prediction
- Smart budget recommendations

## 👨‍💻 Author

**Dheeraj Sribashyam**

Built to modernize campus event approval and management using Full Stack Development and Generative AI.

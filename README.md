# Full Stack Web Application

A comprehensive full stack web application built with React frontend and Node.js backend, featuring user authentication, modern UI components, and production-ready deployment configuration.

## 🚀 Features

### Frontend (React)
- ⚛️ React 18 with functional components and hooks
- 🎨 Modern CSS with variables and responsive design
- 🔐 JWT-based authentication system
- 📱 Mobile-responsive design
- 🎯 Custom hooks for API calls and local storage
- 🔄 Loading states and error handling
- 📋 Form validation and user feedback

### Backend (Node.js/Express)
- 🚀 Express.js REST API
- 🗄️ MongoDB with Mongoose ODM
- 🔒 Secure authentication with JWT
- 📧 Email service integration
- 💳 Stripe payment integration
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 Comprehensive logging with Winston
- ✅ Input validation and sanitization

### DevOps & Tools
- 🐳 Docker containerization
- 🔧 Webpack build configuration
- 🧪 Jest testing framework
- 📏 ESLint and Prettier for code quality
- 🔄 Hot reload for development
- 📊 Performance monitoring

## 📁 Project Structure

```
fullstack-web-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   └── package.json
├── docker-compose.yml     # Docker services
├── Dockerfile            # Backend container
├── nginx.conf           # Nginx configuration
└── package.json         # Root package file
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fullstack-web-app.git
   cd fullstack-web-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Docker Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up --build
   ```

This will start all services including MongoDB, Redis, frontend, and backend.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fullstackapp

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Client URL
CLIENT_URL=http://localhost:3000
```

## 🚀 Development

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build frontend for production
- `npm test` - Run all tests
- `npm run lint` - Lint all code
- `npm run prettier` - Format all code

#### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests

#### Backend (server/)
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm test` - Run backend tests

### Code Quality

The project includes:
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Jest** for testing
- **Pre-commit hooks** for code quality

Run quality checks:
```bash
npm run lint        # Check for linting errors
npm run prettier    # Format code
npm test           # Run tests
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test              # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Backend Testing
```bash
cd server
npm test              # Run tests
npm run test:coverage # Generate coverage report
```

## 📦 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure production environment variables are set:
- `NODE_ENV=production`
- Database connection strings
- JWT secrets
- Email configuration
- Payment processor keys

### Docker Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- SQL injection protection
- XSS protection

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Protected Routes
All API routes except authentication require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   ```bash
   # Kill process on port 3000 or 5000
   npx kill-port 3000
   npx kill-port 5000
   ```

3. **Package Installation Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   npm run clean
   npm run install:all
   ```

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/fullstack-web-app/issues) page
2. Search existing discussions
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- All open source contributors

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
# HelpingHand 🌍

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

**HelpingHand** is a cross-platform web and mobile application designed to strengthen local communities by making it easier to organize and participate in events nearby. The platform allows users to discover volunteer opportunities, social gatherings, and community initiatives through an interactive map powered by Google Maps.

## 🌟 Vision

HelpingHand connects people in the same geographic area to organize and attend community events, encouraging neighborly behavior, making volunteering easier to discover, and building local friendships and support networks.

## ✨ Key Features

### 🗺️ Interactive Map
- Google Maps integration with event pins
- Color-coded pins by event category
- Radius-based filtering
- Real-time event discovery

### 📅 Event Management
- **Host Events**: Create and manage community events
- **RSVP System**: Easy RSVP with attendee tracking
- **Event Categories**: Organize by type (volunteering, social, educational, etc.)
- **Capacity Management**: Set and track event limits

### 👥 Social Features
- User profiles with event history
- Friend connections
- Follow hosts
- See what friends are attending
- Comment system for events

### 📱 Cross-Platform
- **Web App**: Full-featured browser experience
- **Mobile App**: Native iOS and Android applications
- Responsive design for all screen sizes

### ♿ Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Adjustable text sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+ (for caching)
- Google Maps API key
- AWS/GCP account (for hosting and storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/helping-hand.git
   cd helping-hand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env)
   cp server/.env.example server/.env
   # Edit server/.env with your configuration

   # Frontend (.env)
   cp client/.env.example client/.env
   # Edit client/.env with your API keys
   ```

4. **Set up the database**
   ```bash
   cd server
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Backend server
   cd server
   npm run dev

   # Terminal 2: Frontend client
   cd client
   npm start

   # Terminal 3: Mobile app (if developing)
   cd mobile
   npm start
   ```

## 📁 Project Structure

```
helping-hand/
├── client/                 # React web application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
├── server/                # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── migrations/        # Database migrations
│
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # Navigation setup
│   │   └── services/      # API services
│   └── assets/            # Images, fonts, etc.
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── DATABASE_SCHEMA.md # Database design
│   ├── TECH_STACK.md      # Technology choices
│   └── WIREFRAMES.md      # UI/UX wireframes
│
└── .github/               # GitHub configurations
    ├── ISSUES.md          # Issue tracking
    └── workflows/         # CI/CD workflows
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **Redux Toolkit** - State management
- **Material-UI / Tailwind CSS** - UI components
- **Google Maps React** - Map integration
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **GraphQL / REST** - API layer
- **JWT** - Authentication
- **Socket.io** - Real-time features

### Mobile
- **React Native** - Cross-platform mobile
- **Expo** - Development tooling
- **React Navigation** - Navigation
- **Redux Toolkit** - State management

### Infrastructure
- **AWS / GCP** - Cloud hosting
- **Vercel** - Frontend hosting
- **CloudFront / Cloudflare** - CDN
- **S3 / Cloud Storage** - File storage
- **Docker** - Containerization

See [TECH_STACK.md](./docs/TECH_STACK.md) for detailed technology choices and rationale.

## 🗄️ Database Schema

The application uses PostgreSQL with geospatial extensions for location-based queries. See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for the complete schema design.

Key entities:
- **Users** - User accounts and profiles
- **Events** - Community events
- **RSVPs** - Event attendance
- **Comments** - Event discussions
- **Friendships** - User connections
- **Notifications** - User alerts

## 🏗️ Architecture

HelpingHand follows a microservices-ready architecture with clear separation of concerns. See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture diagrams and explanations.

Key components:
- **API Gateway** - Request routing and authentication
- **Event Service** - Event management
- **User Service** - User profiles and authentication
- **Map Service** - Geospatial queries
- **Notification Service** - Real-time notifications
- **File Service** - Image and file storage

## 🎨 Design & Wireframes

UI/UX wireframes and design guidelines are documented in [WIREFRAMES.md](./docs/WIREFRAMES.md). The design prioritizes:
- Clean, modern interface
- Mobile-first responsive design
- Accessibility compliance
- Intuitive navigation

## 📋 Development Roadmap

See [.github/ISSUES.md](./.github/ISSUES.md) for a comprehensive list of planned features and issues.

### Phase 1: Foundation (Weeks 1-4)
- Project setup and infrastructure
- Authentication system
- Basic user profiles
- Database schema implementation

### Phase 2: Core Features (Weeks 5-8)
- Map integration
- Event creation and management
- RSVP system
- Basic search and filtering

### Phase 3: Social Features (Weeks 9-12)
- Friend connections
- Comments system
- Notifications
- User profiles enhancement

### Phase 4: Mobile App (Weeks 13-16)
- React Native setup
- Mobile-specific UI/UX
- Push notifications
- App store deployment

### Phase 5: Polish & Scale (Weeks 17-20)
- Performance optimization
- Accessibility improvements
- Advanced features
- Production deployment

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Production Build

```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build
```

### Environment Setup

Production requires:
- PostgreSQL database
- Redis instance
- Google Maps API key
- AWS S3 bucket (for images)
- Environment variables configured

See deployment documentation for platform-specific instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Aditi Singh** - Project Lead

## 🙏 Acknowledgments

- Google Maps Platform for mapping services
- Open source community for amazing tools and libraries
- All contributors and early adopters

## 📞 Contact & Support

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/helping-hand/issues)
- **Email**: support@helpinghand.app
- **Documentation**: [Full Documentation](./docs/)

## 🔗 Links

- [Landing Page](#) (Coming soon)
- [Privacy Policy](#) (Coming soon)
- [Terms of Service](#) (Coming soon)

---

**Made with ❤️ for stronger communities**

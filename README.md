# OCS User Frontend

> A **Vue.js-based web application** that serves as the **user interface section** of the **Observatory Control System (OCS)**. This project provides the frontend components and views specifically designed for user interactions, authentication, and profile management within the OCS ecosystem.

A comprehensive Vue.js frontend application demonstrating the use of the `ocs-components-lib` and showcasing the user-facing capabilities of an observatory control system. This project provides a modern, responsive web interface for user authentication, profile management, and user-specific operations within the OCS platform.

## 🚀 Quick Start

The easiest way to get started is to run the provided start script:

```bash
chmod +x start_frontend.sh
./start_frontend.sh
```

This will automatically set up the Node.js environment and start the development server at `http://localhost:8080`.

## 📋 Prerequisites

Before running this project, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** - [Download yarn here](https://yarnpkg.com/)
- **Git** - [Download here](https://git-scm.com/)

### Recommended Tools
- **VS Code** or any modern code editor
- **Vue DevTools** browser extension for debugging

## 🛠️ Dependencies

### Core Dependencies
This project uses the following main dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| `vue` | ^2.6.11 | Core Vue.js framework |
| `vue-router` | ^3.2.0 | Client-side routing |
| `vuex` | ^3.4.0 | State management |
| `@vue/composition-api` | ^1.0.0-rc.7 | Composition API for Vue 2 |
| `ocs-component-lib` | ^0.13.3 | Observatory Control System components |

### UI & Styling Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `bootstrap` | ^4.5.3 | CSS framework |
| `bootstrap-vue` | ^2.20.1 | Vue components for Bootstrap |
| `vue-ctk-date-time-picker` | ^2.0.9 | Date and time picker component |

### Utility Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `jquery` | ^3.5.0 | DOM manipulation (legacy support) |
| `lodash` | ^4.17.13 | JavaScript utility library |
| `moment` | ^2.22.1 | Date and time manipulation |
| `vis` | 4.19.1 | Dynamic visualization library |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@vue/cli-service` | ~4.5.0 | Vue CLI build tool |
| `@vue/cli-plugin-babel` | ~4.5.0 | Babel transpilation |
| `@vue/cli-plugin-eslint` | ~4.5.0 | Code linting |
| `@vue/cli-plugin-router` | ~4.5.0 | Router integration |
| `@vue/cli-plugin-vuex` | ~4.5.0 | Vuex integration |
| `sass` | ^1.26.5 | CSS preprocessor |
| `sass-loader` | ^8.0.2 | Sass loader for webpack |

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Swapnil9887/OCS-User.git
   cd OCS-User
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run serve
   # or use the provided script
   ./start_frontend.sh
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VUE_APP_OBSERVATION_PORTAL_API_URL` | Observation portal API URL | `http://127.0.0.1:8000` | Yes |

### Backend Setup

For full functionality, you'll need a running [observation portal](https://github.com/observatorycontrolsystem/observation-portal). 

**Important CORS Configuration:**
When running the observation portal, enable cross-origin resource sharing for the frontend domain:

```bash
export CORS_ORIGIN_WHITELIST=http://127.0.0.1:8080
export CSRF_TRUSTED_ORIGINS=127.0.0.1:8080
```

**Note:** `127.0.0.1` and `localhost` are not interchangeable. If you want both to work, set both values:
```bash
export CSRF_TRUSTED_ORIGINS=127.0.0.1:8080,localhost:8080
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run serve` | Start development server with hot-reload |
| `npm run build` | Build for production (optimized) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Run ESLint and automatically fix issues |

## 📁 Project Structure

```
ocs-example-frontend/
├── public/                 # Static assets
│   ├── config/            # Configuration files
│   └── index.html         # Main HTML template
├── src/                   # Source code
│   ├── assets/           # Images, styles, etc.
│   ├── components/       # Reusable Vue components
│   ├── router/           # Vue Router configuration
│   ├── store/            # Vuex store
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── deploy/               # Deployment configuration
├── docker/               # Docker configuration
├── package.json          # Dependencies and scripts
├── vue.config.js         # Vue CLI configuration
└── start_frontend.sh     # Quick start script
```

## 🐳 Docker Support

This project includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t ocs-frontend .

# Run with Docker Compose
docker-compose up
```

## 🔍 Development Features

- **Hot Module Replacement (HMR)** - Automatic browser refresh on file changes
- **ESLint Integration** - Code quality and style enforcement
- **Sass/SCSS Support** - Advanced CSS preprocessing
- **Vue DevTools** - Browser extension for debugging Vue applications
- **Responsive Design** - Bootstrap-based responsive layout

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version Issues:**
   - Ensure you're using Node.js v14 or higher
   - The start script uses legacy OpenSSL provider for compatibility

2. **Port Conflicts:**
   - Default port is 8080
   - If occupied, Vue CLI will automatically suggest an alternative port

3. **CORS Errors:**
   - Ensure your backend CORS settings include your frontend URL
   - Check that both `127.0.0.1` and `localhost` are configured if needed

4. **Dependency Issues:**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Browser Compatibility

This application is tested and works with:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📚 Additional Resources

- [Vue.js Documentation](https://vuejs.org/v2/guide/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vuex Documentation](https://vuex.vuejs.org/)
- [Bootstrap Vue Documentation](https://bootstrap-vue.org/)
- [OCS Component Library](https://github.com/observatorycontrolsystem/ocs-components-lib)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Observatory Control System (OCS) ecosystem.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section above
- Review the [OCS documentation](https://github.com/observatorycontrolsystem)
- Open an issue on GitHub

---

**Happy Observing! 🌟**
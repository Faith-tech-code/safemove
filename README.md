# SafeMove - Multi-Modal Transport Platform

A comprehensive ride-sharing and transportation platform built with Node.js, Fastify, and MongoDB. Features include web and mobile accessibility, real-time tracking, and multi-modal transport options.

## 🚀 Features

- **Multi-Modal Transport**: Boda, Taxi, Car, Bus, and Train options
- **Fixed Rate Pricing**: No surge pricing or hidden fees
- **Web Platform**: Full-featured web application with voice assistance
- **USSD Support**: Works on any phone via *284*20#
- **Voice Accessible**: Screen reader and hands-free support
- **Real-time Tracking**: Live trip monitoring for riders and drivers
- **Admin Dashboard**: Complete fleet and user management

## 🛠️ Tech Stack

- **Backend**: Node.js, Fastify, MongoDB, Mongoose
- **Frontend**: HTML, CSS, JavaScript, Responsive Design
- **Mobile**: React Native/Expo
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer for document management

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The application will be available at `http://localhost:8000`

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages. The frontend is deployed as a static site.

### Deployment Process

1. **Automatic Deployment**: Push to the `main` branch to trigger automatic deployment
2. **Manual Deployment**: Go to Actions tab and run the "Deploy to GitHub Pages" workflow
3. **Access**: Your site will be available at `https://yourusername.github.io/repository-name/`

### Project Structure for Deployment

```
/
├── frontend/           # Static site files (deployed to GitHub Pages)
│   ├── index.html
│   ├── *.html         # All HTML pages
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   └── .nojekyll      # Disable Jekyll processing
├── backend/           # API server (deploy separately)
├── mobile/            # React Native app
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Pages deployment workflow
└── server.js          # Main server file
```

## 📱 Mobile App

The mobile app is built with React Native/Expo and can be found in the `mobile/` directory.

```bash
cd mobile
npm install
expo start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 📋 Available Pages

- **/** - Main landing page with booking interface
- **/rider-dashboard.html** - Rider dashboard
- **/driver-dashboard.html** - Driver dashboard
- **/admin-dashboard.html** - Admin panel
- **/booking.html** - Trip booking page
- **/login.html** - User login
- **/register.html** - User registration
- **/trip-tracking.html** - Real-time trip tracking

## 🔐 Authentication

The application supports three user roles:
- **Rider**: Book and track trips
- **Driver**: Accept trips and earn money
- **Admin**: Manage users, drivers, and monitor system

## 📞 USSD Integration

Access the platform on any phone using USSD code: `*284*20#`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
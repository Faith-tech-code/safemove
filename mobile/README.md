# SafeMove Mobile App

React Native mobile application for SafeMove multi-modal transport platform.

## Getting Started

### Prerequisites
- Node.js 18+
- iOS: Xcode & CocoaPods
- Android: Android Studio & JDK

### Installation

```bash
cd mobile
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Landing screen
│   ├── (auth)/            # Auth screens (login, register)
│   ├── (rider)/           # Rider screens (booking, history)
│   └── (driver)/          # Driver screens (dashboard, trips)
├── components/            # Reusable components
│   └── KeyboardAvoidingAnimatedView.tsx
├── utils/                 # Utilities and hooks
│   ├── auth/
│   └── api/
└── constants/             # App configuration
```

## Key Features

### ✅ Implemented
- **KeyboardAvoidingAnimatedView**: Smooth keyboard handling with Reanimated
- **Project Structure**: Organized with Expo Router

### 🚧 To Implement
- Authentication flow (login/register)
- Trip booking with multi-modal transport
- Real-time location tracking
- Offline support with React Query
- Push notifications
- Family member management
- SOS emergency alerts

## API Integration

The mobile app connects to the SafeMove backend API:
- **Base URL**: `http://localhost:8000/v1` (development)
- **Production**: `https://api.safemove.com/v1`

### Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /trips` - Fetch user trips
- `POST /trips` - Create new trip booking

## Technologies

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based)
- **State Management**: React Query
- **Animations**: Reanimated 3
- **Storage**: Async Storage
- **API Client**: Fetch API

## Development

### Adding New Screens

1. Create file in `app/` directory
2. Expo Router automatically creates route
3. Use TypeScript for type safety

Example:
```typescript
// app/(rider)/profile.tsx
export default function ProfileScreen() {
  return <View><Text>Profile</Text></View>;
}
```

### Using KeyboardAvoidingAnimatedView

```typescript
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

<KeyboardAvoidingAnimatedView
  behavior="padding"
  keyboardVerticalOffset={20}
>
  <TextInput placeholder="Enter text" />
</KeyboardAvoidingAnimatedView>
```

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Environment Variables

Create `.env` file:
```env
API_BASE_URL=https://api.safemove.com/v1
GOOGLE_MAPS_API_KEY=your_key_here
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Troubleshooting

### Metro bundler cache issues
```bash
npx expo start --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

## Contributing

1. Create feature branch
2. Make changes
3. Test on iOS and Android
4. Submit pull request

## License

Proprietary - SafeMove Platform

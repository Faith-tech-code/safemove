# SafeMove Mobile App Plan

## Overview
This document outlines the mobile app architecture for SafeMove, complementing the existing web application.

## Technology Stack

### Mobile Framework: React Native with Expo
- **Expo Router**: File-based routing system
- **React Query (@tanstack/react-query)**: Data fetching and caching
- **Gesture Handler**: Touch interactions
- **Async Storage**: Local data persistence

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx                 # Root layout with providers
│   ├── index.tsx                   # Landing/splash screen
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (rider)/
│   │   ├── booking.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   └── (driver)/
│       ├── dashboard.tsx
│       └── trips.tsx
├── components/
│   ├── KeyboardAvoidingAnimatedView.tsx  # ✅ Smooth keyboard animations
│   ├── TransportModeSelector.tsx
│   ├── FareDisplay.tsx
│   └── SOSButton.tsx
├── utils/
│   ├── auth/
│   │   └── useAuth.ts
│   ├── api/
│   │   └── client.ts
│   └── hooks/
│       └── useTrips.ts
└── constants/
    └── config.ts
```

## Key Features to Implement

### 1. Authentication
```typescript
// utils/auth/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const initiate = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedUser = await AsyncStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsReady(true);
  };

  const login = async (phone, password) => {
    const response = await fetch('http://localhost:8000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    
    const data = await response.json();
    
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    
    setToken(data.access_token);
    setUser(data.user);
  };

  return { initiate, isReady, user, token, login };
};
```

### 2. API Integration
```typescript
// utils/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/v1';

export const apiClient = {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response.json();
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

### 3. React Query Hooks
```typescript
// utils/hooks/useTrips.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: () => apiClient.get('/trips'),
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tripData) => apiClient.post('/trips', tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
};
```

## Configuration

### QueryClient Setup
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      cacheTime: 1000 * 60 * 30,   // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Benefits Over Web App

1. **Offline Support**: Cached data with React Query
2. **Native Features**: GPS, push notifications, camera
3. **Better Performance**: Native rendering
4. **App Store Presence**: Distribution through Google Play/App Store

## Integration with Existing Backend

The mobile app will use the same API endpoints:
- `POST /v1/auth/login`
- `POST /v1/auth/register`
- `POST /v1/trips`
- `GET /v1/trips`

## Next Steps

1. Initialize Expo project: `npx create-expo-app safemove-mobile`
2. Install dependencies:
   ```bash
   npm install @tanstack/react-query expo-router
   npm install react-native-gesture-handler
   npm install @react-native-async-storage/async-storage
   ```
3. Implement authentication flow
4. Create booking screens
5. Add offline support
6. Implement push notifications

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build for production
eas build --platform all
```

## Environment Variables

Create `.env` file:
```
API_BASE_URL=https://api.safemove.com/v1
GOOGLE_MAPS_API_KEY=your_key_here
```

## Testing Strategy

- Unit tests: Jest + React Testing Library
- Integration tests: Detox
- E2E tests: Maestro

## Deployment

1. **Android**: Google Play Store
2. **iOS**: Apple App Store
3. **OTA Updates**: Expo Updates for quick fixes

## Progressive Enhancement

Mobile app features to add:
- Real-time location tracking
- Push notifications for trip updates
- Offline ticket storage
- Biometric authentication
- NFC for contactless payment

# Product Classification System - Mobile App Setup Guide

## Overview

This is a React Native mobile application (built with Expo) designed to control and monitor a product classification system based on Raspberry Pi and AI. The app communicates with a Raspberry Pi backend server via WebSocket for real-time data and REST API for control commands.

## Features

- **Real-time Monitoring**: Live product classification with 5 captured images per product
- **System Control**: Start/Stop the classification system
- **Device Status**: Monitor Raspberry Pi, ESP32, servo motors, conveyor belt, and LED lights
- **Statistics Dashboard**: View product distribution, success rates, and performance metrics
- **WebSocket Integration**: Real-time updates via WebSocket connection
- **Firebase Support**: Optional data persistence in Firebase (Firestore & Realtime Database)
- **Responsive UI**: Optimized for mobile and tablet devices

## System Requirements

### Mobile Device
- iOS 13+ or Android 6+
- Expo Go app (for development) or Standalone APK/IPA (for production)

### Raspberry Pi Server
- Raspberry Pi 4 with Python 3.8+
- Backend WebSocket server running on port 8000
- REST API server on port 8000

### Network
- Mobile device and Raspberry Pi must be on the same network
- Static IP or mDNS name for Raspberry Pi recommended

## Installation & Setup

### 1. Clone the Project

```bash
cd /path/to/project
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set the correct Raspberry Pi server URL:

```env
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:8000
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

Replace `192.168.1.100` with your Raspberry Pi's actual IP address.

### 3. Optional: Configure Firebase

If you want to enable Firebase data persistence:

1. Create a Firebase project at https://firebase.google.com
2. Create a Realtime Database and Firestore collection
3. Get your Firebase config from Project Settings
4. Update `.env` with your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_ENABLE_FIREBASE=true
```

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Production Build

```bash
# Build APK for Android
eas build --platform android

# Build IPA for iOS
eas build --platform ios
```

## Project Structure

```
src/
├── app/                          # Screen components & navigation
│   ├── _layout.tsx              # Main navigation layout
│   ├── dashboard.tsx            # System control & overview
│   ├── monitoring.tsx           # Real-time product monitoring
│   ├── statistics.tsx           # Analytics & charts
│   ├── devices.tsx              # Device status view
│   └── settings.tsx             # App configuration
│
├── components/                   # Reusable UI components
│   ├── animated-icon.tsx        # Splash screen animation
│   ├── animated-icon.web.tsx    # Web splash animation
│   ├── app-tabs.tsx             # Navigation tabs (legacy)
│   └── ui/                      # Custom UI components
│
├── services/                     # External service integrations
│   ├── websocket.ts             # WebSocket client for real-time data
│   ├── api.ts                   # REST API client
│   ├── firebase.ts              # Firebase Firestore/Realtime DB
│   └── index.ts                 # Service exports
│
├── store/                        # Zustand state management
│   ├── system-store.ts          # System & device state
│   ├── product-store.ts         # Product classification history
│   ├── device-store.ts          # Device status tracking
│   └── index.ts                 # Store exports
│
├── hooks/                        # Custom React hooks
│   ├── useWebSocket.ts          # WebSocket connection management
│   ├── useSystemControl.ts      # System command hooks
│   ├── useProductStream.ts      # Product data streaming
│   ├── useFirebaseSync.ts       # Firebase synchronization
│   └── index.ts                 # Hook exports
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type exports
│
└── constants/                    # Configuration constants
    ├── config.ts                # Server URLs, constants, colors
    └── theme.ts                 # UI theme configuration
```

## Architecture

### Communication Flow

```
Mobile App
    ↓ (REST API)
Raspberry Pi Backend
    ↑ (WebSocket)
Mobile App

Raspberry Pi Backend
    ↓ (WiFi/Serial)
ESP32-S3 (Camera)
    ↓ (WiFi)
Raspberry Pi Backend

Raspberry Pi Backend
    → Firebase Cloud
Mobile App ← Firebase Cloud
```

### State Management (Zustand)

- **System Store**: Application state, device status, statistics
- **Product Store**: Product classification history, filtering
- **Device Store**: Individual device information and health

### Real-time Updates (WebSocket)

Messages from Raspberry Pi to App:

1. **PRODUCT_CLASSIFIED**: New product classification result with 5 images
2. **SYSTEM_STATUS**: Current system and device status
3. **STATS_UPDATE**: Updated product statistics
4. **SYSTEM_ERROR**: Error notifications
5. **DEVICE_STATUS**: Individual device status changes

## API Endpoints

### System Control

```
POST   /system/start              # Start classification
POST   /system/stop               # Stop classification
POST   /system/reset              # Reset system state
GET    /system/status             # Get current status
GET    /health                    # Health check
```

### Device Management

```
GET    /devices/status            # Get all devices status
POST   /devices/{id}/control      # Control specific device
```

### Data Retrieval

```
GET    /products/history          # Get product history
GET    /products/{id}             # Get specific product details
GET    /stats/current             # Get current session stats
GET    /stats/session/{id}        # Get session statistics
```

### Session Management

```
POST   /session/start             # Create new session
POST   /session/end               # End current session
```

## WebSocket Message Format

### Incoming (Server → Client)

```json
{
  "type": "PRODUCT_CLASSIFIED",
  "productId": "PROD-001",
  "timestamp": 1701984000000,
  "classification": "GOOD",
  "confidence": 0.95,
  "processingTime": 150,
  "images": ["base64_image_1", "base64_image_2", ...]
}
```

## Screens Overview

### Dashboard
- System start/stop controls
- Real-time statistics (total, good, bad products)
- Success rate visualization
- Current session ID
- Connection status indicator

### Monitoring
- Current product classification result
- Classification badge with confidence score
- 5 captured images in a grid
- Recent product history
- Image viewer for detailed inspection

### Statistics
- Product distribution bar chart
- Success rate percentage
- Average processing time
- Session duration
- Recent products timeline

### Devices
- Raspberry Pi status (CPU, Memory, Temperature)
- ESP32 status (Signal strength, IP address)
- Servo motors status (Feeder, Good, Bad)
- Conveyor belt status (Running, Speed)
- LED lights status (On/Off, Brightness)

### Settings
- Server URL configuration (WebSocket & REST API)
- Connection testing
- App preferences (auto-start, sync interval)
- Firebase configuration status
- App version and build info

## Development

### Adding a New Hook

1. Create file in `src/hooks/useNewFeature.ts`
2. Implement the hook using Zustand stores and services
3. Export in `src/hooks/index.ts`
4. Use in components

### Adding a New Service

1. Create file in `src/services/newservice.ts`
2. Implement the service class
3. Create singleton pattern with getter
4. Export in `src/services/index.ts`
5. Use with hooks or directly in components

### Adding a New Screen

1. Create file in `src/app/newscreen.tsx`
2. Add screen to tabs in `_layout.tsx`
3. Use hooks and store selectors for state
4. Follow styling conventions

## Troubleshooting

### Connection Issues

1. **WebSocket connection fails**
   - Check Raspberry Pi is on and running backend server
   - Verify WebSocket URL in settings (ws://, not http://)
   - Ensure both devices are on same network
   - Check firewall settings on Raspberry Pi

2. **REST API calls fail**
   - Verify API URL uses http:// (not ws://)
   - Check Raspberry Pi server is running
   - Test with: `curl http://192.168.1.100:8000/health`

3. **Images not loading**
   - Ensure base64 encoding is correct
   - Check app has permission to display images
   - Verify image format is JPEG

### Performance Issues

1. **App freezes when receiving products**
   - Reduce history limit in settings
   - Implement virtualization for long lists
   - Check device RAM availability

2. **High battery consumption**
   - Disable auto-sync when not needed
   - Reduce WebSocket ping interval
   - Close app when monitoring not needed

## Firebase Integration (Optional)

If Firebase is enabled, the app will:

1. **Save Sessions**: Store session metadata in Firestore
2. **Log Products**: Save classification results for analysis
3. **Sync Status**: Store device and system status in Realtime Database
4. **Track Logs**: Keep system event logs for debugging

Firebase collections:

```
firestore/
  ├── sessions/
  │   └── SESSION-001/
  │       ├── startTime
  │       ├── endTime
  │       ├── status
  │       ├── stats
  │       └── logs[]
  ├── products/
  │   └── PROD-001/
  │       ├── sessionId
  │       ├── timestamp
  │       ├── classification
  │       ├── confidence
  │       └── processingTime
  └── system-logs/
      └── LOG-001/
          ├── timestamp
          ├── level
          ├── message
          └── device
```

## Security Considerations

1. **Use HTTPS/WSS in production**
   - Configure nginx reverse proxy
   - Use SSL/TLS certificates

2. **Authentication**
   - Add JWT token validation
   - Store tokens securely in device

3. **Data Protection**
   - Encrypt sensitive data in Firebase rules
   - Implement rate limiting on API

4. **Network Security**
   - Use VPN if accessing remotely
   - Restrict API access by IP
   - Monitor WebSocket connections

## Performance Optimization

1. **Image Handling**
   - Compress base64 images on server
   - Implement image caching
   - Load images on demand

2. **State Management**
   - Use Zustand selectors for optimization
   - Memoize components to prevent re-renders
   - Implement virtual scrolling for lists

3. **Network**
   - Batch API requests when possible
   - Compress WebSocket payloads
   - Implement request debouncing

## Support & Documentation

For more information:

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Firebase Docs](https://firebase.google.com/docs)

## License

Proprietary - All rights reserved

## Authors

- DATN Project Team
- Created: 2024

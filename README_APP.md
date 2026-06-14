# 🤖 Product Classification System - Mobile Control App

A React Native mobile application for controlling and monitoring an AI-powered product classification system. Built with Expo, TypeScript, Zustand, and real-time WebSocket communication.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Platform](https://img.shields.io/badge/Platform-React%20Native-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

## 🎯 Key Features

### Control & Monitoring
- ✅ **System Control**: Start/Stop classification system with real-time feedback
- ✅ **Live Dashboard**: Overview of system status and statistics
- ✅ **Real-time Monitoring**: WebSocket-based live product classification feed
- ✅ **Device Status**: Monitor Raspberry Pi, ESP32, servos, conveyor belt, and LED lights

### Data & Analytics
- 📊 **Statistics Dashboard**: Product distribution charts and success rates
- 📸 **Product Gallery**: View 5 captured images per classified product
- 📋 **Product History**: Complete classification history with details
- 📈 **Performance Metrics**: Average processing time and session duration

### Technical Features
- 🔌 **WebSocket Real-time**: Instant updates from Raspberry Pi backend
- 🔄 **REST API Integration**: System control and status queries
- 📱 **Cross-platform**: iOS, Android, and Web support
- 🔐 **Optional Firebase**: Data persistence and synchronization
- 🎨 **Responsive UI**: Optimized for mobile and tablet devices

## 📋 System Architecture

```
┌─────────────────────────────────────────┐
│      Mobile App (React Native)          │
│  (Dashboard, Monitoring, Statistics)    │
└─────────────────────────────────────────┘
         ↓ REST API          ↑ WebSocket
┌─────────────────────────────────────────┐
│    Raspberry Pi 4 (Backend Server)      │
│  (WebSocket + REST API on port 8000)    │
│                                         │
│  ├─ AI Model (Product Classification)  │
│  ├─ Device Control (Servo, Conveyor)   │
│  └─ Firebase Sync                      │
└─────────────────────────────────────────┘
         ↓ Serial/WiFi
┌─────────────────────────────────────────┐
│    Hardware Components                  │
│  ├─ ESP32-S3 (Camera)                   │
│  ├─ Servo Motors (3x)                   │
│  ├─ Conveyor Belt                       │
│  └─ LED Lights System                   │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Raspberry Pi backend running on your network

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd DoAn

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your Raspberry Pi IP
# EXPO_PUBLIC_WS_URL=ws://YOUR_PI_IP:8000
# EXPO_PUBLIC_API_URL=http://YOUR_PI_IP:8000
```

### Running the App

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on Web
npm run web
```

## 📦 Project Structure

```
src/
├── app/                    # Screen components
│   ├── _layout.tsx        # Navigation setup
│   ├── dashboard.tsx      # Main dashboard
│   ├── monitoring.tsx     # Real-time monitoring
│   ├── statistics.tsx     # Analytics
│   ├── devices.tsx        # Device status
│   └── settings.tsx       # Configuration
│
├── components/            # Reusable components
│   ├── animated-icon.tsx
│   └── ui/
│
├── services/             # Business logic
│   ├── websocket.ts      # WebSocket client
│   ├── api.ts            # REST API client
│   ├── firebase.ts       # Firebase integration
│   └── storage.ts        # Local storage
│
├── store/                # State management (Zustand)
│   ├── system-store.ts   # System & device state
│   ├── product-store.ts  # Product history
│   └── device-store.ts   # Device tracking
│
├── hooks/                # Custom React hooks
│   ├── useWebSocket.ts
│   ├── useSystemControl.ts
│   ├── useProductStream.ts
│   └── useFirebaseSync.ts
│
├── types/                # TypeScript types
│   └── index.ts
│
└── constants/            # Configuration
    └── config.ts
```

## 🎨 App Screens

### Dashboard
Control center with system start/stop buttons and key metrics:
- System status indicator
- Total products processed
- Good vs Bad product count
- Success rate percentage
- Current session ID

### Monitoring
Real-time product classification viewer:
- Current product classification (GOOD/BAD)
- Confidence score with percentage
- 5 captured product images
- Recent product history with timeline
- Product details (ID, timestamp, processing time)

### Statistics
Analytics and performance metrics:
- Product distribution bar chart
- Success rate visualization
- Average processing time
- Session duration
- Recent products timeline

### Devices
Hardware status monitoring:
- Raspberry Pi: CPU, Memory, Temperature, Uptime
- ESP32: Signal strength, IP address, Connection status
- Servo Motors: Feeder, Good Sorter, Bad Sorter status
- Conveyor Belt: Running status, Speed percentage
- LED Lights: On/Off status, Brightness level

### Settings
Application configuration:
- Server URL configuration (WebSocket & REST API)
- Connection testing
- App preferences (auto-start, sync interval)
- Firebase setup status
- App version and build info

## 🔌 API Integration

### WebSocket Messages (Real-time)

Incoming messages from Raspberry Pi:

```typescript
// Product Classification Result
{
  type: 'PRODUCT_CLASSIFIED',
  productId: 'PROD-001',
  classification: 'GOOD' | 'BAD',
  confidence: 0.95,
  images: [base64_image_1, ...], // 5 images
  processingTime: 150 // ms
}

// System Status Update
{
  type: 'SYSTEM_STATUS',
  systemState: 'RUNNING' | 'STOPPED',
  devices: { raspberryPi, esp32, servos, ... }
}

// Statistics Update
{
  type: 'STATS_UPDATE',
  totalProducts: 150,
  goodProducts: 145,
  badProducts: 5,
  successRate: 96.67
}
```

### REST API Endpoints

```
System Control:
  POST   /system/start              # Start classification
  POST   /system/stop               # Stop classification
  POST   /system/reset              # Reset state
  GET    /system/status             # Get status

Data Retrieval:
  GET    /products/history          # Get product history
  GET    /products/{id}             # Get product details
  GET    /stats/current             # Get current stats
  GET    /stats/session/{id}        # Get session stats

Device Control:
  GET    /devices/status            # Get all devices
  POST   /devices/{id}/control      # Control device
  GET    /health                    # Health check
```

## 📊 State Management (Zustand)

### System Store
```typescript
{
  status: 'IDLE' | 'RUNNING' | 'STOPPED' | 'ERROR'
  sessionId: string
  currentStats: SystemStats
  devices: { raspberryPi, esp32, servos, ... }
  isConnected: boolean
}
```

### Product Store
```typescript
{
  products: ProductResult[]
  currentProduct: ProductResult | null
  historyFilter: { dateRange, classification }
}
```

### Device Store
```typescript
{
  devices: Map<string, DeviceInfo>
  health: number (0-100%)
}
```

## 🔧 Configuration

Create `.env` file with your settings:

```env
# Raspberry Pi Server
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:8000
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

# Firebase (Optional)
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
# ... other Firebase config
EXPO_PUBLIC_ENABLE_FIREBASE=false
```

## 🔐 Security Considerations

- Use **wss://** (secure WebSocket) in production
- Use **https://** (secure HTTP) for REST API
- Implement JWT token authentication
- Add API rate limiting
- Use VPN for remote access
- Enable Firebase security rules

## 🚀 Building for Production

### Android APK
```bash
eas build --platform android
```

### iOS App
```bash
eas build --platform ios
```

### Web Version
```bash
npm run web
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[app.json](./app.json)** - Expo configuration
- **[tsconfig.json](./tsconfig.json)** - TypeScript configuration

## 🐛 Troubleshooting

### WebSocket Connection Issues
1. Check Raspberry Pi IP address in settings
2. Verify WebSocket URL uses `ws://` (not `http://`)
3. Ensure both devices are on same network
4. Check Raspberry Pi firewall settings

### API Connection Fails
1. Verify API URL uses `http://` (not `ws://`)
2. Test with: `curl http://192.168.1.100:8000/health`
3. Check Raspberry Pi backend is running

### Images Not Loading
1. Verify base64 image encoding
2. Check app image permission
3. Ensure JPEG format

## 📈 Performance Tips

- Limit product history to 100 items (configurable)
- Use image compression on server
- Implement virtual scrolling for long lists
- Cache frequently accessed data
- Debounce WebSocket messages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 Changelog

### v1.0.0 (2024-12-08)
- Initial release
- Core features: Dashboard, Monitoring, Statistics, Devices, Settings
- WebSocket real-time updates
- REST API integration
- Zustand state management
- Optional Firebase integration

## 📄 License

This project is proprietary. All rights reserved.

## 👨‍💼 Authors

- DATN Project Team
- Created: December 2024

## 🙏 Acknowledgments

- Expo team for amazing React Native framework
- Firebase for cloud services
- Contributors and testers

## 📞 Support

For issues and questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [Expo Documentation](https://docs.expo.dev)
3. Check Firebase documentation for Firebase-related issues
4. Contact project team

---

**Happy Coding! 🚀**

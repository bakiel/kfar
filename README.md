# KFAR Marketplace

A modern e-commerce platform for the Village of Peace community in Dimona, Israel.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at http://localhost:3000

## 📚 Documentation

- **[STORE_BUILDING_GUIDE.md](./STORE_BUILDING_GUIDE.md)** - Complete guide for adding vendors and products
- **[CLAUDE.md](./CLAUDE.md)** - Development guide and coding standards
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[MOBILE_RESPONSIVENESS_AUDIT.md](./MOBILE_RESPONSIVENESS_AUDIT.md)** - Mobile optimization details

## 🏗️ Architecture

- **Data Source**: Local JSON catalog (`/lib/data/complete-catalog.ts`)
- **API**: RESTful endpoints with filtering and sorting
- **State Management**: React Context API for cart
- **Styling**: Tailwind CSS with custom brand colors
- **Images**: Next.js Image optimization

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t kfar-marketplace .
docker run -p 3000:3000 kfar-marketplace
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.8
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Docker ready
- **Images**: Optimized with Next.js Image

## 📁 Project Structure

```
kfar-marketplace-app/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── business/       # Business-related components
│   ├── layout/         # Layout components
│   └── ui/            # UI components
├── public/             # Static assets
│   └── images/        # Image assets
├── lib/               # Utility functions
└── styles/            # Global styles
```

## 🎨 Brand Guidelines

- **Primary Colors**:
  - Leaf Green: `#478c0b`
  - Sun Gold: `#f6af0d`
  - Earth Flame: `#c23c09`
  - Soil Brown: `#3a3a1d`

## 📱 Mobile Optimization

- Minimum touch targets: 44px × 44px
- Responsive grid layouts
- Mobile-optimized navigation
- Progressive image loading

## 🔐 Security

- No sensitive data in repository
- Environment variables for configuration
- Secure image optimization

## 💾 Backup

To create a local backup:
```bash
./backup.sh
```

This will:
- Create a timestamped backup in `/backups`
- Push changes to GitHub
- Keep only the last 5 backups

## 🔧 Key Features

- **Multi-vendor marketplace** with 5 active vendors
- **100+ vegan products** from the Village of Peace
- **Responsive design** optimized for mobile and desktop
- **Multi-currency support** (ILS, USD, EUR, GBP)
- **Admin dashboard** for vendor management
- **Shopping cart** with bulk pricing
- **Secure checkout** with multiple payment options

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for the Village of Peace community.

## 🌍 Community

- **Location**: Dimona, Israel
- **Founded**: 1969
- **Mission**: Sustainable vegan living and community excellence

---

Made with ☀️ in Dimona, Israel

# KFAR Marketplace

Digital marketplace for the Village of Peace (Kfar Hashalom) community in Dimona, Israel. A platform connecting authentic vegan businesses with customers seeking quality services and products.

## 🌟 Features

- **Community Services Hub** - Directory of 6 active businesses with 18 more coming soon
- **Mobile-First Design** - Fully responsive with optimized mobile experience
- **Village Enterprises Showcase** - Featuring the founding six businesses
- **Product Marketplace** - Browse and discover authentic vegan products
- **Cultural Heritage** - Celebrating 55+ years of community history
- **Multi-language Support** - Hebrew and English interfaces

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/bakiel/kfar.git
cd kfar

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

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

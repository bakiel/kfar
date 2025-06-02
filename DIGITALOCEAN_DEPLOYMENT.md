# KFAR Marketplace - DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean account
- Domain name (kfar.market)
- SSL certificate (Let's Encrypt)

## 1. Database Setup (Managed Database)

1. Create a new MySQL/PostgreSQL database cluster
2. Note the connection details
3. Run the migration script:
   ```bash
   mysql -h your-db-host -u your-user -p your-database < database/digitalocean-migration.sql
   ```

## 2. App Platform Setup

1. Create new App in DigitalOcean App Platform
2. Connect GitHub repository
3. Configure environment variables:
   - DATABASE_URL
   - GEMINI_API_KEY
   - DO_SPACES_KEY
   - DO_SPACES_SECRET
   - NEXT_PUBLIC_APP_URL

## 3. Spaces Setup (Image Storage)

1. Create a new Space for images
2. Configure CORS for your domain
3. Upload product images to Space
4. Update image paths in database

## 4. Build Configuration

```yaml
name: kfar-marketplace
services:
- build_command: npm run build
  environment_slug: node-js
  github:
    branch: main
    deploy_on_push: true
    repo: your-repo/kfar-marketplace
  http_port: 3000
  instance_count: 2
  instance_size_slug: basic-xs
  name: kfar-marketplace
  run_command: npm start
  source_dir: /kfar-marketplace-app
```

## 5. Domain Configuration

1. Add custom domain in App Platform
2. Configure DNS records:
   - A record pointing to App Platform
   - CNAME for www subdomain

## 6. SSL Configuration

Let's Encrypt SSL is automatically configured by App Platform

## 7. Monitoring

1. Enable monitoring in App Platform
2. Set up alerts for:
   - High CPU usage
   - Memory usage
   - Error rates
   - Response times

## 8. Backup Strategy

1. Enable automated database backups
2. Schedule daily backups of Spaces
3. Keep 7-day retention minimum

## Post-Deployment

1. Run product image verification
2. Test checkout flow
3. Verify QR codes work
4. Check mobile responsiveness
5. Monitor performance metrics

#!/bin/bash

# KFAR Marketplace Backup Script
# Creates timestamped backups of the project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current date and time
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup directory
BACKUP_DIR="/Users/mac/Downloads/kfar-final/backups"
BACKUP_NAME="kfar-marketplace-backup-${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo -e "${YELLOW}Starting KFAR Marketplace Backup...${NC}"

# Create backup excluding node_modules and .next
tar -czf "${BACKUP_PATH}.tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='out' \
  --exclude='.git' \
  -C /Users/mac/Downloads/kfar-final \
  kfar-marketplace-app

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo "Location: ${BACKUP_PATH}.tar.gz"
    
    # Show backup size
    BACKUP_SIZE=$(ls -lh "${BACKUP_PATH}.tar.gz" | awk '{print $5}')
    echo "Size: ${BACKUP_SIZE}"
    
    # Keep only last 5 backups
    cd "${BACKUP_DIR}"
    ls -t kfar-marketplace-backup-*.tar.gz | tail -n +6 | xargs -I {} rm {}
    echo -e "${GREEN}✓ Old backups cleaned up (keeping last 5)${NC}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi

# Also push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app
git add -A
git commit -m "Auto-backup: ${TIMESTAMP}" || echo "No changes to commit"
git push origin main

echo -e "${GREEN}✓ Backup complete!${NC}"
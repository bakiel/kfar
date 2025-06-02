/**
 * WebSocket Server for Real-time Updates
 * Handles real-time communication between vendors, customers, and admin
 */

const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

// Store active connections
const activeConnections = new Map(); // socketId -> { vendorId, userId, type }
const vendorRooms = new Map(); // vendorId -> Set of socketIds

// Middleware for socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // TODO: Verify JWT token here
  // For now, just pass through
  next();
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);
  
  // Store connection info
  activeConnections.set(socket.id, {
    socketId: socket.id,
    connectedAt: new Date()
  });

  // Handle joining vendor room
  socket.on('join_vendor_room', (vendorId) => {
    socket.join(`vendor:${vendorId}`);
    
    // Track vendor room membership
    if (!vendorRooms.has(vendorId)) {
      vendorRooms.set(vendorId, new Set());
    }
    vendorRooms.get(vendorId).add(socket.id);
    
    // Update connection info
    const connectionInfo = activeConnections.get(socket.id);
    if (connectionInfo) {
      connectionInfo.vendorId = vendorId;
      connectionInfo.type = 'vendor';
    }
    
    console.log(`Socket ${socket.id} joined vendor room: ${vendorId}`);
  });

  // Handle leaving vendor room
  socket.on('leave_vendor_room', (vendorId) => {
    socket.leave(`vendor:${vendorId}`);
    
    // Remove from vendor room tracking
    const room = vendorRooms.get(vendorId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) {
        vendorRooms.delete(vendorId);
      }
    }
    
    console.log(`Socket ${socket.id} left vendor room: ${vendorId}`);
  });

  // Product events
  socket.on('product:updated', (data) => {
    // Broadcast to all clients in vendor room
    io.to(`vendor:${data.vendorId}`).emit('product:updated', data);
    
    // Also broadcast to marketplace room for live updates
    io.to('marketplace').emit('product:updated', data);
    
    logEvent('product:updated', data);
  });

  socket.on('product:created', (data) => {
    io.to(`vendor:${data.vendorId}`).emit('product:created', data);
    io.to('marketplace').emit('product:created', data);
    logEvent('product:created', data);
  });

  socket.on('product:deleted', (data) => {
    io.to(`vendor:${data.vendorId}`).emit('product:deleted', data);
    io.to('marketplace').emit('product:deleted', data);
    logEvent('product:deleted', data);
  });

  socket.on('product:stock_changed', (data) => {
    io.to(`vendor:${data.vendorId}`).emit('product:stock_changed', data);
    io.to('marketplace').emit('product:stock_changed', data);
    logEvent('product:stock_changed', data);
  });

  // Vendor events
  socket.on('vendor:updated', (data) => {
    io.to(`vendor:${data.vendorId}`).emit('vendor:updated', data);
    io.to('marketplace').emit('vendor:updated', data);
    logEvent('vendor:updated', data);
  });

  // Order events
  socket.on('order:created', (data) => {
    // Notify vendor
    io.to(`vendor:${data.order.vendorId}`).emit('order:created', data);
    
    // Notify customer if connected
    if (data.order.customerId) {
      io.to(`customer:${data.order.customerId}`).emit('order:created', data);
    }
    
    // Notify admin
    io.to('admin').emit('order:created', data);
    
    logEvent('order:created', data);
  });

  socket.on('order:updated', (data) => {
    io.to(`vendor:${data.order.vendorId}`).emit('order:updated', data);
    if (data.order.customerId) {
      io.to(`customer:${data.order.customerId}`).emit('order:updated', data);
    }
    logEvent('order:updated', data);
  });

  // Analytics events
  socket.on('product:viewed', (data) => {
    // Only emit to vendor for analytics
    io.to(`vendor:${data.vendorId}`).emit('product:viewed', data);
    
    // Update analytics in background
    updateProductAnalytics(data.productId, 'view');
  });

  // Message/Chat events
  socket.on('message:send', (data) => {
    // Direct message between customer and vendor
    io.to(`vendor:${data.vendorId}`).emit('message:received', data);
    if (data.customerId) {
      io.to(`customer:${data.customerId}`).emit('message:received', data);
    }
    logEvent('message:sent', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    
    // Clean up connection tracking
    const connectionInfo = activeConnections.get(socket.id);
    if (connectionInfo && connectionInfo.vendorId) {
      const room = vendorRooms.get(connectionInfo.vendorId);
      if (room) {
        room.delete(socket.id);
        if (room.size === 0) {
          vendorRooms.delete(connectionInfo.vendorId);
        }
      }
    }
    
    activeConnections.delete(socket.id);
  });
});

// REST endpoints for server-side event emission
app.post('/api/emit', (req, res) => {
  const { event, data, room } = req.body;
  
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
  
  res.json({ success: true });
});

// Get active connections info
app.get('/api/connections', (req, res) => {
  const connections = Array.from(activeConnections.values());
  const rooms = {};
  
  vendorRooms.forEach((sockets, vendorId) => {
    rooms[vendorId] = sockets.size;
  });
  
  res.json({
    totalConnections: connections.length,
    vendorRooms: rooms,
    connections: connections
  });
});

// Analytics tracking (placeholder)
async function updateProductAnalytics(productId, action) {
  // TODO: Update database with analytics
  console.log(`Analytics: Product ${productId} - ${action}`);
}

// Event logging
function logEvent(event, data) {
  console.log(`[${new Date().toISOString()}] Event: ${event}`, {
    vendorId: data.vendorId,
    productId: data.productId,
    timestamp: data.timestamp
  });
}

// Start server
const PORT = process.env.WS_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Accepting connections from: ${process.env.CLIENT_URL || 'http://localhost:3001'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  io.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
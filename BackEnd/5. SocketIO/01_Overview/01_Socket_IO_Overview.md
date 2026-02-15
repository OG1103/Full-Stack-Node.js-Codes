# Socket.IO — Overview

Socket.IO enables **real-time, bidirectional** communication between a client (browser) and server. Unlike HTTP (request → response), Socket.IO keeps a persistent connection open, allowing both sides to send messages at any time.

---

## 1. Installation

```bash
# Server
npm install socket.io

# Client
npm install socket.io-client
```

---

## 2. HTTP vs WebSockets

| Feature | HTTP | WebSocket (Socket.IO) |
|---------|------|----------------------|
| Connection | New connection per request | Persistent connection |
| Direction | Client → Server only | Bidirectional (both ways) |
| Initiation | Client always initiates | Either side can send |
| Use case | REST APIs, page loads | Chat, notifications, live updates |
| Overhead | Headers sent every request | Minimal after connection |

### When to Use Socket.IO

- Chat applications
- Real-time notifications
- Live dashboards / analytics
- Collaborative editing
- Online gaming
- Live location tracking

---

## 3. Core Concepts

### `io` (Server Instance)

The main Socket.IO server. It manages all connections and can broadcast to all clients.

```javascript
import { Server } from 'socket.io';

const io = new Server(httpServer);
```

### `socket` (Individual Connection)

Each connected client gets a unique `socket` object. It represents one client-server connection.

```javascript
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // socket.id = unique identifier for this connection
});
```

### Events

Communication happens through **events**. Either side can emit (send) and listen for events.

```javascript
// Emit an event (send)
socket.emit('eventName', data);

// Listen for an event (receive)
socket.on('eventName', (data) => {
  console.log(data);
});
```

---

## 4. Server Setup

### Basic Server

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',  // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Handle connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for events from this client
  socket.on('message', (data) => {
    console.log('Received:', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

**Important:** Use `httpServer.listen()`, not `app.listen()`. Socket.IO needs the HTTP server instance.

---

## 5. Client Setup

### Browser / React

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Connection events
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Send a message
socket.emit('message', { text: 'Hello from client!' });

// Listen for messages
socket.on('message', (data) => {
  console.log('Received:', data);
});
```

---

## 6. Emit Methods (Server-Side)

| Method | Who Receives | Use Case |
|--------|-------------|----------|
| `socket.emit('event', data)` | Only the sender | Response to a specific client |
| `socket.broadcast.emit('event', data)` | Everyone except the sender | "User is typing" notifications |
| `io.emit('event', data)` | Everyone (including sender) | Global announcements |

### Examples

```javascript
io.on('connection', (socket) => {
  // Send only to this client
  socket.emit('welcome', { message: 'Welcome to the chat!' });

  // Send to everyone except this client
  socket.broadcast.emit('userJoined', { userId: socket.id });

  // Send to everyone (including this client)
  io.emit('announcement', { message: 'New user joined the chat' });

  socket.on('chatMessage', (data) => {
    // Send the message to everyone
    io.emit('chatMessage', {
      userId: socket.id,
      text: data.text,
      timestamp: new Date(),
    });
  });
});
```

---

## 7. Sending Data with Events

### Simple Data

```javascript
socket.emit('message', 'Hello');
socket.emit('score', 42);
socket.emit('status', true);
```

### Object Data

```javascript
socket.emit('message', {
  user: 'John',
  text: 'Hello everyone!',
  timestamp: Date.now(),
});
```

### With Acknowledgment (Callback)

```javascript
// Client sends and waits for server acknowledgment
socket.emit('saveMessage', { text: 'Hello' }, (response) => {
  console.log('Server response:', response);
  // { success: true, messageId: '123' }
});

// Server handles and acknowledges
socket.on('saveMessage', (data, callback) => {
  // Save to database...
  callback({ success: true, messageId: '123' });
});
```

---

## 8. Connection Events

### Server-Side

```javascript
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', socket.id, reason);
    // reason: 'transport close', 'client namespace disconnect', etc.
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});
```

### Client-Side

```javascript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.log('Connection error:', err.message);
});
```

---

## 9. Passing Data on Connection

### Client sends auth data

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt-token-here',
  },
});
```

### Server reads auth data

```javascript
io.on('connection', (socket) => {
  const token = socket.handshake.auth.token;
  // Verify the token...
  console.log('User token:', token);
});
```

### Socket.IO Middleware (Auth)

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;  // Attach user to socket
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated user:', socket.user.email);
});
```

---

## 10. Simple Chat Example

### Server

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', {
      id: socket.id,
      text: msg,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    io.emit('chatMessage', {
      id: 'system',
      text: 'A user has left the chat',
      time: new Date().toLocaleTimeString(),
    });
  });
});
```

### Client

```javascript
const socket = io('http://localhost:5000');

// Send message
const sendMessage = (text) => {
  socket.emit('chatMessage', text);
};

// Receive messages
socket.on('chatMessage', (msg) => {
  console.log(`[${msg.time}] ${msg.id}: ${msg.text}`);
});

// Typing indicator
socket.on('typing', (username) => {
  console.log(`${username} is typing...`);
});
```

---

## 11. Summary

| Concept | Description |
|---------|-------------|
| `io` | Server instance — manages all connections |
| `socket` | Single client connection — has unique `socket.id` |
| `emit()` | Send an event with data |
| `on()` | Listen for an event |
| `broadcast.emit()` | Send to everyone except sender |
| `io.emit()` | Send to everyone |

### Setup Checklist

1. Create HTTP server with `createServer(app)`
2. Attach Socket.IO with `new Server(httpServer, { cors })`
3. Listen for `'connection'` event on `io`
4. Handle events on each `socket`
5. Use `httpServer.listen()` (not `app.listen()`)

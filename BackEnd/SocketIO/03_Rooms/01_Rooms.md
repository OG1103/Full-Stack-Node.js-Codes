# Socket.IO — Rooms

Rooms are channels that sockets can join and leave. They allow you to send events to a subset of clients instead of broadcasting to everyone. A socket can be in multiple rooms simultaneously.

---

## 1. How Rooms Work

```
io (all connections)
├── Room: "general"     → [socket1, socket2, socket3]
├── Room: "project-123" → [socket1, socket4]
├── Room: "admin"       → [socket2]
└── (default)           → Every socket has a room named after its socket.id
```

- Rooms exist only on the server — the client doesn't know about them
- Rooms are created automatically when a socket joins them
- Rooms are destroyed automatically when the last socket leaves
- Every socket automatically has a private room equal to its `socket.id`

---

## 2. Joining and Leaving Rooms

### Join a Room

```javascript
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);

    // Notify the room
    socket.to(roomId).emit('userJoined', {
      userId: socket.id,
      roomId,
    });

    // Confirm to the user
    socket.emit('joinedRoom', { roomId });
  });
});
```

### Leave a Room

```javascript
socket.on('leaveRoom', (roomId) => {
  socket.leave(roomId);
  console.log(`${socket.id} left room: ${roomId}`);

  // Notify remaining room members
  socket.to(roomId).emit('userLeft', {
    userId: socket.id,
    roomId,
  });
});
```

### Automatic Leave on Disconnect

When a socket disconnects, it automatically leaves all rooms. You can notify rooms in the `disconnect` event:

```javascript
socket.on('disconnect', () => {
  // Socket has already left all rooms by this point
  // But you can still broadcast if you tracked which rooms they were in
  console.log(`${socket.id} disconnected`);
});

// Alternative: use 'disconnecting' event (still in rooms)
socket.on('disconnecting', () => {
  // socket.rooms still contains the rooms
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      socket.to(room).emit('userLeft', { userId: socket.id });
    }
  }
});
```

---

## 3. Sending Messages to Rooms

### From Server (io)

```javascript
// Send to everyone in the room (including sender)
io.to('general').emit('message', { text: 'Hello room!' });

// Send to multiple rooms
io.to('room1').to('room2').emit('announcement', 'Server update');
```

### From Socket (Excludes Sender)

```javascript
socket.on('roomMessage', ({ roomId, text }) => {
  // Send to room members except the sender
  socket.to(roomId).emit('roomMessage', {
    userId: socket.id,
    text,
    timestamp: new Date(),
  });

  // Also send to the sender (for confirmation)
  socket.emit('roomMessage', {
    userId: socket.id,
    text,
    timestamp: new Date(),
  });
});
```

---

## 4. Getting Room Information

### List Sockets in a Room

```javascript
// Get all socket IDs in a room
const sockets = await io.in('general').fetchSockets();
const userIds = sockets.map(s => s.id);
console.log('Users in general:', userIds);
```

### Get Rooms a Socket is In

```javascript
// socket.rooms is a Set of room names
console.log(socket.rooms);
// Set { 'socket-id-123', 'general', 'project-456' }
// Note: socket.id is always included as a room
```

### Count Users in a Room

```javascript
const room = io.sockets.adapter.rooms.get('general');
const userCount = room ? room.size : 0;
console.log(`Users in general: ${userCount}`);
```

---

## 5. Common Patterns

### Chat Room Application

```javascript
// Server
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.currentRoom = roomId;

    // Notify room
    io.to(roomId).emit('systemMessage', `${username} joined the room`);

    // Send room member count
    const room = io.sockets.adapter.rooms.get(roomId);
    io.to(roomId).emit('roomUsers', { count: room.size });
  });

  socket.on('chatMessage', ({ roomId, text }) => {
    io.to(roomId).emit('chatMessage', {
      username: socket.username,
      text,
      timestamp: new Date(),
    });
  });

  socket.on('leaveRoom', ({ roomId }) => {
    socket.leave(roomId);
    io.to(roomId).emit('systemMessage', `${socket.username} left the room`);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit('systemMessage', `${socket.username} disconnected`);
      }
    }
  });
});
```

### Private Messaging (Using Socket ID as Room)

```javascript
socket.on('privateMessage', ({ targetId, text }) => {
  // Send to the target user
  io.to(targetId).emit('privateMessage', {
    from: socket.id,
    fromUsername: socket.username,
    text,
  });

  // Confirm to sender
  socket.emit('privateMessageSent', {
    to: targetId,
    text,
  });
});
```

### Notification Rooms (By User ID)

```javascript
// On connection, join a room named after the user's ID
io.on('connection', (socket) => {
  const userId = socket.user.id;  // From auth middleware
  socket.join(`user:${userId}`);
});

// Send notification to a specific user (from anywhere in your app)
const sendNotification = (userId, notification) => {
  io.to(`user:${userId}`).emit('notification', notification);
};

// Example: notify when someone comments on their post
sendNotification(post.authorId, {
  type: 'comment',
  message: 'Someone commented on your post',
  postId: post._id,
});
```

---

## 6. Room Use Cases

| Use Case | Room Name | Example |
|----------|-----------|---------|
| Chat rooms | `room:${roomId}` | Group chat channels |
| Private messages | `user:${socketId}` | Direct messages |
| User notifications | `user:${userId}` | Personal alerts |
| Document editing | `doc:${docId}` | Live collaboration |
| Game lobbies | `game:${gameId}` | Multiplayer games |
| Admin dashboard | `role:admin` | Admin-only updates |
| Geolocation | `city:${cityName}` | Location-based updates |

---

## 7. Client-Side Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join a room
const joinRoom = (roomId) => {
  socket.emit('joinRoom', { roomId, username: 'John' });
};

// Send a message to a room
const sendMessage = (roomId, text) => {
  socket.emit('chatMessage', { roomId, text });
};

// Leave a room
const leaveRoom = (roomId) => {
  socket.emit('leaveRoom', { roomId });
};

// Listen for messages
socket.on('chatMessage', (msg) => {
  console.log(`${msg.username}: ${msg.text}`);
});

socket.on('systemMessage', (msg) => {
  console.log(`[System] ${msg}`);
});

// Usage
joinRoom('general');
sendMessage('general', 'Hello everyone!');
```

---

## 8. Summary

| Action | Server Code |
|--------|-------------|
| Join room | `socket.join('roomId')` |
| Leave room | `socket.leave('roomId')` |
| Send to room (all) | `io.to('roomId').emit()` |
| Send to room (others) | `socket.to('roomId').emit()` |
| Get rooms | `socket.rooms` |
| Count in room | `io.sockets.adapter.rooms.get('roomId')?.size` |

### Key Points

1. Rooms are **server-side only** — clients join via custom events
2. Rooms are created/destroyed **automatically** (join/leave)
3. Every socket is in a room named after its `socket.id`
4. Use `disconnecting` (not `disconnect`) to access rooms before they're cleared
5. `io.to()` includes sender; `socket.to()` excludes sender

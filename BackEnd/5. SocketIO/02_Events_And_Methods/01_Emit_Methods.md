# Socket.IO — Emit Methods

Socket.IO provides several ways to send events, each targeting a different audience. Understanding when to use each method is key to building real-time features.

---

## 1. All Emit Methods Overview

| Method | Sender Receives? | Who Gets It | Use Case |
|--------|-----------------|-------------|----------|
| `socket.emit()` | Only sender | The specific client | Direct response |
| `socket.broadcast.emit()` | No | Everyone except sender | "User typing" |
| `io.emit()` | Yes (everyone) | All connected clients | Global announcement |
| `io.to(room).emit()` | Depends | Everyone in the room | Room message |
| `socket.to(room).emit()` | No | Room members except sender | Room broadcast |

---

## 2. `socket.emit()` — Send to One Client

Send an event to **only the specific client** represented by this socket.

```javascript
io.on('connection', (socket) => {
  // Send welcome message only to this client
  socket.emit('welcome', { message: 'Hello! Your ID is ' + socket.id });

  // Response to a client's request
  socket.on('getProfile', async () => {
    const profile = await User.findById(socket.user.id);
    socket.emit('profile', profile);
  });
});
```

---

## 3. `socket.broadcast.emit()` — Everyone Except Sender

Send to **all connected clients except** the one who triggered the event.

```javascript
io.on('connection', (socket) => {
  // Notify others that someone joined
  socket.broadcast.emit('userJoined', {
    userId: socket.id,
    message: 'A new user has joined',
  });

  // Typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
    // Everyone sees "John is typing..." except John
  });

  // Notify others when someone leaves
  socket.on('disconnect', () => {
    socket.broadcast.emit('userLeft', { userId: socket.id });
  });
});
```

---

## 4. `io.emit()` — Send to Everyone

Send to **all connected clients**, including the sender.

```javascript
io.on('connection', (socket) => {
  // Chat message — everyone should see it (including the sender)
  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', {
      userId: socket.id,
      text: data.text,
      timestamp: new Date(),
    });
  });

  // Global announcement
  io.emit('announcement', 'Server is restarting in 5 minutes');
});
```

---

## 5. `io.to(room).emit()` — Everyone in a Room

Send to **all clients in a specific room** (including the sender if they're in the room).

```javascript
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);

    // Notify the room
    io.to(roomId).emit('roomMessage', {
      message: `${socket.id} joined the room`,
    });
  });

  socket.on('roomChat', ({ roomId, text }) => {
    // Send to everyone in the room (including sender)
    io.to(roomId).emit('roomChat', {
      userId: socket.id,
      text,
      roomId,
    });
  });
});
```

---

## 6. `socket.to(room).emit()` — Room Members Except Sender

Send to **all clients in a room except** the sender.

```javascript
io.on('connection', (socket) => {
  socket.on('typing', ({ roomId, username }) => {
    // Everyone in the room sees typing except the typer
    socket.to(roomId).emit('typing', username);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    // Notify room members (but not the joiner)
    socket.to(roomId).emit('userJoined', { userId: socket.id });
    // Send confirmation to the joiner only
    socket.emit('joinedRoom', { roomId });
  });
});
```

---

## 7. `io.in(room).emit()` — Same as `io.to(room).emit()`

`io.in()` and `io.to()` are **identical**:

```javascript
io.to('room1').emit('event', data);
io.in('room1').emit('event', data);
// Both do the same thing
```

---

## 8. Multiple Rooms

Send to multiple rooms at once:

```javascript
// Send to room1 AND room2
io.to('room1').to('room2').emit('event', data);

// Using socket (excludes sender)
socket.to('room1').to('room2').emit('event', data);
```

---

## 9. Send to a Specific Socket by ID

Every socket automatically joins a room named after its `socket.id`:

```javascript
// Send a private message to a specific user
io.to(targetSocketId).emit('privateMessage', {
  from: socket.id,
  text: 'Hey!',
});

// Example: direct message handler
socket.on('directMessage', ({ targetId, text }) => {
  io.to(targetId).emit('directMessage', {
    from: socket.id,
    text,
  });
});
```

---

## 10. Visual Summary

```
socket.emit('event', data)
  → [Sender only]

socket.broadcast.emit('event', data)
  → [Everyone] - [Sender] = [All others]

io.emit('event', data)
  → [Everyone including sender]

io.to('room').emit('event', data)
  → [Everyone in room including sender]

socket.to('room').emit('event', data)
  → [Everyone in room] - [Sender] = [Room others]
```

---

## 11. Decision Guide

```
Need to send to...
├── Only this client?          → socket.emit()
├── Everyone?                  → io.emit()
├── Everyone except sender?    → socket.broadcast.emit()
├── A specific room?
│   ├── Including sender?      → io.to(room).emit()
│   └── Excluding sender?      → socket.to(room).emit()
└── A specific user?           → io.to(socketId).emit()
```

---

## 12. Summary

| Method | Target | Includes Sender? |
|--------|--------|-----------------|
| `socket.emit()` | Sender only | Yes (only sender) |
| `socket.broadcast.emit()` | All others | No |
| `io.emit()` | Everyone | Yes |
| `io.to(room).emit()` | Room members | Yes |
| `socket.to(room).emit()` | Room members | No |
| `io.to(socketId).emit()` | Specific client | — |

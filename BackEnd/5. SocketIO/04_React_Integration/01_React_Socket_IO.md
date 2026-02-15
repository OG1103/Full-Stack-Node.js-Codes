# Socket.IO — React Integration

How to integrate Socket.IO with a React frontend and Node.js backend, including connection management, component patterns, and a full chat example.

---

## 1. Setup

### Backend

```bash
npm install express socket.io
```

### Frontend (React)

```bash
npm install socket.io-client
```

---

## 2. Socket Connection in React

### Option A: Module-Level Socket (Simple)

Create the socket in a separate module and import it anywhere:

```javascript
// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false,  // Don't connect until we explicitly call connect()
});

export default socket;
```

```javascript
// src/App.jsx
import { useEffect } from 'react';
import socket from './socket';

function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Chat />;
}
```

**Pros:** Simple, socket is shared across all components.
**Cons:** Harder to pass auth tokens dynamically.

### Option B: Context Provider (Recommended)

Provide the socket through React Context for better control:

```javascript
// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const newSocket = io('http://localhost:5000', {
      auth: { token },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
```

```javascript
// src/main.jsx
import { SocketProvider } from './context/SocketContext';

root.render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
```

```javascript
// Any component
import { useSocket } from '../context/SocketContext';

function Chat() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data) => {
      console.log(data);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);
}
```

**Pros:** Clean, auth-aware, easy to manage lifecycle.
**Cons:** Slightly more setup.

---

## 3. Custom Hook Pattern

```javascript
// src/hooks/useSocketEvent.js
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useSocketEvent = (event, handler) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};
```

```javascript
// Usage in any component
import { useCallback } from 'react';
import { useSocketEvent } from '../hooks/useSocketEvent';

function Notifications() {
  const handleNotification = useCallback((data) => {
    console.log('New notification:', data);
  }, []);

  useSocketEvent('notification', handleNotification);

  return <div>...</div>;
}
```

---

## 4. Full Chat Example

### Backend (Node.js)

```javascript
// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = new Map();  // socketId → username

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // User sets their username
  socket.on('setUsername', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    io.emit('systemMessage', `${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('chatMessage', (text) => {
    const username = users.get(socket.id) || 'Anonymous';
    io.emit('chatMessage', {
      username,
      text,
      timestamp: new Date().toISOString(),
    });
  });

  // Typing indicator
  socket.on('typing', () => {
    const username = users.get(socket.id);
    if (username) {
      socket.broadcast.emit('typing', username);
    }
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });

  // Room support
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    const username = users.get(socket.id);
    io.to(roomId).emit('systemMessage', `${username} joined ${roomId}`);
  });

  socket.on('roomMessage', ({ roomId, text }) => {
    const username = users.get(socket.id);
    io.to(roomId).emit('roomMessage', { username, text, roomId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    if (username) {
      io.emit('userList', Array.from(users.values()));
      io.emit('systemMessage', `${username} left the chat`);
    }
  });
});

httpServer.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### Frontend (React)

```javascript
// src/socket.js
import { io } from 'socket.io-client';
export const socket = io('http://localhost:5000');
```

```javascript
// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { socket } from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const typingTimeout = useRef(null);

  useEffect(() => {
    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for system messages
    socket.on('systemMessage', (text) => {
      setMessages((prev) => [...prev, { username: 'System', text, system: true }]);
    });

    // Listen for user list updates
    socket.on('userList', (list) => {
      setUsers(list);
    });

    // Listen for typing indicator
    socket.on('typing', (user) => {
      setTypingUser(user);
    });

    socket.on('stopTyping', () => {
      setTypingUser('');
    });

    return () => {
      socket.off('chatMessage');
      socket.off('systemMessage');
      socket.off('userList');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsJoined(true);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chatMessage', input);
      socket.emit('stopTyping');
      setInput('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping');
    }, 1000);
  };

  if (!isJoined) {
    return (
      <form onSubmit={handleJoin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Join Chat</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Chat</h2>

      {/* Online users */}
      <div>Online: {users.join(', ')}</div>

      {/* Messages */}
      <div style={{ height: 400, overflow: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.system ? 'gray' : 'black' }}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Typing indicator */}
      {typingUser && <div><em>{typingUser} is typing...</em></div>}

      {/* Input */}
      <form onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); handleTyping(); }}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
```

---

## 5. Important React Patterns

### Always Clean Up Listeners

```javascript
useEffect(() => {
  socket.on('event', handler);

  return () => {
    socket.off('event', handler);  // Remove listener on unmount
  };
}, []);
```

### Avoid Stale Closures

Use functional state updates to avoid stale state in socket handlers:

```javascript
// Bad — messages might be stale
socket.on('message', (msg) => {
  setMessages([...messages, msg]);  // 'messages' could be outdated
});

// Good — always uses the latest state
socket.on('message', (msg) => {
  setMessages((prev) => [...prev, msg]);
});
```

### Connect/Disconnect with Auth

```javascript
useEffect(() => {
  if (user) {
    socket.auth = { token: user.token };
    socket.connect();
  }

  return () => {
    socket.disconnect();
  };
}, [user]);
```

---

## 6. Communication Flow

```
React Component                    Node.js Server
     │                                  │
     │── socket.emit('joinRoom') ──────>│
     │                                  │── socket.join(roomId)
     │<── io.to(room).emit('joined') ──│
     │                                  │
     │── socket.emit('message') ──────>│
     │                                  │── io.to(room).emit('message')
     │<── socket.on('message') ────────│
     │                                  │
     │── socket.emit('typing') ───────>│
     │                                  │── socket.broadcast.emit('typing')
     │<── socket.on('typing') ─────────│
```

---

## 7. Summary

| Pattern | When to Use |
|---------|-------------|
| Module-level socket | Simple apps, no auth |
| Context Provider | Auth-aware, multiple components |
| Custom hook | Reusable event listeners |

### Key Rules

1. **Always clean up** listeners with `socket.off()` in useEffect cleanup
2. **Use functional updates** for state (`prev => [...prev, new]`)
3. **Connect after auth** — pass tokens in `socket.auth`
4. **Use `httpServer.listen()`** on the backend (not `app.listen()`)
5. **Configure CORS** on the Socket.IO server for cross-origin React apps

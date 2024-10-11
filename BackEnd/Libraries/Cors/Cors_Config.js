const corsOptions = {
    origin: 'https://example.com', // Allow only this origin
    methods: 'GET,POST',           // Allow only GET and POST requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only certain headers
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  };
  
  // Enable CORS for all routes with specific options
  app.use(cors(corsOptions));
  
  app.get('/api/data', (req, res) => {
    res.json({ message: 'This route has restricted CORS access' });
  });
  
  // origin: Defines which origins are allowed to access the resource. You can specify a single domain, an array of domains, or use a function for custom logic.
    // To allow multiple origins, pass an array of allowed origins: origin: ['https://example.com', 'https://anotherdomain.com']
 
 // methods: Specifies which HTTP methods (like GET, POST, PUT, etc.) are allowed for cross-origin requests.
 //allowedHeaders: Defines which headers can be used in the request. If you want to allow custom headers, you specify them here (e.g., Authorization, Content-Type).
 //credentials: If you want to allow credentials (like cookies or authentication headers) to be sent in cross-origin requests, you need to set this to true.
 //maxAge: Specifies how long (in seconds) the results of a preflight request can be cached by the client.

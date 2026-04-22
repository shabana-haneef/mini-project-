const cors = require('cors');

const corsOptions = {
  origin: ['http://your-frontend-url.com', process.env.FRONTEND_URL], // Added FRONTEND_URL to the origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
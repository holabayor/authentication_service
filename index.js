require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger_output.json');
const passport = require('passport');
const defineRolesandPermissions = require('./helpers/populate');
const userAuthRoutes = require('./routes/auth');
// const getAuthRoutes = require('./routes/getAuth');
const session = require('express-session');
const getAuthRoutes = require('./routes/authorize');
const userUpdateRouter = require('./routes/updateUser');
const {
  errorLogger,
  errorHandler,
} = require('./middleware/errorHandlerMiddleware');
const { UNKNOWN_ENDPOINT } = require('./errors/httpErrorCodes');
const { notFound } = require('./middleware/notFound');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true, // Enable preflight requests
  optionsSuccessStatus: 204, // Use 204 No Content for preflight success status
};


const handlePreflight = (req, res, next) => {
  // Set the CORS headers for the preflight request
  res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000", "http://localhost:3002", "https://zuriportfolio-frontend-pw1h.vercel.app"]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  // Respond to the OPTIONS request with a 204 No Content status
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Pass the request to the next middleware
  next();
};

app.use(handlePreflight) 

app.options('*', cors(corsOptions)); // Set up a global OPTIONS handler
app.use(cors(corsOptions)); // Use the configured CORS middleware for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// session middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const sequelize = require('./config/db');
const User = require('./models/Users');

sequelize.authenticate().then(async () => {
  await User.sync();
  await defineRolesandPermissions();
});

app.use(passport.initialize());
require('./middleware/authEmail')(passport);
require('./middleware/authGithub')(passport);
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// PLEASE DEFINE ALL AUTHENTICATION ROUTES WITH "/api/auth" OR PUT IN "routes/auth.js" ENSURE NO CONFLICTING ROUTE
app.use('/api/auth', userAuthRoutes);

//communication with other microservices
app.use('/api/authorize', getAuthRoutes);

// THIS IS ROUTE FOR UPDATING USER DETAILS, please ensure all related routes are placed incide the userUpdateRouter
app.use('/api/users', userUpdateRouter);

// Serving Files
http: app.use(errorLogger);
app.use(errorHandler);

// app.use("/auth", auth);

// 404 Route handler
http: app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

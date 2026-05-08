import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Load env vars
dotenv.config();

// Routes imports
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CEAMS API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const stationRoutes = require('./routes/station.routes');
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const uploadRoutes = require('./routes/upload.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const RefillHistoryRoutes =require('./routes/RefillHistory.routes');
const statisticsRoutes =require('./routes/statistics.routes');
const ocrRoutes = require('./routes/ocr.routes');
const adminRoutes =require('./routes/admin.routes');
const ownerRoutes =require('./routes/owner.routes');
const productNotificationRoutes =require("./routes/productNotification.routes");
const notificationRoutes = require("./routes/notification.routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.get('/', (req, res) => {res.send('RefillNearby API Running...');});
app.use('/api/refill-history',RefillHistoryRoutes);
app.use('/api/statistics',statisticsRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/owner',ownerRoutes);
app.use('/uploads',express.static('uploads'));
app.use("/api/product-notifications",productNotificationRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;

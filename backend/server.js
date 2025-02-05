const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const usersRoutes = require("./routes/userRoutes");
const cloudinary = require("cloudinary").v2;
const statsRoutes = require('./routes/stats');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
const allowedOrigins = [
	"https://haurly-shop-1.onrender.com",
	"http://localhost:3000",
	"*",
];

// CORS configuration
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Origine non autorisée"));
			}
		},
	})
);

// Initialize Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose
	.connect(process.env.MONGODB_URI, {
	})
	.then(() => console.log("MongoDB connecté"))
	.catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);
app.use('/api', statsRoutes);
app.use('/api/payment', paymentRoutes);
// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));

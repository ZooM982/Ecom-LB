const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const usersRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();const allowedOrigins = [
	"https://lady-boss.onrender.com", 
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin ||
				allowedOrigins.includes(origin) ||
				process.env.NODE_ENV === "development"
			) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
	})
);

app.use(express.json());

// Connexion à MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 60000,
	})
	.then(() => console.log("MongoDB connecté"))
	.catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// Configuration pour servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));

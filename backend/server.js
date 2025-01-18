const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path"); // Importation du module path pour gérer les chemins

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 60000, // 60 secondes
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// Configuration pour servir les fichiers statiques depuis le dossier uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Utiliser les routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Documentation de l'API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

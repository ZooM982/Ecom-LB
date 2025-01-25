const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

//Route pour creer un admin
router.post("/create-admin", async (req, res) => {
	const { name, email, password, username } = req.body;

	if (!username) {
		return res
			.status(400)
			.json({ message: "Le nom d'utilisateur est requis." });
	}

	try {
		// Vérifiez si un utilisateur avec le même username existe déjà
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Le nom d'utilisateur est déjà pris." });
		}

		// Créer un nouvel utilisateur avec le rôle 'admin'
		const newAdmin = new User({
			name,
			email,
			password,
			username,
			role: "admin",
		});
		await newAdmin.save();
		res.status(201).json({
			message: "Administrateur temporaire créé avec succès",
			user: newAdmin,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Route pour la connexion des utilisateurs
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ email: username });
		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		// Vérifier le mot de passe
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Mot de passe incorrect" });
		}

		// Générer un token JWT
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Renvoie le token et les informations de l'utilisateur
		res.json({
			token,
			user: { id: user._id, name: user.name, role: user.role },
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Route pour ajouter un nouvel utilisateur (inscription)
router.post("/register", async (req, res) => {
	const { username, email, password, role } = req.body;

	try {
		const newUser = new User({ username, email, password, role });
		await newUser.save();
		res
			.status(201)
			.json({ message: "Utilisateur créé avec succès", user: newUser });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
});

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
	try {
		const users = await User.find(); // Récupérer tous les utilisateurs
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des utilisateurs" });
	}
});

// Route pour supprimer un utilisateur
router.delete("/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}
		res.status(200).json({ message: "Utilisateur supprimé avec succès" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression de l'utilisateur" });
	}
});

module.exports = router;

module.exports = router;

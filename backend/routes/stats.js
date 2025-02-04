const express = require('express');
const router = express.Router();
const { ProductView, ProductPurchase, SiteVisit } = require('../models/Stats');

// 🔹 Middleware pour valider ObjectId
const mongoose = require('mongoose');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1️⃣ Enregistrer une visite de produit
router.post('/track-view/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(productId)) return res.status(400).json({ error: "ID produit invalide" });

    await ProductView.create({ productId, userId: isValidObjectId(userId) ? userId : null });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l’enregistrement de la visite" });
  }
});

// 2️⃣ Enregistrer un achat de produit
router.post('/track-purchase', async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Liste de produits invalide" });
    }

    const purchases = products.map(product => ({
      productId: isValidObjectId(product.id) ? product.id : null,
      userId: isValidObjectId(userId) ? userId : null,
      quantity: product.quantity > 0 ? product.quantity : 1,
      totalPrice: product.quantity * product.price
    }));

    await ProductPurchase.insertMany(purchases);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l’enregistrement de l’achat" });
  }
});

// 3️⃣ Enregistrer une visite du site
router.post('/track-visit', async (req, res) => {
  try {
    const { userId, page } = req.body;

    if (!page) return res.status(400).json({ error: "Page requise" });

    await SiteVisit.create({ userId: isValidObjectId(userId) ? userId : null, page });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l’enregistrement de la visite du site" });
  }
});

// 4️⃣ Produits les plus visités
router.get('/stats/products-views', async (req, res) => {
  try {
    const stats = await ProductView.aggregate([
      { $group: { _id: "$productId", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
});

// 5️⃣ Produits les plus achetés
router.get('/stats/products-purchases', async (req, res) => {
  try {
    const stats = await ProductPurchase.aggregate([
      { $group: { _id: "$productId", purchases: { $sum: "$quantity" } } },
      { $sort: { purchases: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
});

// 6️⃣ Chiffre d'affaires par produit
router.get('/stats/revenue', async (req, res) => {
  try {
    const revenueStats = await ProductPurchase.aggregate([
      { $group: { _id: "$productId", totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { totalRevenue: -1 } }
    ]);
    res.json(revenueStats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du chiffre d'affaires" });
  }
});

// 7️⃣ Taux d’abandon du panier (correctif)
router.get('/stats/cart-abandonment', async (req, res) => {
  try {
    const totalVisits = await SiteVisit.countDocuments({ page: "/cart" }); // Uniquement visites du panier
    const totalPurchases = await ProductPurchase.countDocuments();

    const abandonmentRate = totalVisits > 0 ? ((totalVisits - totalPurchases) / totalVisits) * 100 : 0;
    res.json({ abandonmentRate: abandonmentRate.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul du taux d'abandon du panier" });
  }
});

// 8️⃣ Répartition géographique des visiteurs
router.get('/stats/geo-distribution', async (req, res) => {
  try {
    // ⚠ Ajoute `userLocation` dans `SiteVisit` depuis le frontend pour activer cette fonctionnalité
    const geoStats = await SiteVisit.aggregate([
      { $match: { userLocation: { $exists: true, $ne: null } } },
      { $group: { _id: "$userLocation", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(geoStats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la répartition géographique" });
  }
});

module.exports = router;

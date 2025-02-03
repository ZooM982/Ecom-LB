const express = require('express');
const router = express.Router();
const { ProductView, ProductPurchase, SiteVisit } = require('../models/Stats');

// 1️⃣ Enregistrer une visite de produit
router.post('/track-view/:productId', async (req, res) => {
  try {
    await ProductView.create({ productId: req.params.productId, userId: req.body.userId || null });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de la visite' });
  }
});

// 2️⃣ Enregistrer un achat de produit
router.post('/track-purchase', async (req, res) => {
  try {
    const purchases = req.body.products.map(product => ({
      productId: product.id,
      userId: req.body.userId,
      quantity: product.quantity,
      totalPrice: product.quantity * product.price
    }));
    await ProductPurchase.insertMany(purchases);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’achat' });
  }
});

// 3️⃣ Enregistrer une visite du site
router.post('/track-visit', async (req, res) => {
  try {
    await SiteVisit.create({ userId: req.body.userId || null, page: req.body.page });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de la visite du site' });
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

// 7️⃣ Taux d’abandon du panier
router.get('/stats/cartAbandonment', async (req, res) => {
  try {
    const totalVisits = await SiteVisit.countDocuments();
    const totalPurchases = await ProductPurchase.countDocuments();

    const abandonmentRate = totalVisits > 0 ? ((totalVisits - totalPurchases) / totalVisits) * 100 : 0;
    res.json({ abandonmentRate });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul du taux d'abandon du panier" });
  }
});

// 8️⃣ Répartition géographique des visiteurs (exemple avec IP)
router.get('/stats/geo-distribution', async (req, res) => {
  try {
    const geoStats = await SiteVisit.aggregate([
      { $group: { _id: "$userLocation", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(geoStats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la répartition géographique" });
  }
});

module.exports = router;

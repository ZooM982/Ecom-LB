const express = require('express');
const router = express.Router();
const { ProductView, ProductPurchase, SiteVisit } = require('../models/Stats');

// Enregistrer une visite de produit
router.post('/track-view/:productId', async (req, res) => {
  try {
    await ProductView.create({ productId: req.params.productId, userId: req.body.userId || null });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de la visite' });
  }
});

// Enregistrer un achat de produit
router.post('/track-purchase', async (req, res) => {
  try {
    const purchases = req.body.products.map(product => ({
      productId: product.id,
      userId: req.body.userId,
      quantity: product.quantity,
    }));
    await ProductPurchase.insertMany(purchases);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’achat' });
  }
});

// Enregistrer une visite du site
router.post('/track-visit', async (req, res) => {
  try {
    await SiteVisit.create({ userId: req.body.userId || null, page: req.body.page });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de la visite du site' });
  }
});

// Produits les plus visités
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

// Produits les plus achetés
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

module.exports = router;

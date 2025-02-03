import axios from 'axios';

// ✅ Définition de l'instance Axios avec l'URL de base
const api = axios.create({
  baseURL: "https://haurly-shop.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Enregistrer une vue produit
export const trackProductView = async (productId, userId = null) => {
  try {
    await api.post(`/track-view/${productId}`, { userId });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement de la visite du produit :", error);
  }
};

// ✅ Enregistrer un achat produit
export const trackPurchase = async (products, userId) => {
  try {
    await api.post('/track-purchase', { products, userId });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement de l'achat :", error);
  }
};

// ✅ Enregistrer une visite du site
export const trackSiteVisit = async (page, userId = null) => {
  try {
    await api.post('/track-visit', { page, userId });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement de la visite du site :", error);
  }
};

// ✅ Récupérer les produits les plus visités
export const fetchProductViews = async () => {
  try {
    const response = await api.get('/stats/products-views');
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques de vues :", error);
    return [];
  }
};

// ✅ Récupérer les produits les plus achetés
export const fetchProductPurchases = async () => {
  try {
    const response = await api.get('/stats/products-purchases');
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques d'achats :", error);
    return [];
  }
};

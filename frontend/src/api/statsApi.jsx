import axios from 'axios';

export const trackProductView = async (productId, userId = null) => {
  try {
    await axios.post(`/api/track-view/${productId}`, { userId });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la visite du produit", error);
  }
};

export const trackPurchase = async (products, userId) => {
  try {
    await axios.post('/api/track-purchase', { products, userId });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'achat", error);
  }
};

export const trackSiteVisit = async (page, userId = null) => {
  try {
    await axios.post('/api/track-visit', { page, userId });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la visite du site", error);
  }
};

export const fetchProductViews = async () => {
  try {
    const response = await axios.get('/api/stats/products-views');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques", error);
    return [];
  }
};

export const fetchProductPurchases = async () => {
  try {
    const response = await axios.get('/api/stats/products-purchases');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques", error);
    return [];
  }
};

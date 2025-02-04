import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Création d'une instance Axios
const api = axios.create({
  baseURL: "https://haurly-shop.onrender.com/api", 
  headers: { "Content-Type": "application/json" },
});

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    revenue: [],
    sales: [],
    cartAbandonment: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Correction des endpoints
        const [revenueRes, salesRes, cartAbandonmentRes] = await Promise.all([
          api.get("/stats/revenue"),
          api.get("/stats/products-purchases"), // Produits les plus achetés
          api.get("/stats/cartAbandonment"),
        ]);

        setStats({
          revenue: revenueRes.data,
          sales: salesRes.data,
          cartAbandonment: cartAbandonmentRes.data.abandonmentRate || 0,
        });
      } catch (error) {
        console.error("❌ Erreur lors du chargement des statistiques", error.response?.data || error.message);
        setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Formateur pour les prix (€)
  const formatPrice = (value) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

  // ✅ États UI : Chargement & Erreur globale
  if (loading) return <p className="text-center text-gray-600">⏳ Chargement des statistiques...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">📊 Statistiques E-commerce</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ✅ Chiffre d'affaires */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">💰 Chiffre d’affaires</h2>
          <ul>
            {stats.revenue.length > 0 ? (
              stats.revenue.map((item) => (
                <li key={item._id}>
                  {item.productName || `Produit ${item._id}`}: {formatPrice(item.totalRevenue)}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Aucune donnée disponible.</p>
            )}
          </ul>
        </div>

        {/* ✅ Ventes par produit */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">📆 Produits les plus achetés</h2>
          <ul>
            {stats.sales.length > 0 ? (
              stats.sales.map((sale, index) => (
                <li key={index}>
                  {sale._id}: {sale.purchases} ventes
                </li>
              ))
            ) : (
              <p className="text-gray-500">Aucune donnée disponible.</p>
            )}
          </ul>
        </div>

        {/* ✅ Taux d’abandon du panier */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">📦 Taux d’abandon de panier</h2>
          <p className="text-xl font-bold text-red-600">
            {stats.cartAbandonment.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;

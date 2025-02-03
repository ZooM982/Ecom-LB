import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Créer une instance Axios pour éviter la répétition de l'URL
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
  const [error, setError] = useState(null); // ✅ Ajouter un état pour gérer les erreurs

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Correction des requêtes avec l'instance Axios
        const [revenueRes, salesRes, cartAbandonmentRes] = await Promise.all([
          api.get("/revenue"),
          api.get("/salesByPeriod?period=month"),
          api.get("/cartAbandonment"),
        ]);

        setStats({
          revenue: revenueRes.data,
          sales: salesRes.data,
          cartAbandonment: cartAbandonmentRes.data.abandonmentRate,
        });
      } catch (error) {
        console.error("❌ Erreur lors du chargement des statistiques", error);
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Gérer les états UI : chargement et erreurs
  if (loading) return <p>⏳ Chargement des statistiques...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Statistiques E-commerce</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ✅ Affichage du chiffre d'affaires */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">💰 Chiffre d’affaires</h2>
          <ul>
            {stats.revenue.length > 0 ? (
              stats.revenue.map((item) => (
                <li key={item._id}>
                  {item.productName}: {item.totalRevenue.toFixed(2)} €
                </li>
              ))
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </ul>
        </div>

        {/* ✅ Affichage des ventes par mois */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">📆 Ventes par mois</h2>
          <ul>
            {stats.sales.length > 0 ? (
              stats.sales.map((sale, index) => (
                <li key={index}>
                  Mois {sale._id}: {sale.totalSales} ventes
                </li>
              ))
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </ul>
        </div>

        {/* ✅ Affichage du taux d’abandon de panier */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">📦 Taux d’abandon de panier</h2>
          <p>{stats.cartAbandonment ? stats.cartAbandonment.toFixed(2) : "0.00"}%</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;

import { useEffect, useState } from "react";
import { fetchProductViews, fetchProductPurchases } from "../api/statsApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import StatsDashboard from "./StatsDashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = () => {
  const [productViews, setProductViews] = useState([]);
  const [productPurchases, setProductPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const views = await fetchProductViews();
        const purchases = await fetchProductPurchases();
        setProductViews(views || []);
        setProductPurchases(purchases || []);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques", err);
        setError("❌ Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Fonction pour formater les labels des produits
  const formatLabel = (id) => (id ? `Produit ${id}` : "Produit inconnu");

  // ✅ Options pour améliorer la lisibilité des graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Pas besoin d'afficher la légende ici
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const viewData = {
    labels: productViews.length > 0 ? productViews.map((p) => formatLabel(p._id)) : [],
    datasets: [
      {
        label: "Vues",
        data: productViews.length > 0 ? productViews.map((p) => p.views) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const purchaseData = {
    labels: productPurchases.length > 0 ? productPurchases.map((p) => formatLabel(p._id)) : [],
    datasets: [
      {
        label: "Achats",
        data: productPurchases.length > 0 ? productPurchases.map((p) => p.purchases) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="min-h-[81.3vh] md:min-h-[79.3vh] p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Statistiques</h2>

      {loading ? (
        <p className="text-gray-600 text-center">⏳ Chargement des statistiques...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <StatsDashboard />
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">📌 Produits les plus visités</h3>
            {productViews.length > 0 ? (
              <Bar data={viewData} options={chartOptions} />
            ) : (
              <p className="text-gray-500">Aucune donnée disponible.</p>
            )}
          </div>
          <div className="w-full mt-6">
            <h3 className="text-lg font-semibold mb-2">🛒 Produits les plus achetés</h3>
            {productPurchases.length > 0 ? (
              <Bar data={purchaseData} options={chartOptions} />
            ) : (
              <p className="text-gray-500">Aucune donnée disponible.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;

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

// Enregistre les composants nécessaires
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Stats = () => {
	const [productViews, setProductViews] = useState([]);
	const [productPurchases, setProductPurchases] = useState([]);

	useEffect(() => {
		fetchProductViews().then(setProductViews);
		fetchProductPurchases().then(setProductPurchases);
	}, []);

	const viewData = {
		labels: productViews.map((p) => `Produit ${p._id}`),
		datasets: [
			{
				label: "Vues",
				data: productViews.map((p) => p.views),
				backgroundColor: "rgba(54, 162, 235, 0.6)",
			},
		],
	};

	const purchaseData = {
		labels: productPurchases.map((p) => `Produit ${p._id}`),
		datasets: [
			{
				label: "Achats",
				data: productPurchases.map((p) => p.purchases),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
			},
		],
	};

	return (
		<div>
			<h2>📊 Statistiques</h2>
			<div className="grid md:grid-cols-2 gap-5">
				<div className="w-full">
					<h3>Produits les plus visités</h3>
					<Bar data={viewData} />
				</div>
				<div className="w-full">
					<h3>Produits les plus achetés</h3>
					<Bar data={purchaseData} />
				</div>
			</div>
		</div>
	);
};

export default Stats;

import React, { useState } from "react";
import { Link, Route, Routes, Navigate, useLocation } from "react-router-dom";
import ManageProducts from "../Dashboard/ManageProducts";
import ManageUsers from "../Dashboard/ManageUsers";
import { useAuth } from "../context/AuthContext";
import {
	FaUser,
	FaOpencart,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import BackButton from "../buttons/Backbutton";
import Stats from "../Dashboard/Stats";
import { IoStatsChartOutline } from "react-icons/io5";
import PaymentHistory from "../Dashboard/PaymentHistory";

const Dashboard = () => {
	const { auth } = useAuth();
	const location = useLocation();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar state

	// Apply active class based on the current route
	const getLinkClass = (path) => {
		return location.pathname.includes(path)
			? "bg-gray-500 border-b-4 border-gray-700 text-white"
			: "hover:underline text-black";
	};

	// Toggle sidebar collapse state
	const toggleSidebar = () => {
		setIsSidebarCollapsed((prev) => !prev);
	};

	return (
		<section className="min-h-[81.3vh] md:min-h-[73.7vh] flex flex-col md:flex-row">
			{/* Sidebar */}
			<BackButton/>
			<aside
				className={`dashboard-sidebar transition-all duration-300 ${
					isSidebarCollapsed ? "w-full md:w-16" : "w-full md:w-64"
				} bg-gray-200 flex flex-col md:flex-col`}
			>
				<div className="flex justify-between items-center mt-8 ms-2 p-4 md:justify-start">
					<button
						onClick={toggleSidebar}
						className="hidden md:block text-gray-600 hover:text-gray-900"
					>
						{isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
					</button>
				</div>
				<ul className="flex md:flex-col gap-4 p-2">
					<li
						className={`flex items-center gap-2 ${
							isSidebarCollapsed ? "justify-center" : "justify-start"
						} ${getLinkClass("/dashboard/products")}`}
					>
						<Link
							className={`flex items-center gap-2 ${
								isSidebarCollapsed ? "text-lg" : "text-[20px] "
							} transition-all duration-300 p-2`}
							to="/dashboard/products"
						>
							<FaOpencart className="text-2xl" />
							{!isSidebarCollapsed && (
								<span className="whitespace-nowrap">Gérer les produits</span>
							)}
						</Link>
					</li>
					<li
						className={`flex items-center gap-2 ${
							isSidebarCollapsed ? "justify-center" : "justify-start"
						} ${getLinkClass("/dashboard/users")}`}
					>
						<Link
							className={`flex items-center gap-2 ${
								isSidebarCollapsed ? "text-lg" : "text-[20px] "
							} transition-all duration-300 p-2`}
							to="/dashboard/users"
						>
							<FaUser className="text-2xl" />
							{!isSidebarCollapsed && (
								<span className="whitespace-nowrap">
									Gérer les utilisateurs
								</span>
							)}
						</Link>
					</li>
					<li
						className={`flex items-center gap-2 ${
							isSidebarCollapsed ? "justify-center" : "justify-start"
						} ${getLinkClass("/dashboard/stats")}`}
					>
						<Link
							className={`flex items-center gap-2 ${
								isSidebarCollapsed ? "text-lg" : "text-[20px] "
							} transition-all duration-300 p-2`}
							to="/dashboard/stats"
						>
							<IoStatsChartOutline className="text-2xl" />
							{!isSidebarCollapsed && (
								<span className="whitespace-nowrap">
									Voir les stats
								</span>
							)}
						</Link>
					</li>
					<li
						className={`flex items-center gap-2 ${
							isSidebarCollapsed ? "justify-center" : "justify-start"
						} ${getLinkClass("/dashboard/paiements")}`}
					>
						<Link
							className={`flex items-center gap-2 ${
								isSidebarCollapsed ? "text-lg" : "text-[20px] "
							} transition-all duration-300 p-2`}
							to="/dashboard/paiements"
						>
							<IoStatsChartOutline className="text-2xl" />
							{!isSidebarCollapsed && (
								<span className="whitespace-nowrap">
									Voir les paiements
								</span>
							)}
						</Link>
					</li>
				</ul>
			</aside>

			{/* Main Content */}
			<main className="dashboard-content flex-1">
				<Routes>
					{auth.token ? (
						<>
							<Route path="products" element={<ManageProducts />} />
							<Route path="users" element={<ManageUsers />} />
							<Route path="stats" element={<Stats />} />
							<Route path="paiements" element={<PaymentHistory />} />
						</>
					) : (
						<Navigate to="/login" />
					)}
				</Routes>
			</main>
		</section>
	);
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
	Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import Login from "./components/Login";
import Register from "./components/Register";
import Men from "./Pages/Men";
import Women from "./Pages/Women";
import Accessories from "./Pages/Accessories";
import Sale from "./Pages/Sale";
import Kids from "./Pages/Kids";
import Dashboard from "./components/Dashboard";
import ProductDetails from "./Pages/ProductDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RequireAdminAuth from "./components/RequireAdminAuth";
import RegisterAdmin from "./components/RegisterAdmin";

function App() {
	const [cartItems, setCartItems] = useState(() => {
		const savedItems = localStorage.getItem("cartItems");
		return savedItems ? JSON.parse(savedItems) : [];
  });
  
  useEffect(() => {
		const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
		setCartItems(storedCartItems);
	}, []);


	const [isCartOpen, setCartOpen] = useState(false);

	const addToCart = (item) => {
		setCartItems((prevItems) => {
			// Vérifier si l'article existe déjà dans le panier en utilisant '_id'
			const existingItem = prevItems.find(
				(cartItem) => cartItem._id === item._id
			);

			let updatedCart;
			if (existingItem) {
				// Si l'article existe, augmenter la quantité
				updatedCart = prevItems.map((cartItem) =>
					cartItem._id === item._id
						? { ...cartItem, quantity: cartItem.quantity + item.quantity }
						: cartItem
				);
			} else {
				// Si l'article n'existe pas, l'ajouter au panier
				updatedCart = [...prevItems, { ...item, quantity: item.quantity || 1 }];
			}

			// Mettre à jour le localStorage
			localStorage.setItem("cartItems", JSON.stringify(updatedCart));
			return updatedCart;
		});
	};


	const toggleCart = () => setCartOpen(!isCartOpen);

	const clearCart = () => {
		setCartItems([]);
		localStorage.removeItem("cartItems");
	};

	return (
		<AuthProvider>
			<Router>
				<AppContent
					addToCart={addToCart}
					toggleCart={toggleCart}
					isCartOpen={isCartOpen}
					cartItems={cartItems}
					clearCart={clearCart}
				/>
			</Router>
		</AuthProvider>
	);
}

const AppContent = ({
	addToCart,
	toggleCart,
	isCartOpen,
	cartItems,
	clearCart,
}) => {
	const location = useLocation();
	const isAuthPage =
		location.pathname === "/login" || location.pathname === "/register";

	return (
		<div className="App">
			{!isAuthPage && <Header toggleCart={toggleCart} cartItems={cartItems} />}
			{location.pathname === "/" && <Hero />}
			<Routes>
				<Route path="/" element={<Products addToCart={addToCart} />} />
				<Route path="/men" element={<Men />} />
				<Route path="/women" element={<Women />} />
				<Route path="/kids" element={<Kids />} />
				<Route path="/accessories" element={<Accessories />} />
				<Route path="/sale" element={<Sale />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/create-admin" element={<RegisterAdmin />} />
				<Route
					path="/dashboard/*"
					element={
						<RequireAdminAuth>
							<Dashboard />
						</RequireAdminAuth>
					}
				/>
				<Route path="/products/:id" element={<ProductDetails />} />
			</Routes>
			<Footer />
			<CartModal
				isOpen={isCartOpen}
				onRequestClose={toggleCart}
				cartItems={cartItems}
				clearCart={clearCart}
			/>
		</div>
	);
};

export default App;

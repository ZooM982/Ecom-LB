import React from "react";
import "./SplashScreen.css";

const SplashScreen = ({ fadeOut }) => {
	return (
		<div
			className={`splash-screen ${
				fadeOut ? "fade-out" : ""
			} flex items-center justify-center h-screen w-screen bg-[#e2b4a4] fixed top-0 left-0 z-50`}
		>
			<div className="relative">
				{/* Logo fixe au centre */}
				<img src="/Icon.jpg" alt="Logo" className="w-40 h-40 mb-4 mx-auto" />
				{/* Conteneur des points qui tournent */}
				<div className="spinning-dots">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
				</div>
			</div>
		</div>
	);
};

export default SplashScreen;

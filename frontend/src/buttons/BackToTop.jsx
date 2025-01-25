import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		if (window.scrollY > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	return (
		<div>
			{isVisible && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-5 z-50 right-5 p-3 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 transition-all duration-300"
					aria-label="Back to top"
				>
					<FaArrowUp className="text-xl" />
				</button>
			)}
		</div>
	);
};

export default BackToTopButton;

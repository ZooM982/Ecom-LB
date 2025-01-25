import React from "react";

function Footer() {
	return (
		<footer className="bg-[#001806] text-white p-6">
			<div className="container mx-auto md:grid grid-cols-3 gap-5">
				<p>&copy; 2024 Clothing Store. All rights reserved.</p>
				<nav className="space-x-6">
					<a href="/" className="hover:text-gray-400">
						Privacy Policy
					</a>
					<a href="/" className="hover:text-gray-400">
						Terms of Service
					</a>
				</nav>
				<p>Created with love By Revhieno Roll Haurly</p>
			</div>
		</footer>
	);
}

export default Footer;

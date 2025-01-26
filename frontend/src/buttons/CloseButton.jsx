import React from "react";

const { remote } = window.require("electron"); // Ou utilisez 'require' si vous avez Electron configuré

function CloseButton() {
	const handleClose = () => {
		remote.getCurrentWindow().close(); // Cette commande ferme la fenêtre actuelle d'Electron
	};

	return (
		<button
			onClick={handleClose}
			className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
		>
			Quitter l'application
		</button>
	);
}

export default CloseButton;

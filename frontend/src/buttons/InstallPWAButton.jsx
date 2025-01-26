import React, { useState, useEffect } from "react";
import { MdInstallMobile, MdInstallDesktop } from "react-icons/md";


const InstallPWAButton = () => {
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [isInstallable, setIsInstallable] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Vérifie si l'app est déjà installée
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			window.navigator.standalone;

		if (isStandalone) {
			setIsInstalled(true);
			return; // Pas besoin d'aller plus loin si l'app est installée
		}

		// Écoutez l'événement `beforeinstallprompt`
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault(); // Empêcher l'affichage automatique
			setDeferredPrompt(event); // Sauvegarder l'événement
			setIsInstallable(true); // Activer le bouton
		};

		// Écoutez l'événement `appinstalled`
		const handleAppInstalled = () => {
			console.log("PWA installée !");
			setIsInstalled(true);
			setIsInstallable(false); // Désactiver le bouton
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		// Nettoyez les événements
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt(); // Affiche la boîte de dialogue d'installation
			const { outcome } = await deferredPrompt.userChoice; // Résultat de l'installation
			if (outcome === "accepted") {
				console.log("L'utilisateur a accepté l'installation !");
			} else {
				console.log("L'utilisateur a refusé l'installation.");
			}
			setDeferredPrompt(null); // Réinitialisez l'événement
			setIsInstallable(false);
		}
	};

	// Ne rien afficher si l'app est installée ou non installable
	if (isInstalled || !isInstallable) {
		return null;
	}

	return (
		<button
			onClick={handleInstallClick}
			className="flex items-center space-x-2 px-4 py-2  text-white rounded-lg shadow-md "
		>
            <MdInstallMobile className="text-[24px] inline-block md:hidden" />
            <MdInstallDesktop className="text-[25px] hidden md:inline-block "/>
		</button>
	);
};

export default InstallPWAButton;

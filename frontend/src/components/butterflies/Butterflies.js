import React, { useEffect } from 'react';
import './Butterflies.css'; // Le fichier CSS pour styliser les papillons

const Butterflies = () => {
  useEffect(() => {
    const randomPosition = () => {
      const butterflies = document.querySelectorAll('.butterfly');
      butterflies.forEach(butterfly => {
        // Position aléatoire initiale
        const x = Math.random() * (window.innerWidth - 50); // Évitez que le papillon sorte de l'écran
        const y = Math.random() * (window.innerHeight - 50);
        butterfly.style.transform = `translate(${x}px, ${y}px)`;
        
        // Direction vers laquelle le papillon se déplace
        const directionX = Math.random() < 0.5 ? 1 : -1; // Gauche ou droite
        const directionY = Math.random() < 0.5 ? 1 : -1; // Haut ou bas

        // Nouvelle position finale
        const endX = directionX === 1 ? window.innerWidth + 50 : -50; // Sortir de l'écran à droite ou à gauche
        const endY = directionY === 1 ? window.innerHeight + 50 : -50; // Sortir de l'écran en haut ou en bas

        // Déplacer le papillon
        setTimeout(() => {
          butterfly.style.transform = `translate(${endX}px, ${endY}px)`;
          butterfly.classList.add('fade-out'); // Ajouter la classe pour faire disparaître le papillon
        }, 50); // Petit délai pour permettre l'affichage initial

        // Réinitialiser après un certain temps
        setTimeout(() => {
          butterfly.classList.remove('fade-out'); // Réinitialiser l'opacité
        }, 3500); // Correspond au temps de l'animation
      });
    };

    const interval = setInterval(randomPosition, 3000); // Déplace les papillons toutes les 3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle quand le composant est démonté
  }, []);

  return (
    <>
      <div className="butterfly" id="butterfly1"></div>
      <div className="butterfly" id="butterfly2"></div>
      <div className="butterfly" id="butterfly3"></div>
      <div className="butterfly" id="butterfly4"></div>
      <div className="butterfly" id="butterfly5"></div>
    </>
  );
};

export default Butterflies;

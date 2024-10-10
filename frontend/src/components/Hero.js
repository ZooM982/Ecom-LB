import React from 'react';

function Hero() {
  return (
    <section className="bg-cover bg-center h-[100vh] " style={{ backgroundImage: 'url(https://img.freepik.com/photos-gratuite/vetements_144627-25214.jpg?size=626&ext=jpg)' }}>
      <div className="container mx-auto h-full flex items-center justify-center">
        <h2 className="text-4xl text-white font-bold">Stylish Clothing for Everyone</h2>
      </div>
    </section>
  );
}

export default Hero;

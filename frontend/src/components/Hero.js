import React from 'react';

function Hero() {
  return (
    <section className="bg-cover bg-center h-64" style={{ backgroundImage: 'url(https://via.placeholder.com/1600x500)' }}>
      <div className="container mx-auto h-full flex items-center justify-center">
        <h2 className="text-4xl text-white font-bold">Stylish Clothing for Everyone</h2>
      </div>
    </section>
  );
}

export default Hero;

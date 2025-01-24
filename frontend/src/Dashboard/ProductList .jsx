import React from "react";

const ProductList = ({ products, handleEditProduct, handleDeleteProduct }) => (
	<div className="md:w-[48%] mx-auto">
		<h3 className="text-xl font-bold mb-4">Produits Disponibles</h3>
		<ul className="space-y-4">
			{products.map((product) => (
				<li key={product._id} className="flex justify-between items-center">
					<h1>{product.category}</h1>
					<div className="flex items-center space-x-4">
						<img
							src={product.image}
							alt={product.name}
							className="w-16 h-16 object-cover rounded-lg"
						/>
						<div>
							<h4 className="text-lg font-bold">{product.name}</h4>
							<p>{product.price} FCFA</p>
							<p>{product.stock} Article(s)</p>
						</div>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => handleEditProduct(product)}
							className="bg-yellow-500 text-white px-4 py-2 rounded-md"
						>
							Modifier
						</button>
						<button
							onClick={() => handleDeleteProduct(product._id)}
							className="bg-red-500 text-white px-4 py-2 rounded-md"
						>
							Supprimer
						</button>
					</div>
				</li>
			))}
		</ul>
	</div>
);

export default ProductList;

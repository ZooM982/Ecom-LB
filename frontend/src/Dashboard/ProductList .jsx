import React from "react";

const ProductList = ({ products, handleEditProduct, handleDeleteProduct }) => (
	<div className="mx-auto">
		<h3 className="text-xl font-bold mb-4">Produits Disponibles</h3>
		<ul className="grid md:grid-cols-3 gap-5">
			{products.map((product) => (
				<li key={product._id} className="w-full my-2 bg-gray-100 items-center">
					<h1 className="text-center font-bold italic font-serif m-2">{product.category}</h1>
					<div className="grid md:grid-cols-1 grid-cols-2 gap-5 w-full items-center">
						<img
							src={product.image}
							alt={product.name}
							className="w-[50%] md:w-[80%] md:h-[120px] mx-auto object-cover rounded-lg"
						/>
						<div className="px-3">
							<h4 className="text-lg font-bold">{product.name}</h4>
							<div className="grid grid-cols-1">
								<p>Prix : {product.price} FCFA</p>
								<p>{product.stock} Article(s)</p>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2 p-2 w-full">
						<button
							onClick={() => handleEditProduct(product)}
							className="bg-yellow-500 text-white p-2 rounded-md"
						>
							Modifier
						</button>
						<button
							onClick={() => handleDeleteProduct(product._id)}
							className="bg-red-500 text-white p-2 rounded-md"
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

import React from "react";
import ImagePreview from "./ImagePreview";

const ProductForm = ({
	newProduct,
	handleInputChange,
	handleSubmit,
	previewImage,
	setPreviewImage,
	editingProduct,
}) => (
	<form
		onSubmit={handleSubmit}
		className="space-y-6 bg-gray-100 p-6 rounded-lg"
	>
		<h3 className="text-xl font-bold">
			{editingProduct ? "Modifier" : "Ajouter"} un Produit
		</h3>

		{/* Nom du produit */}
		<div>
			<label className="block text-gray-700">Nom</label>
			<input
				type="text"
				name="name"
				value={newProduct.name}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border rounded-lg"
				required
			/>
		</div>

		{/* Image principale */}
		<div>
			<label className="block text-gray-700">Image Principale</label>
			{previewImage ? (
				<ImagePreview
					previewImage={previewImage}
					onRemove={() => setPreviewImage(null)}
				/>
			) : (
				<button
					type="button"
					onClick={() => document.getElementById("file-input").click()}
					className="bg-blue-500 w-full h-[70px] text-white px-4 py-2 rounded-lg"
				>
					+
				</button>
			)}
			<input
				type="file"
				id="file-input"
				name="image"
				onChange={handleInputChange}
				className="hidden"
			/>
		</div>

		{/* Prix du produit */}
		<div>
			<label className="block text-gray-700">Prix</label>
			<input
				type="number"
				name="price"
				value={newProduct.price}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border rounded-lg"
				required
				min="0"
			/>
		</div>

		{/* Description du produit */}
		<div>
			<label className="block text-gray-700">Description</label>
			<textarea
				name="description"
				value={newProduct.description}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border rounded-lg"
				required
			/>
		</div>

		{/* Tailles disponibles */}
		<div>
			<label className="block text-gray-700">Tailles</label>
			<input
				type="text"
				name="sizes"
				value={newProduct.sizes.join(", ")}
				onChange={(e) => handleInputChange(e, "sizes")}
				className="w-full px-3 py-2 border rounded-lg"
				required
			/>
			<small>Sépare les tailles par des virgules</small>
		</div>

		{/* Couleurs disponibles */}
		<div>
			<label className="block text-gray-700">Couleurs</label>
			<input
				type="text"
				name="colors"
				value={newProduct.colors.join(", ")}
				onChange={(e) => handleInputChange(e, "colors")}
				className="w-full px-3 py-2 border rounded-lg"
				required
			/>
			<small>Sépare les couleurs par des virgules</small>
		</div>

		{/* Catégorie du produit */}
		<div>
			<label className="block text-gray-700">Catégorie</label>
			<select
				name="category"
				value={newProduct.category}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border rounded-lg"
				required
			>
				<option value="Men">Homme</option>
				<option value="Women">Femme</option>
				<option value="Kids">Enfants</option>
				<option value="Accessories">Accessoires</option>
				<option value="Sale">Vente</option>
			</select>
		</div>

		{/* Stock disponible */}
		<div>
			<label className="block text-gray-700">Stock</label>
			<input
				type="number"
				name="stock"
				value={newProduct.stock}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border rounded-lg"
				min="0"
			/>
		</div>

		{/* Images supplémentaires */}
		<div>
			<label className="block text-gray-700">Images supplémentaires</label>
			<input
				type="file"
				name="additionalImages"
				onChange={handleInputChange}
				multiple
				className="w-full px-3 py-2 border rounded-lg"
			/>
		</div>

		<button
			type="submit"
			className="w-full bg-blue-500 text-white py-2 rounded-lg"
		>
			{editingProduct ? "Modifier Produit" : "Ajouter Produit"}
		</button>
	</form>
);

export default ProductForm;

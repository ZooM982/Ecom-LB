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
		{/* Autres champs du formulaire */}
		{/* ... */}
		<button
			type="submit"
			className="w-full bg-blue-500 text-white py-2 rounded-lg"
		>
			{editingProduct ? "Modifier Produit" : "Ajouter Produit"}
		</button>
	</form>
);

export default ProductForm;

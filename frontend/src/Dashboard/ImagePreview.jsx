import React from "react";

const ImagePreview = ({ previewImage, onRemove }) => (
	<div className="flex items-center space-x-4">
		<img
			src={previewImage}
			alt="Prévisualisation"
			className="mt-2 w-[50%] h-auto rounded-md"
		/>
		<button
			type="button"
			onClick={onRemove}
			className="bg-red-500 text-white px-2 py-1 rounded-md"
		>
			Supprimer
		</button>
	</div>
);

export default ImagePreview;

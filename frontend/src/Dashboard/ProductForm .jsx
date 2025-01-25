import React, { useState, useEffect } from "react";

const ProductForm = ({ onSubmit, initialData = null }) => {
	const [product, setProduct] = useState({
		name: "",
		price: "",
		description: "",
		category: "Men",
		sizes: "",
		colors: "",
		stock: "",
		image: null,
		additionalImages: [],
	});

	const [error, setError] = useState("");

	useEffect(() => {
		if (initialData) {
			setProduct({
				name: initialData.name || "",
				price: initialData.price || "",
				description: initialData.description || "",
				category: initialData.category || "Men",
				sizes: initialData.sizes ? initialData.sizes.join(", ") : "",
				colors: initialData.colors ? initialData.colors.join(", ") : "",
				stock: initialData.stock || "",
				image: null,
				additionalImages: [],
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "image" || name === "additionalImages") {
			setProduct((prev) => ({
				...prev,
				[name]: name === "image" ? files[0] : files,
			}));
		} else {
			setProduct((prev) => ({ ...prev, [name]: value }));
		}
	};

	const validate = () => {
		if (!product.sizes.trim()) {
			setError("Sizes cannot be empty.");
			return false;
		}
		if (!product.colors.trim()) {
			setError("Colors cannot be empty.");
			return false;
		}
		setError("");
		return true;
	};

	const submitForm = (e) => {
		e.preventDefault();
		if (!validate()) return;

		const formattedProduct = {
			...product,
			sizes: product.sizes.split(",").map((size) => size.trim()),
			colors: product.colors.split(",").map((color) => color.trim()),
		};

		onSubmit(formattedProduct);
		setProduct({
			name: "",
			price: "",
			description: "",
			category: "Men",
			sizes: "",
			colors: "",
			stock: "",
			image: null,
			additionalImages: [],
		});
	};

	return (
		<section className="min-h-[81.3vh] md:min-h-[79.3vh] ">
			<form
				onSubmit={submitForm}
				className="p-6 bg-gray-100 rounded-lg space-y-6"
			>
				<h3 className="text-xl font-bold">
					{initialData ? "Edit Product" : "Add Product"}
				</h3>
				{error && (
					<div className="text-red-500 text-sm p-2 border border-red-500 rounded-lg">
						{error}
					</div>
				)}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
					<input
						type="text"
						name="name"
						value={product.name}
						onChange={handleChange}
						placeholder="Name"
						required
						className="w-full p-2 border rounded-lg"
					/>
					<input
						type="number"
						name="price"
						value={product.price}
						onChange={handleChange}
						placeholder="Price"
						required
						className="w-full p-2 border rounded-lg"
					/>
					<textarea
						name="description"
						value={product.description}
						onChange={handleChange}
						placeholder="Description"
						required
						className="w-full p-2 border rounded-lg"
					/>
					<select
						name="category"
						value={product.category}
						onChange={handleChange}
						className="w-full p-2 border rounded-lg"
					>
						<option value="Men">Men</option>
						<option value="Women">Women</option>
						<option value="Kids">Kids</option>
						<option value="Accessories">Accessories</option>
						<option value="Sale">Sale</option>
					</select>
					<input
						type="text"
						name="sizes"
						value={product.sizes}
						onChange={handleChange}
						placeholder="Sizes (comma-separated)"
						className="w-full p-2 border rounded-lg"
					/>
					<input
						type="text"
						name="colors"
						value={product.colors}
						onChange={handleChange}
						placeholder="Colors (comma-separated)"
						className="w-full p-2 border rounded-lg"
					/>
					<input
						type="number"
						name="stock"
						value={product.stock}
						onChange={handleChange}
						placeholder="Stock"
						min="0"
						className="w-full p-2 border rounded-lg"
					/>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<div>
						<label>Main Image:</label>
						<input
							type="file"
							name="image"
							onChange={handleChange}
							className="w-full p-2 border rounded-lg"
							accept="image/*"
							{...(initialData ? {} : { required: true })}
						/>
					</div>
					<div>
						<label>Additional Images:</label>
						<input
							type="file"
							name="additionalImages"
							onChange={handleChange}
							className="w-full p-2 border rounded-lg"
							accept="image/*"
							multiple
						/>
					</div>
				</div>
				<button
					type="submit"
					className="bg-blue-500 w-[50%] mx-auto text-white p-2 rounded-lg"
				>
					{initialData ? "Update Product" : "Submit"}
				</button>
			</form>
		</section>
	);
};

export default ProductForm;

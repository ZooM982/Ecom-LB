import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

function Modal({ isOpen, onClose, children }) {
	const [isClosing, setIsClosing] = useState(false);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsClosing(false);
			onClose();
		}, 400);
	};

	if (!isOpen && !isClosing) return null;

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-end md:items-center z-50">
			<div
				className={`bg-white rounded-t-[50px] md:rounded-lg shadow-lg p-6 w-full md:w-[75%] mx-auto ${
					isClosing ? "animate-slide-down" : "animate-slide-up"
				}`}
			>
				<button
					className="bg-red-500 rounded-full hover:text-gray-700 p-2 float-right"
					onClick={handleClose}
				>
					<AiOutlineClose />
				</button>
				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}

export default Modal;

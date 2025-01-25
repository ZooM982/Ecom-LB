import React from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="w-[35%] md:w-[20%] space-x-5 my-5 mx-auto flex justify-between text-customsText-texteColor">
			<button
				disabled={currentPage === 1}
				className="text-[30px] disabled:cursor-not-allowed disabled:text-customsText-secondaire"
				onClick={() => onPageChange(currentPage - 1)}
			>
				<FaChevronCircleLeft />
			</button>
			<button
				className="w-[30px] h-[30px] bg-customsText-principale rounded-full"
				onClick={() => onPageChange(currentPage)}
			>
				{currentPage}/{totalPages}
			</button>
			<button
				disabled={currentPage === totalPages}
				className="text-[30px] disabled:cursor-not-allowed disabled:text-customsText-secondaire"
				onClick={() => onPageChange(currentPage + 1)}
			>
				<FaChevronCircleRight />
			</button>
		</div>
	);
}

export default Pagination;

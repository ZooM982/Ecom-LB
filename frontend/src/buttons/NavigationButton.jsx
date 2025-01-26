import React from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

function NavigationButton({ direction, onClick, disabled }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			style={{
				transition: "transform 0.5s ease",
			}}
			className={`text-[30px] rounded-full p-1  text-white bg-[#001806] disabled:cursor-not-allowed disabled:opacity-50 hover:scale-150 ${
				direction === "left" ? "mr-2" : "ml-2"
			}`}
		>
			{direction === "left" ? <CiCircleChevLeft /> : <CiCircleChevRight />}
		</button>
	);
}

export default NavigationButton;

import { useNavigate } from "react-router-dom";


const BackButton = () => {
    const navigate = useNavigate(); // Initialiser useNavigate

    return(
        <button 
        onClick={() => navigate(-1)} // Utiliser navigate pour revenir en arrière
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Retour
      </button>
    )
}

export default BackButton

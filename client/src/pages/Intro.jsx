import { useNavigate } from "react-router-dom";

export default function Intro({ setSeenIntro }) {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("seenIntro", "true");
    setSeenIntro(true); // 🔥 esto dispara re-render
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Vendé tu ganado fácil
      </h1>

      <p className="text-gray-600 mb-6">
        Publicá en segundos y recibí consultas por WhatsApp
      </p>

      <button
        onClick={handleStart}
        className="bg-green-600 text-white px-6 py-3 rounded-2xl text-lg font-bold"
      >
        Empezar
      </button>
    </div>
  );
}
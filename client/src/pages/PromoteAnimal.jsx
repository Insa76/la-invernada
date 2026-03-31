import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function PromoteAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/animals/${id}`).then((res) => setAnimal(res.data));
  }, [id]);

  const handlePromote = async () => {
    setLoading(true);

    // ⏳ simulamos proceso de pago
    setTimeout(async () => {
      await api.patch(`/animals/${id}/featured`);
      navigate(`/animal/${id}`);
    }, 1500);
  };

  if (!animal) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">
        Destacar publicación
      </h1>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-bold">{animal.title}</h2>
        <p>{animal.weight} kg</p>
        <p>{animal.location}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded-2xl">
        <h3 className="font-bold">Beneficios</h3>
        <ul className="text-sm mt-2">
          <li>⭐ Aparece primero</li>
          <li>👀 Más visibilidad</li>
          <li>📞 Más consultas</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow text-center">
        <p className="text-sm text-gray-500">Precio</p>
        <p className="text-2xl font-bold">$2000</p>
        <p className="text-xs text-gray-500">
          (simulación)
        </p>
      </div>

      <button
        onClick={handlePromote}
        disabled={loading}
        className="bg-yellow-400 text-black p-4 rounded-2xl font-bold"
      >
        {loading ? "Procesando..." : "Destacar ahora"}
      </button>
    </div>
  );
}
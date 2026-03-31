import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyAnimals() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/animals/me")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAnimals(data);
      })
      .catch(() => setAnimals([]));
  }, []);

  return (
    <div className="p-3 bg-white">
      <h1 className="text-xl font-bold mb-4">
        Mis publicaciones
      </h1>

      {/* 🔄 Estado vacío */}
      {animals.length === 0 ? (
        <p className="text-gray-500">
          No tenés publicaciones todavía
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {animals.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/animal/${a.id}`)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
            >
              <img
                src={a.images?.[0] || "https://via.placeholder.com/400"}
                alt={a.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-3">
                <h2 className="font-bold">{a.title}</h2>
                <p className="text-sm text-gray-600">
                  {a.weight} kg • {a.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
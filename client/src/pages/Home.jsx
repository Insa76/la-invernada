import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Heart, Plus } from "lucide-react";

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minWeight: "",
  });

  // 🔄 Fetch animales
  const fetchAnimals = () => {
    setLoading(true);

    api
      .get("/animals", {
        params: {
          ...filters,
          category,
        },
      })
      .then((res) => setAnimals(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // 📊 Stats
  const fetchStats = () => {
    api
      .get("/animals/stats")
      .then((res) => setTotal(res.data.totalAnimals || 0))
      .catch(console.error);
  };

  useEffect(() => {
    fetchAnimals();
    fetchStats();
  }, [category]);

  return (
    <div className="p-3 bg-white">
      {/* 🏷️ TÍTULO CATEGORÍA */}
      <h1 className="text-lg font-bold mb-2 text-center">
        {category === "animals" && "Animales"}
        {category === "tools" && "Herramientas"}
        {category === "machines" && "Maquinarias"}
        {category === "trades" && "Permutas"}
        {!category && "Marketplace"}
      </h1>

      {/* 📊 PRUEBA SOCIAL */}
      <div className="bg-green-100 text-green-800 p-3 rounded-2xl mb-4 text-center font-semibold flex items-center justify-center gap-2">
        <TrendingUp size={20} />
        {total} publicaciones
      </div>

      {/* 🔍 FILTROS */}
      <div className="bg-white p-3 rounded-2xl shadow-xl mb-4 flex flex-col gap-2">
        <select
          className="bg-white shadow-xl p-2 rounded-xl"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="">Tipo</option>
          <option value="Vaca">Vaca</option>
          <option value="Toro">Toro</option>
          <option value="Ternero">Ternero</option>
          <option value="Chivo">Chivo</option>
          <option value="Oveja">Oveja</option>
        </select>

        <input
          placeholder="Ubicación"
          className="bg-white shadow-xl p-2 rounded-xl"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <input
          placeholder="Peso mínimo (kg)"
          className="bg-white shadow-xl p-2 rounded-xl"
          type="number"
          value={filters.minWeight}
          onChange={(e) =>
            setFilters({ ...filters, minWeight: e.target.value })
          }
        />

        <button
          onClick={fetchAnimals}
          className="bg-stone-500 text-gray-200 p-2 rounded-xl"
        >
          Buscar
        </button>
      </div>

      {/* ❤️ FAVORITOS */}
      <button
        onClick={() => navigate("/favorites")}
        className="bg-stone-500 text-gray-200 p-3 rounded-2xl w-full mb-4 text-lg font-semibold shadow flex items-center justify-center gap-2"
      >
        <Heart size={20} />
        Ver favoritos
      </button>

      {/* ➕ PUBLICAR */}
      <button
        onClick={() => navigate(`/create?category=${category || "animals"}`)}
        className="bg-green-600 text-gray-100 p-4 rounded-2xl w-full mb-4 text-lg font-semibold shadow flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Publicar
      </button>

      {/* 📦 LISTADO */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">
          Cargando publicaciones...
        </div>
      ) : animals.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No hay publicaciones todavía

          <button
            onClick={() =>
              navigate(`/create?category=${category || "animals"}`)
            }
            className="block bg-green-600 text-white mt-4 p-3 rounded-xl"
          >
            Publicar el primero
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {animals.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/animal/${a.id}`)}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
            >
              {/* ⭐ Destacado */}
              {a.isFeatured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                  ⭐ Destacado
                </div>
              )}

              <img
                src={
                  a.images?.[0] ||
                  "https://via.placeholder.com/400"
                }
                alt={a.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-3">
                <h2 className="text-lg font-bold">{a.title}</h2>

                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{a.weight} kg</span>
                  <span>{a.location}</span>
                </div>

                {a.price && (
                  <p className="text-green-700 font-bold mt-2">
                    ${a.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
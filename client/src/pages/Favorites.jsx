import { useEffect, useState } from "react";
import { getFavorites } from "../utils/favorites";
import { useNavigate } from "react-router-dom";
import { Heart} from "lucide-react";


export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div className="p-3 bg-white">
      <h1 className="text-xl font-bold mb-4">
      <Heart size={20} />  
      Mis favoritos
      </h1>

      {favorites.length === 0 && <p>No hay favoritos</p>}

      <div className="flex flex-col gap-4">
        {favorites.map((a) => (
          <div
            key={a.id}
            onClick={() => navigate(`/animal/${a.id}`)}
            className="bg-white rounded-2xl shadow p-3 cursor-pointer"
          >
            <h2 className="font-bold">{a.title}</h2>
            <p>{a.weight} kg</p>
            <p>{a.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
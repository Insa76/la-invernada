import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  toggleFavorite,
  isFavorite,
} from "../utils/favorites";
import { MapPin, Weight, Calendar, Tag, MessageCircle, Heart, Phone, Star, Pencil, Trash2, Lock } from "lucide-react";

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [fav, setFav] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/animals/${id}`)
      .then((res) => {
        setAnimal(res.data);
        setFav(isFavorite(res.data.id));
      })
      .catch((err) => {
        console.error(err);
        alert("Error al cargar el animal");
      });
  }, [id]);

  if (!animal) {
  return (
    <div className="p-4 text-center text-gray-500">
      Cargando publicación...
    </div>
  );
}

  // 🔐 obtener userId del token
  let userId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch (e) {
      console.error("Error parsing token", e);
    }
  }

  // 🔒 verificar dueño correctamente
  const isOwner =
    animal && userId && animal.userId === userId;

  // ❤️ favoritos
  const handleFavorite = () => {
    toggleFavorite(animal);
    setFav(!fav);
  };

  // 🔗 compartir
  const shareUrl = `${window.location.origin}/animal/${animal.id}`;

  const handleShare = () => {
    const shareMessage = `Mirá este animal 👇

🐄 ${animal.title}
⚖️ ${animal.weight} kg
📍 ${animal.location}

👉 ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: animal.title,
        text: shareMessage,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copiado 📋");
    }
  };

  // 💬 WhatsApp
  const message = `Hola! 👋

Me interesa este animal:

🐄 ${animal.title}
⚖️ ${animal.weight} kg
📍 ${animal.location}

¿Sigue disponible?`;

  const whatsappUrl = `https://wa.me/549${animal.phone}?text=${encodeURIComponent(
    message
  )}`;

  // 🟢 reciente
  const createdDate = new Date(animal.createdAt);
  const now = new Date();
  const diffHours = (now - createdDate) / (1000 * 60 * 60);
  const isRecent = diffHours < 48;

  // 🔐 protección acciones
  const requireAuth = () => {
    if (!token) {
      alert("Tenés que iniciar sesión");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleDelete = async () => {
    if (!requireAuth()) return;

    if (confirm("¿Eliminar publicación?")) {
      try {
        await api.delete(`/animals/${animal.id}`);
        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Error al eliminar");
      }
    }
  };

  const handleEdit = () => {
    if (!requireAuth()) return;
    navigate(`/edit/${animal.id}`);
  };

  const handlePromote = () => {
    if (!requireAuth()) return;
    navigate(`/promote/${animal.id}`);
  };

  return (
    <div className="p-3">
      {/* 📸 Imagen */}
      <div className="flex gap-2 overflow-x-auto">
  {(animal.images || []).map((img, i) => (
    <img
      key={i}
      src={img}
      alt="animal"
      className="w-40 h-40 object-cover rounded-xl"
    />
  ))}
</div>

      {/* 🟢 Badge reciente */}
      {isRecent && (
        <div className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-xl mt-2 inline-block">
          Publicación reciente
        </div>
      )}

      {/* 📦 Info */}
      <div className="bg-white p-4 rounded-2xl shadow mt-3">
        <h1 className="text-xl font-bold">{animal.title}</h1>

        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Tag size={16} /> {animal.type}
          </div>
          <div className="flex items-center gap-1">
            <Weight size={16} /> {animal.weight} kg
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} /> {animal.age} meses
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} /> {animal.location}
          </div>
        </div>

        {/* 💰 Precio */}
        {animal.price && (
          <p className="text-green-700 text-lg font-bold mt-3">
            ${animal.price}
          </p>
        )}

        {/* ⭐ Destacado */}
        {animal.isFeatured && animal.featuredUntil && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded-xl mt-3 text-sm">
            ⭐ Destacado hasta:{" "}
            {new Date(animal.featuredUntil).toLocaleDateString()}
          </div>
        )}

        <p className="mt-3 text-gray-700">
          {animal.description || "Sin descripción"}
        </p>
      </div>

      {/* ❤️ Favorito */}
      <button
  onClick={handleFavorite}
  className={`w-full p-3 rounded-2xl mt-3 font-bold flex items-center justify-center gap-2 ${
    fav
      ? "bg-red-500 text-white"
      : "bg-gray-200 text-black"
  }`}
>
  <Heart size={18} />
  {fav ? "Guardado" : "Guardar"}
</button>

      {/* 🔐 CONTACTO HÍBRIDO */}
      {token ? (
        <>
          <div className="bg-white p-4 rounded-2xl shadow mt-3">
            <p className="text-sm text-gray-600">Contacto</p>
            <p className="text-lg font-bold flex items-center gap-2">
  <Phone size={18} /> {animal.phone}
</p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            className="block text-green-500 text-center p-4 rounded-2xl mt-4 text-lg font-bold shadow flex items-center justify-center gap-2 border-2 border-green-600 border-solid"
          >
            <MessageCircle size={20} />
            Consultar por WhatsApp
          </a>
        </>
      ) : (
        <div className="bg-gray-100 p-4 rounded-2xl shadow mt-3 text-center">
          <p className="text-gray-700 font-semibold flex items-center justify-center gap-2">
            <Lock size={18} />
            Iniciá sesión para ver el contacto
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-3  text-black px-4 py-2 rounded-full border-2 border-green-600 border-solid"
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* 🔗 Compartir */}
      <button
        onClick={handleShare}
        className="w-full bg-gray-600 text-white p-3 rounded-2xl mt-3 font-semibold"
      >
        Compartir publicación
      </button>

      {/* ⚙️ Acciones SOLO dueño */}
      {isOwner && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white p-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Eliminar
          </button>

          <button
            onClick={handleEdit}
            className="flex-1 bg-gray-800 text-white p-3 rounded-xl flex items-center justify-center gap-2"
          >
          
            <Pencil size={18} />
            Editar
          </button>
        </div>
      )}

      {/* ⭐ Destacar (requiere login) */}
      <button
  onClick={() => navigate(`/promote/${animal.id}`)}
  className="w-full bg-yellow-400 text-black p-3 rounded-2xl mt-3 font-bold flex items-center justify-center gap-2 "
>
  <Star size={18} />
  Destacar publicación
</button>
    </div>
  );
}
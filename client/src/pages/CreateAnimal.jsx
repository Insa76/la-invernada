import { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

export default function CreateAnimal() {
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 categoría desde URL
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "animals";

  const [form, setForm] = useState({
    title: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    location: "",
    phone: "",
    description: "",
    price: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🚀 submit
  const handleSubmit = async () => {
  try {
    // 🔥 DEBUG FRONT (esto sí sirve)
    console.log("TOKEN:", localStorage.getItem("token"));

    if (!form.title || !form.location || !form.phone) {
      alert("Completá los campos obligatorios");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // 🔹 datos básicos
    Object.keys(form).forEach((key) => {
      if (form[key] !== "" && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    // 🔹 categoría
    formData.append("category", category || "animals");

    // 📸 imágenes
    images.forEach((img) => {
      formData.append("images", img);
    });

    // 🔥 request
    await api.post("/animals", formData);

    navigate(`/market?category=${category}`);

  } catch (error) {
     console.error("CREATE ERROR:", error);
    console.error("ERROR FRONT:", error);

    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al publicar");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      {/* 🧠 título dinámico */}
      <h1 className="text-xl font-bold text-center">
        Publicar{" "}
        {category === "animals" && "animal"}
        {category === "tools" && "herramienta"}
        {category === "machines" && "maquinaria"}
        {category === "trades" && "permuta"}
      </h1>

      {/* 📝 título */}
      <input
        placeholder="Título *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* 🐄 SOLO animales */}
      {category === "animals" && (
        <>
          <select
            className="bg-white shadow-xl p-3 rounded-xl"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="">Tipo</option>
            <option value="Vaca">Vaca</option>
            <option value="Toro">Toro</option>
            <option value="Ternero">Ternero</option>
            <option value="Chivo">Chivo</option>
            <option value="Oveja">Oveja</option>
            <option value="Caballo">Caballo</option>
            <option value="Chacho">Chacho</option>
          </select>

          <input
            placeholder="Raza"
            className="bg-white shadow-xl p-3 rounded-xl"
            value={form.breed}
            onChange={(e) =>
              setForm({ ...form, breed: e.target.value })
            }
          />

          <input
            placeholder="Edad (meses)"
            type="number"
            className="bg-white shadow-xl p-3 rounded-xl"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: e.target.value })
            }
          />

          <input
            placeholder="Peso (kg)"
            type="number"
            className="bg-white shadow-xl p-3 rounded-xl"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
          />
        </>
      )}

      {/* 💰 precio (no obligatorio en permutas) */}
      {category !== "trades" && (
        <input
          placeholder="Precio"
          type="number"
          className="bg-white shadow-xl p-3 rounded-xl"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      )}

      {/* 📍 ubicación */}
      <input
        placeholder="Ubicación *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
      />

      {/* 📞 teléfono */}
      <input
        placeholder="Teléfono *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      {/* 📝 descripción */}
      <textarea
        placeholder="Descripción"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* 📸 imágenes */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files).slice(0, 3);
          setImages(files);
        }}
        className="border p-3 rounded-xl"
      />

      {/* 👀 preview */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* 🚀 botón */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white p-4 rounded-2xl text-lg font-bold shadow flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </div>
  );
}
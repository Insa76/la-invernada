import { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

export default function CreateAnimal() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      if (!token) {
        alert("Tenés que iniciar sesión");
        return;
      }

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

      // 🔹 categoría SIEMPRE
      formData.append("category", category || "animals");

      // 📸 imágenes (máx 3)
      if (images.length > 0) {
        images.forEach((img) => {
          formData.append("images", img);
        });
      }

      // 🔥 request SIN headers manuales (axios ya maneja esto)
      const res = await api.post("/animals", formData);

      console.log("CREATED:", res.data);

      navigate(`/market?category=${category}`);

    } catch (error) {
      console.error("ERROR FRONT:", error);

      // 🔥 mostrar error real del backend
      if (error.response) {
        console.error("BACKEND ERROR:", error.response.data);
        alert(error.response.data?.error || "Error del servidor");
      } else {
        alert("Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      <h1 className="text-xl font-bold text-center">
        Publicar{" "}
        {category === "animals" && "animal"}
        {category === "tools" && "herramienta"}
        {category === "machines" && "maquinaria"}
        {category === "trades" && "permuta"}
      </h1>

      <input
        placeholder="Título *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

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
            <option value="Chancho">Chancho</option>
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

      <input
        placeholder="Ubicación *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
      />

      <input
        placeholder="Teléfono *"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <textarea
        placeholder="Descripción"
        className="bg-white shadow-xl p-3 rounded-xl"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

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
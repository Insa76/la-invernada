import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "",
    weight: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    api.get(`/animals/${id}`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const handleSubmit = async () => {
    await api.put(`/animals/${id}`, form);
    navigate(`/animal/${id}`);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">
        Editar animal
      </h1>

      <input
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        className="border p-3 rounded-xl"
      />

      <input
        value={form.weight}
        onChange={(e) =>
          setForm({ ...form, weight: e.target.value })
        }
        className="border p-3 rounded-xl"
      />

      <input
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
        className="border p-3 rounded-xl"
      />

      <input
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        className="border p-3 rounded-xl"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-4 rounded-xl"
      >
        Guardar cambios
      </button>
    </div>
  );
}
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Completá todos los campos");
        return;
      }

      setLoading(true);

      if (isRegister) {
        await api.post("/auth/register", form);

        alert("Cuenta creada correctamente. Ahora iniciá sesión");
        setIsRegister(false);
        return;
      }

      const res = await api.post("/auth/login", form);

      // 🔐 guardar token
      localStorage.setItem("token", res.data.token);

      navigate("/");
      window.location.reload();

    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h1>

      {/* 📧 Email */}
      <input
        placeholder="Email"
        className="border p-3 rounded-xl"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      {/* 🔒 Password */}
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-3 rounded-xl"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* 🚀 Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2"
      >
        {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
        {loading
          ? "Procesando..."
          : isRegister
          ? "Crear cuenta"
          : "Ingresar"}
      </button>

      {/* 🔄 toggle */}
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="text-sm text-center text-gray-600"
      >
        {isRegister
          ? "¿Ya tenés cuenta? Iniciar sesión"
          : "¿No tenés cuenta? Crear una"}
      </button>
    </div>
  );
}
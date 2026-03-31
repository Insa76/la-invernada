import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await api.post("/auth/register", form);
        alert("Cuenta creada, ahora iniciá sesión");
        setIsRegister(false);
        return;
      }

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Error. Verificá los datos.");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h1>

      <input
        placeholder="Email"
        className="border p-3 rounded-xl"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="border p-3 rounded-xl"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2"
      >
        {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
        {isRegister ? "Crear cuenta" : "Ingresar"}
      </button>

      <button
        onClick={() => setIsRegister(!isRegister)}
        className="text-sm text-center text-gray-600"
      >
        {isRegister
          ? "Ya tenés cuenta? Iniciar sesión"
          : "No tenés cuenta? Crear una"}
      </button>
    </div>
  );
}
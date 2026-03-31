import { useNavigate } from "react-router-dom";
import { PawPrint, Wrench, Tractor, Repeat } from "lucide-react";

export default function CategorySelector() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Animales",
      icon: PawPrint,
      path: "/market?category=animals",
    },
    {
      name: "Herramientas",
      icon: Wrench,
      path: "/market?category=tools",
    },
    {
      name: "Maquinarias",
      icon: Tractor,
      path: "/market?category=machines",
    },
    {
      name: "Permutas",
      icon: Repeat,
      path: "/market?category=trades",
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-4">
        
      <h1 className="text-2xl font-bold text-center mb-4">
        ¿Qué estás buscando?
      </h1>

      {categories.map((c) => (
        <button
          key={c.name}
          onClick={() => navigate(c.path)}
          className="bg-white shadow rounded-2xl p-4 flex items-center gap-3 text-lg font-semibold"
        >
          <c.icon size={24} />
          {c.name}
        </button>
      ))}
    </div>
  );
}
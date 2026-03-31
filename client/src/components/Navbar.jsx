import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, PlusCircle, User, LogOut, BarChart3 } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-600"
      : "text-gray-500";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around p-3">
      <button onClick={() => navigate("/")}>
        <Home className={isActive("/")} />
      </button>

      <button onClick={() => navigate("/favorites")}>
        <Heart className={isActive("/favorites")} />
      </button>

      <button onClick={() => navigate("/create")}>
        <PlusCircle className={isActive("/create")} />
      </button>

      <button onClick={() => navigate("/sales")}>
        <BarChart3 className={isActive("/sales")} />
      </button>

      {token ? (
        <>
          <button onClick={() => navigate("/my-animals")}>
            <User className={isActive("/my-animals")} />
          </button>

          <button onClick={handleLogout}>
            <LogOut className="text-red-500" />
          </button>
        </>
      ) : (
        <button onClick={() => navigate("/login")}>
          <User className={isActive("/login")} />
        </button>
      )}
    </div>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Home.jsx";
import AnimalDetail from "./pages/AnimalDetail.jsx";
import CreateAnimal from "./pages/CreateAnimal.jsx";
import Favorites from "./pages/Favorites.jsx";
import EditAnimal from "./pages/EditAnimal.jsx";
import MyAnimals from "./pages/MyAnimals.jsx";
import PromoteAnimal from "./pages/PromoteAnimal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Intro from "./pages/Intro.jsx";
import Login from "./pages/Login.jsx";
import Sales from "./pages/Sales.jsx";
import CategorySelector from "./pages/CategorySelector.jsx";

function App() {
  const [seenIntro, setSeenIntro] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("seenIntro");
    if (stored === "true") {
      setSeenIntro(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* 🟢 INTRO (solo primera vez) */}
          {!seenIntro && (
            <Route path="/" element={<Intro setSeenIntro={setSeenIntro} />} />
          )}

          {/* 🏠 HOME */}
          <Route path="/" element={<CategorySelector />} />
          <Route path="/market" element={<Home />} />

          {/* 🔓 PUBLICAS */}
          <Route path="/animal/:id" element={<AnimalDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />

          {/* 🔒 PROTEGIDAS */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateAnimal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditAnimal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-animals"
            element={
              <ProtectedRoute>
                <MyAnimals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/promote/:id"
            element={
              <ProtectedRoute>
                <PromoteAnimal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
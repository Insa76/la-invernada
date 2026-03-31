import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative pb-20">

      <div className="relative h-52 w-full">
        <img
          src="/portada.jpeg"
          alt="campo"
          className="w-full h-full object-cover"
        />

        {/* overlay 
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold text-center px-4">
            Mercado Rural
          </h1>
        </div>*/}
      </div>
      {/* Header 
      <header className="bg-green-700 text-gray-100 p-4 text-center text-xl font-bold">
        RuralMarket
      </header>*/}

      {localStorage.getItem("token") && (
        <div className="text-center text-xs text-green-700 bg-green-100 py-1">
          Sesión iniciada
        </div>
      )}

      {/* Contenido */}
      <main>{children}</main>

      {/* Navbar SIEMPRE visible */}
      <Navbar />
    </div>
  );
}
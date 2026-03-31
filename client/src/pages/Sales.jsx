import { useEffect, useState } from "react";
import api from "../services/api";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Download } from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 cargar ventas
  useEffect(() => {
    api
      .get("/animals/me")
      .then((res) => {
        const data = res.data || [];
        const sold = data.filter((a) => a.isSold);
        setSales(sold);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 📁 exportar excel
  const handleExport = () => {
    const data = sales.map((s) => ({
      Titulo: s.title,
      Tipo: s.type,
      Peso: s.weight,
      Ubicacion: s.location,
      Precio: s.soldPrice || "-",
      Fecha: s.soldAt
        ? new Date(s.soldAt).toLocaleDateString()
        : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "ventas.xlsx");
  };

  return (
    <div className="p-3 bg-white">
      <h1 className="text-xl font-bold mb-4">Ventas</h1>

      {/* 📁 Exportar */}
      {sales.length > 0 && (
        <button
          onClick={handleExport}
          className="bg-green-600 text-white p-3 rounded-xl mb-4 flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Descargar Excel
        </button>
      )}

      {/* 🔄 Loading */}
      {loading ? (
        <div className="text-center text-gray-500">
          Cargando ventas...
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No tenés ventas todavía
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sales.map((a) => (
            <div
              key={a.id}
              className="bg-white p-3 rounded-xl shadow"
            >
              <h2 className="font-bold">{a.title}</h2>

              <div className="text-sm text-gray-600 mt-1">
                {a.type} • {a.weight} kg
              </div>

              <div className="text-sm text-gray-600">
                {a.location}
              </div>

              <div className="mt-2 font-semibold text-green-700">
                {a.soldPrice ? `$${a.soldPrice}` : "Sin precio"}
              </div>

              <div className="text-xs text-gray-500">
                {a.soldAt
                  ? new Date(a.soldAt).toLocaleDateString()
                  : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
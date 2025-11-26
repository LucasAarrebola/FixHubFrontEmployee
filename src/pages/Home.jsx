import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Ticket,
  Loader2,
  XCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState("Usuário");
  const [loadingUser, setLoadingUser] = useState(true);

  const [totals, setTotals] = useState({
    total: 0,
    pendente: 0,
    andamento: 0,
    concluido: 0,
    reprovado: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(
          "https://projeto-integrador-fixhub.onrender.com/api/fixhub/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao carregar usuário");

        const data = await response.json();

        setUserName(data.pessoa?.nome || "Usuário");
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(
      "https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/listar-meus-tickets",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setTotals({
          total: data.length,
          pendente: data.filter((t) => t.status === "PENDENTE").length,
          andamento: data.filter((t) => t.status === "EM_ANDAMENTO").length,
          concluido: data.filter((t) => t.status === "CONCLUIDO").length,
          reprovado: data.filter((t) => t.status === "REPROVADO").length,
        });
      });
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="p-6 w-full max-w-xl flex flex-col items-center">
        <div className="w-full flex flex-col items-center gap-6">

          {/* Card Boas-vindas */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 w-full max-w-md flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <span className="text-[var(--primary)] font-bold text-lg">
                {loadingUser ? "..." : userName[0]}
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-500">Bem-vindo(a),</p>
              <p className="font-semibold text-[var(--primary)] text-base">
                {loadingUser ? "Carregando..." : userName}
              </p>
            </div>
          </div>

          {/* Card Estatísticas */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 w-full max-w-md hover:shadow-md transition">
            <div className="grid grid-cols-2 gap-3 text-center">
              <StatsItem title="Total" value={totals.total} icon={<Ticket size={16} />} />
              <StatsItem title="Pendentes" value={totals.pendente} icon={<AlertCircle size={16} />} />
              <StatsItem title="Em Andamento" value={totals.andamento} icon={<Loader2 size={16} />} />
              <StatsItem title="Concluídos" value={totals.concluido} icon={<CheckCircle size={16} />} />
              <StatsItem title="Reprovados" value={totals.reprovado} icon={<XCircle size={16} />} />
            </div>
          </div>

          {/* Card Abrir Ticket */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 w-full max-w-md text-center hover:shadow-md transition">
            <h2 className="font-semibold text-lg text-slate-800 mb-1">Abrir Ticket</h2>
            <p className="text-sm text-slate-500 mb-5">Relate um problema na rodoviária</p>

            <div className="flex justify-center gap-3">
              <Link
                to="/reports/create"
                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Criar Ticket
              </Link>

              <Link
                to="/reports"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Meus Tickets
              </Link>
            </div>
          </div>

          {/* Card Guia */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 w-full max-w-md text-center hover:shadow-md transition">
            <h2 className="text-lg font-semibold flex items-center justify-center gap-2 mb-2 text-slate-800">
              <MapPin className="w-5 h-5 text-[var(--primary)]" />
              Guia da Rodoviária
            </h2>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Encontre informações sobre setores, plataformas e serviços da rodoviária.
            </p>

            <Link
              to="/terminal-map"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm transition"
            >
              Acessar Guia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Componente de estatísticas */
function StatsItem({ title, value, icon }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center shadow-sm">
      <div className="text-slate-600 mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}

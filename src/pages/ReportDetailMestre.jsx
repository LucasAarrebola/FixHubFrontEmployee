import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// -------------------------------------------------------
// Ajuste de URL do Firebase
// -------------------------------------------------------
function fixFirebaseUrl(url) {
  if (!url) return url;
  if (url.includes("firebasestorage.googleapis.com")) return url;

  try {
    const tokenMatch = url.match(/token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    const parts = url.split(".app/");
    if (parts.length < 2) return url;

    const path = parts[1].split("?")[0];
    const encodedPath = encodeURIComponent(path);

    let finalUrl =
      `https://firebasestorage.googleapis.com/v0/b/fixhub-dc44c.firebasestorage.app/o/${encodedPath}?alt=media`;

    if (token) {
      finalUrl += `&token=${token}`;
    }

    return finalUrl;
  } catch (err) {
    console.error("Erro ao ajustar URL do Firebase:", err);
    return url;
  }
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------
export default function ReportDetailMestre() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const funcionarioNome = localStorage.getItem("userName") || null;

  const safeToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire("Erro", "Usuário não autenticado.", "error");
      return null;
    }
    return token;
  };

  // -------------------------------------------------------
  // BUSCAR TICKET
  // -------------------------------------------------------
  useEffect(() => {
    const fetchTicket = async () => {
      const token = safeToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets-mestre/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Erro: ${res.status}`);

        const text = await res.text();
        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error("Erro ao parsear ticket mestre:", err, "raw:", text);
        }

        const imagemFinal = fixFirebaseUrl(data.imagem);

        setTicket({
          ...data,
          imagem: imagemFinal,
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes do ticket mestre:", error);
        Swal.fire("Erro", "Não foi possível carregar os detalhes do ticket.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // -------------------------------------------------------
  // FUNÇÕES DOS BOTÕES
  // -------------------------------------------------------

  // Assumir
  const assumirTicket = async () => {
    const token = safeToken();
    if (!token) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/resolucoes/assumir?idTicketMestre=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      Swal.fire("Sucesso!", "Você assumiu o ticket.", "success");

      setTicket((prev) => ({
        ...prev,
        status: "EM_ANDAMENTO",
        nomeFuncionario: funcionarioNome || prev.nomeFuncionario || "Funcionário",
      }));
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível assumir o ticket.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Renunciar
  const renunciarTicket = async () => {
    const token = safeToken();
    if (!token) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/resolucoes/renunciar?idTicketMestre=${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      Swal.fire("Sucesso!", "Ticket renunciado e voltou para PENDENTE.", "success");

      setTicket((prev) => ({
        ...prev,
        status: "PENDENTE",
        nomeFuncionario: null,
        descricaoResolucao: null,
        dataResolucao: null,
      }));
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível renunciar.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Reprovar
  const reprovarTicket = async () => {
    const token = safeToken();
    if (!token) return;

    const { value: motivo } = await Swal.fire({
      title: "Motivo da reprovação",
      input: "textarea",
      inputPlaceholder: "Explique por que o ticket foi reprovado...",
      showCancelButton: true,
      inputValidator: (value) => (!value?.trim() ? "O motivo é obrigatório." : null),
    });

    if (!motivo) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/resolucoes/reprovar?idTicketMestre=${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      Swal.fire("Reprovado!", "O ticket foi marcado como reprovado.", "success");

      setTicket((prev) => ({
        ...prev,
        status: "REPROVADO",
        motivoReprovacao: motivo,
      }));
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível reprovar o ticket.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Finalizar
  const finalizarTicket = async () => {
    const token = safeToken();
    if (!token) return;

    const { value: escolha } = await Swal.fire({
      title: "O ticket foi aprovado ou reprovado?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Aprovar",
      denyButtonText: "Reprovar",
    });

    if (escolha === undefined) return;
    if (escolha === false) return await reprovarTicket();

    const { value: descricao } = await Swal.fire({
      title: "Descrição da resolução",
      input: "textarea",
      inputPlaceholder: "Descreva o que foi feito para resolver...",
      showCancelButton: true,
      inputValidator: (value) => (!value?.trim() ? "A descrição é obrigatória." : null),
    });

    if (!descricao) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        "https://projeto-integrador-fixhub.onrender.com/api/fixhub/resolucoes/resolver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idTicket: id, descricao }),
        }
      );

      if (!res.ok) throw new Error();

      Swal.fire("Concluído!", "O ticket foi finalizado com sucesso.", "success");

      setTicket((prev) => ({
        ...prev,
        status: "CONCLUIDO",
        descricaoResolucao: descricao,
        nomeFuncionario: funcionarioNome || "Funcionário",
        dataResolucao: new Date().toISOString(),
      }));
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível finalizar o ticket.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------
  // INTERFACE
  // -------------------------------------------------------

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Carregando...</div>;

  if (!ticket)
    return <div className="text-center mt-10 text-gray-500">Nenhum ticket encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">
      {/* TÍTULO */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-2xl font-bold text-sky-700">
          Detalhes do Ticket #{ticket.idTicket}
        </h2>
      </div>

      {/* DESCRIÇÃO */}
      <section className="mt-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Descrição</h3>

        <div className="p-4 bg-gray-50 rounded-xl border text-gray-600 leading-relaxed shadow-sm">
          {ticket.descricaoTicketUsuario || "Sem descrição"}
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Localização</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-xl border text-gray-600 shadow-sm">
            <span className="font-semibold text-gray-700">Andar:</span> {ticket.andar ?? "—"}
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border text-gray-600 shadow-sm">
            <span className="font-semibold text-gray-700">Local:</span>{" "}
            {ticket.localizacao ?? "—"}
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border text-gray-600 shadow-sm">
            <span className="font-semibold text-gray-700">Área:</span>{" "}
            {ticket.descricaoLocalizacao ?? "—"}
          </div>
        </div>
      </section>

      {/* STATUS */}
      <section className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Status</h3>

        <div
          className={`p-3 rounded-lg shadow-sm border-l-4 ${
            ticket.status === "CONCLUIDO"
              ? "border-green-600 bg-green-50 text-green-700"
              : ticket.status === "REPROVADO"
              ? "border-red-600 bg-red-50 text-red-700"
              : "border-yellow-500 bg-yellow-50 text-yellow-700"
          }`}
        >
          {ticket.status}
        </div>
      </section>

      {/* IMAGEM */}
      {ticket.imagem && (
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Imagem</h3>

          <div className="flex justify-center">
            <img
              src={ticket.imagem}
              alt="Ticket"
              className="rounded-xl shadow-md max-h-72 object-cover border cursor-pointer hover:scale-105 transition"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
      )}

      {/* MODAL DA IMAGEM */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={ticket.imagem}
            alt="Ticket Ampliado"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* BOTÕES — agora com espaçamento mt-8 */}
      <div className="mt-8 mb-4 flex gap-3 justify-end">
        {ticket.status === "PENDENTE" && (
          <button
            onClick={assumirTicket}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            {submitting ? "Aguarde..." : "Assumir Ticket"}
          </button>
        )}

        {ticket.status === "EM_ANDAMENTO" && (
          <>
            <button
              onClick={renunciarTicket}
              disabled={submitting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              {submitting ? "Aguarde..." : "Renunciar"}
            </button>

            <button
              onClick={finalizarTicket}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              {submitting ? "Finalizando..." : "Finalizar Ticket"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

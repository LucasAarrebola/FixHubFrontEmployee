import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

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

    let finalUrl = `https://firebasestorage.googleapis.com/v0/b/fixhub-dc44c.firebasestorage.app/o/${encodedPath}?alt=media`;

    if (token) {
      finalUrl += `&token=${token}`;
    }

    return finalUrl;
  } catch (err) {
    console.error("Erro ao ajustar URL do Firebase:", err);
    return url;
  }
}

export default function ReportEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const locations = ["Térreo", "Primeiro andar"];
  const areas = ["Área externa", "Área interna"];
  const categories = [
    "Área de Embarque/Desembarque",
    "Banheiro Feminino",
    "Banheiro Masculino",
    "Bilheteria",
    "Catraca",
    "Elevador",
    "Escada Rolante",
    "Estacionamento",
    "Praça de Alimentação",
    "Outros"
  ];

  const [form, setForm] = useState({
    andar: "",
    descricaoLocalizacao: "",
    localizacao: "",
    descricaoTicketUsuario: "",
    imagem: ""
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // BUSCAR TICKET
  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        Swal.fire("Erro", "Usuário não autenticado.", "error");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/detalhes/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!res.ok) throw new Error(`Erro: ${res.status}`);

        const data = await res.json();

        // Ajusta URL da imagem
        const imagemFinal = fixFirebaseUrl(data.imagem);

        setForm({
          andar: data.andar || "",
          descricaoLocalizacao: data.descricaoLocalizacao || "",
          localizacao: data.localizacao || "",
          descricaoTicketUsuario: data.descricaoTicketUsuario || "",
          imagem: imagemFinal || ""
        });

        setPreview(imagemFinal || null);

        setSelectedCategory(
          categories.includes(data.localizacao) ? data.localizacao : "Outros"
        );

        if (!categories.includes(data.localizacao)) {
          setOtherCategory(data.localizacao);
        }
      } catch (error) {
        console.error("Erro ao buscar ticket:", error);
        Swal.fire("Erro", "Não foi possível carregar os dados do ticket.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // HANDLE CHANGES
  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);

      const reader = new FileReader();
      reader.onloadend = () => setForm((prev) => ({ ...prev, imagem: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // SALVAR ALTERAÇÕES
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!form.andar) return setMensagem("⚠️ Selecione o Andar.");
    if (!form.descricaoLocalizacao) return setMensagem("⚠️ Selecione a Área.");
    if (!selectedCategory) return setMensagem("⚠️ Selecione a Categoria.");
    if (selectedCategory === "Outros" && !otherCategory.trim())
      return setMensagem("⚠️ Descreva a categoria Outros.");
    if (!form.descricaoTicketUsuario.trim())
      return setMensagem("⚠️ A Descrição é obrigatória.");

    const categoriaFinal = selectedCategory === "Outros" ? otherCategory : selectedCategory;

    const token = localStorage.getItem("authToken");
    if (!token) return Swal.fire("Erro", "Usuário não autenticado.", "error");

    const payload = {
      andar: form.andar,
      descricaoLocalizacao: form.descricaoLocalizacao,
      localizacao: categoriaFinal,
      descricaoTicketUsuario: form.descricaoTicketUsuario,
      imagem: form.imagem
    };

    try {
      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error();

      Swal.fire("Sucesso", "Ticket atualizado com sucesso.", "success");
      navigate(-1);
    } catch {
      Swal.fire("Erro", "Não foi possível salvar as alterações.", "error");
    }
  };

  const renderSelect = (label, value, onChange, options, placeholder) => (
    <div>
      <label className="label">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-sky-700 border-b pb-3 text-center">
        Editar Ticket
      </h1>

      {loading ? (
        <p className="text-center py-6 text-gray-500 text-sm">Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {mensagem && (
            <div
              className={`text-sm p-3 rounded-lg font-medium text-center ${
                mensagem.startsWith("🎉")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mensagem}
            </div>
          )}

          {renderSelect("Andar", form.andar, (v) => handleSelectChange("andar", v), locations, "Selecione o andar")}
          {form.andar &&
            renderSelect("Área", form.descricaoLocalizacao, (v) => handleSelectChange("descricaoLocalizacao", v), areas, "Selecione a área")}
          {form.descricaoLocalizacao &&
            renderSelect("Categoria", selectedCategory, setSelectedCategory, categories, "Selecione a categoria")}

          {selectedCategory === "Outros" && (
            <div>
              <label className="label">Descreva Outros *</label>
              <input
                type="text"
                className="input"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="label">Descrição *</label>
            <textarea
              className="input"
              rows={4}
              value={form.descricaoTicketUsuario}
              onChange={(e) => handleSelectChange("descricaoTicketUsuario", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Imagem (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />

            {preview && (
              <div className="mt-3 flex flex-col items-center">
                <p className="text-sm font-medium mb-1">Pré-visualização:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            )}
          </div>

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <img
                src={preview}
                alt="Preview Ampliado"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-200 transition"
            >
              Voltar
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => window.location.reload()}
              >
                Redefinir
              </button>

              <button type="submit" className="btn-primary shadow-md">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

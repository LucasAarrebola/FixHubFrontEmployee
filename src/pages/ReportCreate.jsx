import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ReportCreate() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensagem, setMensagem] = useState('');

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (!selectedLocation) return setMensagem('⚠️ Por favor, selecione o Local.');
    if (!selectedArea) return setMensagem('⚠️ Por favor, selecione a Área.');
    if (!selectedCategory) return setMensagem('⚠️ Por favor, selecione a Categoria.');
    if (selectedCategory === "Outros" && !otherCategory.trim()) {
      return setMensagem('⚠️ Por favor, descreva a categoria "Outros".');
    }
    if (!description.trim()) return setMensagem('⚠️ A Descrição do problema é obrigatória.');

    const categoriaFinal = selectedCategory === "Outros" ? otherCategory : selectedCategory;

    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error');
      return;
    }

    // ==============================
    //   CRIANDO O FORM DATA
    // ==============================
    const formData = new FormData();
    formData.append("idUsuario", 1);
    formData.append("andar", selectedLocation);
    formData.append("localizacao", categoriaFinal);
    formData.append("descricaoLocalizacao", selectedArea);
    formData.append("descricaoTicketUsuario", description);
    if (image) {
      formData.append("imagem", image); // envia a imagem real
    }

    try {
      const response = await fetch(
        'https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // ❗ Não definir Content-Type, o browser cuida disso
          },
          body: formData
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('Erro API:', text);
        throw new Error();
      }

      Swal.fire('Sucesso!', 'Report enviado com sucesso!', 'success');
      navigate('/reports');

    } catch (error) {
      console.error('Erro ao enviar report:', error);
      Swal.fire('Erro', 'Não foi possível enviar o report.', 'error');
    }
  };

  const renderSelect = (label, options, placeholder, value, onChange, disabled) => (
    <div className="mb-4">
      <label className="label">{label} <span className="text-red-500">*</span></label>
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-sky-700 border-b pb-3 text-center">
        Criar Ticket
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">

        {mensagem && (
          <div
            className={`text-sm p-3 rounded-lg font-medium text-center 
            ${mensagem.startsWith('🎉')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
          >
            {mensagem}
          </div>
        )}

        {renderSelect("Local", locations, "Selecione um local", selectedLocation, setSelectedLocation, false)}
        {selectedLocation &&
          renderSelect("Área", areas, "Selecione uma área", selectedArea, setSelectedArea, false)}
        {selectedArea &&
          renderSelect("Categoria", categories, "Selecione uma categoria", selectedCategory, setSelectedCategory, false)}

        {selectedCategory === "Outros" && (
          <div>
            <label className="label">Descreva Outros <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="input"
              placeholder="Descreva a categoria"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="label">Descrição <span className="text-red-500">*</span></label>
          <textarea
            className="input"
            rows="4"
            placeholder="Descreva o problema"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="label mb-2">Adicione uma Imagem (Opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />

          {preview && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Pré-visualização:</p>
              <img
                src={preview}
                alt="Pré-visualização"
                className="max-h-40 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

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
              type="reset"
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => {
                setSelectedLocation("");
                setSelectedArea("");
                setSelectedCategory("");
                setOtherCategory("");
                setDescription("");
                setImage(null);
                setPreview(null);
                setMensagem('');
              }}
            >
              Limpar
            </button>

            <button
              type="submit"
              className="btn-primary shadow-md"
            >
              Enviar
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
  
import React, { useState } from "react";
import FormCard from "../components/FormCard";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");

  const handleNext = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      Swal.fire("Erro", "Digite o nome de usuário.", "error");
      return;
    }

    Swal.fire({
      title: "Usuário encontrado!",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = "/forgot-password/reset";
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6">
      <FormCard title="Recuperar Senha">
        <p className="text-sm text-slate-500 mb-3">
          Digite seu nome de usuário para redefinir sua senha.
        </p>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="label">Nome de usuário</label>
            <input
              type="text"
              className="input"
              placeholder="ex: joaovitor"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button className="btn-primary w-full">Continuar</button>
        </form>

        <div className="text-center mt-4">
          <a href="/" className="text-sm text-[var(--primary)] underline">
            Voltar para o login
          </a>
        </div>
      </FormCard>
    </div>
  );
}

// ...existing code...
import React, { useState, useMemo } from "react";

const DEFAULT_FAQS = [
  {
    id: 1,
    question: "Como faço para solicitar um serviço pelo FixHub?",
    answer:
      "Crie uma conta, selecione a categoria do serviço, descreva o problema e envie. Profissionais cadastrados poderão enviar orçamentos.",

  },
  {
    id: 2,
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito, débito e transferência bancária. O pagamento pode ser feito diretamente pelo app/site conforme instruções do profissional.",
 
  },
  {
    id: 3,
    question: "Posso cancelar um pedido após aceitar um orçamento?",
    answer:
      "Sim, você pode solicitar cancelamento. Dependendo do status, pode haver cobrança parcial pelo trabalho já realizado.",
    category: "Report",
  },
  {
    id: 4,
    question: "Como funciona a garantia do serviço?",
    answer:
      "A garantia varia conforme o profissional e o tipo de serviço. Verifique os termos no perfil do profissional antes de contratar.",
  
  },
  {
    id: 5,
    question: "Como reporto um problema com um profissional?",
    answer:
      "Vá até o pedido em questão e use a opção 'Reportar' ou entre em contato com nosso suporte pelo email suporte@fixhub.com.",
    category: "Suporte",
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState("Geral");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(DEFAULT_FAQS.map((f) => f.category)));
    return ["Geral", ...cats];
  }, []);

  const filtered = useMemo(() => {
    return DEFAULT_FAQS.filter((f) =>
      category === "Geral" ? true : f.category === category
    );
  }, [category]);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="faq-page">
      <header className="faq-header">
        <h1>Perguntas Frequentes</h1>
        <p>Encontre respostas rápidas sobre uso.</p>
      </header>

      <section className="faq-controls">
        <div className="faq-cats" role="tablist" aria-label="Categorias">
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-btn ${c === category ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="faq-list" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="no-results">
            Nenhuma pergunta encontrada. Tente outra categoria ou entre em contato.
          </div>
        ) : (
          filtered.map((f) => (
            <article className="faq-item" key={f.id}>
              <button
                className="faq-question"
                aria-expanded={openId === f.id}
                onClick={() => toggle(f.id)}
              >
                <span>{f.question}</span>
                <span className="chev">{openId === f.id ? "−" : "+"}</span>
              </button>
              {openId === f.id && (
                <div className="faq-answer">
                  <p>{f.answer}</p>
                </div>
              )}
            </article>
          ))
        )}
      </section>

      <footer className="faq-footer">
        <p>
          Não encontrou o que procura? <a href="/contato">Fale com o suporte</a>.
        </p>
      </footer>

      <style>{`
        .faq-page { max-width: 900px; margin: 32px auto; padding: 0 16px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #1f2937; }
        .faq-header h1 { margin: 0 0 6px; font-size: 28px; }
        .faq-header p { margin: 0 0 18px; color: #4b5563; }

        .faq-controls { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
        .faq-cats { display:flex; gap:8px; flex-wrap:wrap; }
        .cat-btn { background:#f3f4f6; border: none; padding:6px 10px; border-radius:999px; cursor:pointer; color:#111827; }
        .cat-btn.active { background:#2563eb; color:white; }

        .faq-item { border-top:1px solid #e5e7eb; padding:12px 0; }
        .faq-question { width:100%; text-align:left; background:none; border:none; padding:0; display:flex; justify-content:space-between; align-items:center; font-size:16px; cursor:pointer; }
        .faq-question .chev { font-weight:700; margin-left:12px; }
        .faq-answer { margin-top:10px; color:#374151; }

        .no-results { padding:20px; text-align:center; color:#6b7280; }

        .faq-footer { margin-top:22px; color:#4b5563; }
        .faq-footer a { color:#2563eb; text-decoration:none; }

        @media (min-width:700px) {
          .faq-controls { flex-direction:row; align-items:center; justify-content:space-between; }
        }
      `}</style>
    </main>
  );
}
// ...existing code...
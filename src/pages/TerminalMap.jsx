import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const initialPanel = {
  title: 'Clique em um setor para mais detalhes',
  text: 'Use este mapa esquemático para se orientar nos três pavimentos principais do Terminal.',
};

export const TASKS_PI = [
  {
    id: 'politica-privacidade',
    name: 'Política de Privacidade',
    detail:
      'Sobre a exclusão da conta: ao apagar a conta, os dados pessoais não são imediatamente removidos do sistema, sendo mantidos conforme a política de retenção da plataforma.',
  },
  {
    id: 'esqueceu-senha',
    name: 'Tela de Esqueceu a Senha',
    detail:
      'Implementar a tela de recuperação de senha, permitindo que o usuário redefina seu acesso.',
  },
  {
    id: 'achados-perdidos',
    name: 'Achados e Perdidos',
    detail: `Funciona na Administração do terminal, atendimento – 08:00 às 12:00 e 13:00 às 17:00 (segunda a sexta-feira).
Telefone: (19) 3731-2930 opção 05.
Você também pode procurar seu pertence online.`,
  },
];

const sectorsData = {
  mezanino: [
    {
      id: 'alimentacao',
      name: 'Praça de Alimentação',
      detail:`
        Local com diversas opções de lanchonetes e restaurantes. Acesso por escadas e elevadores.,
       - McDonald's
       - Subway
       - Lanchonete X
       - Restaurante Y`,
    },
    {
      id: 'sanitarios',
      name: 'Sanitários / Banhos',
      detail: `O Terminal possui 8 pontos de sanitários:
- 4 comuns (2 no mezanino e 2 nas plataformas)
- 4 adaptados para pessoas com deficiência (2 no mezanino e 2 nas plataformas)

Banhos disponíveis nos sanitários do mezanino.
Preço: R$ 15,50 (banhos quentes)`,
      shops: '',
    },
    {
      id: 'informacoes',
      name: 'Serviços / Balcão de Informações',
      detail: `Localizado no saguão do mezanino, com funcionamento 24h.
Informações por telefone: (19) 3731-2930 (URA automática).
     - Balcão de Informações
     - Banca de Jornais
     - Loja de Presentes`,
    },
  ],

  terreo: [
    {
      id: 'bilheterias',
      name: 'Bilheterias',
      detail:
        `Guichês de venda de passagens de diversas empresas de ônibus rodoviário.
         - Viação Cometa
          - Viação 1001
          - Expresso do Sul
          - Viação Catarinense
          - entre outras...`
    },
    {
      id: 'caixa-estacionamento',
      name: 'Caixa Automático / Estacionamento',
      detail: `Caixa 24 Horas disponível.
Estacionamento com 307 vagas (12 PCD e 20 idosos).
Funcionamento 24h.

Preços:
- Meia hora: R$ 6,90
- 1h: R$ 12,45
- 2h: R$ 17,74
- 3h: R$ 23,03
- 4h: R$ 28,32
- 5h: R$ 33,61
- 6h: R$ 38,90
- Diária: R$ 43,79
- Mensalista: R$ 211,61
- Locatário: R$ 105,80
- Cartão de estacionamento: R$ 30,00

Mensalistas e locatários devem realizar cadastro presencial (seg-sex, 8h às 17h).

Formas de pagamento: Dinheiro, Débito, PIX, Conectar Car, Veloe e Sem Parar.`,
    },
    {
      id: 'acessibilidade',
      name: 'Acessibilidade',
      detail: `O terminal está adaptado para pessoas com deficiência:
- 2 cadeiras de rodas disponíveis
- 4 sanitários adaptados
- 2 escadas rolantes (mezanino) + 2 (plataformas)
- 2 elevadores para o mezanino + 2 para plataformas
- 12 vagas PCD e 20 vagas idosos no estacionamento
- Telefones públicos adaptados
- Piso tátil, sinalização em Braille e auxílio gratuito até embarque/desembarque.`,
      shops: '',
    },
    {
      id: 'guarda-volumes',
      name: 'Guarda-volumes',
      detail: `Localizado próximo ao balcão de informações, funcionamento 24h.
Preço: R$ 9,30 por volume (período de 8h).`,
      shops: '',
    },
  ],

  plataformas: [
    {
      id: 'embarque',
      name: 'Plataformas de Embarque',
      detail:
        'Área das baias de ônibus para embarque de passageiros. Possui sanitários comuns e adaptados, além de sinalização tátil.',
      shops: '',
    },
    {
      id: 'desembarque',
      name: 'Desembarque / Táxi',
      detail:
        'Área de chegada dos ônibus e ponto de táxi. Há sanitários e sinalização acessível.',
      shops: '',
    },
    {
      id: 'administracao',
      name: 'Outros',
      detail: `Setor de administração e Achados e Perdidos (seg-sex, 8h–12h / 13h–17h).
Telefone: (19) 3731-2930 opção 05.

Órgãos Fiscalizadores:
- ANTT: 0800-610300
- ARTESP: 0800-7278377
- EMDEC: (19) 3772-4067
- União: Express (0800 779 4990)`
   
    },
  ],
};

export default function TerminalMap({ compact = false }) {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset openId if needed, similar to previous panel reset
  }, [compact]);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const renderFloor = (floorName, sectors) => (
    <section className="tm-floor">
      <h2 className="tm-andar">{floorName}</h2>
      <div className="tm-layout">
        {sectors.map((s) => {
          const taskDetail = TASKS_PI.find((t) => t.id === s.id);
          const detail = taskDetail ? taskDetail.detail : s.detail;
          const title = taskDetail ? taskDetail.name : s.name;
          return (
            <article className="tm-item" key={s.id}>
              <button
                className="tm-question"
                aria-expanded={openId === s.id}
                onClick={() => toggle(s.id)}
              >
                <span>{s.name}</span>
                <span className="chev">{openId === s.id ? "−" : "+"}</span>
              </button>
              {openId === s.id && (
                <div className="tm-answer">
                  <p>{detail}</p>
                  {s.shops && s.shops.trim() !== '' && (
                    <div>
                      <h4>Lojas e Serviços Encontrados:</h4>
                      <ul className="tm-shops-list">
                        {s.shops.split(',').map((shop, i) => (
                          <li key={i}>{shop.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        .tm-container {
          font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
          background-color: #f8fbff;
          color: #1e293b;
          text-align: center;
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem;
        }

        .tm-container h1 {
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .tm-andar {
          color: #2563eb;
          text-align: left;
          margin-top: 1.5rem;
          border-bottom: 2px solid #dbeafe;
          padding-bottom: 0.5rem;
          font-weight: 500;
        }

        .tm-layout {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 1rem;
          gap: 1rem;
        }

        .tm-item {
          border-top: 1px solid #e5e7eb;
          padding: 12px 0;
        }

        .tm-question {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
        }

        .tm-question .chev {
          font-weight: 700;
          margin-left: 12px;
        }

        .tm-answer {
          margin-top: 10px;
          color: #374151;
        }

        .tm-answer p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #475569;
          white-space: pre-line;
        }

        .tm-shops-list {
          list-style: none;
          padding-left: 0;
          margin-top: 0.75rem;
        }

        .tm-shops-list li {
          background: #eff6ff;
          border-left: 4px solid #2563eb;
          margin-bottom: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
        }

        .tm-detalhes {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          text-align: left;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .tm-detalhes h3 {
          color: #1e3a8a;
          margin-top: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .tm-detalhes p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #475569;
          white-space: pre-line;
        }
      `}</style>

      <div className="tm-container">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            ← Voltar
          </button>
        </div>

        <h1>Terminal Rodoviário de Campinas (Dr. Ramos de Azevedo)</h1>

        <div className="tm-detalhes">
          <h3>Use este mapa esquemático para se orientar nos três pavimentos principais do Terminal.</h3>
          <p>Clique em um setor para expandir os detalhes.</p>
        </div>

        {renderFloor('1. Mezanino (Piso Superior) - Alimentação e Informações', sectorsData.mezanino)}
        {renderFloor('2. Térreo (Nível da Rua) - Bilheterias, Acessos e Serviços', sectorsData.terreo)}
        {renderFloor('3. Piso das Plataformas (Subsolo) - Embarque e Fiscalização', sectorsData.plataformas)}
      </div>
    </>
  );
}

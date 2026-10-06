import { useState, useRef } from 'react';
import {
  Activity,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  HeartPulse,
  MessageSquare,
  Shield,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { AzosChatbot } from './AzosChatbot';
import { AzosLogo } from './AzosLogo';

export function AzosSection() {
  const [chatActive, setChatActive] = useState(false);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  const handleStartChat = () => {
    setChatActive(true);
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  return (
    <section className="azos-section" id="cotacao-azos">
      <div className="section-wrap">
        {/* Authentic Azos Co-Branded Hero Banner */}
        <div className="azos-hero-banner">
          <div className="azos-hero-top-row">
            <div className="azos-badge-official">
              <span className="azos-pulse-dot" />
              <span>PARCERIA OFICIAL CREDENCIADA</span>
            </div>
            <div className="azos-susep-tag">
              <ShieldCheck size={14} />
              <span>Regulação SUSEP · Resseguro Munich Re & Swiss Re</span>
            </div>
          </div>

          <div className="azos-brand-lockup">
            <div className="brand-takeda-item">
              <img
                src="/images/takeda-logo-official.png"
                alt="Logo Takeda Seguros"
                className="takeda-hero-logo"
              />
              <span className="takeda-brand-text">
                Takeda <strong>Seguros</strong>
              </span>
            </div>
            <span className="brand-separator">✕</span>
            <div className="brand-azos-item">
              <AzosLogo height={22} color="#ffffff" className="azos-hero-svg-logo" />
            </div>
          </div>

          <h2 className="azos-hero-heading">
            Finalmente um seguro para a sua vida, <em>sem burocracia</em> e com preço justo.
          </h2>

          <p className="azos-hero-lead">
            A <strong>Takeda Seguros</strong> se une à <strong>Azos</strong>, a insurtech de seguro de vida mais inovadora do Brasil.
            Juntamos a tecnologia atuarial 100% digital com a consultoria humana especializada da Takeda.
          </p>

          {/* Azos Core Pillars */}
          <div className="azos-core-bullets">
            <div className="azos-bullet">
              <span className="azos-green-dot" />
              <span>Sem exames médicos</span>
            </div>
            <div className="azos-bullet">
              <span className="azos-green-dot" />
              <span>100% digital</span>
            </div>
            <div className="azos-bullet">
              <span className="azos-green-dot" />
              <span>Sem restrição por profissão</span>
            </div>
            <div className="azos-bullet">
              <span className="azos-green-dot" />
              <span>Aprovação em até 1 dia útil</span>
            </div>
          </div>

          {/* Azos Hero CTA */}
          <div className="azos-hero-actions">
            {!chatActive && (
              <button
                type="button"
                className="azos-btn-primary"
                onClick={handleStartChat}
              >
                <span>Simule agora com Consultor Takeda</span>
                <ArrowRight size={18} />
              </button>
            )}
            <div className="azos-google-rating-card">
              <div className="google-stars-row">
                <Star size={13} fill="#fbbc05" color="#fbbc05" />
                <Star size={13} fill="#fbbc05" color="#fbbc05" />
                <Star size={13} fill="#fbbc05" color="#fbbc05" />
                <Star size={13} fill="#fbbc05" color="#fbbc05" />
                <Star size={13} fill="#fbbc05" color="#fbbc05" />
                <strong>Nota 4,8</strong>
              </div>
              <small>+140 avaliações no Google</small>
            </div>
          </div>
        </div>

        {/* Azos Proof Metrics Row */}
        <div className="azos-proof-bar">
          <div className="azos-proof-item">
            <strong>Transparência</strong>
            <span>em todo o processo</span>
          </div>
          <div className="azos-proof-item">
            <strong>1 dia útil</strong>
            <span>para aprovação da apólice</span>
          </div>
          <div className="azos-proof-item">
            <strong>+ R$ 120 bilhões</strong>
            <span>em capital segurado</span>
          </div>
          <div className="azos-proof-item">
            <strong>Até R$ 2 Milhões</strong>
            <span>contratação 100% online</span>
          </div>
        </div>

        {/* Coberturas Oficiais Azos */}
        <div className="azos-section-header-compact">
          <span className="azos-category-pill">COBERTURAS AZOS</span>
          <h3>Proteção sob medida para cada momento da sua vida</h3>
          <p>
            Na Azos, você monta o seguro do seu jeito: escolha apenas o que faz sentido para você,
            sem vendas casadas ou pacotes engessados.
          </p>
        </div>

        <div className="azos-products-grid">
          {/* Vida / Morte */}
          <div className="azos-product-card card-vida">
            <div className="product-top">
              <div className="product-icon-wrap icon-green">
                <HeartHandshake size={22} />
              </div>
              <span className="product-badge badge-green">Mais Popular</span>
            </div>
            <h4>Seguro de Vida (Morte)</h4>
            <p>
              Garante que seus beneficiários recebam a indenização integral em caso de falecimento do titular por qualquer causa.
              Não entra em inventário e é isento de ITCMD.
            </p>
            <ul className="product-feature-list">
              <li><Check size={14} /> Até R$ 2.000.000 de capital</li>
              <li><Check size={14} /> Carência zero para acidentes</li>
              <li><Check size={14} /> Beneficiários de sua livre escolha</li>
            </ul>
          </div>

          {/* Doenças Graves */}
          <div className="azos-product-card card-dg">
            <div className="product-top">
              <div className="product-icon-wrap icon-burgundy">
                <HeartPulse size={22} />
              </div>
              <span className="product-badge badge-burgundy">Em Vida</span>
            </div>
            <h4>Doenças Graves</h4>
            <p>
              Receba o valor integral da cobertura em parcela única no diagnóstico de doenças graves (Câncer, AVC, Infarto, e mais)
              para usar como quiser: tratamentos, medicamentos ou viagens.
            </p>
            <ul className="product-feature-list">
              <li><Check size={14} /> Cobertura de até 13 patologias</li>
              <li><Check size={14} /> Indenização direta na sua conta</li>
              <li><Check size={14} /> Segunda opinião médica internacional</li>
            </ul>
          </div>

          {/* Invalidez por Acidente */}
          <div className="azos-product-card card-ipta">
            <div className="product-top">
              <div className="product-icon-wrap icon-teal">
                <Activity size={22} />
              </div>
              <span className="product-badge badge-teal">Autonomia</span>
            </div>
            <h4>Invalidez Total por Acidente</h4>
            <p>
              Proteja sua estabilidade e patrimônio. Se sofrer um acidente com perda total definitiva de funções vitais ou motoras,
              receba o capital contratado para adaptar sua vida.
            </p>
            <ul className="product-feature-list">
              <li><Check size={14} /> Pagamento imediato após laudo</li>
              <li><Check size={14} /> Sem carência após emissão</li>
              <li><Check size={14} /> Cobertura completa nacional</li>
            </ul>
          </div>

          {/* Assistência Funeral */}
          <div className="azos-product-card card-funeral">
            <div className="product-top">
              <div className="product-icon-wrap icon-amber">
                <Shield size={22} />
              </div>
              <span className="product-badge badge-amber">24 Horas</span>
            </div>
            <h4>Assistência Funeral Familiar</h4>
            <p>
              Diante do momento mais difícil, assistência completa 24h ou reembolso das despesas funerárias para titular,
              cônjuge e filhos, com respeito e dignidade.
            </p>
            <ul className="product-feature-list">
              <li><Check size={14} /> Prestação de serviço ou reembolso</li>
              <li><Check size={14} /> Translado nacional e funeral completo</li>
              <li><Check size={14} /> Suporte humanizado 24h</li>
            </ul>
          </div>
        </div>

        {/* Guardião Azos Exclusivity Card */}
        <div className="azos-guardian-card">
          <div className="guardian-content">
            <div className="guardian-tag">
              <Zap size={14} />
              <span>TECNOLOGIA EXCLUSIVA AZOS</span>
            </div>
            <h4>O Guardião: Seguro que realmente chega aos seus beneficiários</h4>
            <p>
              Milhões em indenizações no Brasil deixam de ser pagos porque a família não sabia da existência da apólice.
              Na Azos você indica um <strong>Guardião</strong> (uma pessoa de sua total confiança). Se algo acontecer,
              a Azos notifica o Guardião e também faz busca ativa periódica de CPF no sistema público.
            </p>
          </div>
          <div className="guardian-badge-side">
            <div className="guardian-pill">
              <Users size={16} />
              <span>Busca Ativa de CPF</span>
            </div>
            <div className="guardian-pill">
              <ShieldCheck size={16} />
              <span>Aviso Automático à Família</span>
            </div>
          </div>
        </div>

        {/* Diferencial Azos vs Mercado Tradicional */}
        <div className="azos-compare-section">
          <div className="compare-header">
            <span className="azos-category-pill">DIFERENCIAL</span>
            <h3>Por que contratar Azos com a Takeda?</h3>
            <p>Compare a experiência moderna da Azos com os seguros de vida tradicionais de banco.</p>
          </div>

          <div className="azos-compare-table">
            <div className="table-row table-head">
              <div className="table-col col-feature">Critério</div>
              <div className="table-col col-azos">
                <AzosLogo height={16} color="#005700" />
              </div>
              <div className="table-col col-traditional">Bancos Tradicionais</div>
            </div>

            <div className="table-row">
              <div className="table-col col-feature">Contratação das coberturas</div>
              <div className="table-col col-azos">
                <span className="tag-check"><Check size={15} /> 100% independente (sem venda casada)</span>
              </div>
              <div className="table-col col-traditional">
                <span className="tag-cross"><X size={15} /> Venda casada em pacotes prontos</span>
              </div>
            </div>

            <div className="table-row">
              <div className="table-col col-feature">Exames médicos e papelada</div>
              <div className="table-col col-azos">
                <span className="tag-check"><Check size={15} /> Zero exames invasivos</span>
              </div>
              <div className="table-col col-traditional">
                <span className="tag-cross"><X size={15} /> Exames de sangue e formulários lentos</span>
              </div>
            </div>

            <div className="table-row">
              <div className="table-col col-feature">Tempo de aprovação</div>
              <div className="table-col col-azos">
                <span className="tag-check"><Check size={15} /> 30 seg a 1 dia útil</span>
              </div>
              <div className="table-col col-traditional">
                <span className="tag-cross"><X size={15} /> De 15 a 30 dias úteis</span>
              </div>
            </div>

            <div className="table-row">
              <div className="table-col col-feature">Restrição por profissão</div>
              <div className="table-col col-azos">
                <span className="tag-check"><Check size={15} /> Sem restrição na maioria dos planos</span>
              </div>
              <div className="table-col col-traditional">
                <span className="tag-cross"><X size={15} /> Recusa ou sobretaxa para diversas profissões</span>
              </div>
            </div>

            <div className="table-row">
              <div className="table-col col-feature">Atendimento e consultoria</div>
              <div className="table-col col-azos">
                <span className="tag-check"><Check size={15} /> Consultor Takeda dedicado via WhatsApp</span>
              </div>
              <div className="table-col col-traditional">
                <span className="tag-cross"><X size={15} /> Gerentes com metas ou SAC impessoal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Chatbot Anchor Container */}
        <div className="azos-chatbot-section-wrapper" ref={chatSectionRef}>
          <div className="azos-chat-section-header">
            <div className="chat-section-heading">
              <div className="chat-co-brand-mini">
                <span className="chat-badge-dot" />
                <span className="chat-badge-text">SIMULAÇÃO AZOS & TAKEDA</span>
              </div>
              <h3>Calcule sua cobertura em tempo real</h3>
              <p>
                Responda algumas perguntas rápidas. Nosso motor calcula o valor exato na tabela Azos e
                você pode encaminhar sua proposta <strong>diretamente para o WhatsApp do consultor Takeda</strong>.
              </p>
            </div>

            {!chatActive && (
              <button
                type="button"
                className="azos-btn-primary azos-open-chat-btn"
                onClick={handleStartChat}
              >
                <span>Iniciar Simulação</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Chatbot Interface */}
          <div className={`azos-chatbot-embed-frame ${chatActive ? 'is-active' : ''}`}>
            {chatActive ? (
              <AzosChatbot />
            ) : (
              <div className="azos-chat-preview-placeholder" onClick={handleStartChat}>
                <div className="placeholder-avatar-ring">
                  <img
                    src="/images/takeda-logo-official.png"
                    alt="Consultor Takeda Seguros"
                    className="placeholder-avatar"
                  />
                </div>
                <h4>Consultor Digital Takeda & Azos</h4>
                <p>
                  Clique para iniciar. O cálculo leva menos de 1 minuto e apresenta as melhores
                  opções da tabela atuarial Azos com contratação pelo WhatsApp.
                </p>
                <button type="button" className="azos-btn-primary placeholder-cta">
                  <MessageSquare size={16} />
                  <span>Iniciar Simulação Agora</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

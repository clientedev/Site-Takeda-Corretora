import { useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'wouter';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  HeartHandshake,
  Instagram,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { InstagramEmbed } from '@/components/instagram-embed';
import { AzosSection } from '@/components/AzosSection';
import ServicesPage from '@/pages/services-page';
import NotFound from '@/pages/not-found';

const slides = [
  {
    src: '/images/hero-family-01.jpg',
    alt: 'Família reunida à beira-mar ao pôr do sol',
    label: 'O que você mais ama merece cuidado constante',
    position: 'center 58%',
  },
  {
    src: '/images/hero-family-02.jpg',
    alt: 'Família caminhando junta ao ar livre',
    label: 'Um futuro seguro construído lado a lado',
    position: 'center 52%',
  },
  {
    src: '/images/hero-health-03.jpg',
    alt: 'Mãos acolhendo com cuidado',
    label: 'Proteção também é estar presente em cada etapa',
    position: 'center 50%',
  },
];

const navItems = [
  ['#sobre', 'Sobre a Takeda'],
  ['#cotacao-azos', 'Simulação Azos'],
  ['#servicos', 'Serviços'],
  ['#vida', 'Seguro de vida'],
  ['#prev', 'Previdência'],
  ['#mitos', 'Mitos e verdades'],
  ['#faq', 'Dúvidas'],
];

const faqs = [
  [
    'Quanto custa um seguro de vida?',
    'O valor depende da sua idade, do valor da cobertura desejada e das garantias escolhidas. Por isso realizamos um diagnóstico sob medida para encontrar o plano que cabe no seu orçamento, sem coberturas desnecessárias.',
  ],
  [
    'Posso resgatar o dinheiro da previdência quando quiser?',
    'Sim, respeitando o prazo de carência estipulado em contrato (geralmente entre 60 e 180 dias após o aporte). Orientamos sobre a melhor tabela tributária para minimizar o imposto no resgate.',
  ],
  [
    'Qual a diferença entre previdência e poupança?',
    'A previdência privada oferece incentivos fiscais exclusivos (como dedução no PGBL ou tabela regressiva de até 10%), gestão profissional de rendimentos e sucessão patrimonial sem inventário.',
  ],
  [
    'Preciso pagar pela consultoria ou cotação?',
    'Não. O diagnóstico, as simulações e toda a conversa de orientação são 100% gratuitos e sem qualquer compromisso.',
  ],
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    intervalRef.current = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(intervalRef.current);
  }, [paused]);

  const changeSlide = (direction: number) =>
    setActive((current) => (current + direction + slides.length) % slides.length);

  return (
    <div
      className="hero-visual-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      aria-roledescription="carrossel"
      aria-label="Imagens sobre proteção e família"
    >
      <div className="hero-floating-badge">
        <Sparkles size={14} />
        <span>Consultoria Independente</span>
      </div>

      <div className="hero-slides-wrapper">
        {slides.map((slide, index) => (
          <div
            className={`hero-slide-item ${active === index ? 'is-active' : ''}`}
            key={slide.src}
            aria-hidden={active !== index}
          >
            <img src={slide.src} alt={slide.alt} style={{ objectPosition: slide.position }} />
            <div className="hero-slide-gradient" />
            <div className="hero-slide-content">
              <span className="hero-slide-kicker">Takeda Corretora · Proteção com Clareza</span>
              <strong className="hero-slide-title">{slide.label}</strong>
              <div className="hero-slide-counter">
                <span>0{index + 1}</span>
                <i />
                <span>0{slides.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-carousel-nav">
        <button
          type="button"
          className="hero-nav-arrow"
          aria-label="Imagem anterior"
          onClick={() => changeSlide(-1)}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="hero-dots-group" role="group" aria-label="Selecionar imagem">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`hero-dot-btn ${active === index ? 'is-active' : ''}`}
              aria-label={`Mostrar imagem ${index + 1}: ${slide.label}`}
              aria-current={active === index ? 'true' : undefined}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero-nav-arrow"
          aria-label="Próxima imagem"
          onClick={() => changeSlide(1)}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const featuredPosts = servicesData.filter((post) => post.featured);

  return (
    <div className="site-shell">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#inicio" aria-label="Takeda Seguros — início">
            <img
              src="/images/takeda-logo-official.png"
              alt="Logo Takeda Seguros"
              className="brand-logo-img"
            />
            <span className="wordmark-name">
              <span className="wordmark-title">Takeda <em>Seguros</em></span>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav
            id="main-navigation"
            className={menuOpen ? 'navigation is-open' : 'navigation'}
            aria-label="Navegação principal"
          >
            {navItems.map(([href, label]) => (
              <a key={href} href={href} onClick={closeMenu}>
                {label}
              </a>
            ))}
            <a className="nav-contact" href="#cotacao-azos" onClick={closeMenu}>
              Simular Seguro <ArrowRight size={15} />
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        {/* ========================================================
            1. HERO SECTION (ELEGANTE, PROFISSIONAL & INSTITUCIONAL)
           ======================================================== */}
        <section className="hero-section" id="inicio">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-pill">
                <ShieldCheck size={14} className="hero-pill-icon" />
                <span>CONSULTORIA ESPECIALIZADA EM PROTEÇÃO & PREVIDÊNCIA</span>
              </div>

              <h1>
                Planejamento que protege o seu presente e <i>eterniza o seu futuro.</i>
              </h1>

              <p className="hero-lede">
                Seguro de vida e previdência privada desenhados sob medida para o seu momento de vida.
                Sem letras miúdas, sem pressão comercial e com atendimento humano da consultoria ao resgate.
              </p>

              <div className="hero-actions">
                <a className="button button-hero" href="#cotacao-azos">
                  <span>Simulação Online Imediata</span>
                  <ArrowRight size={16} />
                </a>
                <a className="button button-hero-secondary" href="#sobre">
                  <span>Conhecer a Metodologia</span>
                  <ArrowDown size={15} />
                </a>
              </div>

              <div className="hero-trust-bar">
                <div className="trust-item">
                  <span className="trust-icon"><ShieldCheck size={18} /></span>
                  <div>
                    <strong>Multi-seguradoras</strong>
                    <small>As melhores do Brasil</small>
                  </div>
                </div>

                <div className="trust-item">
                  <span className="trust-icon"><HeartHandshake size={18} /></span>
                  <div>
                    <strong>Atendimento Próximo</strong>
                    <small>Sem robôs ou pressão</small>
                  </div>
                </div>

                <div className="trust-item">
                  <span className="trust-icon"><Award size={18} /></span>
                  <div>
                    <strong>Análise Gratuita</strong>
                    <small>Diagnóstico sem custo</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-visual-column">
              <HeroCarousel />
            </div>
          </div>

          <div className="hero-strip-bar">
            <div className="section-wrap hero-strip-inner">
              <div className="strip-item">
                <span className="strip-number">01</span>
                <span>Diagnóstico Patrimonial Isento</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-number">02</span>
                <span>Comparativo Entre Operadoras</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-number">03</span>
                <span>Planejamento Sucessório & Tributário</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-number">04</span>
                <span>Apoio Contínuo e Direto no Sinistro</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. SEÇÃO DE APRESENTAÇÃO COM A FOTO DA TAKEDA (EM SEGUNDO)
           ======================================================== */}
        <section className="about-section" id="sobre">
          <div className="section-wrap about-grid">
            <div className="about-portrait-card">
              <div className="portrait-image-wrapper">
                <img
                  src="/images/takeda-profile.png"
                  alt="Profissional da Takeda Corretora"
                  className="portrait-img"
                />
                <div className="portrait-badge">
                  <Sparkles size={14} />
                  <span>CONSULTORIA ESPECIALIZADA</span>
                </div>
              </div>

              <div className="portrait-quote-card">
                <p>
                  “Proteger não é vender apólice. É garantir que quem você ama continue seguro em qualquer momento da vida.”
                </p>
                <span className="portrait-author">Takeda Corretora</span>
              </div>
            </div>

            <div className="about-copy">
              <p className="eyebrow">
                Conheça a Takeda <span className="eyebrow-line" />
              </p>

              <h2>
                Uma consultora que explica <i>antes de propor qualquer plano.</i>
              </h2>

              <p className="about-lead">
                A Takeda Corretora nasceu da convicção de que seguro e previdência não precisam ser
                complexos, impessoais ou cheios de letras miúdas. Cada pessoa, família e carreira
                tem necessidades únicas.
              </p>

              <p>
                Trabalhamos com total independência das instituições financeiras tradicionais para
                oferecer a melhor relação entre custo e proteção, traduzindo termos técnicos em
                decisões simples e conscientes.
              </p>

              <div className="about-pillars">
                <div className="pillar-card">
                  <div className="pillar-icon"><HeartHandshake size={20} /></div>
                  <div>
                    <h4>Escuta & Diagnóstico Real</h4>
                    <p>Entendemos sua renda, dependentes e planos antes de sugerir qualquer produto.</p>
                  </div>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon"><ShieldCheck size={20} /></div>
                  <div>
                    <h4>Independência de Mercado</h4>
                    <p>Comparamos as principais seguradoras do país para garantir a cobertura ideal.</p>
                  </div>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon"><Award size={20} /></div>
                  <div>
                    <h4>Acompanhamento Vitalício</h4>
                    <p>Revisamos suas apólices ao longo dos anos e auxiliamos ativamente na hora do sinistro.</p>
                  </div>
                </div>
              </div>

              <div className="about-actions">
                <a className="button button-dark" href="#contato">
                  Agendar conversa sem compromisso <ArrowUpRight size={17} />
                </a>
                <span className="about-micro-note">
                  Atendimento direto e personalizado via WhatsApp ou Instagram
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. SEÇÃO EXCLUSIVA DE COTAÇÃO AZOS SEGUROS & TAKEDA
           ======================================================== */}
        <AzosSection />

        {/* ========================================================
            4. SEÇÃO "SERVIÇOS" COM POSTS DO INSTAGRAM
           ======================================================== */}
        <section className="services-section" id="servicos">
          <div className="section-wrap">
            <div className="services-intro-row">
              <div className="services-intro-heading">
                <p className="eyebrow">
                  Serviços & Soluções <span className="eyebrow-line" />
                </p>
                <h2>
                  Conheça nossos <i>Serviços</i> através do nosso Instagram
                </h2>
                <p>
                  Acompanhe conteúdos práticos e didáticos sobre as soluções de proteção patrimonial,
                  seguro de vida e previdência estratégica que oferecemos para você e sua família.
                </p>
              </div>

              <a
                href="https://www.instagram.com/takedacorretora_/"
                target="_blank"
                rel="noopener noreferrer"
                className="services-profile-badge"
              >
                <Instagram size={17} />
                <span>@takedacorretora_</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="services-cards-grid">
              {featuredPosts.map((post) => (
                <InstagramEmbed key={post.id} post={post} />
              ))}
            </div>

            <div className="services-footer-row">
              <div className="services-footer-note">
                <ShieldCheck size={18} />
                <span>Publicações oficiais com explicações claras e sem termos técnicos complicados.</span>
              </div>

              <div className="services-footer-actions">
                <a href="/servicos" className="button button-dark">
                  Ver todos os serviços <ArrowUpRight size={17} />
                </a>
                <a
                  href="https://www.instagram.com/takedacorretora_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-light"
                >
                  <Instagram size={16} />
                  Visitar Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. SEGURO DE VIDA
           ======================================================== */}
        <section className="life-section" id="vida">
          <div className="section-wrap life-grid">
            <div className="life-intro">
              <p className="eyebrow">
                Seguro de vida <span className="eyebrow-line" />
              </p>
              <h2>
                Proteção que cabe <i>na sua realidade.</i>
              </h2>
              <p className="section-lede">
                A cobertura certa começa entendendo a vida que você leva — e quem caminha ao seu lado.
              </p>
              <a className="underlined-link" href="#contato">
                Converse com a Takeda <ArrowUpRight size={17} />
              </a>
              <div className="life-mark">
                Cuidar do agora<br />
                <i>é proteger o depois.</i>
              </div>
            </div>

            <div className="life-details">
              <p>
                O valor da cobertura deve acompanhar o que a sua família precisaria para manter o padrão
                de vida, quitar dívidas e seguir com os planos. Fazemos essa conta com você, sem empurrar
                cobertura que você não precisa.
              </p>
              <ul className="benefit-list">
                <li>
                  <span><Check size={15} /></span>
                  Quem realmente precisa e quando o seguro vale a pena
                </li>
                <li>
                  <span><Check size={15} /></span>
                  Coberturas explicadas uma a uma, com exemplos práticos
                </li>
                <li>
                  <span><Check size={15} /></span>
                  Comparação entre seguradoras renomadas, não apenas uma opção
                </li>
                <li>
                  <span><Check size={15} /></span>
                  Acompanhamento dedicado e ajuda na hora de acionar o seguro
                </li>
              </ul>
              <div className="detail-foot">
                <ShieldCheck size={20} />
                <span>Sem pressa para decidir. Sem letra miúda na conversa.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. PREVIDÊNCIA PRIVADA
           ======================================================== */}
        <section className="pension-section" id="prev">
          <div className="section-wrap pension-wrap">
            <div className="pension-title">
              <div>
                <p className="eyebrow">
                  Previdência privada <span className="eyebrow-line" />
                </p>
                <h2>
                  VGBL ou PGBL?<br />
                  <i>A diferença que muda o seu imposto.</i>
                </h2>
              </div>
              <p className="section-lede">
                O melhor plano depende de como você declara o Imposto de Renda e do que espera para o futuro.
              </p>
            </div>

            <div className="comparison">
              <div className="comparison-intro">
                <span>01 — ENTENDA A DIFERENÇA</span>
                <p>Uma visão geral para a conversa começar com clareza.</p>
              </div>
              <div className="compare-head">
                <span>Critério</span>
                <strong>PGBL</strong>
                <strong>VGBL</strong>
              </div>
              <div className="compare-row">
                <strong>Para quem</strong>
                <span>Quem faz declaração completa do IR</span>
                <span>Quem faz declaração simplificada ou já usou o limite</span>
              </div>
              <div className="compare-row">
                <strong>Benefício fiscal</strong>
                <span>Dedução de até 12% da renda bruta anual</span>
                <span>Sem dedução na declaração</span>
              </div>
              <div className="compare-row">
                <strong>Imposto no resgate</strong>
                <span>Sobre o valor total resgatado</span>
                <span>Apenas sobre a rentabilidade gerada</span>
              </div>
              <div className="compare-row">
                <strong>Tabela de IR</strong>
                <span>Regressiva ou progressiva</span>
                <span>Regressiva ou progressiva</span>
              </div>
            </div>
            <p className="fine-print">
              Informações gerais para orientação. Avaliamos seu enquadramento tributário completo na cotação.
            </p>
          </div>
        </section>

        {/* ========================================================
            5. MITOS E VERDADES
           ======================================================== */}
        <section className="myths-section" id="mitos">
          <div className="section-wrap">
            <div className="section-heading inverted">
              <p className="eyebrow">
                Mitos e verdades <span className="eyebrow-line" />
              </p>
              <h2>
                O que quase ninguém te conta <i>antes de contratar.</i>
              </h2>
              <p>Vamos começar pelo que costuma ficar de fora da conversa bancária tradicional.</p>
            </div>

            <div className="myth-list">
              <article className="myth-row">
                <span className="myth-number">01</span>
                <h3>“Seguro é gasto.”</h3>
                <p>
                  É a troca de uma parcela pequena e previsível por uma proteção que sustenta a família
                  num momento em que ninguém está preparado. Gasto é o que não volta e não protege ninguém.
                </p>
              </article>
              <article className="myth-row">
                <span className="myth-number">02</span>
                <h3>“Seguro de vida é só para quem tem filhos.”</h3>
                <p>
                  Quem divide despesas, tem financiamentos, possui sócios ou cuida dos pais também depende
                  da sua renda. A pergunta certa é: quem sentiria sua falta financeira hoje?
                </p>
              </article>
              <article className="myth-row">
                <span className="myth-number">03</span>
                <h3>“Previdência privada é tudo igual.”</h3>
                <p>
                  VGBL e PGBL tratam o imposto de forma totalmente distinta e atendem a perfis diferentes.
                  Escolher sem orientação especializada custa caro na hora do resgate.
                </p>
              </article>
            </div>
          </div>
          <div className="myths-stamp" aria-hidden="true">
            CLAREZA<br />ACIMA DE<br />PROMESSAS
          </div>
        </section>

        {/* ========================================================
            6. COMO FUNCIONA
           ======================================================== */}
        <section className="process-section">
          <div className="section-wrap process-wrap">
            <div className="process-heading">
              <p className="eyebrow">
                Como funciona <span className="eyebrow-line" />
              </p>
              <h2>
                Do primeiro contato<br />
                à proteção <i>ativa.</i>
              </h2>
              <p>Um caminho transparente, acompanhado do início ao pós-venda.</p>
            </div>

            <div className="steps">
              {[
                ['01', 'Conversa sem compromisso', 'Você compartilha sua situação e nós escutamos: rotina, família, renda e metas.'],
                ['02', 'Análise e comparação', 'Montamos opções comparativas com valores e coberturas lado a lado, em linguagem clara.'],
                ['03', 'Contratação orientada', 'Cuidamos da burocracia e de cada detalhe da proposta junto à seguradora escolhida.'],
                ['04', 'Acompanhamento contínuo', 'Revisamos o seu plano quando sua vida evolui. Atendimento próximo e prioritário no sinistro.'],
              ].map(([num, title, body]) => (
                <article className="step" key={num}>
                  <span className="step-index">{num}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  <ArrowUpRight className="step-arrow" size={19} />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            7. PERGUNTAS FREQUENTES
           ======================================================== */}
        <section className="faq-section" id="faq">
          <div className="section-wrap faq-wrap">
            <div className="faq-heading">
              <p className="eyebrow">
                Dúvidas frequentes <span className="eyebrow-line" />
              </p>
              <h2>
                Perguntas que todo mundo <i>faz.</i>
              </h2>
              <p>Se a sua dúvida não estiver aqui, envie uma mensagem. Respondemos sem qualquer compromisso.</p>
            </div>

            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <details key={question} className="faq-item">
                  <summary>
                    <span className="faq-index">0{index + 1}</span>
                    {question}
                    <ChevronDown className="faq-chevron" size={20} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            8. CONTATO
           ======================================================== */}
        <section className="contact-section" id="contato">
          <div className="section-wrap contact-wrap">
            <div className="contact-copy">
              <p className="eyebrow">
                Contato <span className="eyebrow-line" />
              </p>
              <h2>
                Vamos planejar <i>o seu futuro?</i>
              </h2>
              <p>
                Escolha o canal mais prático para você. Atendimento direto e humanizado para tirar
                todas as suas dúvidas.
              </p>

              <a
                className="instagram-link"
                href="https://www.instagram.com/takedacorretora_/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="instagram-icon">ig</span>
                <span>
                  <small>ACOMPANHE NO INSTAGRAM</small>
                  @takedacorretora_
                </span>
                <ArrowUpRight size={18} />
              </a>

              <div className="contact-note">
                <HeartHandshake size={20} />
                <span>Sem cadastros longos ou ligações insistentes. Fale direto com a Takeda.</span>
              </div>
            </div>

            <div className="contact-card">
              <span className="contact-card-no">ATENDIMENTO CONSULTIVO</span>
              <div className="contact-card-icon">
                <HeartHandshake size={24} />
              </div>
              <h3>Comece com uma pergunta.</h3>
              <p>
                Conte o que você está buscando ou tire suas dúvidas sobre sua apólice atual.
                A Takeda avalia com calma e transparência.
              </p>
              <a
                className="button button-light"
                href="https://www.instagram.com/takedacorretora_/"
                target="_blank"
                rel="noreferrer"
              >
                Falar pelo Instagram <ArrowUpRight size={17} />
              </a>
              <small>Atendimento ético e confidencial.</small>
              <span className="card-corner" aria-hidden="true" />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="wordmark footer-mark" href="#inicio">
            <img
              src="/images/takeda-logo-official.png"
              alt="Logo Takeda Seguros"
              className="brand-logo-img footer-logo-img"
            />
            <span className="wordmark-name">
              Takeda <em>Seguros</em>
              <small>PROTEÇÃO COM CLAREZA</small>
            </span>
          </a>
          <p>
            Seguro de vida e previdência privada<br />
            com atendimento consultivo e independente.
          </p>
          <a href="https://www.instagram.com/takedacorretora_/" target="_blank" rel="noreferrer">
            @takedacorretora_ <ArrowUpRight size={14} />
          </a>
          <span className="copyright">© {new Date().getFullYear()} Takeda Corretora · Todos os direitos reservados</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/servicos" component={ServicesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

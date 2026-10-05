import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, HeartHandshake, Menu, ShieldCheck, X } from 'lucide-react';

const slides = [
  { src: '/images/hero-family-01.jpg', alt: 'Família reunida à beira-mar ao pôr do sol', label: 'O que importa merece cuidado', position: 'center 58%' },
  { src: '/images/hero-family-02.jpg', alt: 'Família caminhando junta ao ar livre', label: 'Um futuro construído lado a lado', position: 'center 52%' },
  { src: '/images/hero-health-03.jpg', alt: 'Mãos acolhendo com cuidado', label: 'Proteção também é presença', position: 'center 50%' },
];
const navItems = [['#mitos', 'Mitos e verdades'], ['#vida', 'Seguro de vida'], ['#prev', 'Previdência'], ['#sobre', 'Sobre'], ['#faq', 'Dúvidas']];
const faqs = [
  ['Quanto custa um seguro de vida?', 'Depende da idade, do valor da cobertura e das garantias escolhidas. Por isso fazemos uma cotação personalizada, sem valor “padrão”.'],
  ['Posso resgatar o dinheiro da previdência quando quiser?', 'Em geral sim, respeitando o prazo de carência do plano. Há impacto no imposto conforme o tempo de aplicação e a tabela escolhida.'],
  ['Qual a diferença entre previdência e poupança?', 'A previdência tem regras fiscais próprias e foco em longo prazo, e pode incluir proteção. Já a poupança é uma reserva simples, de liquidez imediata.'],
  ['Preciso pagar para a cotação?', 'Não. A conversa e a cotação não têm custo nem compromisso.'],
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
    intervalRef.current = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(intervalRef.current);
  }, [paused]);
  const changeSlide = (direction: number) => setActive((current) => (current + direction + slides.length) % slides.length);
  return <div className="hero-visual" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} aria-roledescription="carrossel" aria-label="Imagens sobre proteção e família">
    {slides.map((slide, index) => <div className={`hero-slide ${active === index ? 'is-active' : ''}`} key={slide.src} aria-hidden={active !== index}>
      <img src={slide.src} alt={slide.alt} style={{ objectPosition: slide.position }} />
      <div className="image-shade" />
      <div className="visual-copy"><span className="visual-kicker">Takeda Corretora · cuidado em cada etapa</span><strong>{slide.label}</strong><span className="visual-counter">0{index + 1}<i />0{slides.length}</span></div>
    </div>)}
    <div className="carousel-controls">
      <button type="button" aria-label="Imagem anterior" onClick={() => changeSlide(-1)}><ArrowLeft size={18} /></button>
      <div className="carousel-dots" role="group" aria-label="Selecionar imagem">{slides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Mostrar imagem ${index + 1}: ${slide.label}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)} />)}</div>
      <button type="button" aria-label="Próxima imagem" onClick={() => changeSlide(1)}><ArrowRight size={18} /></button>
    </div>
    <span className="photo-note">Proteção começa com uma boa conversa.</span>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <div className="site-shell">
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#inicio" aria-label="Takeda Corretora — início"><span className="wordmark-name">Takeda <em>Corretora</em><small>PROTEÇÃO COM CLAREZA</small></span></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Navegação principal">
          {navItems.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
          <a className="nav-contact" href="#contato" onClick={closeMenu}>Vamos conversar <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
    <main id="conteudo">
      <section className="hero-section" id="inicio">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="eyebrow"><span /> Seguro · Previdência · Confiança</p>
            <h1>Seu futuro merece <i>cuidado.</i><br />Sua família, <span>tranquilidade.</span></h1>
            <p className="hero-lede">Seguro de vida e previdência privada explicados do jeito que deveriam ser: com clareza, responsabilidade e sem pressão.</p>
            <div className="hero-actions"><a className="button button-dark" href="#contato">Pedir uma cotação <ArrowUpRight size={17} /></a><a className="text-link" href="#sobre">Conheça a Takeda <ArrowDown size={15} /></a></div>
            <div className="hero-promise"><span className="promise-icon"><HeartHandshake size={19} /></span><span>Uma conversa honesta, no seu tempo.</span></div>
          </div>
          <HeroCarousel />
          <div className="hero-side-note">CUIDAR É PENSAR ADIANTE <span>— 01 / 03</span></div>
        </div>
      </section>

      <section className="myths-section" id="mitos">
        <div className="section-wrap">
          <div className="section-heading inverted">
            <p className="eyebrow">Mitos e verdades <span className="eyebrow-line" /></p>
            <h2>O que quase ninguém te conta <i>antes de contratar.</i></h2>
            <p>Vamos começar pelo que costuma ficar de fora da conversa.</p>
          </div>
          <div className="myth-list">
            <article className="myth-row"><span className="myth-number">01</span><h3>“Seguro é gasto.”</h3><p>É a troca de uma parcela previsível por uma proteção que sustenta a família num momento em que ninguém está preparado. Gasto é o que não volta e não protege nada.</p></article>
            <article className="myth-row"><span className="myth-number">02</span><h3>“Seguro de vida é só para quem tem filhos.”</h3><p>Quem divide contas, tem dívidas ou cuida dos pais também depende da sua renda. A pergunta certa é: quem sentiria a sua falta no bolso?</p></article>
            <article className="myth-row"><span className="myth-number">03</span><h3>“Previdência privada é tudo igual.”</h3><p>VGBL e PGBL tratam o imposto de forma diferente e servem a perfis diferentes. Escolher errado custa caro lá na frente.</p></article>
          </div>
        </div>
        <div className="myths-stamp" aria-hidden="true">CLAREZA<br />ACIMA DE<br />PROMESSAS</div>
      </section>

      <section className="life-section" id="vida">
        <div className="section-wrap life-grid">
          <div className="life-intro"><p className="eyebrow">Seguro de vida <span className="eyebrow-line" /></p><h2>Proteção que cabe <i>na sua realidade.</i></h2><p className="section-lede">A cobertura certa começa entendendo a vida que você leva — e quem caminha ao seu lado.</p><a className="underlined-link" href="#contato">Converse com a Takeda <ArrowUpRight size={17} /></a><div className="life-mark">Cuidar do agora<br /><i>é proteger o depois.</i></div></div>
          <div className="life-details"><p>O valor da cobertura deve acompanhar o que a sua família precisaria para manter o padrão de vida, quitar dívidas e seguir com os planos. Fazemos essa conta com você, sem empurrar cobertura que você não precisa.</p>
            <ul className="benefit-list"><li><span><Check size={15} /></span>Quem realmente precisa e quando o seguro vale a pena</li><li><span><Check size={15} /></span>Coberturas explicadas uma a uma, com exemplos</li><li><span><Check size={15} /></span>Comparação entre seguradoras, não só a primeira opção</li><li><span><Check size={15} /></span>Acompanhamento e ajuda na hora de acionar o seguro</li></ul>
            <div className="detail-foot"><ShieldCheck size={20} /><span>Sem pressa para decidir. Sem letra miúda na conversa.</span></div>
          </div>
        </div>
      </section>

      <section className="pension-section" id="prev">
        <div className="section-wrap pension-wrap">
          <div className="pension-title"><div><p className="eyebrow">Previdência privada <span className="eyebrow-line" /></p><h2>VGBL ou PGBL?<br /><i>A diferença que muda o seu imposto.</i></h2></div><p className="section-lede">O melhor plano depende de como você declara o Imposto de Renda e do que espera para o futuro.</p></div>
          <div className="comparison">
            <div className="comparison-intro"><span>01 — ENTENDA A DIFERENÇA</span><p>Uma visão geral para a conversa começar com o pé direito.</p></div>
            <div className="compare-head"><span>Critério</span><strong>PGBL</strong><strong>VGBL</strong></div>
            <div className="compare-row"><strong>Para quem</strong><span>Quem faz declaração completa do IR</span><span>Quem faz declaração simplificada ou já usou o limite</span></div>
            <div className="compare-row"><strong>Benefício fiscal</strong><span>Dedução de até 12% da renda bruta anual</span><span>Sem dedução na declaração</span></div>
            <div className="compare-row"><strong>Imposto no resgate</strong><span>Sobre o valor total</span><span>Apenas sobre o rendimento</span></div>
            <div className="compare-row"><strong>Tabela de IR</strong><span>Regressiva ou progressiva</span><span>Regressiva ou progressiva</span></div>
          </div>
          <p className="fine-print">Informações gerais, não substituem uma análise do seu caso. Consulte as regras vigentes antes de decidir.</p>
        </div>
      </section>

      <section className="process-section">
        <div className="section-wrap process-wrap">
          <div className="process-heading"><p className="eyebrow">Como funciona <span className="eyebrow-line" /></p><h2>Do primeiro contato<br />à proteção <i>ativa.</i></h2><p>Um caminho simples, acompanhado do início ao depois.</p></div>
          <div className="steps">
            {[['01', 'Conversa sem compromisso', 'Você conta sua situação e a gente escuta: família, renda, objetivos.'], ['02', 'Análise e comparação', 'Montamos opções com valores e coberturas lado a lado, em linguagem simples.'], ['03', 'Contratação acompanhada', 'Cuidamos da papelada e de cada detalhe da proposta.'], ['04', 'Acompanhamento contínuo', 'Revisamos o seu plano quando a vida muda. Atendimento personalizado de verdade.']].map(([num, title, body]) => <article className="step" key={num}><span className="step-index">{num}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight className="step-arrow" size={19} /></article>)}
          </div>
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="section-wrap about-grid">
          <div className="portrait-wrap"><img src="/images/takeda-profile.png" alt="Retrato da profissional da Takeda Corretora" /><span className="portrait-label">ATENDIMENTO PRÓXIMO.<br />DECISÕES BEM INFORMADAS.</span><span className="portrait-caption">Takeda Corretora</span></div>
          <div className="about-copy"><p className="eyebrow">Sobre <span className="eyebrow-line" /></p><h2>Uma corretora que explica <i>antes de vender.</i></h2><p>A Takeda Corretora nasceu da convicção de que seguro e previdência não precisam ser confusos. Trabalhamos com responsabilidade e visão de longo prazo, e a sua decisão é sempre mais importante que a venda.</p><p>Aqui, cada conversa começa com escuta. A gente traduz o que parece complicado, apresenta caminhos possíveis e respeita o seu tempo para decidir.</p><div className="about-signature"><span>Takeda Corretora<small>Clareza para cuidar do que importa.</small></span></div></div>
        </div>
      </section>

      <section className="faq-section" id="faq"><div className="section-wrap faq-wrap"><div className="faq-heading"><p className="eyebrow">Dúvidas frequentes <span className="eyebrow-line" /></p><h2>Perguntas que todo mundo <i>faz.</i></h2><p>Se a sua não estiver aqui, pode perguntar. Sem compromisso.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} className="faq-item"><summary><span className="faq-index">0{index + 1}</span>{question}<ChevronDown className="faq-chevron" size={20} /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="contact-section" id="contato"><div className="section-wrap contact-wrap">
        <div className="contact-copy"><p className="eyebrow">Contato <span className="eyebrow-line" /></p><h2>Vamos conversar sobre <i>o seu futuro?</i></h2><p>Escolha o caminho mais confortável para você. Estamos no Instagram para conversar e compartilhar informação.</p><a className="instagram-link" href="https://www.instagram.com/takedacorretora_/" target="_blank" rel="noreferrer"><span className="instagram-icon">ig</span><span><small>ACOMPANHE NO INSTAGRAM</small>@takedacorretora_</span><ArrowUpRight size={18} /></a><div className="contact-note"><HeartHandshake size={20} /><span>Sem formulário que some no caminho. Fale diretamente pelo Instagram.</span></div></div>
        <div className="contact-card"><span className="contact-card-no">UMA CONVERSA, SEM PRESSÃO</span><div className="contact-card-icon"><HeartHandshake size={24} /></div><h3>Comece com uma pergunta.</h3><p>Conte o que você está buscando — ou o que ainda não entendeu. A Takeda explica com calma.</p><a className="button button-light" href="https://www.instagram.com/takedacorretora_/" target="_blank" rel="noreferrer">Abrir Instagram <ArrowUpRight size={17} /></a><small>Não enviamos seus dados a lugar nenhum.</small><span className="card-corner" aria-hidden="true" /></div>
      </div></section>
    </main>
    <footer className="site-footer"><div className="section-wrap footer-inner"><a className="wordmark footer-mark" href="#inicio"><span className="wordmark-name">Takeda <em>Corretora</em><small>PROTEÇÃO COM CLAREZA</small></span></a><p>Seguro de vida e previdência privada<br />com atendimento personalizado.</p><a href="https://www.instagram.com/takedacorretora_/" target="_blank" rel="noreferrer">@takedacorretora_ <ArrowUpRight size={14} /></a><span className="copyright">© {new Date().getFullYear()} Takeda Corretora</span></div></footer>
  </div>;
}

export default App;

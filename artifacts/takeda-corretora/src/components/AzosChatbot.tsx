import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import {
  startSimulation,
  answerSimulation,
  saveLeadLocally,
  SimulationStepResponse,
  SimulationResult,
} from '@/services/simulationApi';
import { AzosLogo } from './AzosLogo';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  contextExplanation?: string;
  isResult?: boolean;
  resultData?: SimulationResult;
}

interface AzosChatbotProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AzosChatbot({ onClose, isModal = false }: AzosChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<SimulationStepResponse | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Input states
  const [textInput, setTextInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [sliderCapital, setSliderCapital] = useState(500000);
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [nameCollected, setNameCollected] = useState('');

  const [showFallbackOption, setShowFallbackOption] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll ONLY inside the messages container - NEVER scrolls the page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  // Focus input without shifting window scroll position
  useEffect(() => {
    if (currentStep?.inputType === 'text' || currentStep?.inputType === 'date') {
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 150);
    }
  }, [currentStep]);

  // Format time
  const getTimeString = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Mask for Date (DD/MM/AAAA)
  const handleDateMask = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 8);
    let masked = clean;
    if (clean.length > 2) masked = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    if (clean.length > 4) masked = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
    setDateInput(masked);
  };

  // Mask for Phone (11) 99999-9999
  const handlePhoneMask = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 11);
    let masked = clean;
    if (clean.length > 2) masked = `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length > 7) masked = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    setPhoneInput(masked);
  };

  // Start simulation on mount
  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    setIsTyping(true);
    setMessages([]);
    setShowFallbackOption(false);

    try {
      const step = await startSimulation({ providerId: 'azos' });
      setSessionId(step.sessionId);
      setCurrentStep(step);

      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: step.question,
            contextExplanation: step.contextExplanation,
            time: getTimeString(),
          },
        ]);
      }, 700);
    } catch {
      setIsTyping(false);
      setShowFallbackOption(true);
    }
  };

  // Dispatch answer to API
  const handleSendAnswer = async (
    answerValue: string | number | boolean | Record<string, unknown>,
    displayText: string
  ) => {
    if (!currentStep) return;

    // Add user message
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: displayText,
      time: getTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Save name if at name step
    if (currentStep.stepId === 'name') {
      setNameCollected(String(answerValue));
      saveLeadLocally({
        name: String(answerValue),
        phone: '',
        provider: 'azos',
      });
    }

    try {
      const nextStep = await answerSimulation({
        sessionId,
        stepId: currentStep.stepId,
        answer: answerValue,
      });

      // Clear current inputs
      setTextInput('');
      setDateInput('');

      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep(nextStep);

        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: nextStep.question,
          contextExplanation: nextStep.contextExplanation,
          time: getTimeString(),
          isResult: nextStep.isFinished,
          resultData: nextStep.result,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 850);
    } catch {
      setIsTyping(false);
      setShowFallbackOption(true);
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={`azos-chatbot-card ${isModal ? 'is-modal' : ''}`}>
      {/* Chatbot Top Header */}
      <div className="azos-chatbot-header">
        <div className="azos-chatbot-identity">
          <div className="azos-avatar-wrap">
            <img
              src="/images/takeda-profile.png"
              alt="Consultor Takeda"
              className="azos-avatar-img"
              onError={(e) => {
                // Graceful fallback to icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="azos-status-online" title="Online" />
          </div>

          <div className="azos-header-copy">
            <div className="azos-header-title-row">
              <h3>Consultor Takeda</h3>
              <div className="azos-chatbot-partner-pill">
                <AzosLogo height={13} color="#005700" />
              </div>
            </div>
            <p className="azos-header-subtitle">
              Simulação atuarial oficial Azos com contratação no WhatsApp
            </p>
          </div>
        </div>

        <div className="azos-header-actions">
          <button
            type="button"
            className="azos-icon-btn"
            title="Reiniciar Simulação"
            onClick={initChat}
          >
            <RefreshCw size={15} />
          </button>
          {onClose && (
            <button
              type="button"
              className="azos-icon-btn"
              title="Fechar"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Security Banner */}
      <div className="azos-security-strip">
        <ShieldCheck size={13} />
        <span>Garantido por Munich Re e regulamentado pela SUSEP · Sem carência p/ acidentes</span>
      </div>

      {/* Chat Messages Body */}
      <div className="azos-messages-container" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`azos-message-row ${msg.sender === 'user' ? 'is-user' : 'is-bot'}`}>
            {msg.sender === 'bot' && (
              <div className="azos-msg-avatar">
                <img
                  src="/images/takeda-logo-official.png"
                  alt="Takeda"
                  className="bot-avatar-emblem"
                />
              </div>
            )}

            <div className="azos-msg-bubble">
              <div className="azos-msg-text">
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {msg.contextExplanation && !msg.isResult && (
                <div className="azos-context-badge">
                  <HelpCircle size={12} />
                  <span>{msg.contextExplanation}</span>
                </div>
              )}

              {/* Proposal Results Card */}
              {msg.isResult && msg.resultData && (
                <div className="azos-results-card">
                  <div className="azos-results-header">
                    <div>
                      <span className="azos-results-kicker">PROPOSTAS OFICIAIS AZOS</span>
                      <h4>Opções calculadas para {msg.resultData.clientName}</h4>
                      <small>Idade: {msg.resultData.age} anos · Capital: {formatBRL(msg.resultData.capital)}</small>
                    </div>
                  </div>

                  <div className="azos-plans-grid">
                    {msg.resultData.plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`azos-plan-card ${plan.id === 'recomendado' ? 'is-featured' : ''}`}
                      >
                        {plan.badge && <span className="azos-plan-badge">{plan.badge}</span>}
                        <h5 className="azos-plan-title">{plan.title}</h5>

                        <div className="azos-plan-price">
                          <span className="price-prefix">R$</span>
                          <strong className="price-value">{plan.monthlyPrice}</strong>
                          <span className="price-period">/mês</span>
                        </div>

                        <ul className="azos-plan-coverages">
                          {plan.coverages.map((cov, i) => (
                            <li key={i} className={cov.highlight ? 'is-highlight' : ''}>
                              <CheckCircle2 size={13} className="coverage-check" />
                              <span className="coverage-name">{cov.name}:</span>
                              <strong className="coverage-val">{cov.value}</strong>
                            </li>
                          ))}
                        </ul>

                        <div className="azos-plan-cta">
                          <a
                            href={plan.contractUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-azos-contract"
                          >
                            <span>Contratar via WhatsApp</span>
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="azos-results-footer-cta">
                    <div className="azos-results-human-note">
                      <MessageSquare size={16} />
                      <div>
                        <strong>Dúvidas sobre coberturas ou quer personalizar valores?</strong>
                        <p>Nosso consultor humano está disponível no WhatsApp para te ajudar a escolher.</p>
                      </div>
                    </div>
                    <a
                      href={msg.resultData.whatsappMessage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-whatsapp-lead"
                    >
                      <span>Falar com Corretor Takeda no WhatsApp</span>
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              )}

              <span className="azos-msg-time">{msg.time}</span>
            </div>

            {msg.sender === 'user' && (
              <div className="azos-msg-avatar is-user-avatar">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="azos-message-row is-bot">
            <div className="azos-msg-avatar">
              <Shield size={14} />
            </div>
            <div className="azos-typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Fallback Option */}
        {showFallbackOption && (
          <div className="azos-fallback-card">
            <Zap size={20} className="fallback-icon" />
            <div>
              <strong>Parece que a seguradora demorou para responder.</strong>
              <p>Quer que nosso corretor finalize a cotação com as mesmas condições pelo WhatsApp?</p>
            </div>
            <a
              href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                `Olá! Estava simulando no site da Takeda (Azos) e gostaria que um consultor finalizasse minha cotação personalizada.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-dark fallback-btn"
            >
              <span>Continuar pelo WhatsApp</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        )}
      </div>

      {/* Interactive Contextual Input Bar */}
      {!currentStep?.isFinished && currentStep && (
        <div className="azos-chatbot-controls">
          {/* STEP: TEXT (NAME) */}
          {currentStep.inputType === 'text' && (
            <form
              className="azos-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (textInput.trim().length >= 2) {
                  handleSendAnswer(textInput.trim(), textInput.trim());
                }
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="azos-text-input"
                placeholder="Digite seu nome completo..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                autoComplete="name"
              />
              <button
                type="submit"
                className="azos-submit-btn"
                disabled={textInput.trim().length < 2 || isTyping}
              >
                <span>Enviar</span>
                <Send size={15} />
              </button>
            </form>
          )}

          {/* STEP: DATE (BIRTHDATE) */}
          {currentStep.inputType === 'date' && (
            <form
              className="azos-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (dateInput.length === 10) {
                  handleSendAnswer(dateInput, dateInput);
                }
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="azos-text-input"
                placeholder="Ex: 15/08/1988"
                value={dateInput}
                onChange={(e) => handleDateMask(e.target.value)}
                maxLength={10}
              />
              <button
                type="submit"
                className="azos-submit-btn"
                disabled={dateInput.length !== 10 || isTyping}
              >
                <span>Confirmar Data</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* STEP: CHOICE (GENDER, SMOKER, OBJECTIVE) */}
          {currentStep.inputType === 'choice' && currentStep.options && (
            <div className="azos-choices-group">
              {currentStep.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="azos-choice-btn"
                  disabled={isTyping}
                  onClick={() => handleSendAnswer(opt.value, opt.label)}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP: PROFESSION */}
          {currentStep.inputType === 'profession' && currentStep.options && (
            <div className="azos-profession-group">
              <span className="control-label">Selecione sua ocupação:</span>
              <div className="profession-chips-grid">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="profession-chip"
                    disabled={isTyping}
                    onClick={() => handleSendAnswer(opt.value, opt.label)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: SLIDER (CAPITAL SEGURADO) */}
          {currentStep.inputType === 'slider' && currentStep.sliderConfig && (
            <div className="azos-slider-control">
              <div className="slider-header-row">
                <span className="slider-caption">Capital Segurado Selecionado:</span>
                <strong className="slider-value-display">{formatBRL(sliderCapital)}</strong>
              </div>

              <input
                type="range"
                className="azos-range-input"
                min={currentStep.sliderConfig.min}
                max={currentStep.sliderConfig.max}
                step={currentStep.sliderConfig.step}
                value={sliderCapital}
                onChange={(e) => setSliderCapital(Number(e.target.value))}
              />

              <div className="slider-quick-chips">
                {[200000, 350000, 500000, 1000000, 2000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`slider-chip ${sliderCapital === val ? 'is-active' : ''}`}
                    onClick={() => setSliderCapital(val)}
                  >
                    {formatBRL(val)}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="button button-dark slider-confirm-btn"
                disabled={isTyping}
                onClick={() => handleSendAnswer(sliderCapital, `Capital desejado: ${formatBRL(sliderCapital)}`)}
              >
                <span>Calcular com {formatBRL(sliderCapital)}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* STEP: CONTACT (WHATSAPP + EMAIL) */}
          {currentStep.inputType === 'contact' && (
            <form
              className="azos-contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (phoneInput.length >= 14 && emailInput.includes('@')) {
                  handleSendAnswer(
                    { phone: phoneInput, email: emailInput },
                    `WhatsApp: ${phoneInput} | E-mail: ${emailInput}`
                  );
                }
              }}
            >
              <div className="contact-inputs-grid">
                <input
                  type="tel"
                  className="azos-text-input"
                  placeholder="WhatsApp com DDD (Ex: 11 99999-9999)"
                  value={phoneInput}
                  onChange={(e) => handlePhoneMask(e.target.value)}
                  maxLength={15}
                  required
                />
                <input
                  type="email"
                  className="azos-text-input"
                  placeholder="Seu melhor e-mail (opcional)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="button button-dark contact-submit-btn"
                disabled={phoneInput.length < 14 || !emailInput.includes('@') || isTyping}
              >
                <span>Ver Minha Cotação Oficial Azos</span>
                <Sparkles size={16} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Chatbot Footer Micro Note */}
      <div className="azos-chatbot-footbar">
        <span>🔒 Criptografia SSL 256 bits · Sem spam · Seus dados protegidos</span>
        <a
          href="https://www.azos.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="azos-official-badge"
        >
          Parceria Oficial <strong>Azos Seguros</strong>
        </a>
      </div>
    </div>
  );
}

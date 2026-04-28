import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CATEGORIES,
  CHATBOT_SUGGESTED_PROMPTS,
  SUPPORTED_LANGUAGES,
} from '@shared/siteContent';
import { inferLegalCategory } from '@shared/legalContract';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useApi } from '../hooks/useApi';
import { saveAssistantHistory } from '../services/firestore';

const OFFLINE_GUIDANCE_BY_CATEGORY = {
  property: {
    summary:
      'This sounds like a property or tenancy issue. The strongest early move is to gather written proof before making calls or threats.',
    steps: [
      'Keep the agreement, rent receipts, bank transfers, and chats together.',
      'Write a dated demand message or notice stating what you want and by when.',
      'If there is no response, approach the Rent Controller, civil forum, or legal-aid desk.',
    ],
    authority: 'Start with the local Rent Controller, civil lawyer desk, or District Legal Services Authority.',
    laws: ['Transfer of Property Act', 'Applicable state rent-control rules'],
  },
  labour: {
    summary:
      'This looks like a labour or salary dispute. Written employment proof and a clear payment timeline matter most at the first stage.',
    steps: [
      'Collect payslips, attendance proof, offer letters, and work chats.',
      'Ask the employer for written clarification on dues or termination.',
      'Escalate to the Labour Commissioner or Labour Officer if the issue continues.',
    ],
    authority: 'Start with the Labour Commissioner or district Labour Officer.',
    laws: ['Code on Wages', 'Industrial dispute framework'],
  },
  consumer: {
    summary:
      'This seems like a consumer complaint. Refund, replacement, and service deficiency claims depend heavily on invoice and payment evidence.',
    steps: [
      'Preserve invoices, order IDs, screenshots, and support-ticket replies.',
      'Send one clear written refund or correction request to the seller or platform.',
      'Escalate to the National Consumer Helpline or consumer commission if unresolved.',
    ],
    authority: 'Start with the seller or platform, then move to the National Consumer Helpline.',
    laws: ['Consumer Protection Act, 2019', 'E-commerce rules'],
  },
  domestic: {
    summary:
      'This may involve domestic violence or a family safety issue. Immediate safety comes before documentation.',
    steps: [
      'Move to a safe place if there is immediate risk.',
      'Call 181 or 112, or reach a Protection Officer, women’s cell, or trusted support person.',
      'Preserve photos, medical records, messages, and witness details carefully.',
    ],
    authority: 'Start with the Women’s Helpline, police, or Protection Officer if there is risk.',
    laws: ['Protection of Women from Domestic Violence Act'],
  },
  police: {
    summary:
      'This looks like a police or FIR issue. A written timeline and acknowledgement are usually the first important steps.',
    steps: [
      'Write the incident timeline with dates, names, and available proof.',
      'Submit a written complaint and ask for acknowledgement or diary reference.',
      'Escalate to the Superintendent of Police or magistrate if registration is refused.',
    ],
    authority: 'Start with the Station House Officer, then escalate to senior police or the magistrate.',
    laws: ['Criminal procedure provisions for FIR and complaint escalation'],
  },
  cyber: {
    summary:
      'This appears to be a cyber or online fraud issue. Fast reporting improves the chance of preserving accounts and transactions.',
    steps: [
      'Report quickly on 1930 or the National Cyber Crime Portal.',
      'Inform the bank or platform immediately and request a freeze or recovery step.',
      'Save screenshots, transaction IDs, UPI IDs, and phone numbers.',
    ],
    authority: 'Start with 1930, the cyber-crime portal, and the affected bank or platform.',
    laws: ['Information Technology Act', 'Banking complaint channels'],
  },
};

function isBackendUnavailable(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /cannot reach the backend|failed to fetch|network/i.test(message);
}

function buildOfflineGuidance(categoryId, query) {
  const categoryConfig =
    OFFLINE_GUIDANCE_BY_CATEGORY[categoryId] || OFFLINE_GUIDANCE_BY_CATEGORY.consumer;
  const shortQuery = query.replace(/\s+/g, ' ').trim().slice(0, 130);

  return {
    summary: `${categoryConfig.summary} Issue noted: "${shortQuery}".`,
    steps: categoryConfig.steps,
    authority: categoryConfig.authority,
    laws: categoryConfig.laws,
    research: [],
  };
}

function buildGuidanceMessage(result) {
  return {
    summary: result.summary,
    steps: (result.steps || []).slice(0, 3),
    authority: result.authority,
    laws: (result.laws || []).slice(0, 2),
    research:
      result.research?.indiankanoon?.documents?.slice(0, 1) || [],
  };
}

function buildAssistantMessage(id, text, guidance = null, tone = 'default') {
  return {
    id,
    role: 'assistant',
    text,
    guidance,
    tone,
  };
}

function GuidanceCard({ guidance }) {
  return (
    <div className="chat-guidance">
      <p>{guidance.summary}</p>

      {guidance.steps.length ? (
        <div className="chat-guidance__section">
          <strong>Next steps</strong>
          <ul className="chat-guidance__list">
            {guidance.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="chat-guidance__section">
        <strong>Where to start</strong>
        <span>{guidance.authority}</span>
      </div>

      {guidance.laws.length ? (
        <div className="chat-guidance__section">
          <strong>Relevant laws</strong>
          <div className="chat-tag-row">
            {guidance.laws.map((law) => (
              <span className="chat-tag" key={law}>
                {law}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {guidance.research.length ? (
        <div className="chat-guidance__section">
          <strong>Related source</strong>
          {guidance.research.map((document) => (
            <a href={document.link} key={document.id} rel="noreferrer" target="_blank">
              {document.title}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function LegalChatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { loading, submitLegalQuery, clearError } = useApi();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [messages, setMessages] = useState(() => [
    buildAssistantMessage(
      'welcome',
      'Ask a legal question in plain language. I can help with rent, salary, fraud, police, domestic, and cyber issues.',
    ),
  ]);

  const isHidden = location.pathname === '/signin';
  const selectedCategory = useMemo(
    () => CATEGORIES.find((item) => item.id === category),
    [category],
  );
  const featuredPrompt = CHATBOT_SUGGESTED_PROMPTS[0];

  if (isHidden) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) {
      return;
    }

    clearError();

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedQuery,
    };

    setMessages((current) => [...current, userMessage]);
    setQuery('');

    const resolvedCategory = category || inferLegalCategory(trimmedQuery);

    if (!resolvedCategory) {
      setMessages((current) => [
        ...current,
        buildAssistantMessage(
          `assistant-${Date.now()}`,
          'Please mention the legal area a bit more clearly, for example rent, salary, fraud, police, domestic violence, or cyber crime.',
          null,
          'warning',
        ),
      ]);
      return;
    }

    try {
      const payload = {
        category: resolvedCategory,
        language,
        query: trimmedQuery,
      };

      const response = await submitLegalQuery(payload);

      setMessages((current) => [
        ...current,
        buildAssistantMessage(
          `assistant-${Date.now()}`,
          `Guidance for ${
            selectedCategory?.title ||
            CATEGORIES.find((item) => item.id === resolvedCategory)?.title ||
            'your issue'
          }`,
          buildGuidanceMessage(response),
        ),
      ]);

      if (user?.uid) {
        await saveAssistantHistory({
          userId: user.uid,
          payload,
          result: response,
        });
      }
    } catch (error) {
      if (isBackendUnavailable(error)) {
        setMessages((current) => [
          ...current,
          buildAssistantMessage(
            `assistant-${Date.now()}`,
            'The live legal service is unavailable right now, so here is a quick preliminary legal checklist based on your issue.',
            buildOfflineGuidance(resolvedCategory, trimmedQuery),
            'fallback',
          ),
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        buildAssistantMessage(
          `assistant-${Date.now()}`,
          error instanceof Error
            ? error.message
            : 'I could not prepare legal guidance right now.',
          null,
          'error',
        ),
      ]);
    }
  }

  return (
    <div className={`chatbot-dock ${open ? 'chatbot-dock--open' : ''}`}>
      {open ? (
        <section className="chatbot-panel" aria-label="Legal help chatbot">
          <div className="chatbot-panel__header">
            <div className="chatbot-panel__title">
              <span className="chatbot-badge">NS</span>
              <div>
                <p className="eyebrow">Legal Chat</p>
                <h3>NyayaSaathi guide</h3>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>

          <div className="chatbot-meta">
            <select
              className="field-control field-control--small"
              value={language}
              onChange={(event) => {
                clearError();
                setLanguage(event.target.value);
              }}
            >
              {SUPPORTED_LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="field-control field-control--small"
              value={category}
              onChange={(event) => {
                clearError();
                setCategory(event.target.value);
              }}
            >
              <option value="">Auto-detect category</option>
              {CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="chatbot-showcase">
            <div className="chatbot-showcase__copy">
              <span className="chatbot-suggestions-label">Rapid legal triage</span>
              <strong>Start here for a quick first read, then jump into the full assistant if you want the deeper workflow.</strong>
            </div>

            <div className="chatbot-showcase__chips">
              <span className="chatbot-showcase__chip">Auto-detect category</span>
              <span className="chatbot-showcase__chip">Draft next steps</span>
              <span className="chatbot-showcase__chip">Source-backed guidance</span>
            </div>

            <div className="chatbot-showcase__actions">
              <button
                className="secondary-action secondary-action--compact"
                onClick={() => {
                  setOpen(false);
                  navigate('/assistant');
                }}
                type="button"
              >
                Open full workspace
              </button>
              <button
                className="secondary-action secondary-action--compact"
                onClick={() => {
                  clearError();
                  setQuery(featuredPrompt);
                }}
                type="button"
              >
                Load demo issue
              </button>
            </div>
          </div>

          <div className="chatbot-suggestions-wrap">
            <span className="chatbot-suggestions-label">Try an example</span>
            <div className="chatbot-suggestions">
              {CHATBOT_SUGGESTED_PROMPTS.slice(0, 2).map((prompt) => (
                <button
                  className="chatbot-suggestion"
                  key={prompt}
                  onClick={() => {
                    clearError();
                    setQuery(prompt);
                  }}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <article
                className={`chat-message chat-message--${message.role} ${
                  message.tone ? `chat-message--${message.tone}` : ''
                }`}
                key={message.id}
              >
                <span className="chat-message__label">
                  {message.role === 'user' ? 'You' : 'Guide'}
                </span>
                <p>{message.text}</p>
                {message.guidance ? <GuidanceCard guidance={message.guidance} /> : null}
              </article>
            ))}

            {loading ? (
              <article className="chat-message chat-message--assistant chat-message--loading">
                <span className="chat-message__label">Guide</span>
                <p>Reviewing Indian law for your situation...</p>
                <div className="chat-loading-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ) : null}
          </div>

          <form className="chatbot-composer" onSubmit={handleSubmit}>
            <label className="field">
              <span>Describe your legal issue</span>
              <textarea
                className="field-textarea field-textarea--compact"
                placeholder="Example: My landlord is not returning my deposit after I moved out."
                value={query}
                onChange={(event) => {
                  clearError();
                  setQuery(event.target.value);
                }}
              />
            </label>

            <div className="chatbot-composer__footer">
              <span className="chatbot-hint">
                {selectedCategory
                  ? `Category locked: ${selectedCategory.title}`
                  : 'Category will be detected from your question when possible.'}
              </span>
              <button className="primary-action" disabled={loading || !query.trim()} type="submit">
                {loading ? 'Reviewing your situation...' : 'Ask legal guide'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        className="chatbot-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="chatbot-trigger__dot" />
        Legal Help
      </button>
    </div>
  );
}

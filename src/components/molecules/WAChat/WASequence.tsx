'use client';
/**
 * WASequence — Client leaf (D-99). Renders the full WA screen with sequential animation.
 * Replicates prototipo timings: 26ms/char typing → 440ms hold → bubble → 560ms.
 * Brain: 700+min(900,len×14)ms → bubble → 800ms. Pause 2800ms → loop.
 * IntersectionObserver (threshold 0.3) starts/stops the loop.
 * prefers-reduced-motion: show all messages immediately, no loop.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

interface WAChatMsg {
  id?: string;
  who: 'user' | 'brain';
  text: string;
  time: string;
}

interface WASequenceProps {
  messages: WAChatMsg[];
  contactName: string;
  footer?: string;
}

function WAChecks() {
  return (
    <svg
      className="bbf-wa-checks"
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 5.5 L4 8.5 L9.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5.5 L8.5 8.5 L14 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WASequence({ messages, contactName, footer }: WASequenceProps) {
  const [shown, setShown] = useState<WAChatMsg[]>([]);
  const [typingInput, setTypingInput] = useState('');
  const [brainTyping, setBrainTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputTextRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const loopActive = useRef(false);
  const hasText = typingInput.length > 0;

  // Auto-scroll body + keep typed text visible at the end (input scroll follows cursor)
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const inputEl = inputTextRef.current;
    if (inputEl) inputEl.scrollTop = inputEl.scrollHeight;
  }, [shown, brainTyping, typingInput]);

  const startLoop = useCallback(() => {
    if (loopActive.current) return;
    loopActive.current = true;
    const myRun = ++runId.current;
    const alive = () => runId.current === myRun;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      setShown([]);
      setTypingInput('');
      setBrainTyping(false);
      await sleep(700);

      while (alive()) {
        for (const msg of messages) {
          if (!alive()) return;

          if (msg.who === 'user') {
            for (let i = 1; i <= msg.text.length; i++) {
              if (!alive()) return;
              setTypingInput(msg.text.slice(0, i));
              await sleep(26);
            }
            await sleep(440);
            if (!alive()) return;
            setTypingInput('');
            setShown((s) => [...s, msg]);
            await sleep(560);
          } else {
            setBrainTyping(true);
            await sleep(700);
            if (!alive()) return;
            await sleep(700 + Math.min(900, msg.text.length * 14));
            if (!alive()) return;
            setBrainTyping(false);
            setShown((s) => [...s, msg]);
            await sleep(800);
          }
        }

        await sleep(2800);
        if (!alive()) return;
        setShown([]);
        setTypingInput('');
        setBrainTyping(false);
        await sleep(700);
      }
    }

    run().finally(() => {
      loopActive.current = false;
    });
  }, [messages]);

  const stopLoop = useCallback(() => {
    loopActive.current = false;
    runId.current++;
    setShown([]);
    setTypingInput('');
    setBrainTyping(false);
  }, []);

  useEffect(() => {
    // prefers-reduced-motion: static, no animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(messages);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      runId.current++;
    };
  }, [startLoop, stopLoop, messages]);

  return (
    <div ref={wrapRef} className="bbf-wa-screen">
      {/* Status bar */}
      <div className="bbf-wa-status">
        <span className="bbf-wa-status-time">23:07</span>
        <span className="bbf-wa-status-icons" aria-hidden="true">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
            <rect x="0" y="7" width="3" height="4" rx="0.5" />
            <rect x="4" y="5" width="3" height="6" rx="0.5" />
            <rect x="8" y="3" width="3" height="8" rx="0.5" />
            <rect x="12" y="0" width="3" height="11" rx="0.5" />
          </svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <path
              d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4C14.4 1.4 11.3.2 8 .2S1.6 1.4-.3 3.2L1 4.6C2.6 3.1 4.7 2.2 8 2.2z"
              opacity="0.45"
            />
            <path d="M8 5.2c1.4 0 2.7.5 3.7 1.4l1.3-1.4C11.8 3.9 10 3.2 8 3.2s-3.8.7-5 1.9l1.3 1.4C5.3 5.7 6.6 5.2 8 5.2z" />
            <path d="M8 8.2c.6 0 1.2.2 1.6.7L8 10.8 6.4 8.9c.4-.5 1-.7 1.6-.7z" />
          </svg>
          <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="21"
              height="10"
              rx="2.5"
              stroke="currentColor"
              opacity="0.5"
            />
            <rect x="2" y="2" width="16" height="7" rx="1" fill="currentColor" />
            <rect
              x="23"
              y="3.5"
              width="1.5"
              height="4"
              rx="0.75"
              fill="currentColor"
              opacity="0.5"
            />
          </svg>
        </span>
      </div>

      {/* Header */}
      <div className="bbf-wa-header">
        <button className="bbf-wa-back" aria-label="Atrás">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="bbf-wa-avatar" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <circle cx="6.5" cy="6.5" r="1" fill="#fff" />
            <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
            <circle cx="6.5" cy="17.5" r="1" fill="#fff" />
            <circle cx="17.5" cy="17.5" r="1" fill="#fff" />
          </svg>
        </div>
        <div className="bbf-wa-peer">
          <div className="bbf-wa-peer-name">{contactName}</div>
          <div className="bbf-wa-peer-status">{brainTyping ? 'escribiendo…' : 'en línea'}</div>
        </div>
        <div className="bbf-wa-actions" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M15 10l5-3v10l-5-3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </div>
      </div>

      {/* Body — dynamic messages */}
      <div className="bbf-wa-body" ref={bodyRef}>
        <div className="bbf-wa-daystamp">
          <span>HOY</span>
        </div>
        <div className="bbf-wa-encrypt">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z" />
          </svg>
          Los mensajes están cifrados de extremo a extremo.
        </div>

        {shown.map((m, i) => (
          <div key={m.id ?? i} className={`bbf-wa-row bbf-wa-row--${m.who}`}>
            <div className={`bbf-wa-bubble bbf-wa-bubble--${m.who}`}>
              <span className="bbf-wa-text">{m.text}</span>
              <span className="bbf-wa-meta">
                <span className="bbf-wa-time">{m.time}</span>
                {m.who === 'user' && (
                  <span className="bbf-wa-checks-wrap">
                    <WAChecks />
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}

        {brainTyping && (
          <div className="bbf-wa-row bbf-wa-row--brain">
            <div className="bbf-wa-bubble bbf-wa-bubble--brain bbf-wa-bubble--typing">
              <span className="bbf-wa-dot" />
              <span className="bbf-wa-dot" />
              <span className="bbf-wa-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input bar — decorative (typing state driven by animation) */}
      <div className="bbf-wa-inputbar">
        <div className="bbf-wa-input">
          <svg
            className="bbf-wa-input-emoji"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1.1" fill="currentColor" />
            <circle cx="15" cy="10" r="1.1" fill="currentColor" />
            <path
              d="M8.5 14.5c.9 1.1 2.1 1.7 3.5 1.7s2.6-.6 3.5-1.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span
            ref={inputTextRef}
            className={`bbf-wa-input-text ${hasText ? '' : 'is-placeholder'}`}
          >
            {hasText ? typingInput : 'Mensaje'}
            {hasText && <span className="bbf-wa-caret" />}
          </span>
          <svg
            className="bbf-wa-input-clip"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16.5 6.5l-7 7a2.5 2.5 0 003.5 3.5l7-7a4.5 4.5 0 00-6.4-6.4l-7 7a6.5 6.5 0 009.2 9.2l6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="bbf-wa-input-cam"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="7"
              width="18"
              height="13"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8 7l1.2-2h5.6L16 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <button
          className={`bbf-wa-send ${hasText ? 'is-send' : ''}`}
          aria-label={hasText ? 'Enviar' : 'Mensaje de voz'}
        >
          {hasText ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 11.5L21 3l-8.5 18-2.2-7.3L3 11.5z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path
                d="M6 11a6 6 0 0012 0M12 17v3"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {footer && <p className="bbf-wa-footer">{footer}</p>}
    </div>
  );
}

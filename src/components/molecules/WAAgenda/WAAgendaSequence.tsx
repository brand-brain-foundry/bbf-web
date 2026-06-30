'use client';
/**
 * WAAgendaSequence — Client leaf (D-99). Reutiliza chrome .bbf-wa-* de capabilities-wa.css.
 * Animación: brief usuario → confirmación Brain → Google Meet card (invitados Enviando→Enviado)
 * → invitaciones enviadas → ask + quick replies → cierre. Loop con IntersectionObserver.
 * prefers-reduced-motion: muestra todo estático sin loop.
 */
import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

// useSyncExternalStore for prefers-reduced-motion — avoids setState-in-effect (react-hooks error)
const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getReducedMotionServer = () => false;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Invitee {
  id?: string;
  name: string;
  email: string;
}

interface MeetCardData {
  title: string;
  day: string;
  time: string;
  timezone: string;
  link: string;
  invitees: Invitee[];
}

interface QuickReply {
  id?: string;
  label: string;
}

export interface WAAgendaUI {
  backAriaLabel: string;
  statusTyping: string;
  statusOnline: string;
  daystamp: string;
  encrypted: string;
  inputPlaceholder: string;
  sendAriaLabel: string;
  voiceAriaLabel: string;
  inviteeSent: string;
  inviteeSending: string;
  copyLinkLabel: string;
  copiedLinkLabel: string;
  inviteesPrefix: string;
  copyMeetAriaPrefix: string;
  joinCallLabel: string;
}

interface WAAgendaSequenceProps {
  contactName: string;
  briefText: string;
  confirmText: string;
  meetCard: MeetCardData;
  inviteSentText: string;
  askText: string;
  quickReplies: QuickReply[];
  closingText: string;
  ui: WAAgendaUI;
}

type ShownItem =
  | { kind: 'text'; who: 'user' | 'brain'; text: string; time: string; id: string }
  | { kind: 'meet'; id: string };

// ── Sub-components ────────────────────────────────────────────────────────────

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

function GoogleMeetLogo() {
  return (
    <svg
      className="bbf-wag-meet-logo"
      width="30"
      height="30"
      viewBox="0 0 87 72"
      aria-hidden="true"
    >
      <path fill="#00832d" d="M49 36l8.3 9.5 11.2 7.1 2-16.6-2-16.3-11.4 6.3z" />
      <path fill="#0066da" d="M0 51.5V66c0 3.3 2.7 6 6 6h14.5l3-11-3-9.5-9.9-3z" />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.6 3 9.9-3 3-9.4z" />
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
      <path
        fill="#00ac47"
        d="M82.6 8.2L69.7 18.8v34.9l13 10.7c1.9 1.5 4.8.2 4.8-2.3V10.4c0-2.5-2.8-3.8-4.9-2.2zM49 36v15.5H20.5V72h43.2c3.3 0 6-2.7 6-6V53.7z"
      />
      <path fill="#ffba00" d="M63.7 0H20.5v20.5H49V36l20.7-17.2V6c0-3.3-2.7-6-6-6z" />
    </svg>
  );
}

const AVATAR_COLORS = ['#5b6ef0', '#e8714a', '#34a853', '#fbbc04'];

function InviteeRow({
  name,
  email,
  started,
  index,
  inviteeSent,
  inviteeSending,
}: Invitee & { started: boolean; index: number; inviteeSent: string; inviteeSending: string }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!started) {
      setSent(false);
      return;
    }
    const id = setTimeout(() => setSent(true), 900 + Math.random() * 700);
    return () => clearTimeout(id);
  }, [started]);

  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="bbf-wag-invitee">
      <span className="bbf-wag-invitee__av" style={{ background: avatarColor }} aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="bbf-wag-invitee__info">
        <span className="bbf-wag-invitee__name">{name}</span>
        <span className="bbf-wag-invitee__email">{email}</span>
      </span>
      <span className={`bbf-wag-invitee__state ${sent ? 'is-sent' : 'is-sending'}`}>
        {sent ? (
          <>
            <svg width="13" height="10" viewBox="0 0 16 11" fill="none" aria-hidden="true">
              <path
                d="M1 5.5L4 8.5L9.5 2.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 5.5L8.5 8.5L14 2.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {inviteeSent}
          </>
        ) : (
          <>
            <span className="bbf-wag-invitee__spin" aria-hidden="true" />
            {inviteeSending}
          </>
        )}
      </span>
    </div>
  );
}

function MeetCard({
  meet,
  invStarted,
  time,
  copyLinkLabel,
  copiedLinkLabel,
  inviteesPrefix,
  copyMeetAriaPrefix,
  joinCallLabel,
  inviteeSent,
  inviteeSending,
}: {
  meet: MeetCardData;
  invStarted: boolean;
  time: string;
  copyLinkLabel: string;
  copiedLinkLabel: string;
  inviteesPrefix: string;
  copyMeetAriaPrefix: string;
  joinCallLabel: string;
  inviteeSent: string;
  inviteeSending: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="bbf-wag-meet">
      {/* Head */}
      <div className="bbf-wag-meet__head">
        <GoogleMeetLogo />
        <div className="bbf-wag-meet__head-txt">
          <div className="bbf-wag-meet__app">Google Meet</div>
          <div className="bbf-wag-meet__title">{meet.title}</div>
        </div>
      </div>

      {/* When */}
      <div className="bbf-wag-meet__when">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M3 9h18M8 3v4M16 3v4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <div className="bbf-wag-meet__day">{meet.day}</div>
          <div className="bbf-wag-meet__time-slot">
            {meet.time} · {meet.timezone}
          </div>
        </div>
      </div>

      {/* Link */}
      <button
        className="bbf-wag-meet__link"
        type="button"
        onClick={handleCopy}
        aria-label={`${copyMeetAriaPrefix}${meet.link}`}
      >
        <span className="bbf-wag-meet__link-l">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 15l6-6M10.5 6.5l1-1a4.5 4.5 0 016.4 6.4l-3 3a4.5 4.5 0 01-6.4 0M13.5 17.5l-1 1a4.5 4.5 0 01-6.4-6.4l3-3a4.5 4.5 0 016.4 0"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="bbf-wag-meet__link-url">{meet.link}</span>
        </span>
        <span className="bbf-wag-meet__copy">{copied ? copiedLinkLabel : copyLinkLabel}</span>
      </button>

      {/* Invitees */}
      {meet.invitees.length > 0 && (
        <div className="bbf-wag-meet__invitees">
          <div className="bbf-wag-meet__invitees-lbl">
            {inviteesPrefix}
            {meet.invitees.length}
          </div>
          {meet.invitees.map((inv, i) => (
            <InviteeRow
              key={inv.id ?? i}
              name={inv.name}
              email={inv.email}
              started={invStarted}
              index={i}
              inviteeSent={inviteeSent}
              inviteeSending={inviteeSending}
            />
          ))}
        </div>
      )}

      {/* Join */}
      <button className="bbf-wag-meet__join" type="button">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 10l5-3v10l-5-3v-4zM3 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        {joinCallLabel}
      </button>

      <div className="bbf-wag-meet__time-meta">{time}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WAAgendaSequence({
  contactName,
  briefText,
  confirmText,
  meetCard,
  inviteSentText,
  askText,
  quickReplies,
  closingText,
  ui,
}: WAAgendaSequenceProps) {
  const [shown, setShown] = useState<ShownItem[]>([]);
  const [typingInput, setTypingInput] = useState('');
  const [brainTyping, setBrainTyping] = useState(false);
  const [quickVisible, setQuickVisible] = useState(false);
  const [invStarted, setInvStarted] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  // Reduced-motion: derive static view from props without setState-in-effect
  const reducedMotionItems: ShownItem[] = prefersReducedMotion
    ? [
        { kind: 'text', who: 'user', text: briefText, time: '9:13', id: 'brief' },
        { kind: 'text', who: 'brain', text: confirmText, time: '9:13', id: 'confirm' },
        { kind: 'meet', id: 'meet' },
        { kind: 'text', who: 'brain', text: inviteSentText, time: '9:14', id: 'invite-sent' },
        { kind: 'text', who: 'brain', text: askText, time: '9:14', id: 'ask' },
        {
          kind: 'text',
          who: 'user',
          text: quickReplies[0]?.label ?? '',
          time: '9:15',
          id: 'reply',
        },
        { kind: 'text', who: 'brain', text: closingText, time: '9:15', id: 'closing' },
      ]
    : [];
  const visibleMessages = prefersReducedMotion ? reducedMotionItems : shown;
  const visibleInvStarted = prefersReducedMotion || invStarted;

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputTextRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const loopActive = useRef(false);
  const hasText = typingInput.length > 0;

  // Auto-scroll body
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const inputEl = inputTextRef.current;
    if (inputEl) inputEl.scrollTop = inputEl.scrollHeight;
  }, [shown, brainTyping, typingInput, quickVisible]);

  const startLoop = useCallback(() => {
    if (loopActive.current) return;
    loopActive.current = true;
    const myRun = ++runId.current;
    const alive = () => runId.current === myRun;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const firstReplyLabel = quickReplies[0]?.label ?? 'Sí';

    async function run() {
      setShown([]);
      setTypingInput('');
      setBrainTyping(false);
      setQuickVisible(false);
      setInvStarted(false);
      await sleep(800);

      while (alive()) {
        // Step 1 — usuario tipea briefText
        for (let i = 1; i <= briefText.length; i++) {
          if (!alive()) return;
          setTypingInput(briefText.slice(0, i));
          await sleep(22);
        }
        await sleep(480);
        if (!alive()) return;
        setTypingInput('');
        setShown((s) => [
          ...s,
          { kind: 'text', who: 'user', text: briefText, time: '9:13', id: 'brief' },
        ]);
        await sleep(700);

        // Step 2 — Brain: confirmText
        if (!alive()) return;
        setBrainTyping(true);
        await sleep(700 + Math.min(900, confirmText.length * 13));
        if (!alive()) return;
        setBrainTyping(false);
        setShown((s) => [
          ...s,
          { kind: 'text', who: 'brain', text: confirmText, time: '9:13', id: 'confirm' },
        ]);
        await sleep(850);

        // Step 3 — Brain: MeetCard (1300ms think time)
        if (!alive()) return;
        setBrainTyping(true);
        await sleep(1300);
        if (!alive()) return;
        setBrainTyping(false);
        setShown((s) => [...s, { kind: 'meet', id: 'meet' }]);
        setInvStarted(true);
        await sleep(2600); // espera animación de invitados

        // Step 4 — Brain: inviteSentText
        if (!alive()) return;
        setBrainTyping(true);
        await sleep(700 + Math.min(900, inviteSentText.length * 13));
        if (!alive()) return;
        setBrainTyping(false);
        setShown((s) => [
          ...s,
          {
            kind: 'text',
            who: 'brain',
            text: inviteSentText,
            time: '9:14',
            id: 'invite-sent',
          },
        ]);
        await sleep(850);

        // Step 5 — Brain: askText + quick replies
        if (!alive()) return;
        setBrainTyping(true);
        await sleep(700 + Math.min(900, askText.length * 13));
        if (!alive()) return;
        setBrainTyping(false);
        setShown((s) => [
          ...s,
          { kind: 'text', who: 'brain', text: askText, time: '9:14', id: 'ask' },
        ]);
        setQuickVisible(true);
        await sleep(1400);

        // Step 6 — usuario selecciona primer quick reply + typing en el input (BUG 2 fix)
        if (!alive()) return;
        setQuickVisible(false);
        await sleep(300);
        if (!alive()) return;
        for (let i = 1; i <= firstReplyLabel.length; i++) {
          if (!alive()) return;
          setTypingInput(firstReplyLabel.slice(0, i));
          await sleep(22);
        }
        await sleep(480);
        if (!alive()) return;
        setTypingInput('');
        setShown((s) => [
          ...s,
          { kind: 'text', who: 'user', text: firstReplyLabel, time: '9:15', id: 'reply' },
        ]);
        await sleep(700);

        // Step 7 — Brain: closingText
        if (!alive()) return;
        setBrainTyping(true);
        await sleep(700 + Math.min(900, closingText.length * 13));
        if (!alive()) return;
        setBrainTyping(false);
        setShown((s) => [
          ...s,
          { kind: 'text', who: 'brain', text: closingText, time: '9:15', id: 'closing' },
        ]);
        await sleep(3600);

        // Reset → loop
        if (!alive()) return;
        setShown([]);
        setTypingInput('');
        setBrainTyping(false);
        setQuickVisible(false);
        setInvStarted(false);
        await sleep(800);
      }
    }

    run().finally(() => {
      loopActive.current = false;
    });
  }, [briefText, confirmText, inviteSentText, askText, closingText, quickReplies]);

  const stopLoop = useCallback(() => {
    loopActive.current = false;
    runId.current++;
    setShown([]);
    setTypingInput('');
    setBrainTyping(false);
    setQuickVisible(false);
    setInvStarted(false);
  }, []);

  useEffect(() => {
    // prefersReducedMotion: visibleMessages + visibleInvStarted derived above — no setState needed
    if (prefersReducedMotion) return;

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
  }, [
    prefersReducedMotion,
    startLoop,
    stopLoop,
    briefText,
    confirmText,
    inviteSentText,
    askText,
    closingText,
    quickReplies,
  ]);

  return (
    <div ref={wrapRef} className="bbf-wa-screen">
      {/* Status bar */}
      <div className="bbf-wa-status">
        <span className="bbf-wa-status-time">9:14</span>
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
        <button className="bbf-wa-back" aria-label={ui.backAriaLabel}>
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
          <div className="bbf-wa-peer-status">
            {brainTyping ? ui.statusTyping : ui.statusOnline}
          </div>
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

      {/* Body */}
      <div className="bbf-wa-body" ref={bodyRef}>
        <div className="bbf-wa-daystamp">
          <span>{ui.daystamp}</span>
        </div>
        <div className="bbf-wa-encrypt">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z" />
          </svg>
          {ui.encrypted}
        </div>

        {visibleMessages.map((item, i) => {
          if (item.kind === 'meet') {
            return (
              <div key={item.id} className="bbf-wa-row bbf-wa-row--brain">
                <div className="bbf-wa-bubble bbf-wa-bubble--brain bbf-wa-bubble--card">
                  <MeetCard
                    meet={meetCard}
                    invStarted={visibleInvStarted}
                    time="9:13"
                    copyLinkLabel={ui.copyLinkLabel}
                    copiedLinkLabel={ui.copiedLinkLabel}
                    inviteesPrefix={ui.inviteesPrefix}
                    copyMeetAriaPrefix={ui.copyMeetAriaPrefix}
                    joinCallLabel={ui.joinCallLabel}
                    inviteeSent={ui.inviteeSent}
                    inviteeSending={ui.inviteeSending}
                  />
                </div>
              </div>
            );
          }
          return (
            <div key={item.id ?? i} className={`bbf-wa-row bbf-wa-row--${item.who}`}>
              <div className={`bbf-wa-bubble bbf-wa-bubble--${item.who}`}>
                <span className="bbf-wa-text">{item.text}</span>
                <span className="bbf-wa-meta">
                  <span className="bbf-wa-time">{item.time}</span>
                  {item.who === 'user' && (
                    <span className="bbf-wa-checks-wrap">
                      <WAChecks />
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {brainTyping && (
          <div className="bbf-wa-row bbf-wa-row--brain">
            <div className="bbf-wa-bubble bbf-wa-bubble--brain bbf-wa-bubble--typing">
              <span className="bbf-wa-dot" />
              <span className="bbf-wa-dot" />
              <span className="bbf-wa-dot" />
            </div>
          </div>
        )}

        {quickVisible && quickReplies.length > 0 && (
          <div className="bbf-wag-quickrow">
            {quickReplies.map((qr, i) => (
              <button
                key={qr.id ?? i}
                type="button"
                className={`bbf-wag-quick${i === 0 ? 'is-primary' : ''}`}
              >
                {i === 0 && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M3 9h18M8 3v4M16 3v4M8.5 14l2.5 2.5 4.5-4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {qr.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar — decorativo */}
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
            {hasText ? typingInput : ui.inputPlaceholder}
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
          aria-label={hasText ? ui.sendAriaLabel : ui.voiceAriaLabel}
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
    </div>
  );
}

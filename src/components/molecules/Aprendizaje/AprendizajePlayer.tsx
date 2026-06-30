'use client';

/**
 * AprendizajePlayer — D-APR-01 Client leaf.
 * Fase 1 InsightsScreen (app chrome, 7.2s) → Fase 2 RecChat (WA chrome) → loop.
 * Doble reutilización: .bbf-app-screen-* (pane 1) + .bbf-wa-* (pane 2).
 * .bbf-wa-chat en pane 2 provee --wa-* vars; override en capabilities-aprendizaje.css.
 * Fidelidad al prototipo: public/assets/development/aprendizaje/
 */
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type MutableRefObject,
} from 'react';
import Image from 'next/image';

// ── Inline SVGs (prototipo fuente de verdad) ──────────────────────────────────
const IGGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" style={{ flexShrink: 0 }}>
    <defs>
      <linearGradient id="apr-ig" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#feda75" />
        <stop offset="0.4" stopColor="#fa7e1e" />
        <stop offset="0.7" stopColor="#d62976" />
        <stop offset="1" stopColor="#962fbf" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#apr-ig)" />
    <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
    <circle cx="16.4" cy="7.6" r="1.1" fill="#fff" />
  </svg>
);

const ClockSVG = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BrainLogoSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="3" fill="#fff" />
    <circle cx="6.5" cy="6.5" r="1" fill="#fff" />
    <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
    <circle cx="6.5" cy="17.5" r="1" fill="#fff" />
    <circle cx="17.5" cy="17.5" r="1" fill="#fff" />
  </svg>
);

const BrainCardSVG = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {([0, 45, 90, 135, 180, 225, 270, 315] as const).map((a) => {
      const r = (a * Math.PI) / 180;
      return (
        <circle key={a} cx={16 + Math.cos(r) * 8.5} cy={16 + Math.sin(r) * 8.5} r="3" fill="#fff" />
      );
    })}
    <circle cx="16" cy="16" r="4" fill="#fff" />
  </svg>
);

// ── Hardcoded illustrative data (prototipo fuente de verdad) ──────────────────
const METRICS = [
  {
    label: 'Alcance',
    target: 48217,
    delta: '+312%',
    hero: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: 'Impresiones',
    target: 71432,
    delta: '+264%',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 19V10M9 19V5M14 19v-6M19 19V8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Me gusta',
    target: 5847,
    delta: '+220%',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 20.5l-1.4-1.3C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3c1.5 0 3 .7 3.9 1.9l1.3 1.6 1.3-1.6C14.2 3.7 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8c0 3.7-3.4 6.8-8.6 11.4L12 20.5z" />
      </svg>
    ),
  },
  {
    label: 'Comentarios',
    target: 312,
    delta: '+148%',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5h16v11H9l-5 4V5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Compartidos',
    target: 1204,
    delta: '+186%',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 11.5L20 4l-3 16-5-5-3 4v-5l11-9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Guardados',
    target: 2931,
    delta: '+408%',
    star: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 3h12v18l-6-4-6 4V3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

const CHART_BARS = [22, 34, 41, 58, 72, 100] as const;
const CHART_LABELS = ['12h', '24h', '36h', '48h', '60h', '72h'] as const;

const AUDIENCE = [
  { label: 'Ciudad de México', pct: 38 },
  { label: 'Guadalajara', pct: 16 },
  { label: 'Monterrey', pct: 12 },
] as const;

function fmtNum(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 100 ? `${Math.round(k)}` : `${k.toFixed(1)}`.replace('.0', '');
    return `${s}K`;
  }
  return n.toLocaleString('es-MX');
}

export interface AprendizajeUI {
  // Insights pane
  liveBadge: string;
  engLabel: string;
  engDelta: string;
  bannerStrong: string;
  bannerSub: string;
  metricsAriaLabel: string;
  metricKeyTag: string;
  metricDeltaSub: string;
  chartTitle: string;
  chartTag: string;
  audienceTitle: string;
  audienceSub: string;
  audienceAriaLabel: string;
  learnTitle: string;
  learnAriaLabel: string;
  signalsSuffix: string;
  tabsAriaLabel: string;
  tabContent: string;
  tabAnalytics: string;
  tabAudiencia: string;
  tabHerram: string;
  metricLabels: [string, string, string, string, string, string];
  audienceLabels: [string, string, string];
  // RecChat pane
  backAriaLabel: string;
  statusTyping: string;
  statusOnline: string;
  daystamp: string;
  inputPlaceholder: string;
  sendAriaLabel: string;
  recCardTitle: string;
  recCardConf: string;
  quickYes: string;
  quickAdjust: string;
  briefQuestion: string;
  brainAsk: string;
  b1Text: string;
  b2Text: string;
  userReply: string;
  b3Text: string;
  // Step indicators
  step1Label: string;
  step2Label: string;
  stepsAriaLabel: string;
}

// ── InsightsPane ──────────────────────────────────────────────────────────────
interface InsightsPaneProps {
  active: boolean;
  insightsTitle: string;
  postImageUrl: string | null;
  postImageAlt: string;
  postCaption: string;
  platformLabel: string;
  timeLabel: string;
  ui: AprendizajeUI;
}

function InsightsPane({
  active,
  insightsTitle,
  postImageUrl,
  postImageAlt,
  postCaption,
  platformLabel,
  timeLabel,
  ui,
}: InsightsPaneProps) {
  const [counts, setCounts] = useState<number[]>(METRICS.map((m) => m.target));
  const [eng, setEng] = useState<number>(124); // 124 = 12.4% ×10
  const [signals, setSignals] = useState<number>(2931);

  useEffect(() => {
    if (!active) {
      // Show final values when inactive — never display 0 statically
      setCounts(METRICS.map((m) => m.target));
      setEng(124);
      setSignals(2931);
      return;
    }
    const metricTargets = METRICS.map((m) => m.target);
    const engTarget = 124;
    const sigTarget = 2931;
    const dur = 1500;
    const start = performance.now();
    // Reset to 0 so the count-up animation starts from zero
    setCounts(metricTargets.map(() => 0));
    setEng(0);
    setSignals(0);
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts(metricTargets.map((t) => Math.round(ease * t)));
      setEng(Math.round(ease * engTarget));
      setSignals(Math.round(ease * sigTarget));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <>
      <div className="bbf-app-sb" aria-hidden="true">
        <span className="bbf-app-sb__l">9:41</span>
        <div className="bbf-app-sb__r">
          <span className="bbf-app-sb__pill" />
          <span className="bbf-app-sb__batt" />
        </div>
      </div>

      <div className="bbf-app-appbar">
        <span className="bbf-app-appbar__logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 19V10M9 19V5M14 19v-6M19 19V8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="bbf-app-appbar__title">{insightsTitle}</span>
        <div className="bbf-app-appbar__right">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12.5l5 5L20 6"
              stroke="#1e8e3e"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="bbf-app-screen-body bbf-apr-ins-body">
        {/* Hero: thumbnail + info */}
        <div className="bbf-apr-ins-hero">
          <div className="bbf-apr-ins-hero__thumb">
            {postImageUrl ? (
              <Image
                src={postImageUrl}
                alt={postImageAlt}
                fill
                sizes="96px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bbf-apr-ins-hero__placeholder" aria-hidden="true" />
            )}
            <span className="bbf-apr-ins-hero__live" aria-hidden="true">
              <span className="bbf-apr-ins-hero__live-dot" />
              {ui.liveBadge}
            </span>
          </div>
          <div className="bbf-apr-ins-hero__info">
            <div className="bbf-apr-ins-platform">
              <IGGlyph />
              {platformLabel}
            </div>
            {postCaption && <p className="bbf-apr-ins-caption">{postCaption}</p>}
            <div className="bbf-apr-ins-published">
              <ClockSVG />
              {timeLabel}
            </div>
            <div className="bbf-apr-ins-eng">
              <span className="bbf-apr-ins-eng__v">{(eng / 10).toFixed(1)}%</span>
              <span className="bbf-apr-ins-eng__l">
                {ui.engLabel}
                <br />
                <span>{ui.engDelta}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="bbf-apr-ins-banner" role="status">
          <span className="bbf-apr-ins-banner__emoji" aria-hidden="true">
            🚀
          </span>
          <div className="bbf-apr-ins-banner__txt">
            <div className="bbf-apr-ins-banner__strong">{ui.bannerStrong}</div>
            <div className="bbf-apr-ins-banner__span">{ui.bannerSub}</div>
          </div>
        </div>

        {/* Metric grid */}
        <div className="bbf-apr-ins-metrics" aria-label={ui.metricsAriaLabel}>
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={[
                'bbf-apr-ins-metric',
                'hero' in m && m.hero ? 'bbf-apr-ins-metric--hero' : '',
                'star' in m && m.star ? 'bbf-apr-ins-metric--star' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="bbf-apr-ins-metric__top">
                <span className="bbf-apr-ins-metric__icon">{m.icon}</span>
                <span className="bbf-apr-ins-metric__l">{ui.metricLabels[i]}</span>
                {'star' in m && m.star && (
                  <span className="bbf-apr-ins-metric__tag">{ui.metricKeyTag}</span>
                )}
              </div>
              <div className="bbf-apr-ins-metric__n">{fmtNum(counts[i])}</div>
              <div className="bbf-apr-ins-metric__d">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M6 9.5V2.5M3 5l3-3 3 3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {m.delta} <span className="bbf-apr-ins-metric__d-sub">{ui.metricDeltaSub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bbf-apr-ins-card" aria-hidden="true">
          <div className="bbf-apr-ins-card__head">
            <span className="bbf-apr-ins-card__title">{ui.chartTitle}</span>
            <span className="bbf-apr-ins-card__tag">{ui.chartTag}</span>
          </div>
          <div className="bbf-apr-ins-chart">
            {CHART_BARS.map((h, i) => (
              <div key={i} className="bbf-apr-ins-chart__col">
                <div
                  className={`bbf-apr-ins-chart__bar${i === CHART_BARS.length - 1 ? 'bbf-apr-ins-chart__bar--last' : ''}`}
                  style={
                    {
                      '--bar-h': active ? `${h}%` : '4%',
                      '--bar-i': i,
                    } as CSSProperties
                  }
                />
                <span className="bbf-apr-ins-chart__x">{CHART_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div className="bbf-apr-ins-card">
          <div className="bbf-apr-ins-card__head">
            <span className="bbf-apr-ins-card__title">{ui.audienceTitle}</span>
            <span className="bbf-apr-ins-card__sub">{ui.audienceSub}</span>
          </div>
          <div className="bbf-apr-ins-audience" aria-label={ui.audienceAriaLabel}>
            {AUDIENCE.map((a, i) => (
              <div key={a.label} className="bbf-apr-ins-aud-row">
                <span className="bbf-apr-ins-aud-label">{ui.audienceLabels[i]}</span>
                <div className="bbf-apr-ins-aud-track">
                  <div
                    className="bbf-apr-ins-aud-fill"
                    style={
                      {
                        '--aud-w': active ? `${a.pct}%` : '0%',
                        '--aud-i': i,
                      } as CSSProperties
                    }
                  />
                </div>
                <span className="bbf-apr-ins-aud-pct">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brain aprendió — DARK */}
        <div className="bbf-apr-ins-learn" aria-label={ui.learnAriaLabel}>
          <span className="bbf-apr-ins-learn__mark" aria-hidden="true">
            <BrainLogoSVG />
          </span>
          <div className="bbf-apr-ins-learn__body">
            <span className="bbf-apr-ins-learn__title">{ui.learnTitle}</span>
            <span className="bbf-apr-ins-learn__sub">
              +{signals.toLocaleString('es-MX')} {ui.signalsSuffix}
            </span>
          </div>
          <span className="bbf-apr-ins-learn__dot" aria-hidden="true" />
        </div>
      </div>

      <div className="bbf-app-tabs" aria-label={ui.tabsAriaLabel} aria-hidden="true">
        {[
          { id: 'content', label: ui.tabContent },
          { id: 'analytics', label: ui.tabAnalytics },
          { id: 'audience', label: ui.tabAudiencia },
          { id: 'tools', label: ui.tabHerram },
        ].map((tab) => (
          <div key={tab.id} className={`bbf-app-tab${tab.id === 'analytics' ? 'is-active' : ''}`}>
            <span className="bbf-app-tab__label">{tab.label}</span>
          </div>
        ))}
      </div>

      <div className="bbf-app-navbar" aria-hidden="true">
        <span className="bbf-app-navbar__btn" />
        <span className="bbf-app-navbar__btn bbf-app-navbar__btn--home" />
        <span className="bbf-app-navbar__btn" />
      </div>
    </>
  );
}

// ── RecChatPane ───────────────────────────────────────────────────────────────
type RecPoint = {
  id?: string | null;
  key: string;
  value: string;
  data: string;
  icon?: React.ReactNode;
};
type ChatEntry = {
  id: string;
  who: 'brain' | 'user';
  text?: string;
  isCard?: boolean;
  isAsk?: boolean;
  time?: string;
};

interface RecChatPaneProps {
  active: boolean;
  onDone: () => void;
  recPoints: RecPoint[];
  projection: string;
  runId: MutableRefObject<number>;
  ui: AprendizajeUI;
}

function RecChatPane({ active, onDone, recPoints, projection, runId, ui }: RecChatPaneProps) {
  const [msgs, setMsgs] = useState<ChatEntry[]>([]);
  const [inputText, setInputText] = useState('');
  const [brainTyping, setBrainTyping] = useState(false);
  const [answered, setAnswered] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, brainTyping, inputText, answered]);

  useEffect(() => {
    if (!active) {
      setMsgs([]);
      setInputText('');
      setBrainTyping(false);
      setAnswered(false);
      return;
    }

    const myRun = ++runId.current;
    const alive = () => runId.current === myRun;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      setMsgs([]);
      setInputText('');
      setBrainTyping(false);
      setAnswered(false);
      await sleep(700);
      if (!alive()) return;

      // User types
      for (let i = 1; i <= ui.briefQuestion.length; i++) {
        if (!alive()) return;
        setInputText(ui.briefQuestion.slice(0, i));
        await sleep(24);
      }
      await sleep(420);
      if (!alive()) return;
      setInputText('');
      setMsgs([{ id: 'u1', who: 'user', text: ui.briefQuestion, time: '9:41' }]);
      await sleep(650);

      // Brain b1 — full stats
      const b1Text = ui.b1Text;
      setBrainTyping(true);
      await sleep(650);
      if (!alive()) return;
      await sleep(650 + Math.min(900, b1Text.length * 12));
      if (!alive()) return;
      setBrainTyping(false);
      setMsgs((m) => [...m, { id: 'b1', who: 'brain', text: b1Text, time: '9:41' }]);
      await sleep(800);

      // Brain b2
      const b2Text = ui.b2Text;
      if (!alive()) return;
      setBrainTyping(true);
      await sleep(650);
      if (!alive()) return;
      await sleep(650 + Math.min(900, b2Text.length * 12));
      if (!alive()) return;
      setBrainTyping(false);
      setMsgs((m) => [...m, { id: 'b2', who: 'brain', text: b2Text, time: '9:41' }]);
      await sleep(800);

      // RecCard
      if (!alive()) return;
      setBrainTyping(true);
      await sleep(650);
      if (!alive()) return;
      await sleep(1400);
      if (!alive()) return;
      setBrainTyping(false);
      setMsgs((m) => [...m, { id: 'card', who: 'brain', isCard: true, time: '9:42' }]);
      await sleep(1200);

      // Brain ask
      if (!alive()) return;
      setBrainTyping(true);
      await sleep(650);
      if (!alive()) return;
      await sleep(650 + Math.min(900, ui.brainAsk.length * 12));
      if (!alive()) return;
      setBrainTyping(false);
      setMsgs((m) => [
        ...m,
        { id: 'ask', who: 'brain', text: ui.brainAsk, isAsk: true, time: '9:42' },
      ]);
      await sleep(300);

      // Quick replies visible (derived from msgs in render via isAsk + !answered)
      // User auto-accepts after 1500ms
      await sleep(1500);
      if (!alive()) return;
      setAnswered(true);
      await sleep(800);
      if (!alive()) return;
      setMsgs((m) => [...m, { id: 'u2', who: 'user', text: ui.userReply, time: '9:43' }]);
      await sleep(650);

      // Brain confirm
      if (!alive()) return;
      setBrainTyping(true);
      await sleep(1300);
      if (!alive()) return;
      setBrainTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: 'b3',
          who: 'brain',
          text: ui.b3Text,
          time: '9:43',
        },
      ]);
      await sleep(2800);
      if (!alive()) return;
      onDone();
    }

    run();
    return () => {
      runId.current++;
    };
  }, [active, onDone, runId]);

  const points: RecPoint[] = recPoints;

  const askVisible = msgs.some((m) => m.isAsk) && !answered;
  const hasText = inputText.length > 0;

  return (
    <>
      <div className="bbf-wa-status" aria-hidden="true">
        <span className="bbf-wa-status__time">9:41</span>
        <div className="bbf-wa-status-icons">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="bbf-wa-header">
        <button className="bbf-wa-back" aria-label={ui.backAriaLabel} tabIndex={-1}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <circle cx="6.5" cy="6.5" r="1" fill="#fff" />
            <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
            <circle cx="6.5" cy="17.5" r="1" fill="#fff" />
            <circle cx="17.5" cy="17.5" r="1" fill="#fff" />
          </svg>
        </div>
        <div className="bbf-wa-peer">
          <div className="bbf-wa-peer-name">Brain</div>
          <div className="bbf-wa-peer-status">
            {brainTyping ? ui.statusTyping : ui.statusOnline}
          </div>
        </div>
        <div className="bbf-wa-actions" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </div>
      </div>

      <div className="bbf-wa-body" ref={bodyRef}>
        <div className="bbf-wa-daystamp" aria-hidden="true">
          <span>{ui.daystamp}</span>
        </div>

        {msgs.map((msg) => {
          if (msg.isCard) {
            return (
              <div key={msg.id} className="bbf-wa-row bbf-wa-row--brain">
                <div className="bbf-wa-bubble bbf-wa-bubble--brain bbf-apr-bubble--card">
                  <div className="bbf-apr-rec-card">
                    <div className="bbf-apr-rec-card__head">
                      <span className="bbf-apr-rec-card__brain" aria-hidden="true">
                        <BrainCardSVG />
                      </span>
                      <div>
                        <div className="bbf-apr-rec-card__title">{ui.recCardTitle}</div>
                        <div className="bbf-apr-rec-card__conf">
                          <span className="bbf-apr-rec-card__conf-dot" />
                          {ui.recCardConf}
                        </div>
                      </div>
                    </div>
                    <div className="bbf-apr-rec-card__points">
                      {points.map((pt, i) => (
                        <div key={pt.id ?? i} className="bbf-apr-rec-point">
                          {pt.icon ? (
                            <span className="bbf-apr-rec-point__icon" aria-hidden="true">
                              {pt.icon}
                            </span>
                          ) : (
                            <span
                              className="bbf-apr-rec-point__icon bbf-apr-rec-point__icon--default"
                              aria-hidden="true"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="8"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                              </svg>
                            </span>
                          )}
                          <div className="bbf-apr-rec-point__body">
                            <div className="bbf-apr-rec-point__key">{pt.key}</div>
                            <div className="bbf-apr-rec-point__value">{pt.value}</div>
                            {pt.data && (
                              <div className="bbf-apr-rec-point__data">
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M6 9.5V2.5M3 5l3-3 3 3"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {pt.data}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {projection && (
                      <div className="bbf-apr-rec-card__foot">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 12.5l5 5L20 6"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {projection}
                      </div>
                    )}
                  </div>
                  <div className="bbf-wa-meta">
                    <span className="bbf-wa-time">{msg.time ?? '9:42'}</span>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`bbf-wa-row bbf-wa-row--${msg.who}`}>
              <div className={`bbf-wa-bubble bbf-wa-bubble--${msg.who}`}>
                <span className="bbf-wa-text">{msg.text}</span>
                <span className="bbf-wa-meta">
                  <span className="bbf-wa-time">{msg.time ?? '9:41'}</span>
                  {/* User has double checks, brain does not */}
                  {msg.who === 'user' && (
                    <span className="bbf-wa-checks-wrap">
                      <span className="bbf-wa-checks" />
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

        {askVisible && (
          <div className="bbf-apr-quickrow">
            <button className="bbf-apr-quick bbf-apr-quick--primary" tabIndex={-1}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h11l3 3v13H5V4z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {ui.quickYes}
            </button>
            <button className="bbf-apr-quick" tabIndex={-1}>
              {ui.quickAdjust}
            </button>
          </div>
        )}
      </div>

      <div className="bbf-wa-inputbar">
        <div className="bbf-wa-input">
          <svg
            className="bbf-wa-input-emoji"
            width="20"
            height="20"
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
          <span className={hasText ? 'bbf-wa-input-text' : 'bbf-wa-input-text is-placeholder'}>
            {hasText ? inputText : ui.inputPlaceholder}
            {hasText && <span className="bbf-wa-caret" />}
          </span>
          <svg
            className="bbf-wa-input-clip"
            width="20"
            height="20"
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
            width="20"
            height="20"
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
          className={hasText ? 'bbf-wa-send is-send' : 'bbf-wa-send'}
          aria-label={ui.sendAriaLabel}
          aria-hidden={true}
          tabIndex={-1}
        >
          {hasText ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 11.5L21 3l-8.5 18-2.2-7.3L3 11.5z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="9"
                y="3"
                width="6"
                height="11"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.6"
              />
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
    </>
  );
}

// ── AprendizajePlayer ─────────────────────────────────────────────────────────
export interface AprendizajePlayerProps {
  insightsTitle: string;
  postImageUrl: string | null;
  postImageAlt: string;
  postCaption: string;
  platformLabel: string;
  timeLabel: string;
  recPoints: RecPoint[];
  projection: string;
  ui: AprendizajeUI;
}

export function AprendizajePlayer({
  insightsTitle,
  postImageUrl,
  postImageAlt,
  postCaption,
  platformLabel,
  timeLabel,
  recPoints,
  projection,
  ui,
}: AprendizajePlayerProps) {
  const [phase, setPhase] = useState<'insights' | 'chat'>('insights');
  // loopIsActive as state so React re-renders when IO fires (ref alone won't trigger re-render)
  const [loopIsActive, setLoopIsActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loopActive = useRef(false);
  const runId = useRef(0);

  const handleChatDone = useCallback(() => {
    setPhase('insights');
  }, []);

  // Insights → chat after 7.2s (deps include loopIsActive so timer fires when IO activates)
  useEffect(() => {
    if (phase !== 'insights' || !loopIsActive) return;
    const t = setTimeout(() => {
      if (loopActive.current) setPhase('chat');
    }, 7200);
    return () => clearTimeout(t);
  }, [phase, loopIsActive]);

  // IntersectionObserver — start/stop loop on viewport entry/exit
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loopActive.current = true;
          setLoopIsActive(true);
          setPhase('insights');
        } else {
          loopActive.current = false;
          setLoopIsActive(false);
          runId.current++;
          setPhase('insights');
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // prefers-reduced-motion: lock to static insights
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      loopActive.current = false;
    }
  }, []);

  return (
    <div
      className="bbf-app-screen bbf-app-aprendizaje"
      ref={wrapperRef}
      data-component="bbf-aprendizaje"
    >
      <div className="bbf-app-phone">
        <div className="bbf-app-phone__screen">
          {/* Pane 1: InsightsScreen — app chrome */}
          <div
            className={
              phase === 'insights'
                ? 'bbf-apr-pane bbf-apr-pane--in'
                : 'bbf-apr-pane bbf-apr-pane--left'
            }
            aria-hidden={phase !== 'insights'}
          >
            <InsightsPane
              active={phase === 'insights' && loopIsActive}
              insightsTitle={insightsTitle}
              postImageUrl={postImageUrl}
              postImageAlt={postImageAlt}
              postCaption={postCaption}
              platformLabel={platformLabel}
              timeLabel={timeLabel}
              ui={ui}
            />
          </div>

          {/* Pane 2: RecChat — WA chrome. .bbf-wa-chat provee --wa-* vars. */}
          <div
            className={
              phase === 'chat'
                ? 'bbf-apr-pane bbf-wa-chat bbf-apr-pane--in'
                : 'bbf-apr-pane bbf-wa-chat bbf-apr-pane--right'
            }
            aria-hidden={phase !== 'chat'}
          >
            <RecChatPane
              active={phase === 'chat'}
              onDone={handleChatDone}
              recPoints={recPoints}
              projection={projection}
              runId={runId}
              ui={ui}
            />
          </div>
        </div>
      </div>

      {/* Step indicator — pill style (prototipo) */}
      <div className="bbf-apr-steps" role="tablist" aria-label={ui.stepsAriaLabel}>
        <div
          className={phase === 'insights' ? 'bbf-apr-step bbf-apr-step--active' : 'bbf-apr-step'}
          role="tab"
          aria-selected={phase === 'insights'}
        >
          <span className="bbf-apr-step__n" aria-hidden="true">
            1
          </span>
          <span className="bbf-apr-step__l">{ui.step1Label}</span>
        </div>
        <span className="bbf-apr-step__arrow" aria-hidden="true">
          →
        </span>
        <div
          className={phase === 'chat' ? 'bbf-apr-step bbf-apr-step--active' : 'bbf-apr-step'}
          role="tab"
          aria-selected={phase === 'chat'}
        >
          <span className="bbf-apr-step__n" aria-hidden="true">
            2
          </span>
          <span className="bbf-apr-step__l">{ui.step2Label}</span>
        </div>
      </div>
    </div>
  );
}

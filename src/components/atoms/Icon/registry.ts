/**
 * BBF Design System — Icon registry canon (D-108)
 *
 * Registro centralizado de íconos Lucide con nombres semánticos BBF.
 * Keys semánticos → componentes Lucide (aliased names).
 *
 * Uso:
 *   import { Icons, Icon } from '@/components/atoms/Icon';
 *   <Icon icon={Icons.arrowRight} size="md" />
 *
 * Decisión: D-108 (Icon registry centralizado)
 * Librería: Lucide (D-83)
 */

import {
  // Navigation
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ExternalLink,
  Home,
  // Actions
  Search,
  Plus,
  Minus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Filter,
  // Status
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
  Eye,
  EyeOff,
  // Communication
  Mail,
  Phone,
  MessageSquare,
  Send,
  Bell,
  // Content
  FileText,
  Image,
  Video,
  Play,
  Pause,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Bookmark,
  Link,
  // User
  User,
  Users,
  Settings,
  LogOut,
  LogIn,
  Globe,
  // Brand / Decorative
  Sparkles,
  Zap,
  Building2,
  Briefcase,
  Target,
  Layers,
  Award,
  TrendingUp,
  Heart,
} from 'lucide-react';

export const Icons = {
  // ── Navigation ────────────────────────────────────────
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  menu: Menu,
  close: X,
  externalLink: ExternalLink,
  home: Home,

  // ── Actions ───────────────────────────────────────────
  search: Search,
  plus: Plus,
  minus: Minus,
  edit: Pencil,
  trash: Trash2,
  download: Download,
  upload: Upload,
  share: Share2,
  copy: Copy,
  check: Check,
  refresh: RefreshCw,
  filter: Filter,

  // ── Status ────────────────────────────────────────────
  checkCircle: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  alert: AlertCircle,
  info: Info,
  loading: Loader2,
  eye: Eye,
  eyeOff: EyeOff,

  // ── Communication ─────────────────────────────────────
  mail: Mail,
  phone: Phone,
  message: MessageSquare,
  send: Send,
  bell: Bell,

  // ── Content ───────────────────────────────────────────
  file: FileText,
  image: Image,
  video: Video,
  play: Play,
  pause: Pause,
  bookOpen: BookOpen,
  calendar: Calendar,
  clock: Clock,
  star: Star,
  bookmark: Bookmark,
  link: Link,

  // ── User ──────────────────────────────────────────────
  user: User,
  users: Users,
  settings: Settings,
  logout: LogOut,
  login: LogIn,
  globe: Globe,

  // ── Brand / Decorative ────────────────────────────────
  sparkles: Sparkles,
  zap: Zap,
  building: Building2,
  briefcase: Briefcase,
  target: Target,
  layers: Layers,
  award: Award,
  trending: TrendingUp,
  heart: Heart,
} as const;

export type IconCanon = keyof typeof Icons;

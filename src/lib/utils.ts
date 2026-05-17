/**
 * BBF Design System — cn() helper canon
 *
 * Subordinado a: BBF_M5_Framework_Plan.md §5.4
 * Decisión: D-BBF-WEB-63 (CVA + tailwind-merge + clsx)
 *
 * NOTA M5-A: clsx y tailwind-merge se instalan en M5-D.
 * Por ahora exportamos versión simplificada que M5-D actualizará.
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

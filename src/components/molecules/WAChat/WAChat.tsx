/**
 * WAChat — Server Component shell for the wa-chat CapabilityScene kind.
 * Passes admin data to WASequence (Client leaf). D-99 pattern.
 * Piel WA encapsulada en .bbf-wa-chat via capabilities-wa.css (NOT BBF system tokens).
 */
import type { SceneWAChatData } from '../CapabilityScene/types';
import { WASequence } from './WASequence';

interface WAChatProps {
  data: SceneWAChatData;
}

export function WAChat({ data }: WAChatProps) {
  const messages = (data.messages ?? []).map((m) => ({
    id: m.id ?? undefined,
    who: m.who as 'user' | 'brain',
    text: m.text ?? '',
    time: m.time ?? '23:04',
  }));

  return (
    <div className="bbf-wa-chat" data-component="bbf-wa-chat">
      <WASequence
        messages={messages}
        contactName={data.contactName ?? 'Brain'}
        footer={data.footer ?? undefined}
      />
    </div>
  );
}

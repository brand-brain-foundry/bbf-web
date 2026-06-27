/**
 * WAAgenda — Server Component shell for the wa-agenda CapabilityScene kind.
 * D-WAG-01: altura 720px (capabilities-wa-agenda.css). Reutiliza .bbf-wa-* chrome.
 * Passes typed admin data to WAAgendaSequence (Client leaf). D-99 pattern.
 */
import type { SceneWAAgendaData } from '../CapabilityScene/types';
import { WAAgendaSequence } from './WAAgendaSequence';

interface WAAgendaProps {
  data: SceneWAAgendaData;
}

export function WAAgenda({ data }: WAAgendaProps) {
  const meetRaw = data.meetCard ?? {};
  const invitees = (meetRaw.invitees ?? []).map((inv) => ({
    id: inv.id ?? undefined,
    name: inv.name ?? '',
    email: inv.email ?? '',
  }));
  const quickReplies = (data.quickReplies ?? []).map((qr) => ({
    id: qr.id ?? undefined,
    label: qr.label ?? '',
  }));

  return (
    <div className="bbf-wa-chat bbf-wa-agenda" data-component="bbf-wa-agenda">
      <WAAgendaSequence
        contactName={data.contactName ?? 'Brain'}
        briefText={data.briefText ?? ''}
        confirmText={data.confirmText ?? ''}
        meetCard={{
          title: meetRaw.title ?? '',
          day: meetRaw.day ?? '',
          time: meetRaw.time ?? '',
          timezone: meetRaw.timezone ?? 'GMT-6',
          link: meetRaw.link ?? '',
          invitees,
        }}
        inviteSentText={data.inviteSentText ?? ''}
        askText={data.askText ?? ''}
        quickReplies={quickReplies}
        closingText={data.closingText ?? ''}
      />
    </div>
  );
}

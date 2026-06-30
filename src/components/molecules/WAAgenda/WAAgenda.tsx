/**
 * WAAgenda — Server Component shell for the wa-agenda CapabilityScene kind.
 * D-WAG-01: altura 720px (capabilities-wa-agenda.css). Reutiliza .bbf-wa-* chrome.
 * Passes typed admin data to WAAgendaSequence (Client leaf). D-99 pattern.
 */
import { getTranslations } from 'next-intl/server';
import type { SceneWAAgendaData } from '../CapabilityScene/types';
import { WAAgendaSequence } from './WAAgendaSequence';
import type { WAAgendaUI } from './WAAgendaSequence';

interface WAAgendaProps {
  data: SceneWAAgendaData;
}

export async function WAAgenda({ data }: WAAgendaProps) {
  const [tWa, tAgenda] = await Promise.all([
    getTranslations('capabilities.scenes.wa'),
    getTranslations('capabilities.scenes.waAgenda'),
  ]);
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

  const ui: WAAgendaUI = {
    backAriaLabel: tWa('backAriaLabel'),
    statusTyping: tWa('statusTyping'),
    statusOnline: tWa('statusOnline'),
    daystamp: tWa('daystamp'),
    encrypted: tWa('encrypted'),
    inputPlaceholder: tWa('inputPlaceholder'),
    sendAriaLabel: tWa('sendAriaLabel'),
    voiceAriaLabel: tWa('voiceAriaLabel'),
    inviteeSent: tAgenda('inviteeSent'),
    inviteeSending: tAgenda('inviteeSending'),
    copyLinkLabel: tAgenda('copyLinkLabel'),
    copiedLinkLabel: tAgenda('copiedLinkLabel'),
    inviteesPrefix: tAgenda('inviteesPrefix'),
    copyMeetAriaPrefix: tAgenda('copyMeetAriaPrefix'),
    joinCallLabel: tAgenda('joinCallLabel'),
  };

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
        ui={ui}
      />
    </div>
  );
}

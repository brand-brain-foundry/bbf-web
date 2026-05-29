/**
 * CapabilityScene — D-85 monolítica polymorphic, Server Component
 * Renders one of 5 scene kinds: chat | pipeline | workflow | stack | media.
 * All data via props from Payload. No 'use client'.
 */
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { SceneData } from './types';

interface CapabilitySceneProps {
  scene: SceneData;
}

export async function CapabilityScene({ scene }: CapabilitySceneProps) {
  const t = await getTranslations('capabilities.scenes.states');

  if (scene.kind === 'chat') {
    const chat = scene.chat;
    return (
      <div
        data-component="bbf-capability-scene"
        data-kind="chat"
        className="bbf-cap-scene bbf-cap-chat"
      >
        <div className="bbf-cap-scene__head">{scene.meta}</div>
        <div className="bbf-cap-scene__body bbf-cap-chat__messages">
          {chat?.messages?.map((msg, i) => (
            <div key={msg.id ?? i} className={`bbf-cap-chat__msg bbf-cap-chat__msg--${msg.who}`}>
              {msg.text}
            </div>
          ))}
        </div>
        {chat?.footer && <div className="bbf-cap-scene__footer">{chat.footer}</div>}
      </div>
    );
  }

  if (scene.kind === 'pipeline') {
    const pipeline = scene.pipeline;
    return (
      <div
        data-component="bbf-capability-scene"
        data-kind="pipeline"
        className="bbf-cap-scene bbf-cap-pipe"
      >
        <div className="bbf-cap-scene__head">{scene.meta}</div>
        <div className="bbf-cap-scene__body">
          <ol className="bbf-cap-pipe__steps">
            {pipeline?.steps?.map((step, i) => (
              <li
                key={step.id ?? i}
                className={`bbf-cap-pipe__row bbf-cap-pipe__row--${step.state}`}
              >
                <span className="bbf-cap-pipe__dot" aria-hidden="true" />
                <div>
                  <div className="bbf-cap-pipe__label">{step.label}</div>
                  <div className="bbf-cap-pipe__detail">{step.detail}</div>
                </div>
                <span className="bbf-cap-pipe__state">{t(step.state)}</span>
              </li>
            ))}
          </ol>
        </div>
        {pipeline?.footer && <div className="bbf-cap-scene__footer">{pipeline.footer}</div>}
      </div>
    );
  }

  if (scene.kind === 'workflow') {
    const workflow = scene.workflow;
    const nodes = workflow?.nodes ?? [];
    const edges = workflow?.edges ?? [];
    return (
      <div
        data-component="bbf-capability-scene"
        data-kind="workflow"
        className="bbf-cap-scene bbf-cap-workflow"
      >
        <div className="bbf-cap-scene__head">{scene.meta}</div>
        <div className="bbf-cap-scene__body bbf-cap-workflow">
          <svg
            className="bbf-cap-workflow__svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {edges.map((edge, i) => {
              const fromNode = nodes[edge.from];
              const toNode = nodes[edge.to];
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={edge.id ?? i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className="bbf-cap-workflow__edge"
                  strokeDasharray="0.6 0.6"
                />
              );
            })}
          </svg>
          {nodes.map((node, i) => (
            <div
              key={node.id ?? i}
              className={`bbf-cap-workflow__node-wrap bbf-cap-workflow__node-wrap--${node.kind}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` } as CSSProperties}
            >
              <span className="bbf-cap-workflow__dot" aria-hidden="true" />
              <span
                className={`bbf-cap-workflow__node-label bbf-cap-workflow__node-label--${node.kind}`}
              >
                {node.label}
              </span>
            </div>
          ))}
        </div>
        {workflow?.footer && <div className="bbf-cap-scene__footer">{workflow.footer}</div>}
      </div>
    );
  }

  if (scene.kind === 'stack') {
    const stack = scene.stack;
    return (
      <div
        data-component="bbf-capability-scene"
        data-kind="stack"
        className="bbf-cap-scene bbf-cap-stack"
      >
        <div className="bbf-cap-scene__head">{scene.meta}</div>
        <div className="bbf-cap-scene__body">
          <div className="bbf-cap-stack__groups">
            {stack?.groups?.map((group, i) => (
              <div key={group.id ?? i}>
                <div className="bbf-cap-stack__group-label">{group.label}</div>
                <div className="bbf-cap-stack__chips">
                  {group.items?.map((item, j) => (
                    <span key={item.id ?? j} className="bbf-cap-stack__chip">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {stack?.footer && <div className="bbf-cap-scene__footer">{stack.footer}</div>}
      </div>
    );
  }

  if (scene.kind === 'media') {
    const media = scene.media;
    if (!media || typeof media.asset !== 'object' || media.asset === null) {
      return null;
    }
    const asset = media.asset;
    const isVideo = media.mediaType === 'video';
    const altText = asset.alt ?? '';
    const posterUrl =
      typeof media.posterFallback === 'object' && media.posterFallback !== null
        ? (media.posterFallback.url ?? undefined)
        : undefined;
    return (
      <div
        data-component="bbf-capability-scene"
        data-kind="media"
        className="bbf-cap-scene bbf-cap-media"
      >
        <div className="bbf-cap-media__frame">
          {isVideo ? (
            <video
              src={asset.url ?? undefined}
              poster={posterUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-label={altText}
              className="bbf-cap-media__video"
            />
          ) : (
            <Image
              src={asset.url ?? ''}
              alt={altText}
              width={asset.width ?? 540}
              height={asset.height ?? 960}
              sizes="(max-width: 920px) 100vw, 50vw"
              className="bbf-cap-media__image"
            />
          )}
        </div>
        {media.caption && <p className="bbf-cap-media__caption">{media.caption}</p>}
        {media.footer && <p className="bbf-cap-scene__footer">{media.footer}</p>}
      </div>
    );
  }

  return null;
}

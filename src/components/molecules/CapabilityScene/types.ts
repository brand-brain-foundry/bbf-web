/**
 * CapabilityScene types — derived from Payload generated types (C-01).
 * No redefinitions — only aliases and narrowing helpers.
 */
import type { SiteHomepage } from '@/payload/payload-types';

type CapabilityItem = NonNullable<
  NonNullable<NonNullable<SiteHomepage['capabilities']>['items']>[number]
>;

export type SceneData = CapabilityItem['scene'];
export type SceneKind = SceneData['kind'];

export type SceneChatData = NonNullable<SceneData['chat']>;
export type ScenePipelineData = NonNullable<SceneData['pipeline']>;
export type SceneWorkflowData = NonNullable<SceneData['workflow']>;
export type SceneStackData = NonNullable<SceneData['stack']>;

export type PipelineStep = NonNullable<ScenePipelineData['steps']>[number];
export type WorkflowNode = NonNullable<SceneWorkflowData['nodes']>[number];
export type WorkflowEdge = NonNullable<SceneWorkflowData['edges']>[number];
export type StackGroup = NonNullable<SceneStackData['groups']>[number];

export type SceneMediaData = NonNullable<SceneData['media']>;

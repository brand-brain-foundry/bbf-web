import type { Block } from 'payload';

export const CodeBlock: Block = {
  slug: 'code',
  labels: { singular: 'Code', plural: 'Code Blocks' },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TSX / JSX', value: 'tsx' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'JSON', value: 'json' },
        { label: 'Bash / Shell', value: 'bash' },
        { label: 'SQL', value: 'sql' },
        { label: 'Python', value: 'python' },
        { label: 'Plain text', value: 'text' },
      ],
    },
    {
      name: 'filename',
      type: 'text',
      admin: { description: 'Optional filename shown above the code block' },
    },
    {
      name: 'content',
      type: 'code',
      required: true,
      admin: { language: 'javascript' },
    },
    {
      name: 'lineNumbers',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};

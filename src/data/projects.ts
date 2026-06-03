export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  repo: string;
  highlights?: string[];
}

export const projects: Project[] = [
  {
    id: 'nat-gate',
    name: 'nat-gate',
    description: 'CLI tool for iptables port forwarding through Tailscale tunnels. Interactive TUI, multiple install methods, IPv4/IPv6, rate limiting.',
    tags: ['Rust', 'CLI', 'Networking', 'Tailscale'],
    image: '/images/img-3.jpg',
    repo: 'https://github.com/h3nr1-d14z/nat-gate',
    highlights: ['Rust-based CLI with interactive TUI', 'Tailscale tunnel integration', 'IPv4/IPv6 dual-stack support', 'Rate limiting & security controls'],
  },
  {
    id: 'ai-redteam-toolkit',
    name: 'ai-redteam-toolkit',
    description: 'AI-powered offensive security framework. 78 slash commands for pentest, red team, RE, game hacking, OSINT, forensics. Works with Claude Code & OpenCode.',
    tags: ['Python', 'Security', 'AI', 'Offensive'],
    image: '/images/img-1.jpg',
    repo: 'https://github.com/h3nr1-d14z/ai-redteam-toolkit',
    highlights: ['78+ specialized slash commands', 'Claude Code & OpenCode integration', 'Covers pentest, RE, OSINT, forensics', 'AI-assisted vulnerability research'],
  },
  {
    id: 'omnigraph',
    name: 'OmniGraph',
    description: 'Distributed RAG-MCP server for AI code assistance: local-first, read-only, hybrid semantic + lexical search over Qdrant + Memgraph + Tree-sitter, with a Go file watcher and 4-tool MCP bridge to Claude Code.',
    tags: ['Python', 'Go', 'Qdrant', 'Memgraph'],
    image: '/images/img-2.jpg',
    repo: 'https://github.com/h3nr1-d14z/OmniGraph',
    highlights: ['Local-first RAG architecture', 'Hybrid semantic + lexical search', 'Qdrant vector DB + Memgraph graph DB', 'MCP bridge for Claude Code'],
  },
  {
    id: 'codeforces-minecraft',
    name: 'codeforces-minecraft',
    description: 'Minecraft mod where players solve competitive programming problems for in-game rewards. ICPC-style scoring, because why not.',
    tags: ['Java', 'Fabric', 'Minecraft', 'Gaming'],
    image: '/images/img-4.jpg',
    repo: 'https://github.com/h3nr1-d14z/codeforces-minecraft',
    highlights: ['Minecraft Fabric mod', 'Codeforces API integration', 'ICPC-style scoring system', 'In-game reward mechanics'],
  },
  {
    id: 'memviz',
    name: 'memviz',
    description: 'C++ memory & algorithm visualizer built for students who learn by seeing.',
    tags: ['TypeScript', 'React', 'Education', 'C++'],
    image: '/images/img-5.jpg',
    repo: 'https://github.com/h3nr1-d14z/memviz',
    highlights: ['Interactive memory visualization', 'Algorithm step-through', 'Built for educational use', 'React + TypeScript frontend'],
  },
  {
    id: 'messenger-desktop',
    name: 'messenger-desktop',
    description: 'Unofficial Messenger desktop app with native features.',
    tags: ['TypeScript', 'Electron', 'Desktop'],
    image: '/images/img-6.jpg',
    repo: 'https://github.com/h3nr1-d14z/messenger-desktop',
    highlights: ['Electron-based desktop wrapper', 'Native OS integrations', 'Custom UI enhancements', 'Cross-platform support'],
  },
];

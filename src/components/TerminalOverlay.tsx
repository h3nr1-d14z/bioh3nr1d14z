import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Terminal } from 'lucide-react';

interface Command {
  input: string;
  output: string[];
}

const COMMANDS: Record<string, string[]> = {
  help: [
    'Available commands:',
    '  whoami     - About me',
    '  skills     - Tech stack overview',
    '  projects   - Featured projects',
    '  contact    - Contact information',
    '  socials    - Social media links',
    '  clear      - Clear terminal',
    '  exit       - Close terminal',
  ],
  whoami: [
    'h3nr1.d14z / Luna Zamora',
    'Game Dev · Full-Stack · DevOps Engineer',
    'Based in Hanoi, Vietnam',
    'I build systems that shouldn\'t exist,',
    'secure what shouldn\'t be broken,',
    'and ship what others call impossible.',
  ],
  skills: [
    'Tech Arsenal:',
    '  Systems:     Rust, Go, C++, Linux',
    '  Backend:     Python, Node.js, PostgreSQL, MongoDB',
    '  Frontend:    React, TypeScript, Three.js, Tailwind',
    '  DevOps:      Docker, Kubernetes, AWS, Cloudflare',
    '  Security:    Pentesting, Red Team, Reverse Engineering',
  ],
  projects: [
    'Featured Systems:',
    '  OmniGraph              - Distributed RAG-MCP server',
    '  ai-redteam-toolkit     - AI-powered offensive security',
    '  nat-gate               - iptables port forwarding CLI',
    '  codeforces-minecraft   - CP problems in Minecraft',
    '  memviz                 - Memory & algorithm visualizer',
  ],
  contact: [
    'Contact:',
    '  Email:     h3nr1.d14z@example.com',
    '  Location:  Hanoi, Vietnam',
    '  Discord:   h3nr1.d14z',
  ],
  socials: [
    'Social Media:',
    '  GitHub:    https://github.com/h3nr1-d14z',
    '  Facebook:  https://www.facebook.com/h3nr1.d14z',
  ],
  clear: [],
  exit: ['Closing terminal...'],
};

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([
    { input: '', output: ['Type "help" to see available commands.'] },
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === 'clear') {
      setCommands([]);
      return;
    }

    if (trimmed === 'exit') {
      setCommands(prev => [...prev, { input: cmd, output: COMMANDS[trimmed] }]);
      setTimeout(() => setIsOpen(false), 500);
      return;
    }

    const output = COMMANDS[trimmed] || [`Command not found: ${trimmed}. Type "help" for available commands.`];
    setCommands(prev => [...prev, { input: cmd, output }]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="terminal-overlay">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-header-left">
            <Terminal size={16} />
            <span>h3nr1.d14z@portfolio:~</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="terminal-close">
            <X size={16} />
          </button>
        </div>

        <div ref={terminalRef} className="terminal-body">
          {commands.map((cmd, i) => (
            <div key={i} className="terminal-command-block">
              {cmd.input && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">$</span>
                  <span>{cmd.input}</span>
                </div>
              )}
              {cmd.output.map((line, j) => (
                <div key={j} className="terminal-output-line">
                  {line}
                </div>
              ))}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="terminal-input"
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

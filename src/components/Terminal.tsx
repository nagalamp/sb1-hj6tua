import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();
    
    xtermRef.current = term;

    term.writeln('Microsoft(R) Windows DOS');
    term.writeln('(C) Microsoft Corp 1990-1992.');
    term.writeln('');
    term.write('C:\\>');

    term.onKey(({ key, domEvent }) => {
      const char = key;
      
      if (domEvent.keyCode === 13) {
        term.write('\r\nC:\\>');
      } else if (domEvent.keyCode === 8) {
        if (term.buffer.active.cursorX > 4) {
          term.write('\b \b');
        }
      } else {
        term.write(char);
      }
    });

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={terminalRef} className="h-full" />;
}
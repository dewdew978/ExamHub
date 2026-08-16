import { useState, useRef, useEffect } from 'react';
import { Calculator as CalcIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { evaluate } from 'mathjs';

export default function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleInput = (val) => {
    setExpression((prev) => prev + val);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculate = () => {
    if (!expression) return;
    try {
      // Replace some common string patterns to match mathjs
      // e.g., mathjs uses log10 for base 10, log for natural log (ln)
      let parsedExpr = expression
        .replace(/ln\(/g, 'log(')
        .replace(/log\(/g, 'log10(') // This means if user types log(), it becomes log10()
        .replace(/π/g, 'pi')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      const res = evaluate(parsedExpr);
      const formattedRes = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString();
      
      setResult(formattedRes);
      setHistory(prev => [...prev.slice(-4), { expr: expression, res: formattedRes }]);
      setExpression(formattedRes); // Ready for next calculation
    } catch (err) {
      setResult('Error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    }
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const del = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
        title="เครื่องคิดเลขวิทยาศาสตร์"
      >
        <CalcIcon size={24} />
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: isMinimized ? '2rem' : '2rem',
        right: '2rem',
        width: '320px',
        background: 'var(--surface)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px var(--border-divider)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      className="animate-fade-in"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: 'var(--surface-hover)',
        borderBottom: '1px solid var(--border-divider)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
          <CalcIcon size={16} style={{ color: 'var(--text-muted)' }} />
          Scientific Calculator
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div style={{ padding: '1rem' }}>
          {/* Display */}
          <div style={{
            background: 'var(--surface-active)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.25rem',
            minHeight: '80px'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', height: '20px' }}>
              {history.length > 0 && result !== 'Error' && history[history.length-1].expr + ' ='}
            </div>
            <input 
              ref={inputRef}
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: '1.5rem',
                fontWeight: 600,
                textAlign: 'right',
                width: '100%',
                outline: 'none'
              }}
            />
            {result === 'Error' && <div style={{ color: 'var(--error)', fontSize: '0.75rem' }}>Syntax Error</div>}
          </div>

          {/* Keypad */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '0.5rem' 
          }}>
            {/* Row 1 */}
            <Btn onClick={() => handleInput('sin(')} color="var(--surface-hover)">sin</Btn>
            <Btn onClick={() => handleInput('cos(')} color="var(--surface-hover)">cos</Btn>
            <Btn onClick={() => handleInput('tan(')} color="var(--surface-hover)">tan</Btn>
            <Btn onClick={() => handleInput('log(')} color="var(--surface-hover)">log</Btn>
            <Btn onClick={() => handleInput('ln(')} color="var(--surface-hover)">ln</Btn>
            
            {/* Row 2 */}
            <Btn onClick={() => handleInput('(')} color="var(--surface-hover)">(</Btn>
            <Btn onClick={() => handleInput(')')} color="var(--surface-hover)">)</Btn>
            <Btn onClick={() => handleInput('^')} color="var(--surface-hover)">x^y</Btn>
            <Btn onClick={() => handleInput('sqrt(')} color="var(--surface-hover)">√</Btn>
            <Btn onClick={() => handleInput('e')} color="var(--surface-hover)">e</Btn>

            {/* Row 3 */}
            <Btn onClick={() => handleInput('7')}>7</Btn>
            <Btn onClick={() => handleInput('8')}>8</Btn>
            <Btn onClick={() => handleInput('9')}>9</Btn>
            <Btn onClick={del} color="rgba(239, 68, 68, 0.1)" textColor="var(--error)">DEL</Btn>
            <Btn onClick={clear} color="rgba(239, 68, 68, 0.1)" textColor="var(--error)">AC</Btn>

            {/* Row 4 */}
            <Btn onClick={() => handleInput('4')}>4</Btn>
            <Btn onClick={() => handleInput('5')}>5</Btn>
            <Btn onClick={() => handleInput('6')}>6</Btn>
            <Btn onClick={() => handleInput('*')} color="var(--surface-active)">×</Btn>
            <Btn onClick={() => handleInput('/')} color="var(--surface-active)">÷</Btn>

            {/* Row 5 */}
            <Btn onClick={() => handleInput('1')}>1</Btn>
            <Btn onClick={() => handleInput('2')}>2</Btn>
            <Btn onClick={() => handleInput('3')}>3</Btn>
            <Btn onClick={() => handleInput('+')} color="var(--surface-active)">+</Btn>
            <Btn onClick={() => handleInput('-')} color="var(--surface-active)">-</Btn>

            {/* Row 6 */}
            <Btn onClick={() => handleInput('0')} style={{ gridColumn: 'span 2' }}>0</Btn>
            <Btn onClick={() => handleInput('.')}>.</Btn>
            <Btn onClick={calculate} color="var(--primary)" textColor="var(--bg)" style={{ gridColumn: 'span 2' }}>=</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, color = 'transparent', textColor = 'var(--text)', style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        border: '1px solid var(--border-divider)',
        color: textColor,
        borderRadius: '6px',
        padding: '0.75rem 0',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
      onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
    >
      {children}
    </button>
  );
}

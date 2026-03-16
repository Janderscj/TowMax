import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

function QuestionAxleRatio({ onAnswer, options, currentValue }) {
  const [selected, setSelected] = useState(currentValue || null);

  useEffect(() => {
    if (currentValue) {
      setSelected(currentValue);
    }
  }, [currentValue]);

  if (!options) return null;
  const ratios = options.axleRatio ?? [];

  const handleSelect = (value) => {
    setSelected(value);
    onAnswer('axleRatio', value);
  };

  return (
    <div>
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px',
          letterSpacing: '-0.3px',
        }}
      >
        What is your axle ratio?
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {ratios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => handleSelect(ratio)}
            style={{
              width: '100%',
              padding: '18px 20px',
              background: selected === ratio ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.05)',
              border:
                selected === ratio
                  ? '2px solid rgba(255,140,0,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              if (selected !== ratio) {
                e.currentTarget.style.background = 'rgba(255,140,0,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,140,0,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== ratio) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            <span>{ratio}</span>
            {selected === ratio && (
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ff8c00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#000',
                }}
              >
                ✓
              </span>
            )}
            {selected !== ratio && <ArrowRight size={18} style={{ opacity: 0.3 }} />}
          </button>
        ))}

        <button
          onClick={() => handleSelect("I'm not sure")}
          style={{
            width: '100%',
            padding: '18px 20px',
            background:
              selected === "I'm not sure" ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
            border:
              selected === "I'm not sure"
                ? '2px dashed rgba(255,255,255,0.3)'
                : '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: selected === "I'm not sure" ? '#fff' : '#888',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            if (selected !== "I'm not sure") {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== "I'm not sure") {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          <span>I'm not sure</span>
          {selected === "I'm not sure" && (
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              ✓
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuestionAxleRatio;

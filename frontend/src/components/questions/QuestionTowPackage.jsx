import { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function isOptionInMatches(matches, field, optionValue) {
  if (!Array.isArray(matches) || matches.length === 0) return true;

  const normalizedOption = normalize(optionValue);
  return matches.some((match) => {
    const candidate = normalize(match?.[field]);
    if (!candidate) return false;
    return (
      candidate === normalizedOption ||
      candidate.includes(normalizedOption) ||
      normalizedOption.includes(candidate)
    );
  });
}

function QuestionTowPackage({ onAnswer, options, matches, currentValue, disabled = false }) {
  const [selected, setSelected] = useState(currentValue || null);

  // Local narrowing layer: only render options that still exist in remaining matches.
  const visibleTowPackages = useMemo(() => {
    const towPackages = options?.towPackage ?? [];
    return towPackages.filter((pkg) => isOptionInMatches(matches, 'towPackage', pkg));
  }, [options, matches]);

  useEffect(() => {
    if (currentValue) {
      setSelected(currentValue);
    }
  }, [currentValue]);

  if (!options) return null;

  const handleSelect = (value) => {
    setSelected(value);
    onAnswer('towPackage', value);
  };

  return (
    // Wrapper dims and blocks all clicks while a refine call is in-flight,
    // preventing impossible combinations from being selected.
    <div
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.2s',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px',
          letterSpacing: '-0.3px',
        }}
      >
        Does your truck have a tow package?
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {visibleTowPackages.map((pkg) => (
          <button
            key={pkg}
            onClick={() => handleSelect(pkg)}
            style={{
              width: '100%',
              padding: '18px 20px',
              background: selected === pkg ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.05)',
              border:
                selected === pkg
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
              if (selected !== pkg) {
                e.currentTarget.style.background = 'rgba(255,140,0,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,140,0,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== pkg) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            <span>{pkg}</span>
            {selected === pkg && (
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
            {selected !== pkg && <ArrowRight size={18} style={{ opacity: 0.3 }} />}
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

export default QuestionTowPackage;

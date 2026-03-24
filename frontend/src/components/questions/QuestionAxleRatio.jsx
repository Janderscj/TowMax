import { useMemo, useState, useEffect } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import HelpModalAxleRatio from './HelpModalAxleRatio';
import { guessAxleRatio } from '../../utils/guessAxleRatio';

function QuestionAxleRatio({
  onAnswer,
  options,
  currentValue,
  decoded,
  currentAnswers,
  disabled = false,
}) {
  const [selected, setSelected] = useState(currentValue || null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const ratios = options?.axleRatio ?? [];

  useEffect(() => {
    if (currentValue) {
      setSelected(currentValue);
    }
  }, [currentValue]);

  const guessResult = useMemo(() => {
    return guessAxleRatio({
      decoded,
      currentAnswers,
      options: options || {},
    });
  }, [decoded, currentAnswers, options]);

  if (!options) return null;

  const handleSelect = (value) => {
    setSelected(value);
    onAnswer('axleRatio', value);
  };

  const handleSmartGuess = () => {
    // If we have a confident single ratio, answer directly.
    if (guessResult.mode === 'exact' && guessResult.bestGuess) {
      handleSelect(guessResult.bestGuess);
      setShowHelpModal(false);
      return;
    }

    // If multiple ratios are plausible, intentionally use the existing
    // refine fallback path. Backend skips filtering for "I'm not sure"
    // and returns min/max range from all valid ratios.
    handleSelect("I'm not sure");
    setShowHelpModal(false);
  };

  const handleNotSureSelection = () => {
    // Requirement: selecting "I'm not sure" should still use smart-guess logic.
    if (guessResult.mode === 'exact' && guessResult.bestGuess) {
      handleSelect(guessResult.bestGuess);
      return;
    }

    // Ambiguous path: keep axle unknown so refine computes a min/max range.
    handleSelect("I'm not sure");
  };

  const guessSummary =
    guessResult.mode === 'exact' && guessResult.bestGuess
      ? `Best guess: ${guessResult.bestGuess} (${guessResult.reason})`
      : guessResult.mode === 'range'
        ? `Likely ratios: ${guessResult.likelyRatios.join(', ')}. We will use a towing range fallback.`
        : guessResult.reason;

  return (
    <>
      {/* Wrapper dims and blocks answer buttons while a refine call is in-flight,
          preventing impossible combinations. The help modal is rendered
          outside this div so it remains dismissible regardless of loading state. */}
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
          What is your axle ratio?
        </h3>

        <button
          onClick={() => setShowHelpModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px',
            border: 'none',
            background: 'transparent',
            color: '#ffb74d',
            fontSize: '13px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          <HelpCircle size={14} />
          How do I find this?
        </button>

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
            onClick={handleNotSureSelection}
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

      {/* Modal lives outside the disabled wrapper — position:fixed escapes
          normal flow and must remain interactive so the user can close it. */}
      {showHelpModal && (
        <HelpModalAxleRatio
          make={decoded?.make}
          guessSummary={guessSummary}
          onClose={() => setShowHelpModal(false)}
          onUseBestGuess={handleSmartGuess}
        />
      )}
    </>
  );
}

export default QuestionAxleRatio;

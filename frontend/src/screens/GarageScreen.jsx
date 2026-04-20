import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Car } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';

function GarageScreen({
  onVinSelect,
  onAddVehicle,
  onVehicleClick,
  onHome,
  onSignOut,
  onBack,
  isGuest = false,
  onLogin,
}) {
  const { user, profile, isFree, isPremium, isDealer } = useAuth();
  const [garage, setGarage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);

  useEffect(() => {
    if (!user || isDealer) {
      setLoading(false);
      return;
    }

    const loadGarage = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error('No session');

        const response = await fetch(`${API_URL}/api/garage`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch garage');
        }

        const data = await response.json();
        setGarage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGarage();
  }, [API_URL, user, isDealer]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveClick = (vehicleId) => {
    if (isFree) {
      setShowRemoveWarning(true);
      return;
    }
    removeVehicle(vehicleId);
  };

  const removeVehicle = async (vehicleId) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`${API_URL}/api/garage/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ vehicleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove vehicle');
      }

      setGarage(garage.filter((v) => v.id !== vehicleId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading garage...</div>
      </div>
    );
  }

  if (isDealer) {
    return (
      <div style={styles.container}>
        <div style={styles.dealerMessage}>
          <h2>Dealer Dashboard</h2>
          <p>As a dealer, you have direct access to VIN lookup tools.</p>
          <button onClick={() => onVinSelect()} style={styles.vinButton}>
            Go to VIN Lookup
          </button>
        </div>
      </div>
    );
  }

  const garageLimit = profile?.garage_limit;
  const garageLimitLabel =
    garageLimit == null ? 'Unlimited vehicles' : `${garage.length} / ${garageLimit} vehicles`;
  const garageFull = garageLimit != null && garage.length >= garageLimit;
  const disableAdd = isFree && garageFull;

  return (
    <div style={styles.container}>
      <AppHeader
        showBackButton={true}
        onBack={onBack}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <PageTitle>My Garage</PageTitle>

      <div style={styles.roleInfo}>
        <p style={styles.roleText}>
          {isFree ? 'Free Account' : isPremium ? 'Premium Account' : 'Unknown Role'}
        </p>
        <p style={styles.limitText}>{garageLimitLabel}</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {garageFull && (
        <div style={styles.notice}>
          Your garage is full. Find an exact match first, then upgrade to Premium to save unlimited
          vehicles.
        </div>
      )}

      <div style={styles.vehiclesList}>
        {garage.map((vehicle) => (
          <div
            key={vehicle.id}
            style={styles.vehicleCard}
            onClick={() => onVehicleClick(vehicle)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onVehicleClick(vehicle);
              }
            }}
            aria-label={`View details for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          >
            <div style={styles.vehicleInfo}>
              <Car size={24} style={styles.carIcon} />
              <div>
                <p style={styles.vehicleTitle}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.trim && ` ${vehicle.trim}`}
                </p>
                <p style={styles.vinText}>VIN: {vehicle.vin}</p>
              </div>
            </div>
            <div style={styles.vehicleActions}>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveClick(vehicle.id);
                }}
                style={styles.removeButton}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={!disableAdd ? onAddVehicle : undefined}
          disabled={disableAdd}
          style={{
            ...styles.addButton,
            opacity: disableAdd ? 0.5 : 1,
            cursor: disableAdd ? 'not-allowed' : 'pointer',
          }}
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {showRemoveWarning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowRemoveWarning(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '320px',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#ff6b6b',
                margin: '0 0 12px 0',
              }}
            >
              Free Account Restriction
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#ccc',
                lineHeight: '1.5',
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}
            >
              Free accounts cannot remove vehicles. Please upgrade to Premium to manage your garage.
            </p>
            <button
              onClick={() => setShowRemoveWarning(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 107, 107, 0.2)',
                border: '1px solid rgba(255, 107, 107, 0.4)',
                borderRadius: '8px',
                color: '#ff6b6b',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: 'white',
  },
  roleInfo: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  roleText: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  limitText: {
    color: '#ccc',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: '20px',
  },
  notice: {
    background: 'rgba(255, 140, 0, 0.12)',
    border: '1px solid rgba(255, 140, 0, 0.25)',
    color: '#ffb74d',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '20px',
    lineHeight: 1.5,
    fontSize: '0.95rem',
  },
  vehiclesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  vehicleCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  vehicleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  carIcon: {
    color: '#4ecdc4',
  },
  vehicleTitle: {
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  },
  vinText: {
    color: '#ccc',
    margin: 0,
    fontSize: '0.9rem',
  },
  vehicleActions: {
    display: 'flex',
    gap: '10px',
  },
  removeButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    background: '#4ecdc4',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
  },
  dealerMessage: {
    textAlign: 'center',
    padding: '50px',
  },
  vinButton: {
    background: '#4ecdc4',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginTop: '20px',
  },
};

export default GarageScreen;

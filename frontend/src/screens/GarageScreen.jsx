import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Car } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import styles from './GarageScreen.module.css';

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
      <div className={styles.container}>
        <div className={styles.loading}>Loading garage...</div>
      </div>
    );
  }

  if (isDealer) {
    return (
      <div className={styles.container}>
        <div className={styles.dealerMessage}>
          <h2>Dealer Dashboard</h2>
          <p>As a dealer, you have direct access to VIN lookup tools.</p>
          <button onClick={() => onVinSelect()} className={styles.vinButton}>
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
    <div className={styles.container}>
      <AppHeader
        showBackButton={true}
        onBack={onBack}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <PageTitle>My Garage</PageTitle>

      <div className={styles.roleInfo}>
        <p className={styles.roleText}>
          {isFree ? 'Free Account' : isPremium ? 'Premium Account' : 'Unknown Role'}
        </p>
        <p className={styles.limitText}>{garageLimitLabel}</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {garageFull && (
        <div className={styles.notice}>
          Your garage is full. Find an exact match first, then upgrade to Premium to save unlimited
          vehicles.
        </div>
      )}

      <div className={styles.vehiclesList}>
        {garage.map((vehicle) => (
          <div
            key={vehicle.id}
            className={styles.vehicleCard}
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
            <div className={styles.vehicleInfo}>
              <Car size={24} className={styles.carIcon} />
              <div>
                <p className={styles.vehicleTitle}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.trim && ` ${vehicle.trim}`}
                </p>
                <p className={styles.vinText}>VIN: {vehicle.vin}</p>
              </div>
            </div>
            <div className={styles.vehicleActions}>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveClick(vehicle.id);
                }}
                className={styles.removeButton}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={!disableAdd ? onAddVehicle : undefined}
          disabled={disableAdd}
          className={styles.addButton}
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {showRemoveWarning && (
        <div className={styles.modalOverlay} onClick={() => setShowRemoveWarning(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Free Account Restriction</h3>
            <p className={styles.modalText}>
              Free accounts cannot remove vehicles. Please upgrade to Premium to manage your garage.
            </p>
            <button onClick={() => setShowRemoveWarning(false)} className={styles.modalButton}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GarageScreen;

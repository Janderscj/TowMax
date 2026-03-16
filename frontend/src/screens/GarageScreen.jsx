import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Trash2, Car } from 'lucide-react';
import { supabase } from '../utils/supabase';

function GarageScreen({ onVinSelect }) {
  const { user, profile, signOut, isFree, isPremium, isDealer } = useAuth();
  const [garage, setGarage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vin: '',
    year: '',
    make: '',
    model: '',
    trim: '',
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user && !isDealer) {
      fetchGarage();
    }
  }, [user, isDealer]);

  const fetchGarage = async () => {
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

  const addVehicle = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`${API_URL}/api/garage/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newVehicle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add vehicle');
      }

      const addedVehicle = await response.json();
      setGarage([addedVehicle, ...garage]);
      setNewVehicle({ vin: '', year: '', make: '', model: '', trim: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
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

  const maxVehicles = isFree ? 1 : isPremium ? 5 : 0;
  const canAddMore = garage.length < maxVehicles;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Garage</h1>
        <button onClick={handleSignOut} style={styles.signOutButton}>
          <LogOut size={20} />
        </button>
      </div>

      <div style={styles.roleInfo}>
        <p style={styles.roleText}>
          {isFree ? 'Free Account' : isPremium ? 'Premium Account' : 'Unknown Role'}
        </p>
        <p style={styles.limitText}>
          {garage.length} / {maxVehicles} vehicles
        </p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.vehiclesList}>
        {garage.map((vehicle) => (
          <div key={vehicle.id} style={styles.vehicleCard}>
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
              <button onClick={() => onVinSelect(vehicle.vin)} style={styles.selectButton}>
                Select
              </button>
              <button
                onClick={() => removeVehicle(vehicle.id)}
                style={styles.removeButton}
                disabled={isFree && garage.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {canAddMore && (
          <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addButton}>
            <Plus size={20} />
            Add Vehicle
          </button>
        )}
      </div>

      {showAddForm && (
        <div style={styles.addForm}>
          <h3>Add New Vehicle</h3>
          <input
            type="text"
            placeholder="VIN"
            value={newVehicle.vin}
            onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value.toUpperCase() })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Year"
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Trim (optional)"
            value={newVehicle.trim}
            onChange={(e) => setNewVehicle({ ...newVehicle, trim: e.target.value })}
            style={styles.input}
          />
          <div style={styles.formActions}>
            <button onClick={addVehicle} style={styles.saveButton}>
              Save
            </button>
            <button onClick={() => setShowAddForm(false)} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <button onClick={() => onVinSelect()} style={styles.vinLookupButton}>
        VIN Lookup
      </button>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  signOutButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
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
  selectButton: {
    background: '#4ecdc4',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
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
  addForm: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: 'white',
    color: 'black',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  saveButton: {
    background: '#4ecdc4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  cancelButton: {
    background: '#666',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  vinLookupButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
    fontSize: '1.1rem',
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

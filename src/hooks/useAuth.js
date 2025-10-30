import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = sessionStorage.getItem('authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (pin) => {
    try {
      const docRef = doc(db, 'config', 'security');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pinAdmin === pin) {
          setIsAuthenticated(true);
          sessionStorage.setItem('authenticated', 'true');
          return { success: true };
        } else {
          return { success: false, error: 'PIN incorrecto' };
        }
      } else {
        return { success: false, error: 'Error de configuración' };
      }
    } catch (error) {
      console.error('Error al verificar PIN:', error);
      return { success: false, error: 'Error al verificar PIN' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('authenticated');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};

export default useAuth;

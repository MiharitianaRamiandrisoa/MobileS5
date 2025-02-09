// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crée le contexte
const AuthContext = createContext();

// Le provider qui enveloppe ton application et fournit l'état utilisateur
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Optionnel : Charger l'utilisateur stocké localement lors du démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    // Stocke l'utilisateur en local pour persistance (optionnel)
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Un hook pour accéder facilement au contexte
export const useAuth = () => useContext(AuthContext);

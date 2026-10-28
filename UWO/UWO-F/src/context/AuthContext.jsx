import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Admin auth state
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('uwo_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uwo_user') || 'null');
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('uwo_role') || null;
    } catch {
      return null;
    }
  });

  // Partner auth state
  const [partnerToken, setPartnerToken] = useState(() => {
    try {
      return localStorage.getItem('uwo_partner_token') || localStorage.getItem('partner_token') || null;
    } catch {
      return null;
    }
  });

  const [partnerUser, setPartnerUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uwo_partner_user') || 'null');
    } catch {
      return null;
    }
  });

  // Generic login setter
  const login = (newToken, newUser, newRole = 'admin') => {
    if (newRole === 'admin' || newRole === 'SUPER_ADMIN' || newRole === 'SALES_ADMIN') {
      setToken(newToken);
      setUser(newUser);
      setRole(newRole);
      localStorage.setItem('uwo_token', newToken);
      localStorage.setItem('uwo_user', JSON.stringify(newUser));
      localStorage.setItem('uwo_role', newRole);
    } else {
      setPartnerToken(newToken);
      setPartnerUser(newUser);
      setRole('partner');
      localStorage.setItem('uwo_partner_token', newToken);
      localStorage.setItem('partner_token', newToken);
      localStorage.setItem('uwo_partner_user', JSON.stringify(newUser));
      localStorage.setItem('uwo_role', 'partner');
    }
  };

  // Dedicated Admin Login async function
  const loginAdmin = async (email, password) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role: 'admin' })
      });
      const data = await res.json();

      if (res.ok) {
        const adminUser = data.user || { email: email.trim(), role: data.role || 'admin' };
        setToken(data.token);
        setUser(adminUser);
        setRole(data.role || 'admin');
        localStorage.setItem('uwo_token', data.token);
        localStorage.setItem('uwo_user', JSON.stringify(adminUser));
        localStorage.setItem('uwo_role', data.role || 'admin');
        return { success: true, data };
      } else {
        return { success: false, message: data.message || data.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error('Admin login error:', err);
      return { success: false, message: 'Server unreachable. Please check connection.' };
    }
  };

  // Dedicated Partner Login async function
  const loginPartner = async (email, password) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role: 'partner' })
      });
      const data = await res.json();

      if (res.ok) {
        const pUser = data.user || { email: email.trim(), role: 'partner' };
        setPartnerToken(data.token);
        setPartnerUser(pUser);
        setRole('partner');
        localStorage.setItem('uwo_partner_token', data.token);
        localStorage.setItem('partner_token', data.token);
        localStorage.setItem('uwo_partner_user', JSON.stringify(pUser));
        localStorage.setItem('uwo_role', 'partner');
        return { success: true, data };
      } else {
        return { success: false, message: data.message || data.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error('Partner login error:', err);
      return { success: false, message: 'Server unreachable. Please check connection.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('uwo_token');
    localStorage.removeItem('uwo_user');
    localStorage.removeItem('uwo_role');
  };

  const logoutPartner = () => {
    setPartnerToken(null);
    setPartnerUser(null);
    localStorage.removeItem('uwo_partner_token');
    localStorage.removeItem('partner_token');
    localStorage.removeItem('uwo_partner_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        partnerToken,
        partnerUser,
        login,
        loginAdmin,
        loginPartner,
        logout,
        logoutPartner,
        isAuthenticated: !!token,
        isPartnerAuthenticated: !!partnerToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

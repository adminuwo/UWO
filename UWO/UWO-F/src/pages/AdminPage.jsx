import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    const adminUrl =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5174'
        : 'https://admin.uwo24.com';
    window.location.replace(adminUrl);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontFamily: 'sans-serif'
      }}
    >
      <p>Redirecting to Unified Admin Dashboard...</p>
    </div>
  );
}

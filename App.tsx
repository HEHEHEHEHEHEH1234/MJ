import React from 'react';
import { Welcome } from './components/Welcome';
import { Dashboard } from './components/Dashboard';
import { useUserStore } from './store/userStore';

function App() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {user ? <Dashboard /> : <Welcome />}
    </div>
  );
}

export default App;
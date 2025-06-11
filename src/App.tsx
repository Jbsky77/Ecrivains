import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { BookView } from './pages/BookView';
import { NotesPage } from './pages/NotesPage';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Book } from './types';

function AppContent() {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <AuthPage />;
  }

  if (selectedBook) {
    return (
      <Layout>
        <BookView 
          book={selectedBook} 
          onBack={() => setSelectedBook(null)} 
        />
      </Layout>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Layout>
          {activeTab === 'dashboard' && (
            <Dashboard onSelectBook={setSelectedBook} />
          )}
          {activeTab === 'books' && (
            <Dashboard onSelectBook={setSelectedBook} />
          )}
          {activeTab === 'statistics' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques</h2>
              <p className="text-gray-600">Fonctionnalité en cours de développement</p>
            </div>
          )}
          {activeTab === 'characters' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Personnages</h2>
              <p className="text-gray-600">Vue globale des personnages en cours de développement</p>
            </div>
          )}
          {activeTab === 'locations' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lieux</h2>
              <p className="text-gray-600">Vue globale des lieux en cours de développement</p>
            </div>
          )}
          {activeTab === 'objects' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Objets</h2>
              <p className="text-gray-600">Vue globale des objets en cours de développement</p>
            </div>
          )}
          {activeTab === 'notes' && (
            <NotesPage />
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
              <p className="text-gray-600">Configuration du compte en cours de développement</p>
            </div>
          )}
        </Layout>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
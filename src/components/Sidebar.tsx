import React from 'react';
import { Home, Book, BarChart3, Users, MapPin, Package, Settings, StickyNote } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Tableau de bord', icon: Home },
  { id: 'books', name: 'Mes Livres', icon: Book },
  { id: 'statistics', name: 'Statistiques', icon: BarChart3 },
  { id: 'characters', name: 'Personnages', icon: Users },
  { id: 'locations', name: 'Lieux', icon: MapPin },
  { id: 'objects', name: 'Objets', icon: Package },
  { id: 'notes', name: 'Bloc-notes', icon: StickyNote },
  { id: 'settings', name: 'Paramètres', icon: Settings },
];

export function Sidebar({ activeTab = 'dashboard', onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">WriterStudio</h2>
            <p className="text-xs text-gray-500">Version Pro</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm mb-1">Objectif du jour</h3>
          <p className="text-xs opacity-90">500 mots restants</p>
          <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
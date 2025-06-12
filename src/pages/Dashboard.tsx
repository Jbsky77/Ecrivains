import React, { useState } from 'react';
import { Plus, TrendingUp, BookOpen, Target, Calendar } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import { BookCard } from '../components/BookCard';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { Book } from '../types';
import { calculateProgress, formatWordCount } from '../utils/wordCount';

interface DashboardProps {
  /**
   * Optional project information. Some consumers of this component
   * pass a `project` or `projectId` prop. Typing these props avoids
   * TypeScript errors without affecting existing behaviour.
   */
  project?: unknown;
  projectId?: string;
}

export function Dashboard({ project, projectId }: DashboardProps) {
  const { books, createBook, deleteBook } = useBooks();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newBookData, setNewBookData] = useState({
    title: '',
    genre: '',
    description: '',
    wordGoal: 50000,
    status: 'draft' as const,
    currentWords: 0
  });

  const handleCreateBook = () => {
    if (newBookData.title && newBookData.genre) {
      createBook(newBookData);
      setNewBookData({
        title: '',
        genre: '',
        description: '',
        wordGoal: 50000,
        status: 'draft',
        currentWords: 0
      });
      setShowCreateModal(false);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      deleteBook(bookId);
    }
  };

  const totalWords = books.reduce((sum, book) => sum + book.currentWords, 0);
  const totalGoal = books.reduce((sum, book) => sum + book.wordGoal, 0);
  const completedBooks = books.filter(book => book.status === 'completed').length;
  const inProgressBooks = books.filter(book => book.status === 'in-progress').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name} !</h1>
            <p className="text-purple-100 text-lg">
              Prêt à donner vie à vos histoires aujourd'hui ?
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nouveau Livre</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mots écrits</p>
              <p className="text-2xl font-bold text-gray-900">{formatWordCount(totalWords)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar 
              progress={calculateProgress(totalWords, totalGoal)} 
              color="blue" 
            />
            <p className="text-xs text-gray-500 mt-1">
              Objectif global: {formatWordCount(totalGoal)} mots
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Livres actifs</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressBooks}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {books.length} livre{books.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{completedBooks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Félicitations pour vos accomplissements !
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Objectif du jour</p>
              <p className="text-2xl font-bold text-gray-900">{user?.dailyGoal || 500}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Restant pour aujourd'hui
          </p>
        </div>
      </div>

      {/* Books Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mes Projets</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{books.length} projet{books.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun projet pour le moment
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez votre premier livre dès maintenant !
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer mon premier livre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
                onEdit={() => {/* TODO: Open edit modal */}}
                onDelete={() => handleDeleteBook(book.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Book Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Créer un nouveau livre"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du livre
            </label>
            <input
              type="text"
              value={newBookData.title}
              onChange={(e) => setNewBookData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Le titre de votre œuvre..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={newBookData.genre}
              onChange={(e) => setNewBookData(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionnez un genre</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystère</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science Fiction">Science-Fiction</option>
              <option value="Thriller">Thriller</option>
              <option value="Historical">Historique</option>
              <option value="Biography">Biographie</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newBookData.description}
              onChange={(e) => setNewBookData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Résumé de votre histoire..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectif de mots
            </label>
            <input
              type="number"
              value={newBookData.wordGoal}
              onChange={(e) => setNewBookData(prev => ({ ...prev, wordGoal: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="50000"
              min="1000"
              step="1000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommandé: 50,000 - 80,000 mots pour un roman
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateBook}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer le livre
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
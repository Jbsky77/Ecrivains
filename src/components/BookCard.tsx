import React from 'react';
import { Book as BookIcon, Edit3, Trash2, Calendar, Target } from 'lucide-react';
import { Book } from '../types';
import { ProgressBar } from './ProgressBar';
import { formatWordCount, calculateProgress, getStatusColor } from '../utils/wordCount';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BookCard({ book, onClick, onEdit, onDelete }: BookCardProps) {
  const progress = calculateProgress(book.currentWords, book.wordGoal);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors" onClick={onClick}>
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">{book.genre}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
              {book.status === 'draft' && 'Brouillon'}
              {book.status === 'in-progress' && 'En cours'}
              {book.status === 'completed' && 'Terminé'}
              {book.status === 'published' && 'Publié'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{book.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progression</span>
            <span className="font-medium text-gray-900">
              {formatWordCount(book.currentWords)} / {formatWordCount(book.wordGoal)} mots
            </span>
          </div>
          
          <ProgressBar progress={progress} color="purple" />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Modifié {new Date(book.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{book.chapters.length} chapitres</span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    'Êtes-vous sûr de vouloir supprimer ce projet ?'
                  )
                ) {
                  onDelete();
                }
              }}
              className="flex items-center text-xs text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
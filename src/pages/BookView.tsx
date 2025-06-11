import React, { useState } from 'react';
import { ArrowLeft, Plus, Users, MapPin, Package, FileText, Edit3, Trash2, GripVertical } from 'lucide-react';
import { Book, Chapter } from '../types';
import { useBooks } from '../hooks/useBooks';
import { TextEditor } from '../components/TextEditor';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { calculateProgress, getStatusColor, countWords } from '../utils/wordCount';

interface BookViewProps {
  book: Book;
  onBack: () => void;
}

export function BookView({ book, onBack }: BookViewProps) {
  const { updateBook, addChapter, updateChapter, deleteChapter, addCharacter, addLocation, addObject } = useBooks();
  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'locations' | 'objects'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);
  
  const [newChapterData, setNewChapterData] = useState({
    title: '',
    content: '',
    status: 'todo' as const
  });

  const [newCharacterData, setNewCharacterData] = useState({
    name: '',
    role: '',
    description: '',
    relationships: [] as string[],
    relatedChapters: [] as string[]
  });

  const [newLocationData, setNewLocationData] = useState({
    name: '',
    description: '',
    relatedChapters: [] as string[]
  });

  const [newObjectData, setNewObjectData] = useState({
    name: '',
    description: '',
    importance: 'medium' as const,
    relatedChapters: [] as string[]
  });

  const progress = calculateProgress(book.currentWords, book.wordGoal);

  const handleCreateChapter = () => {
    if (newChapterData.title) {
      const order = book.chapters.length + 1;
      addChapter(book.id, { ...newChapterData, order, wordCount: countWords(newChapterData.content) });
      setNewChapterData({ title: '', content: '', status: 'todo' });
      setShowChapterModal(false);
    }
  };

  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    if (updates.content) {
      updates.wordCount = countWords(updates.content);
    }
    updateChapter(book.id, chapterId, updates);
    
    // Update book's total word count
    const totalWords = book.chapters.reduce((sum, chapter) => {
      if (chapter.id === chapterId) {
        return sum + (updates.wordCount || chapter.wordCount);
      }
      return sum + chapter.wordCount;
    }, 0);
    
    updateBook(book.id, { currentWords: totalWords });
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) {
      deleteChapter(book.id, chapterId);
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
      }
    }
  };

  const handleCreateCharacter = () => {
    if (newCharacterData.name) {
      addCharacter(book.id, newCharacterData);
      setNewCharacterData({ name: '', role: '', description: '', relationships: [], relatedChapters: [] });
      setShowCharacterModal(false);
    }
  };

  const handleCreateLocation = () => {
    if (newLocationData.name) {
      addLocation(book.id, newLocationData);
      setNewLocationData({ name: '', description: '', relatedChapters: [] });
      setShowLocationModal(false);
    }
  };

  const handleCreateObject = () => {
    if (newObjectData.name) {
      addObject(book.id, newObjectData);
      setNewObjectData({ name: '', description: '', importance: 'medium', relatedChapters: [] });
      setShowObjectModal(false);
    }
  };

  const tabs = [
    { id: 'chapters', name: 'Chapitres', icon: FileText, count: book.chapters.length },
    { id: 'characters', name: 'Personnages', icon: Users, count: book.characters.length },
    { id: 'locations', name: 'Lieux', icon: MapPin, count: book.locations.length },
    { id: 'objects', name: 'Objets', icon: Package, count: book.objects.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au tableau de bord</span>
        </button>
      </div>

      {/* Book Info */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">{book.description}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                {book.status === 'draft' && 'Brouillon'}
                {book.status === 'in-progress' && 'En cours'}
                {book.status === 'completed' && 'Terminé'}
                {book.status === 'published' && 'Publié'}
              </span>
              <span className="text-sm text-gray-500">{book.genre}</span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Progression</p>
            <ProgressBar progress={progress} color="purple" showLabel />
            <p className="text-xs text-gray-500 mt-1">
              {book.currentWords.toLocaleString()} / {book.wordGoal.toLocaleString()} mots
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Chapitres</p>
            <p className="text-2xl font-bold text-gray-900">{book.chapters.length}</p>
            <p className="text-xs text-gray-500">
              {book.chapters.filter(c => c.status === 'completed').length} terminés
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Dernière modification</p>
            <p className="text-sm text-gray-900">
              {new Date(book.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Chapitres</h3>
                <button
                  onClick={() => setShowChapterModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau chapitre</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chapter List */}
                <div className="space-y-3">
                  {book.chapters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun chapitre pour le moment</p>
                    </div>
                  ) : (
                    book.chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter) => (
                        <div
                          key={chapter.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedChapter?.id === chapter.id
                              ? 'border-purple-200 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedChapter(chapter)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                                  {chapter.status === 'todo' && 'À faire'}
                                  {chapter.status === 'in-progress' && 'En cours'}
                                  {chapter.status === 'completed' && 'Terminé'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{chapter.wordCount} mots</p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Edit chapter
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChapter(chapter.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Chapter Editor */}
                <div>
                  {selectedChapter ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {selectedChapter.title}
                        </h4>
                        <select
                          value={selectedChapter.status}
                          onChange={(e) => 
                            handleUpdateChapter(selectedChapter.id, { 
                              status: e.target.value as Chapter['status'] 
                            })
                          }
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="todo">À faire</option>
                          <option value="in-progress">En cours</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </div>
                      <TextEditor
                        content={selectedChapter.content}
                        onChange={(content) => 
                          handleUpdateChapter(selectedChapter.id, { content })
                        }
                        wordGoal={book.wordGoal / book.chapters.length}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Sélectionnez un chapitre pour commencer à écrire</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Personnages</h3>
                <button
                  onClick={() => setShowCharacterModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau personnage</span>
                </button>
              </div>

              {book.characters.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun personnage créé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {book.characters.map((character) => (
                    <div key={character.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{character.name}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {character.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{character.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>Apparaît dans {character.relatedChapters.length} chapitre{character.relatedChapters.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lieux</h3>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau lieu</span>
                </button>
              </div>

              {book.locations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun lieu défini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {book.locations.map((location) => (
                    <div key={location.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{location.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>Mentionné dans {location.relatedChapters.length} chapitre{location.relatedChapters.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Objects Tab */}
          {activeTab === 'objects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Objets & Concepts</h3>
                <button
                  onClick={() => setShowObjectModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvel objet</span>
                </button>
              </div>

              {book.objects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun objet défini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {book.objects.map((object) => (
                    <div key={object.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{object.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          object.importance === 'high' ? 'bg-red-100 text-red-800' :
                          object.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {object.importance === 'high' && 'Important'}
                          {object.importance === 'medium' && 'Moyen'}
                          {object.importance === 'low' && 'Mineur'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{object.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>Mentionné dans {object.relatedChapters.length} chapitre{object.relatedChapters.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showChapterModal}
        onClose={() => setShowChapterModal(false)}
        title="Nouveau chapitre"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du chapitre
            </label>
            <input
              type="text"
              value={newChapterData.title}
              onChange={(e) => setNewChapterData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: La découverte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={newChapterData.status}
              onChange={(e) => setNewChapterData(prev => ({ ...prev, status: e.target.value as Chapter['status'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="todo">À faire</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowChapterModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateChapter}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        title="Nouveau personnage"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du personnage
            </label>
            <input
              type="text"
              value={newCharacterData.name}
              onChange={(e) => setNewCharacterData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Emma Cartwright"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <input
              type="text"
              value={newCharacterData.role}
              onChange={(e) => setNewCharacterData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Protagoniste, Antagoniste, Personnage secondaire..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newCharacterData.description}
              onChange={(e) => setNewCharacterData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Description physique, personnalité, background..."
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowCharacterModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateCharacter}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Nouveau lieu"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du lieu
            </label>
            <input
              type="text"
              value={newLocationData.name}
              onChange={(e) => setNewLocationData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Bibliothèque Oubliée"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newLocationData.description}
              onChange={(e) => setNewLocationData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Description du lieu, ambiance, détails importants..."
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowLocationModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateLocation}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showObjectModal}
        onClose={() => setShowObjectModal(false)}
        title="Nouvel objet"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'objet
            </label>
            <input
              type="text"
              value={newObjectData.name}
              onChange={(e) => setNewObjectData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Le livre lumineux"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importance
            </label>
            <select
              value={newObjectData.importance}
              onChange={(e) => setNewObjectData(prev => ({ ...prev, importance: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="low">Mineur</option>
              <option value="medium">Moyen</option>
              <option value="high">Important</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newObjectData.description}
              onChange={(e) => setNewObjectData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Description de l'objet et de son rôle dans l'histoire..."
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowObjectModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateObject}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
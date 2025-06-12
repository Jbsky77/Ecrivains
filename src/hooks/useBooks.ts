import { useState } from 'react';
import { Book, Chapter, Character, Location, BookObject } from '../types';
import { useLocalStorage } from './useLocalStorage';

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'Le Mystère de la Bibliothèque Oubliée',
    genre: 'Mystery',
    description: 'Une histoire captivante sur une bibliothèque mystérieuse qui recèle des secrets anciens.',
    status: 'in-progress',
    wordGoal: 80000,
    currentWords: 12500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    chapters: [
      {
        id: '1',
        title: 'La Découverte',
        content: 'Emma poussa la lourde porte de chêne et pénétra dans la bibliothèque abandonnée...',
        wordCount: 2500,
        status: 'completed',
        order: 1,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16'
      },
      {
        id: '2',
        title: 'Les Indices Cachés',
        content: 'Les rayonnages semblaient infinis, s\'étendant dans l\'obscurité...',
        wordCount: 3200,
        status: 'completed',
        order: 2,
        createdAt: '2024-01-17',
        updatedAt: '2024-01-18'
      },
      {
        id: '3',
        title: 'Le Premier Secret',
        content: 'Emma découvrit un livre étrange, ses pages semblaient briller dans la pénombre...',
        wordCount: 2800,
        status: 'in-progress',
        order: 3,
        createdAt: '2024-01-19',
        updatedAt: '2024-01-20'
      }
    ],
    characters: [
      {
        id: '1',
        name: 'Emma Cartwright',
        role: 'Protagoniste',
        description: 'Bibliothécaire passionnée, 28 ans, curieuse et déterminée.',
        relationships: ['Prof. Aldrich'],
        relatedChapters: ['1', '2', '3']
      },
      {
        id: '2',
        name: 'Prof. Aldrich',
        role: 'Mentor',
        description: 'Ancien professeur d\'histoire, gardien des secrets de la bibliothèque.',
        relationships: ['Emma Cartwright'],
        relatedChapters: ['2', '3']
      }
    ],
    locations: [
      {
        id: '1',
        name: 'Bibliothèque Oubliée',
        description: 'Une ancienne bibliothèque cachée sous l\'université, remplie de livres mystérieux.',
        relatedChapters: ['1', '2', '3']
      }
    ],
    objects: [
      {
        id: '1',
        name: 'Le Livre Lumineux',
        description: 'Un livre ancien dont les pages émettent une faible lueur dorée.',
        importance: 'high',
        relatedChapters: ['3']
      }
    ]
  }
];

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>('books', initialBooks);

  const createBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'chapters' | 'characters' | 'locations' | 'objects'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: [],
      characters: [],
      locations: [],
      objects: []
    };
    setBooks(prev => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, ...updates, updatedAt: new Date().toISOString() }
        : book
    ));
  };

  const deleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
  };

  const clearBooks = () => {
    setBooks([]);
  };

  const manualSave = () => {
    setBooks(prev => [...prev]);
  };

  const addChapter = (bookId: string, chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChapter: Chapter = {
      ...chapterData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            chapters: [...book.chapters, newChapter],
            updatedAt: new Date().toISOString()
          }
        : book
    ));
    return newChapter;
  };

  const updateChapter = (bookId: string, chapterId: string, updates: Partial<Chapter>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? {
            ...book,
            chapters: book.chapters.map(chapter =>
              chapter.id === chapterId
                ? { ...chapter, ...updates, updatedAt: new Date().toISOString() }
                : chapter
            ),
            updatedAt: new Date().toISOString()
          }
        : book
    ));
  };

  const deleteChapter = (bookId: string, chapterId: string) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? {
            ...book,
            chapters: book.chapters.filter(chapter => chapter.id !== chapterId),
            updatedAt: new Date().toISOString()
          }
        : book
    ));
  };

  const addCharacter = (bookId: string, characterData: Omit<Character, 'id'>) => {
    const newCharacter: Character = {
      ...characterData,
      id: Date.now().toString()
    };

    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            characters: [...book.characters, newCharacter],
            updatedAt: new Date().toISOString()
          }
        : book
    ));
    return newCharacter;
  };

  const updateCharacter = (bookId: string, characterId: string, updates: Partial<Character>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? {
            ...book,
            characters: book.characters.map(character =>
              character.id === characterId
                ? { ...character, ...updates }
                : character
            ),
            updatedAt: new Date().toISOString()
          }
        : book
    ));
  };

  const addLocation = (bookId: string, locationData: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...locationData,
      id: Date.now().toString()
    };

    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            locations: [...book.locations, newLocation],
            updatedAt: new Date().toISOString()
          }
        : book
    ));
    return newLocation;
  };

  const addObject = (bookId: string, objectData: Omit<BookObject, 'id'>) => {
    const newObject: BookObject = {
      ...objectData,
      id: Date.now().toString()
    };

    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            objects: [...book.objects, newObject],
            updatedAt: new Date().toISOString()
          }
        : book
    ));
    return newObject;
  };

  return {
    books,
    createBook,
    updateBook,
    deleteBook,
    addChapter,
    updateChapter,
    deleteChapter,
    addCharacter,
    updateCharacter,
    addLocation,
    addObject,
    clearBooks,
    manualSave
  };
}
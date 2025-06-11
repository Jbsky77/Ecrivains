import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TextEditor } from '../components/TextEditor';

export function NotesPage() {
  const [note, setNote] = useLocalStorage<string>('quick-note', '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Bloc-notes</h2>
      <TextEditor
        content={note}
        onChange={setNote}
        onSave={handleSave}
        placeholder="Ecrivez vos idées ici..."
      />
      {saved && (
        <p className="text-sm text-green-600">Note sauvegardée !</p>
      )}
    </div>
  );
}

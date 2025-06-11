import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, Save, Maximize, Eye, EyeOff } from 'lucide-react';
import { countWords } from '../utils/wordCount';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  autoSave?: boolean;
  wordGoal?: number;
}

export function TextEditor({ 
  content, 
  onChange, 
  onSave, 
  placeholder = "Commencez à écrire votre histoire...",
  autoSave = true,
  wordGoal 
}: TextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const wordCount = countWords(content);
  const charCount = content.length;

  useEffect(() => {
    if (autoSave && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (autoSave) {
      saveTimeoutRef.current = setTimeout(() => {
        if (onSave) {
          setIsSaving(true);
          onSave();
          setTimeout(() => setIsSaving(false), 1000);
        }
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, autoSave, onSave]);

  const handleFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);

    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'list':
        newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      default:
        return;
    }

    const newContent = content.slice(0, start) + newText + content.slice(end);
    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFormatting('bold')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Gras"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatting('italic')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Italique"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatting('list')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title={showStats ? "Masquer les statistiques" : "Afficher les statistiques"}
          >
            {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Plein écran"
          >
            <Maximize className="w-4 h-4" />
          </button>
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistics Bar */}
      {showStats && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              <strong className="text-gray-900">{wordCount.toLocaleString()}</strong> mots
            </span>
            <span className="text-gray-600">
              <strong className="text-gray-900">{charCount.toLocaleString()}</strong> caractères
            </span>
            {wordGoal && (
              <span className="text-gray-600">
                Objectif: <strong className="text-purple-600">{((wordCount / wordGoal) * 100).toFixed(1)}%</strong>
              </span>
            )}
          </div>
          {autoSave && (
            <span className="text-xs text-gray-500">
              {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarde automatique activée'}
            </span>
          )}
        </div>
      )}

      {/* Editor */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-96'}`}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full p-6 resize-none border-none outline-none text-gray-900 leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}
        />
      </div>
    </div>
  );
}
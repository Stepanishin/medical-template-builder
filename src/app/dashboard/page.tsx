'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ITemplate } from '@/models/Template';
import TemplateEditor from '@/components/TemplateEditor';
import TemplateForm from '@/components/TemplateForm';

export default function Dashboard() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [editedContent, setEditedContent] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else if (response.status === 401) {
        router.push('/login');
        return;
      } else {
        setError('Ошибка загрузки шаблонов');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTemplate = async (
    templateData: Omit<ITemplate, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates([newTemplate, ...templates]);
        setShowTemplateForm(false);
      } else {
        alert('Ошибка создания шаблона');
      }
    } catch {
      alert('Ошибка соединения');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Удалить шаблон?')) return;

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(templates.filter((t) => t._id !== id));
        if (selectedTemplate?._id === id) {
          setSelectedTemplate(null);
          setEditedContent('');
        }
      } else {
        alert('Ошибка удаления шаблона');
      }
    } catch {
      alert('Ошибка соединения');
    }
  };

  const selectTemplate = (template: ITemplate) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
  };

  const copyToClipboard = async () => {
    if (!editedContent) {
      return;
    }

    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = editedContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-600'>{error}</div>
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Сайдбар */}
      <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Шаблоны</h2>

          <button
            onClick={() => setShowTemplateForm(true)}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
          >
            + Создать шаблон
          </button>

          {/* Поиск */}
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск шаблонов..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Список шаблонов */}
        <div className='flex-1 overflow-y-auto p-4'>
          {templates.length === 0 ? (
            <div className='text-gray-500 text-center'>Нет шаблонов</div>
          ) : filteredTemplates.length === 0 ? (
            <div className='text-gray-500 text-center'>Нет шаблонов по запросу &ldquo;{searchQuery}&rdquo;</div>
          ) : (
            <div className='space-y-2'>
              {filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors group ${
                    selectedTemplate?._id === template._id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => selectTemplate(template)}
                >
                  <div className='font-medium text-gray-800 mb-1'>
                    {template.name}
                  </div>
                  <div className='text-sm text-gray-600 truncate'>
                    {template.content
                      ? template.content.substring(0, 50) + '...'
                      : 'Нет содержимого'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template._id!);
                    }}
                    className='opacity-0 group-hover:opacity-100 mt-2 text-red-600 hover:text-red-800 text-sm'
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка выхода */}
        <div className='p-4 border-t border-gray-200'>
          <button
            onClick={handleLogout}
            className='w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700'
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Центральная область */}
      <div className='flex-1 flex flex-col p-8 overflow-auto'>
        {selectedTemplate ? (
          <div className='w-full'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {selectedTemplate.name}
              </h2>
            </div>
            <TemplateEditor
              template={selectedTemplate}
              onContentChange={setEditedContent}
            />
            <button
              onClick={copyToClipboard}
              className={`relative py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                copied 
                  ? 'bg-emerald-500 text-white transform scale-105' 
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              <span className={`transition-opacity duration-200 ${copied ? 'opacity-0' : 'opacity-100'}`}>
                Скопировать текст
              </span>
              {copied && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Скопировано!
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Конструктор медицинских шаблонов
              </h2>
              <p className='text-gray-600'>
                Выберите шаблон из списка слева или создайте новый
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно создания шаблона */}
      {showTemplateForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <TemplateForm
            onSubmit={addTemplate}
            onCancel={() => setShowTemplateForm(false)}
          />
        </div>
      )}
    </div>
  );
}

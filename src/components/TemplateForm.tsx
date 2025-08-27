'use client';

import { useState } from 'react';
import { ITemplate } from '@/models/Template';

interface TemplateFormProps {
  onSubmit: (template: Omit<ITemplate, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TemplateForm({ onSubmit, onCancel }: TemplateFormProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [variables, setVariables] = useState<Array<{
    name: string;
    type: 'text' | 'select';
    options?: string[];
    placeholder?: string;
  }>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addVariable = () => {
    setVariables([
      ...variables,
      {
        name: '',
        type: 'text',
        placeholder: '',
      }
    ]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateVariable = (index: number, field: string, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const newVariables = [...variables];
    (newVariables[index] as any)[field] = value; // eslint-disable-line @typescript-eslint/no-explicit-any
    setVariables(newVariables);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      alert('Введите название и содержание шаблона');
      return;
    }

    const validVariables = variables.filter(v => v.name.trim());
    
    onSubmit({
      name: name.trim(),
      content: content.trim(),
      variables: validVariables.length > 0 ? validVariables : undefined,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Создать новый шаблон</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название шаблона
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Заключение терапевта"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содержание шаблона
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            // placeholder="Пример: Пациент {имя_пациента} обратился с жалобами на {жалобы}..."
            placeholder="Вводи текст сюда..."
            required
          />
          {/* <div className="text-xs text-gray-500 mt-1">
            Используйте фигурные скобки для переменных: {'{имя_переменной}'}
          </div> */}
        </div>

        {/* <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Переменные (опционально)
            </label>
            <button
              type="button"
              onClick={addVariable}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Добавить переменную
            </button>
          </div>
          
          {variables.map((variable, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Название переменной"
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={variable.name}
                    onChange={(e) => updateVariable(index, 'name', e.target.value)}
                  />
                  <select
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={variable.type}
                    onChange={(e) => updateVariable(index, 'type', e.target.value)}
                  >
                    <option value="text">Текстовое поле</option>
                    <option value="select">Выпадающий список</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariable(index)}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  ✕
                </button>
              </div>
              
              {variable.type === 'text' && (
                <input
                  type="text"
                  placeholder="Подсказка для поля"
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={variable.placeholder || ''}
                  onChange={(e) => updateVariable(index, 'placeholder', e.target.value)}
                />
              )}
              
              {variable.type === 'select' && (
                <textarea
                  placeholder="Варианты через запятую: Вариант 1, Вариант 2, Вариант 3"
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none"
                  value={(variable.options || []).join(', ')}
                  onChange={(e) => updateVariable(index, 'options', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              )}
            </div>
          ))}
        </div> */}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Создать шаблон
          </button>
        </div>
      </form>
    </div>
  );
}
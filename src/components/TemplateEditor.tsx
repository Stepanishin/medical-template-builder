'use client';

import { useState, useEffect } from 'react';
import { ITemplate } from '@/models/Template';

interface TemplateEditorProps {
  template: ITemplate;
  onContentChange: (content: string) => void;
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'select';
  options?: string[];
  placeholder?: string;
  value: string;
}

export default function TemplateEditor({ template, onContentChange }: TemplateEditorProps) {
  const [content, setContent] = useState(template.content);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  useEffect(() => {
    const templateVariables = template.variables || [];
    const initialVariables: TemplateVariable[] = templateVariables.map(v => ({
      ...v,
      value: '',
    }));
    setVariables(initialVariables);
    setContent(template.content);
  }, [template]);

  const updateContent = () => {
    let updatedContent = template.content;
    
    variables.forEach(variable => {
      const placeholder = `{${variable.name}}`;
      updatedContent = updatedContent.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        variable.value || placeholder
      );
    });

    setContent(updatedContent);
    onContentChange(updatedContent);
  };

  const handleVariableChange = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index].value = value;
    setVariables(newVariables);
  };

  useEffect(() => {
    updateContent();
  }, [variables]);

  const handleDirectEdit = (value: string) => {
    setContent(value);
    onContentChange(value);
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      {variables.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Настройте переменные:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variables.map((variable, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {variable.name}
                </label>
                {variable.type === 'select' && variable.options ? (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={variable.value}
                    onChange={(e) => handleVariableChange(index, e.target.value)}
                  >
                    <option value="">Выберите...</option>
                    {variable.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={variable.placeholder || `Введите ${variable.name}`}
                    value={variable.value}
                    onChange={(e) => handleVariableChange(index, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Текст шаблона:
        </label>
        <textarea
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          value={content}
          onChange={(e) => handleDirectEdit(e.target.value)}
          placeholder="Текст шаблона с переменными..."
        />
      </div>
    </div>
  );
}
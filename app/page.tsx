'use client'

import React, { useState } from 'react'
import { diffChars } from 'diff'
import { translations, type Language } from './i18n/translations'

interface DiffItem {
  [key: string]: any
}

interface FieldSelection {
  id: number
  field: string
}

export default function JsonDiffPage() {
  const [lang, setLang] = useState<Language>('zh')
  const t = translations[lang]
  
  const [jsonInput, setJsonInput] = useState('')
  const [diffItems, setDiffItems] = useState<DiffItem[]>([])
  const [availableFields, setAvailableFields] = useState<string[]>([])
  const [baseField, setBaseField] = useState('')
  const [compareFields, setCompareFields] = useState<FieldSelection[]>([
    { id: 1, field: '' }
  ])
  const [nextId, setNextId] = useState(2)
  const [isJsonValid, setIsJsonValid] = useState(false)

  const exampleJson = {
    zh: `[
    {
      "source": "李响发现那小姑娘正拿眼看他。",
      "target": [
        "李响发现那小姑娘正看他。"
      ],
      "error_type": "成分赘余",
      "gen_text": "李响发现那小姑娘正拿眼看他。",
      "gen_right": false
    },
    {
      "source": "我国500米口径球面射电望远镜主要用于实现巡视宇宙中的中性氢、观测脉冲星等科学目标和空间飞行器测量与通讯等。",
      "target": [
        "我国500米口径球面射电望远镜主要用于实现巡视宇宙中的中性氢、观测脉冲星等科学目标和空间飞行器测量与通讯等应用目标。"
      ],
      "error_type": "成分残缺",
      "gen_text": "我国500米口径球面射电望远镜主要用于实现巡视宇宙中的中性氢、观测脉冲星等科学目标以及空间飞行器的测量与通讯等。",
      "gen_right": false
    }
  ]`,
    en: `[
    {
      "source": "The quick brown fox jumps over the lazy dog.",
      "target": [
        "The brown fox quickly jumps over the lazy dog."
      ],
      "error_type": "word order",
      "gen_text": "The quick brown fox jumps over the lazy dog.",
      "gen_right": false
    },
    {
      "source": "The Hubble Space Telescope has revolutionized our understanding of the cosmos through observations.",
      "target": [
        "The Hubble Space Telescope has revolutionized our understanding of the cosmos through detailed observations."
      ],
      "error_type": "missing detail",
      "gen_text": "The Hubble Space Telescope has transformed our understanding of the cosmos through observations.",
      "gen_right": false
    }
  ]`
  }

  const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value)
    try {
      const parsed = JSON.parse(e.target.value)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      setDiffItems(items)
      
      if (items.length > 0) {
        const fields = Object.keys(items[0])
        setAvailableFields(fields)
        setIsJsonValid(true)
        setBaseField('')
        setCompareFields([
          { id: 1, field: '' }
        ])
      }
    } catch (error) {
      console.error('Invalid JSON input')
      setIsJsonValid(false)
      setAvailableFields([])
    }
  }

  const loadExample = () => {
    const currentExample = exampleJson[lang]
    setJsonInput(currentExample)
    try {
      const parsed = JSON.parse(currentExample)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      setDiffItems(items)
      
      if (items.length > 0) {
        const fields = Object.keys(items[0])
        setAvailableFields(fields)
        setIsJsonValid(true)
        setBaseField('source')
        setCompareFields([
          { id: 1, field: '' }
        ])
      }
    } catch (error) {
      console.error('Invalid JSON input')
    }
  }

  const addField = () => {
    setCompareFields([...compareFields, { id: nextId, field: '' }])
    setNextId(nextId + 1)
  }

  const removeField = (id: number) => {
    if (compareFields.length > 1) {
      setCompareFields(compareFields.filter(f => f.id !== id))
    }
  }

  const updateField = (id: number, value: string) => {
    setCompareFields(compareFields.map(f => 
      f.id === id ? { ...f, field: value } : f
    ))
  }

  const renderDiff = (text1: string, text2: string) => {
    const differences = diffChars(String(text1), String(text2))
    
    return differences.map((part, index) => {
      const color = part.added 
        ? 'bg-green-200 text-green-900' 
        : part.removed 
        ? 'bg-red-200 text-red-900' 
        : ''
      
      return (
        <span 
          key={index} 
          className={`${color} ${part.added || part.removed ? 'px-1 rounded' : ''}`}
          title={part.added ? t.added : part.removed ? t.removed : ''}
        >
          {part.value}
        </span>
      )
    })
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {lang === 'zh' ? 'English' : '中文'}
        </button>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
        <p className="mt-2 text-gray-600">{t.subtitle}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">{t.inputJson}</div>
          <button
            onClick={loadExample}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t.loadExample}
          </button>
        </div>
        <textarea
          className="w-full h-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
          value={jsonInput}
          onChange={handleJsonInput}
          placeholder={t.placeholder}
        />
      </div>

      {isJsonValid && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">{t.baseField}</label>
              <select
                className="w-full p-2 border rounded"
                value={baseField}
                onChange={(e) => setBaseField(e.target.value)}
              >
                <option value="">{t.selectBase}</option>
                {availableFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block font-bold mb-2">{t.compareField}</label>
              {compareFields.map((fieldSelection, index) => (
                <div key={fieldSelection.id} className="flex items-center gap-2">
                  <select
                    className="flex-1 p-2 border rounded"
                    value={fieldSelection.field}
                    onChange={(e) => updateField(fieldSelection.id, e.target.value)}
                  >
                    <option value="">{t.selectCompare}</option>
                    {availableFields
                      .filter(field => field !== baseField)
                      .map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))
                    }
                  </select>
                  {index >= 1 && (
                    <button
                      onClick={() => removeField(fieldSelection.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addField}
                className="mt-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.addCompareField}
              </button>
            </div>
          </div>
        </div>
      )}

      {isJsonValid && baseField && compareFields.some(f => f.field) && (
        <div className="space-y-6">
          {diffItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm relative">
              <div className="absolute -left-4 -top-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow">
                {index + 1}
              </div>
              
              <div className="grid gap-4">
                <div>
                  <div className="font-bold mb-1">{baseField}{t.baseline}:</div>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    {item[baseField]}
                  </div>
                </div>

                {compareFields
                  .filter(f => f.field)
                  .map(fieldSelection => (
                    <div key={fieldSelection.id}>
                      <div className="font-bold mb-1">{fieldSelection.field}:</div>
                      <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                        {item[fieldSelection.field]}
                      </div>
                      {fieldSelection.field && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500 mb-1">{t.differences}</div>
                          <div className="p-2 bg-white rounded border font-mono text-sm">
                            {renderDiff(item[baseField], item[fieldSelection.field])}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
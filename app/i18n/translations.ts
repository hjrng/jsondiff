export const translations = {
  zh: {
    title: 'JSON 差异对比工具',
    subtitle: '比较 JSON 数据中不同字段的文本差异',
    inputJson: '输入JSON数据：',
    loadExample: '加载示例',
    placeholder: '请输入JSON数据...',
    baseField: '基准字段：',
    compareField: '比较字段：',
    selectBase: '请选择基准字段...',
    selectCompare: '请选择要比较的字段...',
    addCompareField: '添加比较字段',
    baseline: '（基准）',
    differences: '与基准的差异：',
    added: '新增',
    removed: '删除'
  },
  en: {
    title: 'JSON Diff Tool',
    subtitle: 'Compare text differences between JSON fields',
    inputJson: 'Input JSON:',
    loadExample: 'Load Example',
    placeholder: 'Please input JSON data...',
    baseField: 'Base Field:',
    compareField: 'Compare Field:',
    selectBase: 'Select base field...',
    selectCompare: 'Select field to compare...',
    addCompareField: 'Add Compare Field',
    baseline: '(Baseline)',
    differences: 'Differences from baseline:',
    added: 'Added',
    removed: 'Removed'
  }
} as const

export type Language = keyof typeof translations 
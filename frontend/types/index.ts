export type User = { id: string; name: string; email: string }

export type Section = 'Visão geral' | 'Gratuidade' | 'Bolsistas' | 'Documentos' | 'Prazos e alertas' | 'Auditoria' | 'Base normativa'

export type ApiState<T> = {
  data: T | null
  isLoading: boolean
  error: string | null
}

export type Student = {
  id: string | number
  initials?: string
  name: string
  course?: string
  scholarship?: string
  income?: string
  term?: string
  status?: string
}

export type Document = {
  id: string | number
  name: string
  category?: string
  version?: string
  owner?: string
  validity?: string
  status?: string
}

export type AuditItem = {
  id: string | number
  title: string
  group?: string
  is_checked: boolean
}

export type Deadline = {
  id: string | number
  date?: string
  title: string
  description?: string
}

export type DashboardMetric = {
  label: string
  status?: string
  value?: string | number
  percent?: number
}

export type Certificate = {
  name?: string
  number?: string
  days_remaining?: number
}

export type Dashboard = {
  headline?: string
  description?: string
  compliance_percent?: number
  score?: number
  metrics?: DashboardMetric[]
  certificate?: Certificate
}

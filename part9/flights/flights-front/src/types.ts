export interface ValidationError {
  message: string;
  errors: Record<string, string[]>
}

export interface DiaryEntry {
  id: number
  date: string
  weather: string
  visibility: string
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>


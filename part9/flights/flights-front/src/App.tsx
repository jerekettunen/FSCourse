import { useEffect, useState } from 'react'
import { DiaryEntry } from './types'
import { getDiaries } from './services/diaryService'
import Entry from './components/Entry'
import NewDiaryForm from './components/NewDiaryForm'

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    getDiaries()
      .then((response) => {
        setDiaries(response)
      })
  }, [])

  console.log(diaries)

  return (
<div>
  <h1>The flight diary</h1>
  <NewDiaryForm diaries={diaries} setDiaries={setDiaries}/>
  <h2>Diary entries</h2>
  {diaries.map((entry, index) => (
    <Entry key={index} entry={entry}/>
    )
  )}
</div>
)
}

export default App

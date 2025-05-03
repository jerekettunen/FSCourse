import { useState } from "react";
import { createDiaryEntry } from "../services/diaryService";
import { DiaryEntry, ValidationError } from "../types";
import axios from "axios";

interface NewDiaryFormProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}

const NewDiaryForm = ({diaries, setDiaries}: NewDiaryFormProps) => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };
    try {
      const result = await createDiaryEntry(diaryEntry);
      if (result) {
      const toAddDiaryEntry = {
        id: result.id,
        date: result.date,
        weather: result.weather,
        visibility: result.visibility,
      };
      setDiaries(diaries.concat(toAddDiaryEntry));
      }
    } catch (error) {
        // @ts-expect-error functionality is alright, likely a bug in the library
        if(axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
          // @ts-expect-error functionality is alright, likely a bug in the library
          setErrorMessage(error.response?.data);
          setTimeout(() => {
            setErrorMessage("");
          }
          , 5000);
        } else {
          console.log("Unknown error", error);
          setErrorMessage("An unknown error occurred");
          setTimeout(() => {
            setErrorMessage("");
          }
          , 5000);
        }
    }
    
    // Reset the form fields
    setDate("");
    setWeather("");
    setVisibility("");
    setComment("");
  }

  return (
  <div>
    <h2>Add a new diary entry</h2>
    {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
    <form onSubmit={submit}>
      <div>
        date
        <input
          type='date'
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        <span style={{ marginRight: "10px" }}>visibility</span>
        {["great", "good", "ok", "poor"].map((option) => (
          <label key={option} style={{ marginRight: "10px" }}>
        {option.charAt(0).toUpperCase() + option.slice(1)}
        <input
          type="radio"
          name="visibility"
          value={option}
          checked={visibility === option}
          onChange={({ target }) => setVisibility(target.value)}
        />
          </label>
        ))}
      </div>
      <div>
        <span style={{ marginRight: "10px" }}>weather</span>
        {["sunny", "rainy", "cloudy", "stormy", "windy"].map((option) => (
          <label key={option} style={{ marginRight: "10px" }}>
        {option.charAt(0).toUpperCase() + option.slice(1)}
        <input
          type="radio"
          name="weather"
          value={option}
          checked={weather === option}
          onChange={({ target }) => setWeather(target.value)}
        />
          </label>
        ))}
      </div>
      <div>
        comment
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  </div>
  );
}

export default NewDiaryForm;
import { useState } from "react";
import { createDiaryEntry } from "../services/diaryService";
import { DiaryEntry, ValidationError } from "../types";
import axios, {AxiosError} from "axios";

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
    console.log(diaryEntry);
    try {
      const result = await createDiaryEntry(diaryEntry);
      console.log(result);
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
        if(axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
          console.log(error.response?.data);
          console.log(error.response?.status);
          setErrorMessage(error.response?.data);
        } else {
          console.log("Unknown error", error);
          setErrorMessage("An unknown error occurred");
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
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        visibility
        <input
          value={visibility}
          onChange={({ target }) => setVisibility(target.value)}
        />
      </div>
      <div>
        weather
        <input
          value={weather}
          onChange={({ target }) => setWeather(target.value)}
        />
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
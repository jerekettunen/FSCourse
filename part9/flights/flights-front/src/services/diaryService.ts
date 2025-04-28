import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getDiaries = async () => {
  const response = await axios
    .get<DiaryEntry[]>(baseUrl);
  return response.data;
}

export const createDiaryEntry = async (diaryEntry: NewDiaryEntry) => {
  const response = await axios
    .post<DiaryEntry>(baseUrl, diaryEntry);
  return response.data;
}
import { DiaryEntry } from "../types";

interface EntryProps {
  entry: DiaryEntry;
}


const Entry = ({ entry }: EntryProps) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>visibility: {entry.visibility}</p>
      <p>weather: {entry.weather}</p>
    </div>
  );
};
export default Entry;
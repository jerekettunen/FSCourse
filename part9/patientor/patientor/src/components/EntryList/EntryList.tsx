import { Entry, Diagnosis } from "../../types";
import Hospital from "./Hospital";
import Occupational from "./Occupational";
import HealthCheck from "./HealthCheck";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


const EntryList = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {

  switch (entry.type) {
    case "HealthCheck":
      return (
        <HealthCheck entry={entry} diagnoses={diagnoses} />
      );
    case "OccupationalHealthcare":
      return (
        <Occupational entry={entry} diagnoses={diagnoses} /> 
      );
    case "Hospital":
      return (
       <Hospital entry={entry} diagnoses={diagnoses} />
      );
    default:
      return assertNever(entry); 
  }
};
export default EntryList;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { Patient, Diagnosis } from "../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import EntryList from "./EntryList/EntryList";
import NewEntryForm from "./AddPatientEntryModal/NewEntryForm";


const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const [patient, setPatient] = useState<Patient>();
  const [view, setView] = useState(false);
  
  const id = useParams<{ id: string }>().id;
  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const patient = await patientService.getById(id);
          setPatient(patient);
        } catch (e) {
          console.error(e);
        }
      }
    };
    void fetchPatient();
  }
  , [id]);


  if (!patient) {
    return null;
  }
  console.log(patient);

  const genderIcon = () => {
    switch (patient.gender) {
      case 'female':
        return <FemaleIcon />;
      case 'male':
        return <MaleIcon />;
      case 'other':
        return <FlightTakeoffIcon />;
      default:
        return null;
    }
  };

  const toggleView = () => {
    setView(!view);
  };
  const handleClick = () => {
    toggleView();
  };

  return (
    <div>
      <h2>{patient.name} {genderIcon()}</h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <button onClick={handleClick}>
        {view ? "Add entries" : "Close Add entries"}
      </button>
      {!view && (
        <div>
          <NewEntryForm patient = {patient} diagnoses={diagnoses} setPatient = {setPatient} />
        </div>
      )}
      <br />
      <h3>entries</h3>
      {patient.entries.map(entry => (
        <div key={entry.id}>
          <EntryList entry={entry} diagnoses={diagnoses} />
        </div>
      ))}
    </div>
  );
  
};
export default PatientPage;
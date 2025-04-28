import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { Patient } from "../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';



const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  
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

  switch (patient.gender) {
    case 'female':
      return(
        <div>
          <h2>{patient.name} <FemaleIcon /></h2>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
        </div>
      );
    case 'male':
      return(
        <div>
          <h2>{patient.name} <MaleIcon /></h2>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
        </div>
      );
    case 'other':
      return(
        <div>
          <h2>{patient.name} <FlightTakeoffIcon /></h2>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
        </div>
      );
    default:
      return(
        <div>
          <h2>Something is wrong</h2>
        </div>
      );
  }
  
};
export default PatientPage;
import patientData from "../data/patients";
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatient } from "../types";


const getEntries = (): Patient[] => {
  return patientData;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatientEntry = {
    id: id,
    entries: [],
    ...entry
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
}; 

const getPatient = (id: string): Patient | undefined => {
  const patient = patientData.find(p => p.id === id);
  if (patient) {
    return {
      ...patient,
    };
  }
  return undefined;
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
  getPatient
};

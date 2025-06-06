import patients from "../data/patients";
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatient, NewEntry, Entry } from "../types";


const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
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
  patients.push(newPatientEntry);
  return newPatientEntry;
}; 

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  if (patient) {
    return {
      ...patient,
    };
  }
  return undefined;
};

const addEntry = (id: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find(p => p.id === id);
  if (patient) {
    id = uuid();
    const newEntry = {
      id: id,
      ...entry
    };
    const updatedPatient = {
      ...patient,
      entries: patient.entries.concat(newEntry)
    };
    patients.forEach((p, index) => {
      if (p.id === patient.id) {
      patients[index] = updatedPatient;
      }
    });
    
    return newEntry;
  }
  return undefined;
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
  getPatient,
  addEntry
};

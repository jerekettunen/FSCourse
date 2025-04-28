import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}


export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}




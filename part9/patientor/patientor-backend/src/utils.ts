import { NewPatient, Gender } from "./types";
import { z } from "zod";

export const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  ssn: z.string(),
});

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};


export default toNewPatient;
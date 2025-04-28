import { Entry, Diagnosis } from "../../types";
import WorkIcon from "@mui/icons-material/Work";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { Card, CardContent } from "@mui/material";

const Occupational = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  const getDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : undefined;
  };

  const isOccupationalHealthcareEntry = (
    entry: Entry
  ): entry is Entry & { employerName: string } => {
    return "employerName" in entry && typeof entry.employerName === "string";
  };

  if (!isOccupationalHealthcareEntry(entry)) {
    return null;
  }

  return (
    <Card
      sx={{
        minWidth: 275,
        maxWidth: 650,
        margin: 1,
        backgroundColor: "#e3f2fd",
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#1f1f1f",
        borderColor: "#64b5f6",
        borderWidth: 2,
        borderStyle: "solid",
        "&:hover": {
          backgroundColor: "#bbdefb",
          transform: "scale(1.02)",
          transition: "transform 0.5s",
        },
      }}
      variant="outlined"
    >
      <CardContent
        sx={{
          backgroundColor: "#f5f5f5",
          width: "90%", // Adjust width to be slightly smaller than the card
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "1rem",
        }}
      >
        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {entry.date} <WorkIcon sx={{ fontSize: 20, color: "#1976d2" }} />
        </p>
        <p style={{ marginBottom: "0.5rem" }}>{entry.description}</p>
        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PeopleAltRoundedIcon sx={{ fontSize: 20, color: "#000000" }} />
          {entry.specialist}
        </p>
        <p>Employer: {entry.employerName}</p>
        {entry.diagnosisCodes && (
          <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>
            {code} {getDiagnosisName(code) && `- ${getDiagnosisName(code)}`}
          </li>
        ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Occupational;
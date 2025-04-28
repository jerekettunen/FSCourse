import { Entry, Diagnosis } from "../../types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';


const Hospital = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  const getDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : undefined;
  };

  const isHospitalEntry = (entry: Entry): entry is Entry & { discharge: { date: string; criteria: string } } => {
    return 'discharge' in entry && typeof entry.discharge === 'object' && 'date' in entry.discharge && 'criteria' in entry.discharge;
  };
  if (!isHospitalEntry(entry)) {
    return null;
  }


  return (
    <div>
      <Card sx={{ minWidth: 275, maxWidth: 650
        , margin: 1, backgroundColor: '#ffe4e6', borderRadius: 2, boxShadow: 3, padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'
        , justifyContent: 'center', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#1f1f1f', borderColor: '#ff8a80', borderWidth: 2, borderStyle: 'solid'
        , '&:hover': {
          backgroundColor: '#ffc1c3',
          transform: 'scale(1.02)',
          transition: 'transform 0.5s',
        },
       }} variant="outlined">
        <CardContent  sx={{
          backgroundColor: "#f5f5f5",
          width: "90%", // Adjust width to be slightly smaller than the card
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "1rem",
        }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {entry.date}
            <LocalHospitalRoundedIcon sx={{ fontSize: 20, color: '#ff1744' }} />
            </p>
          <p>{entry.description}</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PeopleAltRoundedIcon sx={{ fontSize: 20, color: '#000000' }} />
            {entry.specialist}</p>
          <p>Discharge Date: {entry.discharge.date}</p>
          <p>Discharge Criteria: {entry.discharge.criteria}</p>
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
    </div>
  );
};
export default Hospital;

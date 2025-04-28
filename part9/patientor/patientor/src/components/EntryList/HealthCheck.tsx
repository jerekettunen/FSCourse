import { Entry, Diagnosis } from "../../types";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import HealingRoundedIcon from '@mui/icons-material/HealingRounded';
import { Card, CardContent } from '@mui/material';

const HealthCheck = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  const getDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : undefined;
  };

  const isHealthCheckEntry = (entry: Entry): entry is Entry & { healthCheckRating: number } => {
    return 'healthCheckRating' in entry && typeof entry.healthCheckRating === 'number';
  };

  const getHeartColor = (rating: number): string => {
    switch (rating) {
      case 0:
        return 'green';
      case 1:
        return 'yellow';
      case 2:
        return 'orange';
      case 3:
        return 'red';
      default:
        return 'gray';
    }
  };

  if (!isHealthCheckEntry(entry)) {
    return null;
  }

  return (
    <Card sx={{ minWidth: 275, maxWidth: 650
      , margin: 1, backgroundColor: '#fff9c4', borderRadius: 2, boxShadow: 3, padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'
      , justifyContent: 'center', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#1f1f1f', borderColor: '#ffecb3', borderWidth: 2, borderStyle: 'solid'
      , '&:hover': {
      backgroundColor: '#fff59d',
      transform: 'scale(1.02)',
      transition: 'transform 0.5s',
      },
     }} variant="outlined">
      <CardContent  sx={{
        backgroundColor: "#fffde7",
        width: "90%", // Adjust width to be slightly smaller than the card
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "1rem",
      }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {entry.date} <HealingRoundedIcon />
      </p>
      <p style={{ marginBottom: '0.5rem' }}>
      {entry.description}
      </p>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <PeopleAltRoundedIcon style={{ marginRight: '0.5rem' }} />
      {entry.specialist}
      </p>
      <FavoriteRoundedIcon style={{ color: getHeartColor(entry.healthCheckRating) }} />
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

export default HealthCheck;

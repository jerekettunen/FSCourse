import { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Entry, NewEntry, Diagnosis, Patient } from '../../types';
import patientService from '../../services/patients';


const newEntryFormStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2rem',
  background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  margin: '2rem auto',
  width: '100%',
  maxWidth: '700px',
  border: '2px solid #90caf9',
  boxSizing: 'border-box' as const,
  fontFamily: "'Roboto', sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#1a237e',
  textAlign: 'left',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};



const NewEntryForm = ({ patient, diagnoses, setPatient }: { patient: Patient; diagnoses: Diagnosis[]; setPatient: (updatedPatient: Patient) => void}) => {
  const [entryType, setEntryType] = useState('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<Dayjs | null>(null);
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<Dayjs | null>(null);
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  // Add any additional state variables needed for the form
  const types = ['HealthCheck', 'OccupationalHealthcare', 'Hospital'] as const;
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Perform form submission logic here
    const baseEntry = {
      description,
      date: date ? date.format('YYYY-MM-DD') : '',
      specialist,
      diagnosisCodes,
    };

    let newEntry: NewEntry;

    switch (entryType) {
      case 'HealthCheck':
      newEntry = {
        ...baseEntry,
        type: 'HealthCheck',
        healthCheckRating,
      };
      break;

      case 'OccupationalHealthcare':
      newEntry = {
        ...baseEntry,
        type: 'OccupationalHealthcare',
        employerName,
        sickLeave: sickLeaveStartDate && sickLeaveEndDate
        ? {
          startDate: sickLeaveStartDate.format('YYYY-MM-DD'),
          endDate: sickLeaveEndDate.format('YYYY-MM-DD'),
          }
        : undefined,
      };
      break;

      case 'Hospital':
      newEntry = {
        ...baseEntry,
        type: 'Hospital',
        discharge: dischargeDate && dischargeCriteria
        ? {
          date: dischargeDate.format('YYYY-MM-DD'),
          criteria: dischargeCriteria,
          }
        : {date: '', criteria: ''},
      };
      break;

      default:
      console.error('Invalid entry type');
      return;
    }

    console.log('Form submitted:', newEntry);
    const result = await patientService.createEntry(patient.id, newEntry) as Entry;
    const newPatient = {
      ...patient,
      entries: patient.entries.concat(result),
    };
    setPatient(newPatient);
    // Reset form fields
    setEntryType('');
    setDescription('');
    setDate(null);
    setSpecialist('');
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setEmployerName(''); 
    setSickLeaveStartDate(null);
    setSickLeaveEndDate(null);
    setDischargeDate(null);
    setDischargeCriteria('');
    // date: date ? date.format('YYYY-MM-DD') : ''
  };


  return (
    <form onSubmit={handleSubmit} style={newEntryFormStyle}>
      <InputLabel id="entry-type-label">Entry Type</InputLabel>
      <Select
        labelId="entry-type-label"
        value={entryType}
        onChange={({ target }) => setEntryType(target.value)}
        fullWidth
      >
        <MenuItem value="" disabled>
          Select entry type
        </MenuItem>
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Description"
        fullWidth
        multiline
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        />
      <DatePicker
        label="Entry Date"
        value={date}
        onChange={(newValue) => setDate(newValue)}
      />
      <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
      <Select
        labelId="diagnosis-codes-label"
        multiple
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(typeof target.value === 'string' ? target.value.split(',') : target.value)}
        renderValue={(selected) => selected.join(', ')}
        fullWidth
      >
        {diagnoses.map((diagnosis) => (
          <MenuItem key={diagnosis.code} value={diagnosis.code}>
            {diagnosis.code} - {diagnosis.name}
          </MenuItem>
        ))}
      </Select>
      {entryType === 'HealthCheck' && (
        <div style={{ width: '95%', padding: '1rem 1.5rem' }}>
          <InputLabel id="health-check-rating-label" style={{ marginBottom: '0.5rem' }}>
            Health Check Rating
          </InputLabel>
          <Slider
            value={healthCheckRating}
            onChange={(_, newValue) => setHealthCheckRating(newValue as number)}
            step={1}
            marks={[
              { value: 0, label: '0 - Healthy' },
              { value: 1, label: '1 - Low Risk' },
              { value: 2, label: '2 - High Risk' },
              { value: 3, label: '3 - Critical Risk' },
            ]}
            min={0}
            max={3}
            valueLabelDisplay="auto"
            style={{ margin: '0 auto', maxWidth: '90%' }}
          />
        </div>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            label="Employer Name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
          <DatePicker
            label="Sick Leave Start Date"
            value={sickLeaveStartDate}
            onChange={(newValue) => setSickLeaveStartDate(newValue)}
          />
          <DatePicker
            label="Sick Leave End Date"
            value={sickLeaveEndDate}
            onChange={(newValue) => setSickLeaveEndDate(newValue)}
          />
        </>
      )}

      {entryType === 'Hospital' && (
        <>
          <DatePicker
            label="Discharge Date"
            value={dischargeDate}
            onChange={(newValue) => setDischargeDate(newValue)}
          />
          <TextField
            label="Discharge Criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
  
    </form>
  );
};
export default NewEntryForm;
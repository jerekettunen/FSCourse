import express from 'express';
import calculateBmi from './bmiCalculator';
import {calculateExercises, ExerciseInput} from './exerciseCalculator';

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const bmi = calculateBmi(Number(height), Number(weight));
  res.json({
    height: Number(height),
    weight: Number(weight),
    bmi,
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: ExerciseInput = req.body;

  if (!body.target || !body.daily_exercises) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (
    typeof body.target !== 'number' ||
    !Array.isArray(body.daily_exercises) ||
    !body.daily_exercises.every((exercise) => typeof exercise === 'number')
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const { target, daily_exercises } = body;

  const result = calculateExercises(daily_exercises, target);
  res.json(result);
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

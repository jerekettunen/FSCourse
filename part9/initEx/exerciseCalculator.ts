interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export interface ExerciseInput {
  target: number;
  daily_exercises: number[];
}

export const calculateExercises = (hours: Array<number>, target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((h) => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : average >= target * 0.75 ? 2 : 1;
  const ratingDescription =
    rating === 3 ? 'Smashed it' : rating === 2 ? 'Average result' : 'So lazy';

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};


if (require.main === module) {

    try {
      const target = Number(process.argv[2]);
      const hours = process.argv.slice(3).map((h) => Number(h));
      if (
        !Array.isArray(hours) ||
        hours.some((h) => typeof h !== 'number') ||
        isNaN(target)
      ) {
        throw new Error(
          'Invalid input! Expected an array of numbers for hours and a number for target.'
        );
      }
      if (isNaN(target) || hours.some((h) => isNaN(h))) {
        throw new Error('Provided values were not numbers!');
      }
      console.log(calculateExercises(hours, target));
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      console.log(errorMessage);
    }
  };

export default calculateExercises;

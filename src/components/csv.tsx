import React, { useReducer, useRef, useState } from 'react';
import Papa from 'papaparse';

const CSVUploader: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<object>({});
  const showExerciseData = useRef(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log({ type: file?.type });
    if (file && file.type === 'text/csv') {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsedData = Papa.parse(text, { header: true });
        const data: Record<
          string,
          {
            info: Array<{
              date: string;
              weight: number;
              reps: number;
            }>;
            maxWeight: number;
            maxReps: number;
          }
        > = {} as Record<
          string,
          {
            info: Array<{
              date: string;
              weight: number;
              reps: number;
            }>;
            maxWeight: number;
            maxReps: number;
          }
        >;

        for (const key of parsedData.data) {
          const exercise = key['Exercise Name'];
          if (!data[exercise]) {
            data[exercise] = {
              info: [],
              maxReps: 0,
              maxWeight: 0,
            };
          }

          const payload = {
            date: key['Date'],
            weight: Number(key['Weight']),
            reps: Number(key['Reps']),
          };

          data[exercise].info.push(payload);

          if (payload.weight > data[exercise].maxWeight) {
            data[exercise].maxReps = payload.reps;
            data[exercise].maxWeight = payload.weight;
          }
        }

        setExerciseData(data);
        showExerciseData.current = true;
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file.');
      setFileName(null);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <label
        htmlFor='csv-upload'
        className='cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition'
      >
        <input
          id='csv-upload'
          type='file'
          accept='.csv'
          className='hidden'
          onChange={handleFileChange}
        />
        <span className='text-gray-600'>Click to upload a CSV file</span>
      </label>
      {fileName && (
        <p className='mt-3 text-green-600 font-semibold'>
          Selected: {fileName}
        </p>
      )}

      {Object.keys(exerciseData).length > 0 && (
        <div className='mt-5 overflow-x-auto'>
          {Object.entries(exerciseData).map(([exercise, data]) => (
            <div key={exercise} className='mb-6'>
              <h2 className='text-lg font-bold text-blue-600 mb-2'>
                {exercise}
              </h2>
              <p className='text-sm text-gray-600'>
                Max Weight:{' '}
                <span className='font-bold'>{data.maxWeight} kg</span> | Max
                Reps: <span className='font-bold'>{data.maxReps}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CSVUploader;

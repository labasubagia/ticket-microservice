'use client';

import { handleErrors } from '@/lib/error';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { nanoid } from 'nanoid';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AlertErrorProps {
  error: unknown;
}

export const AlertError = ({ error }: AlertErrorProps) => {
  return (
    <Alert variant={'destructive'} className="mb-2 mt-4">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul>
          {handleErrors(error).map((error) => {
            const message = error.field
              ? `Validation error on field ${error.field}: ${error.message}`
              : error.message;
            return <li key={nanoid()}>{message}</li>;
          })}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

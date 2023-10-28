'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { handleErrors } from '@/lib/error';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { nanoid } from 'nanoid';

interface AlertErrorProps {
  error: unknown;
}

export const AlertError = ({ error }: AlertErrorProps) => {
  const errors = handleErrors(error);
  return (
    <Alert variant={'destructive'} className="mb-2 mt-4">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul>
          {errors.map((error) => {
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

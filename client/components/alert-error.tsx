'use client'

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { handleErrors } from "@/lib/error"
import { nanoid } from "nanoid"
import React from 'react'

interface AlertErrorProps {
  error: unknown
}

export const AlertError = ({ error }: AlertErrorProps) => {
  return (
    <Alert variant={'destructive'} className='mt-4 mb-2'>
      <ExclamationTriangleIcon className='h-4 w-4'/>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul>
          {handleErrors(error).map(error => {
          const message = error.field ? `Validation error on field ${error.field}: ${error.message}` : error.message
          return <li key={nanoid()}>{message}</li>
          })}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
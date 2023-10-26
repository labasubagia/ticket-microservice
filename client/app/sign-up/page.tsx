'use client'

import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ResponseError } from '@/types/error'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20)
})

export default function SignUp() {

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [errors, setErrors] = useState<ResponseError[]>([])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/users/sign-up',  values)
      setErrors([])
      router.push('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(error?.response?.data?.errors ?? [])
        return 
      }
      setErrors([{message: (error as Error)?.message}])
    }
  }

  return (
    <main className={cn('p-4 px-8')}>
      <Form {...form}>
        <h1 className='text-xl'>Sign Up</h1>

        {(errors.length > 0) && (
          <Alert variant={'destructive'} className={cn('mt-4 mb-2')}>
            <ExclamationTriangleIcon className='h-4 w-4'/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <ul>
                {errors.map(error => {
                  const message = error.field ? `Validation error on field ${error.field}: ${error.message}` : error.message
                  return <li key={nanoid()}>{message}</li>
                })}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField 
            control={form.control}
            name='email'
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name='password'
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Password' type='password' {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <Button type="submit">Send</Button>
        </form>
      </Form>
    </main>
  )
}

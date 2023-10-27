'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { handleErrors } from '@/lib/error'
import { nanoid } from 'nanoid'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20)
})

export default function SignIn() {

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const signIn = async (values: z.infer<typeof formSchema>) => axios.post('/api/users/sign-in', values)

  const mutation = useMutation(signIn)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values, {
      onSuccess(data, variables, context) {
        router.push('/')
      },
    })
  }

  return (
    <main className={cn('p-4 px-8')}>
      <Form {...form}>

      <h1 className='text-xl'>Sign In</h1>

      {mutation.isError && (
        <Alert variant={'destructive'} className={cn('mt-4 mb-2')}>
          <ExclamationTriangleIcon className='h-4 w-4'/>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <ul>
              {handleErrors(mutation.error).map(error => {
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

          <Button type="submit">Login</Button>
        </form>
      </Form>
    </main>
  )
}

import api from "@/lib/fetch"
import { User } from "@/types/user"

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/current-user', )
    return response.data?.currentUser as User
  } catch {
    return null
  }
}

export interface SignUpParams {
  email: string
  password: string
}

export const signUp = async (values: SignInParams) => api.post('/api/users/sign-up', values)

export interface SignInParams extends SignUpParams {}
  
export const signIn = async (values: SignInParams) => api.post('/api/users/sign-in', values)

export const signOut = async () => api.post('/api/users/sign-out')
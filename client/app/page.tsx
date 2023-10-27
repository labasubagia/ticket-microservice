import api from "@/lib/fetch"
import { User } from "@/types/user"

const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/current-user')
    return response.data?.currentUser as User
  } catch {
    return null
  }
}

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <main>
      {user?.email}
    </main>
  )
}

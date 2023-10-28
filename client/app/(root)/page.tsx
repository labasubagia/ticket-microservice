import { getCurrentUser } from "@/actions/auth"
import { Header } from "@/components/header"

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <>
      <Header currentUser={user ?? undefined}/>
      <p>Hello World</p>
    </>
  )
}

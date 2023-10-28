import { getCurrentUser } from "@/actions/auth"
import { Header } from "@/components/header"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <>
      <Header currentUser={user ?? undefined}/>
      {children}
    </>
  )
}
  
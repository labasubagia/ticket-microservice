import { User } from "@/types/user";
import { nanoid } from "nanoid";
import Link from "next/link";

interface Nav {
  name: string
  path: string 
  isShow: boolean
}

export const Header = ({ currentUser }: { currentUser?: User }) => {

  let navigation: Nav[] = [
    { name: 'Sign Up', path: '/sign-up', isShow: !currentUser },
    { name: 'Sign In', path: '/sign-in', isShow: !currentUser },
    { name: 'Sign Out', path: '/sign-out', isShow: !!currentUser },
  ]
  navigation = navigation.filter(nav => nav.isShow)

  return (
    <header className="flex p-4 justify-between">
      <div className="text-xl">
        <Link href='/'>GetTix</Link>
      </div>
      <ul className="flex items-center space-x-4">
        {navigation.map(nav => (
          <li key={nanoid()}>
            <Link href={nav.path}>{nav.name}</Link>
          </li>
        ))}
      </ul>
    </header>
  )
}
import { nanoid } from 'nanoid';
import Link from 'next/link';

import { User } from '@/types/user';

interface Nav {
  name: string;
  path: string;
  isShow: boolean;
}

export const Header = ({
  currentUser,
}: {
  currentUser: User | null | undefined;
}) => {
  let navigation: Nav[] = [
    // Guest
    { name: 'Sign Up', path: '/sign-up', isShow: !currentUser },
    { name: 'Sign In', path: '/sign-in', isShow: !currentUser },

    // User
    { name: 'Sell My Ticket', path: '/ticket/create', isShow: !!currentUser },
    { name: 'My Order', path: '/order', isShow: !!currentUser },
    { name: 'Sign Out', path: '/sign-out', isShow: !!currentUser },
  ];
  navigation = navigation.filter((nav) => nav.isShow);

  return (
    <header className="bg-blue-400 p-4 text-white shadow">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl">
            <Link href="/">GetTix</Link>
          </div>
          <ul className="flex items-center space-x-4">
            {navigation.map((nav) => (
              <li key={nanoid()}>
                <Link href={nav.path}>{nav.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

//app/components/Navbar.js
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const path = usePathname();
  if (!path.startsWith('/dashboard')) return null;
  const router = useRouter();
  return (
    <nav className="navbar">
      <div>
        <Link href="/dashboard">Home</Link>
        <Link href="/dashboard/about">About</Link>
      </div>
      <div>
        <Link href="/dashboard/upload">Upload</Link>
        <button onClick={() => { logout(); router.replace('/login'); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

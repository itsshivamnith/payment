import Link from "next/link";
import Image from "next/image";
import logo from "../logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Image src={logo} alt="sBTC Logo" width={42} height={42} />
      <Link href="/" className="nav-link">
        Home
      </Link>
      <Link href="/dashboard" className="nav-link">
        Dashboard
      </Link>
      <Link href="/create-payment" className="nav-link">
        Create Payment
      </Link>
      <Link href="/login" className="nav-link">
        Login
      </Link>
      <Link href="/register" className="nav-link">
        Register
      </Link>
    </nav>
  );
}

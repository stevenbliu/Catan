import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-100 p-4 flex justify-between">
      <h1 className="font-bold text-xl">Interview App</h1>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/feature">Feature</Link>
      </nav>
    </header>
  );
}

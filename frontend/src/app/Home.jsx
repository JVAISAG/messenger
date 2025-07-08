import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b">
        <h1 className="text-2xl font-bold">Messenger</h1>
        <div className="space-x-2">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="registration">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to Messenger 👋
          </h2>
          <p className="text-gray-600">
            Start chatting with your friends by logging in or signing up.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-t text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
      </footer>
    </div>
  );
}

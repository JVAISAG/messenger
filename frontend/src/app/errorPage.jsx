import { Button } from '../components/ui/button';
import { useRouter } from 'next/router';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          className="px-6 py-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
        <Button
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </Button>
      </header>

      {/* Main Content - 404 Error Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="text-9xl font-bold text-blue-600">404</div>

          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>

          <p className="text-xl text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="pt-6 space-x-4">
            <Button
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>

        {/* Optional: Add an illustration */}
        <div className="mt-12 max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="1"
          >
            <path
              d="M12 2v4m0 12v4m-8-8H2m20 0h-4m1.078 7.078L16 16m5.078-5.078L16 16m0 0l-5.078 5.078M8 16l-5.078-5.078M8 8L2.922 2.922M16 8l5.078-5.078"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

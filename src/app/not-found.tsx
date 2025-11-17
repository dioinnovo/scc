import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-2 bg-scc-red text-white rounded-lg hover:bg-scc-red-hover transition"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

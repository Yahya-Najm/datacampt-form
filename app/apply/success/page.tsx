import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mx-auto mb-5">
          <svg
            className="h-8 w-8 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/foroz-logo.svg" alt="FOROZ" className="h-6 w-auto" />
          <span className="text-gray-300">×</span>
          <img src="/datacampt.png" alt="DataCamp" className="h-6 w-auto" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-gray-600 mb-1">
          Thank you for applying for the DataCamp Donates scholarship through FOROZ.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You will receive a confirmation email shortly. Our team will review your application and
          be in touch.
        </p>

        <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm text-teal-800 text-left mb-6">
          <strong>What happens next?</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Check your inbox for a confirmation email.</li>
            <li>Our team will review your application.</li>
            <li>If approved, you will receive DataCamp access instructions.</li>
          </ul>
        </div>

        <Link
          href="https://foroz.me"
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Return to FOROZ →
        </Link>
      </div>
    </div>
  );
}

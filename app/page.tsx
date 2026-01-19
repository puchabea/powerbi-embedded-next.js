import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold text-zinc-900">
            Reportes NIC Labs
          </h2>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Sign in
          </h1>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-zinc-700"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="beatriz"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>

          {/* Fake login */}
          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </form>
      </div>
    </div>
  );
}

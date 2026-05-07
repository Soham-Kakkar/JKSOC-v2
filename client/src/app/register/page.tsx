import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold mb-6 text-center">Register for JKSoC</h1>
        <RegisterForm />
      </main>
    </div>
  );
}

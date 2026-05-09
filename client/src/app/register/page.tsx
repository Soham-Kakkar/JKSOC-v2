import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-center">Register for JKSoC</h1>
        <RegisterForm />
    </div>
  );
}

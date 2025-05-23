import { LoginForm } from "@/components/cms/authentication/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#F2F4F8]">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

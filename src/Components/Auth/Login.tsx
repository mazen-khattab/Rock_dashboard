import { useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.email("Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClassName =
  "w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

const iconClassName = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";

const mockHandleLogin = async ({ email, password }: LoginFormValues) => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return 

  if (email === "admin@test.com" && password === "password123") {
    return;
  }

  throw new Error("Invalid email or password.");
};

type IconButtonProps = ComponentPropsWithoutRef<"button">;

const IconButton = ({ className = "", ...props }: IconButtonProps) => (
  <button
    type="button"
    className={`absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 ${className}`}
    {...props}
  />
);

export const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null);

    try {
      await mockHandleLogin(values);
      navigate("/dashboard");
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.4)] backdrop-blur sm:p-8">
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#003334] to-[#046d6f] text-white shadow-lg">
            <LockKeyhole size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Welcome Back</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to access your dashboard
            </p>
          </div>
        </div>

        {globalError && (
          <div
            className="mb-6 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            role="alert"
          >
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className={iconClassName} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={inputClassName}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <LockKeyhole size={18} className={iconClassName} />
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className={inputClassName}
                {...register("password")}
              />
              <IconButton
                onClick={() => setIsPasswordVisible((current) => !current)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </div>
            {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

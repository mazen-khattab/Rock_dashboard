import { useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../Context/useAuth";
import { getAuthErrorMessage } from "../../Services/AuthService";

const loginSchema = z.object({
  email: z.email("Email is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClassName =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 sm:px-4 py-2.5 sm:py-3 pl-11 pr-11 text-sm sm:text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-700";

const iconClassName = "pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500";

type IconButtonProps = ComponentPropsWithoutRef<"button">;

const IconButton = ({ className = "", ...props }: IconButtonProps) => (
  <button
    type="button"
    className={`absolute right-2 sm:right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer ${className}`}
    {...props}
  />
);

export const Login = () => {
  const { login } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null);

    try {
      await login(values);
    } catch (error) {
      setGlobalError(getAuthErrorMessage(error, "Unable to sign in. Please try again."));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-3.5 sm:p-6 lg:p-10 overflow-hidden text-zinc-200">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(39,39,42,0.35),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(24,24,27,0.4),transparent_50%)] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950/90 p-5 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-xl shadow-black/50">
            <LockKeyhole size={24} className="sm:hidden" />
            <LockKeyhole size={28} className="hidden sm:block" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Welcome Back</h1>
            <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
              Sign in to access your dashboard
            </p>
          </div>
        </div>

        {globalError && (
          <div
            className="mb-5 sm:mb-6 rounded-xl border border-rose-900/40 bg-rose-950/30 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-rose-300 shadow-sm"
            role="alert"
          >
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="email" className="text-xs sm:text-sm font-medium text-zinc-300">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className={iconClassName} />
              <input
                id="email"
                type="email"
                autoComplete="username"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                placeholder="name@example.com"
                className={inputClassName}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs sm:text-sm text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="password" className="text-xs sm:text-sm font-medium text-zinc-300">
              Password
            </label>
            <div className="relative">
              <LockKeyhole size={18} className={iconClassName} />
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
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
            {errors.password && <p className="text-xs sm:text-sm text-rose-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700/80 px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-zinc-100 shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-500">
          <ShieldCheck size={13} className="text-zinc-600" />
          <span>Rock Dashboard &bull; Secure Administration</span>
        </div>
      </div>
    </div>
  );
};

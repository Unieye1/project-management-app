import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(formData) {
    setMessage("");

    const endpoint = isRegistering ? "register" : "login";

    const body = isRegistering
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isRegistering) {
        setMessage("Account created! Please sign in.");
        setIsRegistering(false);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server");
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f4f7ff_0%,#e8edff_52%,#f7f4ff_100%)] px-[18px] py-8 font-sans text-[#17213b]">
      <section
        aria-labelledby="auth-title"
        className="w-full max-w-[420px] rounded-[20px] border border-[rgba(225,230,244,0.9)] bg-white p-6 shadow-[0_24px_70px_rgba(47,62,115,0.13)] sm:p-10"
      >
        <div className="mb-[30px] flex items-center gap-2.5 text-sm font-bold tracking-[0.02em] text-[#4f46e5]">
          <span
            aria-hidden="true"
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#eef0ff]"
          >
            ✦
          </span>
          <span>Project Manager</span>
        </div>

        <h1
          className="mb-2 text-[28px] font-semibold tracking-[-0.04em] text-[#17213b]"
          id="auth-title"
        >
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mb-[26px] text-sm leading-[1.6] text-[#68728a]">
          {isRegistering
            ? "Sign up to get started with your projects."
            : "Sign in to continue to your workspace."}
        </p>

        <form
          className="flex flex-col gap-[17px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isRegistering && (
            <div className="flex flex-col gap-2">
              <label
                className="text-[13px] font-semibold text-[#303a53]"
                htmlFor="auth-name"
              >
                Full name
              </label>
              <input
                autoComplete="name"
                className="w-full rounded-[9px] border border-[#dce1ed] bg-white px-[13px] py-3 text-sm text-[#17213b] outline-none transition focus:border-[#6963e9] focus:ring-[3px] focus:ring-[rgba(99,91,230,0.13)] placeholder:text-[#a0a8b8]"
                id="auth-name"
                name="name"
                placeholder="Your name"
                type="text"
                {...register("name", {
                  required: isRegistering ? "Name is required" : false,
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-semibold text-[#303a53]"
              htmlFor="auth-email"
            >
              Email address
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-[9px] border border-[#dce1ed] bg-white px-[13px] py-3 text-sm text-[#17213b] outline-none transition focus:border-[#6963e9] focus:ring-[3px] focus:ring-[rgba(99,91,230,0.13)] placeholder:text-[#a0a8b8]"
              id="auth-email"
              name="email"
              placeholder="you@example.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-semibold text-[#303a53]"
              htmlFor="auth-password"
            >
              Password
            </label>
            <input
              autoComplete={isRegistering ? "new-password" : "current-password"}
              className="w-full rounded-[9px] border border-[#dce1ed] bg-white px-[13px] py-3 text-sm text-[#17213b] outline-none transition focus:border-[#6963e9] focus:ring-[3px] focus:ring-[rgba(99,91,230,0.13)] placeholder:text-[#a0a8b8]"
              id="auth-password"
              minLength={6}
              name="password"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {!isRegistering && (
            <div className="-mt-0.5 flex items-center justify-between">
              <label className="inline-flex items-center gap-[7px] text-xs text-[#68728a]">
                <input
                  className="m-0 h-[14px] w-[14px] accent-[#5b54dd]"
                  name="remember"
                  type="checkbox"
                />
                Remember me
              </label>
              <button
                className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-[#514bd2] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6963e9]"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            className="mt-[3px] w-full cursor-pointer rounded-[9px] border-0 bg-[#574fe2] px-4 py-[13px] text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[#4841cf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6963e9]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Sign in"}
            
          </button>
        </form>

        <div className="mt-[25px] border-t border-[#edf0f6] pt-[21px] text-center text-[13px] text-[#68728a]">
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-[#514bd2] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6963e9]"
            onClick={() => setIsRegistering(!isRegistering)}
            type="button"
          >
            {isRegistering ? "Sign in" : "Create account"}
          </button>
        </div>
      </section>
    </main>
  );
}

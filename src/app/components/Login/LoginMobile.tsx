"use client";

import { useState, useEffect, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useAuthStore } from "store/auth/useAuthStore";
import { useAuthGuard } from "app/hooks/useAuthGuard";

type GoogleCredentialResponse = {
  credential: string;
  select_by?: string;
};




const LoginMobile = () => {
    
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const signupWithGoogle = useAuthStore((state)=>state.signupWithGoogle)
  const error = searchParams.get("error");
  const authUser = useAuthStore((state)=>state.authUser)

  useEffect(() => {
    if (authUser) {
      // Redirect logged-in users away from login page
      router.replace("/"); // or "/dashboard" if you have a dashboard
    }
  }, [authUser, router]);


  const handleGoogleResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const credential = response.credential;

        const result = await signupWithGoogle({
          googleToken: credential,
        });

        if (result?.success) {
          // toast.success("Signed in with Google!");
          router.push("/");
        } else {
          toast.error(result?.message || "Google signup failed.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong with Google login.");
      }
    },
    [signupWithGoogle, router] // include all external variables used inside
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        const el = document.getElementById("g_id_signin");
        if (el) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(el, {
            theme: "outline",
            size: "large",
            width: 350,
          });
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [handleGoogleResponse]);

  useEffect(() => {
    if (error) toast.error(decodeURIComponent(error as string));
  }, [error]);

  // const handlePasswordToggle = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill out all fields");

    try {
      const result = await login({ email, password }); // <- capture result
      if (result) {                                   // <- only redirect if truthy
        router.push("/"); 
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Login failed");
    }
  };



  return (
    <div className="w-full flex items-center justify-center bg-gray-50 relative p-6 overflow-hidden">

    <div className="w-full max-w-md p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg mt-12 mb-12 
                    md:bg-white md:backdrop-blur-0 flex flex-col justify-center">

        {/* Logo */}
        <div className="uppercase text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2">
        <Image
            src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762097380/logo_f7mhch.png"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-auto"
        />
        Rich<span className="text-green-500">Field</span>
        </div>

        {/* Title */}
        <h3 className="text-xl mb-4 text-black text-center">Login</h3>
        <p className="mb-6 text-gray-600 text-center">
        Welcome Back! Please enter your details.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
        <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-sm
                    md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
        />

        <div className="relative">
            <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black
                        placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-sm
                        md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
            />
            <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setPasswordVisible(!passwordVisible)}
            >
            {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
        </div>

        {/* Remember + Forgot Password */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" />
            Remember me for 30 days
            </label>
            <button
            type="button"
            className="text-blue-500 text-sm underline"
            onClick={() => router.push("/forgot-password")}
            >
            Forgot Password?
            </button>
        </div>

        {/* Submit */}
        <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full bg-black text-white py-3 rounded-md font-semibold ${
            isLoggingIn ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {isLoggingIn ? "Logging in..." : "Log in"}
        </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
        <div className="border-t flex-grow"></div>
        <span className="px-4 text-gray-500">or</span>
        <div className="border-t flex-grow"></div>
        </div>

        <div id="g_id_signin"></div>

        <p className="text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
        <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => router.push("/signup")}
        >
            Sign Up
        </button>
        </p>

    </div>
    </div>

  )
}

export default LoginMobile
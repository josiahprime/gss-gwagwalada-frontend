"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "store/auth/useAuthStore";
import Image from "next/image";

type GoogleCredentialResponse = {
  credential: string;
  select_by?: string;
};

const SignupMobile = () => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const signup = useAuthStore((state) => state.signup);
  const signupWithGoogle = useAuthStore((state) => state.signupWithGoogle);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const authUser = useAuthStore((state)=>state.authUser)
  

  

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "username" && value.includes(" ")) {
      toast.error("Username cannot contain spaces.");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let token: string | null = null;
    if (recaptchaRef.current) {
      token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
    }

    if (formData.username.includes(" ")) {
      toast.error("Username cannot contain spaces. Please use letters, numbers, or underscores.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      recaptchaToken: token ?? "",
    });

    if (result?.success) {
      toast.success("Verification email sent! Please check your inbox.");
      router.push("/login");
    } else {
      toast.error(result?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-50 md:h-screen relative p-6 overflow-hidden">
        <div className="w-full max-w-md p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg mt-12 mb-12 md:bg-white md:backdrop-blur-0 flex flex-col justify-center">


        <div className="uppercase text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2 md:text-left">    
          <Image
            src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762097380/logo_f7mhch.png"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-auto"
          />
          Rich<span className="text-green-500">Field</span>
        </div>

        <h3 className="text-xl mb-4 text-black text-center md:text-left">Sign Up</h3>
        <p className="mb-6 text-gray-600 text-center md:text-left">
          Create your account to get started.
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm md:bg-white md:border-gray-300 md:text-black md:placeholder-gray-400 md:backdrop-blur-0"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className={`w-full bg-black text-white py-3 rounded-md font-semibold ${
              isSigningUp ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="border-t flex-grow"></div>
          <span className="px-4 text-gray-500">or</span>
          <div className="border-t flex-grow"></div>
        </div>

        <div id="g_id_signin"></div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => router.push("/login")}
          >
            Log in
          </button>
        </p>

        {/* ReCAPTCHA */}
        <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_FRONTEND_KEY!}
        size="invisible"
        />

      </div>
    </div>
  );
};

export default SignupMobile;

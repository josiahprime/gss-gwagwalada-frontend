"use client"
import ReCAPTCHA from 'react-google-recaptcha';
import Image from 'next/image';
import { useRef } from 'react';
import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from 'next/navigation'; // ✅ correct in app directory
import toast from "react-hot-toast";
import { useAuthStore } from "store/auth/useAuthStore";
import SignupMobile from 'app/components/Signup/SignupMobile';
import MobileCheckSkeleton from 'app/components/ui/MobileCheckSkeleton';
import InfoModal from 'app/components/Modal/InfoModal';
import { useAuthStore } from 'store/auth/useAuthStore';



type GoogleCredentialResponse = {
  credential: string;
  select_by?: string;
};


// secret key: 
const Signup = () => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const signup = useAuthStore((state) => state.signup);
  const signupWithGoogle = useAuthStore((state)=>state.signupWithGoogle)
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const [isMobile, setIsMobile] = useState<null | boolean>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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







  


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "username" && value.includes(" ")) {
      toast.error("Username cannot contain spaces.");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('login button clicked')
    console.log(process.env.NEXT_PUBLIC_RECAPTCHA_FRONTEND_KEY);
    e.preventDefault();

    let token: string | null = null;
    if (recaptchaRef.current) {
      console.log("✅ Executing reCAPTCHA...");
      token = await recaptchaRef.current.executeAsync();
      console.log("🎯 reCAPTCHA Token:", token);
      recaptchaRef.current.reset();
    } else {
      console.warn("⚠️ recaptchaRef is null");
    }

    // 🚫 Check for spaces in username
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
      setIsModalOpen(true);
    } else {
      toast.error(result?.message || "Signup failed. Try again.");
    }
  };

  if (isMobile === null) return <MobileCheckSkeleton/>;

  return (
    <>
    {isMobile ? (
      <SignupMobile />
    ) : 
      (<div className="flex flex-col md:flex-row h-screen">
        {/* Left Side */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-50">
          <div className="w-96">
            <div className="uppercase text-2xl font-bold mb-4">
              Rich<span className="text-green-500">Field</span>
            </div>

            <h3 className="text-xl mb-4 mt-2 text-black">Sign Up</h3>
            <p className="mb-6 text-gray-600">Create your account to get started.</p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Form */}
            <div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Hidden reCAPTCHA */}
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_FRONTEND_KEY || ''}
                size="invisible"
                className='right-20'
              />
            </div>

            <div className="flex items-center my-4">
              <div className="border-t flex-grow"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="border-t flex-grow"></div>
            </div>

            {/* <button className="w-full border py-3 rounded-md font-semibold flex items-center justify-center">
              <Image src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762093061/googleIcon_ycpzgf.png" alt="Google logo" width={24} height={24} className="mr-2" />
              Sign up with Google
            </button> */}
            <div className="flex justify-center my-4">
              <div id="g_id_signin"></div>
            </div>



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
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full relative h-64 md:h-auto">
          <Image
            src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762093796/orange_jz5thl.jpg"
            alt="Marketplace"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center text-white p-12 bg-black/40">
            <h1 className="text-4xl font-bold mb-4">
              Buy and sell farm produce with ease
            </h1>
            <p className="text-lg">
              Join the marketplace that connects local farmers and fresh food lovers.
            </p>
          </div>
        </div>

      </div>)}

      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          router.push("/login"); // redirect after modal closes
        }} 
      />
    </>
  );
};

export default Signup;

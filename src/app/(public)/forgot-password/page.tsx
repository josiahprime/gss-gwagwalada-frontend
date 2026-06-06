'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from 'store/auth/useAuthStore';
import InfoModal from 'app/components/Modal/InfoModal';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { requestPasswordReset, isRequestingReset } = useAuthStore();
  const requestPasswordReset = useAuthStore((state)=>(state.requestPasswordReset))
  const isRequestingReset = useAuthStore((state)=>(state.isRequestingReset))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await requestPasswordReset(email);

    if (result?.success) {
      // Open the modal on success
      setIsModalOpen(true);
    } else {
      // Optionally show error toast
      toast.error(result?.message || "Failed to send reset link. Try again.");
    }
  };


  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 relative h-full">
        <Image
          src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762093790/loginPageImg1_woqvmm.jpg"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center text-white p-12">
          <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
          <p className="text-lg">Enter your email to receive a password reset link.</p>
        </div>
      </div>


      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-96">
          <div className="uppercase text-2xl font-bold mb-4">
            Rich<span className="text-green-500">Field</span>
          </div>
          <h3 className="text-xl mb-4">Request Password Reset</h3>
          <p className="mb-6 text-gray-600">Please enter your email to receive a reset link.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isRequestingReset}
              className={`w-full ${
                isRequestingReset ? 'bg-gray-500' : 'bg-black'
              } text-white py-3 rounded-md font-semibold`}
            >
              {isRequestingReset ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="border-t flex-grow"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="border-t flex-grow"></div>
          </div>

          <button className="w-full border py-3 rounded-md font-semibold flex items-center justify-center">
            <Image
              src="/images/googleIcon.png"
              alt="Google logo"
              width={24}
              height={24}
              className="mr-2"
            />
            Reset with Google
          </button>

          <p className="text-center text-gray-600 mt-6">
            Remembered your password?{' '}
            <a href="/login" className="text-blue-500">
              Log in here
            </a>
          </p>
        </div>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Check your email!"
        message="We sent a password reset link. Check your inbox or spam folder."
        buttonText="Ok, got it"
        Icon={Mail}
      />
    </div>
    
  );
};

export default ForgotPassword;

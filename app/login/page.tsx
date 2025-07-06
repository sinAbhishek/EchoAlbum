"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Lottie from "lottie-react";
import loginAnimation from "@/public/lottie/login.json";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.error("Login error", err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 bg-gradient-to-l from-orange-100 to-pink-100">
        <div className="w-[80%] px-8 h-[80%] bg-white max-w-md space-y-6 flex flex-col justify-center items-center rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Login
          </h1>

          {/* Email Input */}
          <div className="w-full">
            <p className="mb-1 font-medium">Email</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <p className="mb-1 font-medium">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Spinner Below Button */}
          {loading && (
            <div className="flex justify-center items-center mt-2">
              <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-pink-500 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right: Lottie Animation */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-r from-orange-100 to-pink-800 p-8">
        <Lottie animationData={loginAnimation} className="max-w-[400px]" />
      </div>
    </div>
  );
}

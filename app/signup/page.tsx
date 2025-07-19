"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loginAnimation from "@/public/lottie/login.json";
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/");
    } catch (err) {
      console.error("Signup error", err);
      alert("Signup failed");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 bg-gradient-to-l from-gray-800 to-red-400">
        <div className="w-[80%] px-8 h-[80%] bg-white max-w-md space-y-6 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center text-gray-800 redhat">
            Signup
          </h1>
          <div className=" w-full">
            <p className="mb-1 font-medium redhat text-gray-800">Email</p>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 redhat text-gray-900  border border-gray-300 outline-none rounded-lg  "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className=" w-full">
            <p className="mb-1 font-medium redhat text-gray-800">Password</p>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 redhat text-gray-900  border border-gray-300 outline-none rounded-lg  "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition"
          >
            SignUp
          </button>
          {loading && (
            <div className="flex justify-center items-center mt-2">
              <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-pink-500 hover:underline font-medium"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right: Lottie Animation */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-r from-gray-800 to-rose-900 p-8">
        <Lottie animationData={loginAnimation} className="max-w-[400px]" />
      </div>
    </div>
  );
}

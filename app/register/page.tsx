"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function RegisterPage() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const router= useRouter();
      console.log("NOw registration start")
      const handleSumit=async(e:React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
         console.log("NOw registration start")
        if(password!==confirmPassword){
            alert("passwords do not match");
            return;
        }
        try {
            const res= await fetch("/api/auth/register",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email,
                    password,
                }),
            })
            const data=await res.json();
            if(!res.ok){
                throw new Error(data.error||"registration failed");
            }  
            alert(data.message);
            router.push("/login");

        } catch (error) {
            console.error(error);
        }
      }
   

    return<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Register Page</h1>
    
    <form onSubmit={handleSumit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Register
      </button>
    </form>

    <div className="mt-4 text-center">
      <p>
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  </div>
</div>

}

export default RegisterPage;


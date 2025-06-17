"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

const Register = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", 
    termsAccepted: false,
  })

  const [error, setError] = useState("");
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setIsAuthenticated, setUser, login } = useAuth();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
  
    if (!isValidEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Failed to create an account");
        setLoading(false);
        return;
      }

      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password, 
        }),
        credentials: "include", 
      });

      const loginData = await loginResponse.json();
      login(loginData.user);
  
      if (!loginResponse.ok) {
        setError(loginData.error || "Failed to log in");
        return;
      }

      const userResponse = await fetch("/api/auth/user", { credentials: "include" });
      const userData = await userResponse.json();
      if (userData.isAuthenticated) {
        setUser(userData.user); // Make sure to set the latest user data
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      setLoading(false); // Re-enable button on error
    }
  };  

  return(
    // <section className="bg-gray-50 dark:bg-gray-900">
    <section className="relative flex items-center justify-center min-h-screen px-4 py-8 md:py-4">
  {/* Background Image with 50% opacity overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-50"
    style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
  />

        <div className="relative w-full max-w-4xl h-[650px] md:h-[700px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden mb-8 md:mb-0">
          {/* Left: Already Have an Account? - Hidden on mobile */}
          <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-8 md:p-16 bg-neutral-dark text-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Welcome Back!</h2>
            <p className="text-center mt-2 mb-6">Already have an account? Sign in now.</p>
            
            <Link href="/login">
              <button className="w-full md:w-auto px-6 py-2 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
         </div>

            {/* Right: Register Form */}
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white bg-opacity-90 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Create an account
                  </h1>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <form className="w-full" onSubmit={handleSubmit} noValidate>
                      <div>
                          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilot Callsign or Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all" 
                            placeholder="Maverick" 
                            required 
                            disabled={loading} // Disable input when loading
                          />
                      </div>
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            id="email"
                            autoComplete="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all" 
                            placeholder="name@company.com" 
                            required 
                            disabled={loading} // Disable input when loading
                          />
                      </div>
                      <div className="relative w-full">
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            id="password" 
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all" 
                            required 
                            disabled={loading} // Disable input when loading
                          />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-4 flex items-center text-sm text-neutral-dark font-semibold hover:underline focus:outline-none">
                              {showPassword ? "Hide" : "Show"}
                            </button>
                      </div>
                      <div className="relative w-full mt-4">
                          <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                          <input 
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword" 
                            id="confirm-password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all" 
                            required
                            disabled={loading} // Disable input when loading
                          />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-4 flex items-center text-sm text-neutral-dark font-semibold hover:underline focus:outline-none">
                              {showPassword ? "Hide" : "Show"}
                            </button>
                      </div>
                      <div className="flex items-start mb-6">
                          <div className="flex items-center h-5">
                            <input 
                              id="terms"
                              aria-describedby="terms" 
                              type="checkbox"
                              name="termsAccepted"
                              checked={formData.termsAccepted}
                              onChange={handleChange}
                              className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-neutral-dark transition checked:bg-neutral-dark checked:border-neutral-dark checked:appearance-auto"
                              required
                              disabled={loading} // Disable input when loading
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/terms">Terms and Conditions</a></label>
                          </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </button>
                  </form>
              </div>
        </div>
    </section>
  )
}

export default Register;

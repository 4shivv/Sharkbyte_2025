import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faEnvelope, faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const LoginInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FR-1.2: Login user with credentials
      await login({ email, password });
      // Navigate to agent dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      // Display error message to user
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#100C08] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-2xl p-8 space-y-8 border border-gray-200 dark:border-gray-800 transition-all duration-300">
        
        {/* Header */}
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faShieldHalved} className="text-4xl text-[#1a1a1a] dark:text-gray-100 mb-3" />
          <h2 className="text-3xl font-extrabold text-[#1a1a1a] dark:text-white font-inter">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Log in to manage your agent security.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a1a1a] focus:border-[#1a1a1a] sm:text-sm dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="usernname@organization.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a1a1a] focus:border-[#1a1a1a] sm:text-sm dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#a7b8dd] hover:bg-[#5c6491] focus:outline-none focus:ring-2  focus:ring-[#434875] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-4 w-4" />
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need an account? 
            <Link to="/signup" className="font-medium text-[#1a1a1a] dark:text-white hover:text-gray-700 dark:hover:text-gray-300 ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginInPage;
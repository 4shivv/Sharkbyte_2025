import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faEnvelope, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FR-1.1: Register a new user with email and password
      await register({ email, password, confirmPassword });
      setSuccess(true);
      // Navigate to dashboard after successful registration
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      // Display error message to user
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#010B13] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0A1628] shadow-2xl rounded-3xl p-8 space-y-8 border border-gray-200 dark:border-gray-800 transition-all duration-300">
        
        {/* Header */}
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faShieldHalved} className="text-4xl text-[#1a1a1a] dark:text-blue-400/80 mb-3" />
          <h2 className="text-3xl font-extrabold text-[#1a1a1a] dark:text-white font-inter">
            Join AgentGuard
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Secure your AI agents against Confused Deputy attacks.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            Registration successful! Redirecting to dashboard...
          </div>
        )}

        {/* Sign-Up Form */}
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
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  placeholder-gray-400 focus:outline-none focus:ring-[#1a1a1a] focus:border-[#506488] sm:text-sm dark:bg-[#1c1e2485] dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="username@organization.com"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  placeholder-gray-400 focus:outline-none focus:ring-[#1a1a1a] focus:border-[#506488] sm:text-sm dark:bg-[#1c1e2485] dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  placeholder-gray-400 focus:outline-none focus:ring-[#1a1a1a] focus:border-[#506488] sm:text-sm dark:bg-[#1c1e2485] dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2  focus:ring-[#434875] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Account"}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account? 
            <Link to="/login" className="font-medium text-[#1a1a1a] dark:text-white hover:text-gray-700 dark:hover:text-gray-300 ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
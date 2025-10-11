import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faPersonWalking } from "@fortawesome/free-solid-svg-icons";

const SignInPage = () => {
  const [nameActive, setNameActive] = useState(false);
  const [emailActive, setEmailActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="flex min-h-screen font-poppins bg-mint/10">
      {/* LEFT — FORM SIDE */}
      <div className="flex-1 flex flex-col justify-center px-16 lg:px-28 max-w-4xl bg-white   relative ">
        <div>
          <h1 className="text-3xl font-semibold text-darkGreen">
            Create an Account
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Enter your details to join Navora
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5 max-w-sm"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              onFocus={() => setNameActive(true)}
              onBlur={() => setNameActive(false)}
              className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                nameActive
                  ? "border-forest ring-forest/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              onFocus={() => setEmailActive(true)}
              onBlur={() => setEmailActive(false)}
              className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                emailActive
                  ? "border-forest ring-forest/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              onFocus={() => setPasswordActive(true)}
              onBlur={() => setPasswordActive(false)}
              className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                passwordActive
                  ? "border-forest ring-forest/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-forest text-white py-2.5 rounded-full hover:bg-[#1a5547] transition-colors font-medium cursor-pointer"
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500">
            <span className="text-sm">Already a member?</span>
            <Link
              to="/login"
              className="text-sm text-pine font-medium hover:underline"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>

      {/* RIGHT — VISUAL PANEL */}
       <div className="hidden left-20 mt-35 mr-10 z-10 lg:flex relative w-[32rem] h-[32rem] rounded-full items-center justify-center overflow-hidden bg-radial from-pine/30 via-pine/20 to-[#E8F5F1] backdrop-blur-xl">
                  {/* Pulsing sonar circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-48 h-48 rounded-full border border-forest/90 animate-pulseWave delay-[0s]" />
                    <div className="absolute w-72 h-72 rounded-full border border-pine/80 animate-pulseWave delay-[0.75s]" />
                    <div className="absolute w-96 h-96 rounded-full border border-emerald-400/40 animate-pulseWave delay-[1.5s]" />
                    <div className="absolute w-[30rem] h-[30rem] rounded-full border border-forest/20 animate-pulseWave delay-[2.25s]" />
                    <div className="absolute w-[36rem] h-[36rem] rounded-full border border-pine/15 animate-pulseWave delay-[3s]" />
                  </div>
          
          
                  {/* Central Icon */}
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="text-[7rem] text-darkGreen relative z-10 animate-fadeInSlow"
                  />
                </div>
          
                <div className="absolute hidden lg:block border">
                      <div className="fixed bottom-10 right-90 w-60 h-60 bg-forest/80 rounded-full  hidden sm:block"></div>
                      <div className="fixed top-15 right-12 w-50 h-50 bg-pine/50 rounded-full  hidden sm:block"></div>
                </div>

      <style>
  {`
    @keyframes pulseWave {
      0% {
        transform: scale(0.6);
        opacity: 0.9;
      }
      60% {
        transform: scale(1.2);
        opacity: 0.25;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .animate-pulseWave {
      animation: pulseWave 3s ease-out infinite;
    }

    /* Staggered overlap delays so there’s always one active */
    .delay-[0s] { animation-delay: 0s; }
    .delay-[0.75s] { animation-delay: 0.75s; }
    .delay-[1.5s] { animation-delay: 1.5s; }
    .delay-[2.25s] { animation-delay: 2.25s; }
    .delay-[3s] { animation-delay: 3s; }

    @keyframes fadeInSlow {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fadeInSlow {
      animation: fadeInSlow 1.6s ease-out forwards;
    }
  `}
</style>

    </div>
  );
};

export default SignInPage;

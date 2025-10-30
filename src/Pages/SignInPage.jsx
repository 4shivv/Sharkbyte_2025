import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowPointer,
  faHandPointer,
  faICursor,
  faT,
  faPen,
  faLightbulb,
  faListUl,
  faNoteSticky,
  faChartPie,
  faChartLine,
  faDiagramProject,
  faSquarePollVertical,
  faEye,
  faEyeSlash,
  faLocationArrow,
  faSquareRootVariable,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const SignInPage = () => {
  const [nameActive, setNameActive] = useState(false);
  const [emailActive, setEmailActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignedUp(true);
  };

  return (
    <>
      <div className="flex min-h-screen font-inter text-[#1A1A1A] overflow-hidden">
        {/* LEFT: Signup Form */}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-24 max-w-xl bg-white">
          <div className="left-1/8 absolute w-xl">
          <h1 className="text-3xl font-semibold font-poppins mb-2">
            {signedUp ? "Welcome Aboard! 🎉" : "Create Your Account"}
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            {signedUp
              ? "Redirecting to your workspace..."
              : "Sign up to start organizing your ideas"}
          </p>

          {!signedUp && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm">
              {/* Name Field */}
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
                  placeholder="Your name"
                  onFocus={() => setNameActive(true)}
                  onBlur={() => setNameActive(false)}
                  className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    nameActive
                      ? "border-forest ring-forest/20"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              </div>

              {/* Email Field */}
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
                  placeholder="you@example.com"
                  onFocus={() => setEmailActive(true)}
                  onBlur={() => setEmailActive(false)}
                  className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    emailActive
                      ? "border-forest ring-forest/20"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onFocus={() => setPasswordActive(true)}
                  onBlur={() => setPasswordActive(false)}
                  className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    passwordActive
                      ? "border-forest ring-forest/20"
                      : "border-gray-200 hover:border-gray-400"
                  } pr-13`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11.5 -translate-y-1/2 text-gray-500/50 hover:text-gray-700 cursor-pointer transition-all duration-300"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#1E1E1E] text-white py-2.5 rounded-full hover:bg-[#698CD1] active:bg-black transition-colors font-medium cursor-pointer"
              >
                Sign Up
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="text-[#4f6de6] font-medium hover:underline"
                >
                  Log in
                </Link>
              </div>
            </form>
          )}
          </div>
        </div>

        {/* RIGHT: GoodNotes-Style Board */}
        <div className="hidden lg:flex flex-1 mt-5 mb-5 mr-5 ml-60 relative items-center justify-center bg-[#5780c0]/90 rounded-[2rem] ">
        {/* Subtle grid */}
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_12s_linear_infinite]" />

        {/* Central Sticky */}
        <div className="absolute flex flex-col gap-2 border border-[#E3C95D] bg-[#FFF4B3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-1 px-8 py-5 rounded-2xl text-gray-800 text-lg font-semibold max-w-sm ">
          <div className="flex items-center justify-between gap-20  border-[#CBB34A]/40 pb-2 text-[#6C5100] font-poppins font-medium">
            <span>Welcome Board</span>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <span className="mt-3 mb-3  text-base font-medium text-[#6c5100c0]">
            🚀 Let’s get you set up.
          </span>
        </div>

        {/* Sticky Notes */}
        <div className="absolute top-16 left-20 -rotate-2 bg-[#FFD8D8] border border-[#E9A1A1] px-6 py-4 rounded-2xl text-[#5C1F1F] font-medium">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faLightbulb} />
            <span>Brainstorm</span>
          </div>
          <p className="text-sm opacity-80">Map out creative sparks 💡</p>
        </div>

        <div className="absolute top-32 right-20 rotate-[2deg] bg-[#C8F5D2] border border-[#8ACC9B] px-6 py-4 rounded-2xl text-[#214B2A] font-medium">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faPen} />
            <span>Quick Notes</span>
          </div>
          <p className="text-sm opacity-80">Capture thoughts ✍️</p>
        </div>

        <div className="absolute bottom-35 right-15 rotate-3 bg-[#D2E7FF] border border-[#A2C1F9] px-6 py-4 rounded-2xl text-[#102A5A] font-medium">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faListUl} />
            <span>Task Flow</span>
          </div>
          <p className="text-sm opacity-80">Organize steps clearly</p>
        </div>

        <div className="absolute bottom-16 left-20 rotate-[-1.5deg] bg-[#FFE9B3] border border-[#E6C76E] px-6 py-4 rounded-2xl text-[#6E5600] font-medium">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faChartPie} size="lg" />
            <span>Progress</span>
          </div>
          <p className="text-sm opacity-80">Visualize data simply 🥧</p>
        </div>

        <div className="absolute top-1/4 left-1/4 rotate-[1deg] bg-[#D7D2FF] border border-[#A29EF4] px-6 py-4 rounded-2xl text-[#2E2172] font-medium">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faChartLine} size="lg" />
            <span>Trends</span>
          </div>
          <p className="text-sm opacity-80">See growth over <mark className="bg-[#7664ff] text-white px-1">time</mark> 📈</p>
        </div>

      

        {/* Floating cursors (users) */}
        <div className="absolute flex flex-col items-end gap-1 top-40 left-15 animate-[float_4s_ease-in-out_infinite]">
          <FontAwesomeIcon icon={faHandPointer} className="text-[#ffc9c9] text-3xl" />
          <div className="bg-[#ffc9c9] text-[#5C1F1F] text-sm ml-5 mr-5 px-3 py-1 rounded-full font-medium">
            Alex
          </div>
        </div>

        <div className="absolute flex flex-col  gap-1  bottom-10 right-10  animate-[float_6s_ease-in-out_infinite_1s]">
          <FontAwesomeIcon icon={faLocationArrow} className="text-[#ccdeff] text-2xl -rotate-90" />
          <div className="bg-[#dce8ff] text-gray-700 text-sm ml-5 px-3 py-1 rounded-full font-medium">
            Leo
          </div>
        </div>

        <div className="absolute flex gap-2 bottom-24 left-1/2 animate-[float_4s_ease-in-out_infinite_2s]">
          <FontAwesomeIcon icon={faLocationArrow} className="text-[#ffe59f] text-2xl -rotate-140" />
          <div className="bg-[#ffecb8] text-[#4A3A00] text-sm px-3 py-1 rounded-full font-medium">
            Kai
          </div>
        </div>

        <div className="absolute flex flex-col gap-1 top-15 right-15 animate-[float_7s_ease-in-out_infinite_3s]">
          <div className="bg-[#cbffd1] text-[#214B2A] text-sm ml-5 px-3 py-1 rounded-full font-medium">
            Sofia
          </div>
          <FontAwesomeIcon icon={faLocationArrow} className="text-[#a6feb0] text-2xl -rotate-180" />

        </div>

        <div className="absolute flex flex-col gap-1 top-1/3 right-55 animate-[float_8s_ease-in-out_infinite_4s]">
          <FontAwesomeIcon icon={faICursor} className="text-[#f2ecff] text-2xl" />
          <div className="bg-[#e2d5ff] text-[#2E2172] text-sm ml-5 px-3 py-1 rounded-full font-medium">
            Maya
          </div>
        </div>

        <div className="absolute left-25 bottom-1/3">
          <FontAwesomeIcon icon={faSquareRootVariable} className="text-white text-5xl"/>
        </div>
        <div className="absolute right-15 top-75">
          <FontAwesomeIcon
            icon={faChartPie}
            className="text-white text-6xl"
            style={{ animation: "shakeChart 5s ease-in-out infinite" }}
          />

          <style>
            {`
              @keyframes shakeChart {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                50% { transform: translateX(4px); }
                75% { transform: translateX(-2px); }
              }
            `}
          </style>
        </div>
        
        <div className="absolute right-1/2 bottom-1/4">
          <FontAwesomeIcon
            icon={faSquare}
            className="text-white text-4xl"
            style={{
              transformOrigin: "center",
              display: "inline-block",
              animation: "rotateSquare 25s linear infinite",
            }}
          />

          <style>
          {`
          @keyframes rotateSquare {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          `}
          </style>
        </div>
      </div>
      </div>
    </>
  );
};

export default SignInPage;

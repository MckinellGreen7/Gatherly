import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthProps {
  mode: "signin" | "signup";
  userType: "user" | "admin";
}

const Auth: React.FC<AuthProps> = ({ mode, userType: initialUserType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">(0);
  const [userType, setUserType] = useState(initialUserType);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async () => {
    const endpoint = `https://backend.khandelwalshriyansh1208.workers.dev/api/v1/${userType}/${mode}`;

    try {
      const response = await axios.post(endpoint, {
        email,
        password,
        ...(mode === "signup" && userType === "user" && { name, age }), // Include name and age only if signing up as user
        ...(mode === "signup" && userType === "admin" && { name }), // Include name only if signing up as admin
      });

      if (response.status === 200) {
        const token = response.data;
        console.log(token);
        localStorage.setItem("token", token);
        navigate(`/${userType}/dashboard`);
      } else {
        alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} failed. Please check your details.`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 411) {
        setError("Invalid email / password");
      } else {
        console.error(`Error during ${mode}:`, error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const toggleUserType = () => {
    setUserType((prevType) => (prevType === "user" ? "admin" : "user"));
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-2 lg:px-4">
      <div className="max-w-lg py-5 bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-3/4 xl:w-2/3 p-6 sm:p-8">
          <div className="flex flex-col items-center">
            
            <label className="flex cursor-pointer gap-2 mb-4 items-center">
              <span className={`label-text font-bold ${userType === "user" ? 'text-blue-900 text-xl' : 'text-gray-500 text-lg'}`}>
                User
              </span>
              <input
                type="checkbox"
                value={userType === "admin" ? "admin" : "user"}
                className="toggle theme-controller"
                onChange={toggleUserType}
              />
              <span className={`label-text font-bold ${userType === "admin" ? 'text-blue-900 text-xl' : 'text-gray-500 text-lg'}`}>
                Admin
              </span>
            </label>

            <div className="text-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold text-blue-900">
                {mode === "signin" ? "Sign In" : "Sign Up"}
              </h1>
              <p className="pt-2 text-md text-gray-500">
                {mode === "signin" 
                  ? `Enter your details to sign in as ${userType}`
                  : `Enter your details to sign up as ${userType}`}
              </p>
            </div>
            <div className="w-full flex-1 mt-6">
              <div className="mx-auto max-w-xs flex flex-col gap-3">
                {mode === "signup" && (
                  <>
                    <input
                      className="w-full px-4 py-3 text-md rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {userType === "user" && (
                      <input
                        className="w-full px-4 py-3 text-md rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="number"
                        placeholder="Enter your age"
                        value={age === 0 ? "" : age}
                        onChange={(e) => setAge(Number(e.target.value))}
                      />
                    )}
                  </>
                )}
                <input
                  className="w-full px-4 py-3 text-md rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-4 py-3 text-md rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <p className="text-md text-red-500 mt-2">{error}</p>
                )}
                <button
                  onClick={handleAuth}
                  className="mt-4 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">{mode === "signin" ? "Sign In" : "Sign Up"}</span>
                </button>
                {mode === "signin" ? (
                  <p className="mt-5 text-md text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup">
                      <span className="text-blue-900 font-semibold hover:underline">Sign up</span>
                    </Link>
                  </p>
                ) : (
                  <p className="mt-5 text-md text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link to="/signin">
                      <span className="text-blue-900 font-semibold hover:underline">Sign in</span>
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

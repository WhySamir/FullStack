import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Api/authApi.ts";

import { useDispatch } from "react-redux";
import { login } from "../../Redux/auth.ts";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        navigate("/");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMessage("");
    e.preventDefault();
    try {
      const data = await loginUser({ username, password }, setErrorMessage);
      if (data) {
        console.log("User logged in:", data);
        dispatch(login(data));
        navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogle = () => {
    console.log("Handled");
  };
  if (!isOpen) return null;
  return (
    <>
      {/* {isOpen && ( */}
      <div className="relative flex items-center justify-center min-h-[90vh] ">
        {/* Glassmorphism Container backdrop-blur-lg */}
        <div
          ref={menuRef}
          className="bg-white/10  border border-white/30 shadow-lg rounded-xl p-4 w-[90vw] sm:w-[50vw] lg:w-[48vw]  2xl:w-[50vw] text-white"
        >
          <h1 className="text-2xl font-semibold text-center mb-6">
            Log in to your account
          </h1>
          {errorMessage && ( // Show error message if exists
            <div className="bg-red-500 text-white p-2 rounded-lg text-center mb-4">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-col">
              <label
                htmlFor="emailorusername"
                className="text-sm mb-3 font-medium"
              >
                Email or Username:
              </label>
              <input
                type="text"
                required
                id="emailorusername"
                name="emailorusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-4 py-3 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-3 text-sm font-medium">
                Password:
              </label>
              <input
                id="password"
                type="password"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all text-white font-bold py-3 rounded-lg w-full shadow-md"
            >
              LOG IN
            </button>

            <p className="text-center text-gray-300">or</p>

            <div
              onClick={handleGoogle}
              className="flex items-center justify-center space-x-3 bg-white/20 hover:bg-white/30 transition-all text-white border border-gray-400 py-3 rounded-lg w-full shadow-md"
            >
              <img src="./MIcon.svg" alt="Google Icon" className="w-6 h-6" />
              <span className="font-bold">LOG IN WITH GOOGLE</span>
            </div>

            <p className="text-center mt-4 text-gray-300">
              New to WatchFree?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-500 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default Signin;

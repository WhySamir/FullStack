import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Api/authApi.ts";

import { useDispatch } from "react-redux";
import { register } from "../../Redux/auth.ts";

const Signin = () => {
  const [credentials, setcredentials] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    avatar: null as File | null,
    coverImage: null as File | null,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const data = await registerUser(credentials, setErrorMessage);
    if (data) {
      console.log("User logged in:", data);
      dispatch(register(data));
      //   dispatch({ type: "USER_REGISTER_SUCCESS", payload: data });
      navigate("/signin");
    } else {
      console.log("Login failed, not navigating");
    }
  };

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

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setcredentials((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Handles both text input and file upload
    }));
  };
  const handleGoogle = () => {
    console.log("Handled");
  };
  if (!isOpen) return null;

  return (
    <div className=" relative flex items-center justify-center min-h-[90vh] ">
      {/* Glassmorphism Container backdrop-blur-lg */}
      <div
        ref={menuRef}
        className="bg-white/10  border border-white/30 shadow-lg rounded-xl p-4 w-[90vw] sm:w-[50vw] lg:w-[48vw]  2xl:w-[50vw] text-white"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create your new account
        </h1>
        {errorMessage && ( // Show error message if exists
          <div className="bg-red-500 text-white p-2 rounded-lg text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col space-y-2"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1 font-medium">
              Email:
            </label>
            <input
              type="text"
              required
              name="email"
              id="email"
              value={credentials.email}
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 autofill:bg-transparent backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm mb-1 font-medium">
              Username:
            </label>
            <input
              type="text"
              required
              name="username"
              id="username"
              value={credentials.username}
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="fullname" className="text-sm mb-1 font-medium">
              FullName:
            </label>
            <input
              type="text"
              required
              name="fullname"
              id="fullname"
              value={credentials.fullName}
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium">
              Password:
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              value={credentials.password}
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="avatar" className="text-sm mb-1 font-medium">
              Avatar:
            </label>
            <input
              type="file"
              accept="image/*"
              required
              name="avatar"
              id="avatar"
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="coverImage" className="text-sm mb-1 font-medium">
              Cover Image:
            </label>
            <input
              type="file"
              accept="image/*"
              name="coverImage"
              id="coverImage"
              //   value={credentials.coverImage}
              onChange={onchange}
              className=" w-full px-4 py-1 text-lg bg-white/20 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 transition-all text-white font-bold py-3 rounded-lg w-full shadow-md"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-300">or</p>

          <div
            onClick={handleGoogle}
            className="flex items-center justify-center space-x-3 bg-white/20 hover:bg-white/30 transition-all text-white border border-gray-400 py-3 rounded-lg w-full shadow-md"
          >
            <img src="./MIcon.svg" alt="Google Icon" className="w-6 h-6" />
            <span className="font-bold">Sign Up With Google</span>
          </div>

          <p className="text-center mt-4 text-gray-300">
            Already have an account on WatchFree?{" "}
            <Link
              to="signin"
              className="text-blue-400 hover:text-blue-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;

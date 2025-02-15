import api from "./axios";

//login
export const loginUser = async (
  userData: { username: string; password: string },
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const response = await api.post("/users/login", userData);
    if (response.data.success) {
      console.log("Login successful:", response.data);
      
      return response.data;
    } else {
      setErrorMessage(response.data.message || "Login failed. Please try again.");
      return null;
    }
  } catch (error: any) {
    setErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
    return null;
  }
};
//register 
// const userD  = { username:string; email;string,password:strings,fullName:string,avatar:File,coverImage:File}
export const registerUser = async (
  userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar: File | null;
    coverImage: File | null;
  },
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("fullName", userData.fullName);
    if (userData.avatar) formData.append("avatar", userData.avatar);
    if (userData.coverImage) formData.append("coverImage", userData.coverImage);

    const response = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      console.log("Registration successful:", response.data);
      return response.data;
    } else {
      setErrorMessage(response.data.message || "Registration failed. Please try again.");
      return null;
    }
  } catch (error: any) {
    setErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
    return null;
  }
};




//get current user
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/users/current-user");
    return response.data;
  } catch (error: any) {
    return null;
  }
};
//logout
export const handleLogout = async () => {
  try {
    const response = await api.post("/users/logout");
      return response.data;
  } catch (error: any) {
    console.error("Logout error:", error.message);
    throw error;
  }
};
export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/users/refresh-token");
    if (response.data) {
      return response.data.accessToken;
    }
  } catch (error: any) {
    throw error;
  }
};


//login
export const loginUser = async (userData: { username: string; password: string },setErrorMessage:React.Dispatch<React.SetStateAction<string>>) => {
  try {
    
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Include cookies in the request
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if ( response.ok) {
        const data= await response.json()
        console.log("Login successful:", data);
        // setTimeout(() => {
        //   console.log("Login successful, toggling authentication...");
        // }, 1000);     
         return data;
        }else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Login failed. Please try again.");
          return null; 
        }
  } catch (error:unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    setErrorMessage(error.message);
  }else {
    setErrorMessage("An unexpected error occurred."); // Fallback for unknown errors
  }
}
  };
//register 
// const userD  = { username:string; email;string,password:strings,fullName:string,avatar:File,coverImage:File}

export const registerUser = async (userData: { username: string; email: string; password: string; fullName:string; avatar:File | null;  coverImage:File | null; },setErrorMessage:React.Dispatch<React.SetStateAction<string>>) => {
  try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("fullName", userData.fullName);
      if (userData.avatar) formData.append("avatar", userData.avatar);
      if (userData.coverImage) formData.append("coverImage", userData.coverImage);
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        body: formData,
       credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        return data;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed. Please try again.");
        return null;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred."); 
      }
    }
  }




//get current user
  export const fetchCurrentUser = async () => {
  try {
      const response = await fetch("http://localhost:8000/api/v1/users/current-user", {
        method: "GET",
        credentials: "include", 
      });
      if (response.status === 401) {
        // console.warn("Session expired. Redirecting to Sigin...");
        return null;
      }
      if (!response.ok) {
      throw new Error(`HTTP Error`);
    }
    const data = await response.json();
    return data;
  } catch (error:unknown) {
    if (error instanceof Error) {
      console.log(error.message);}
    console.error(error)
    return null;
  }
  };
//logout
export  const handleLogout = async () => {

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include", 
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Logout successful");
       
        return data.data;
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };
 export const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/refresh-token",
        {
          method: "POST",
          credentials: "include", 
        }
      );

      const data = await response.json();

      if (data.success) {
        // Save the new access token
        console.log("Access token refreshed:", data.data.accessToken);
        return data.data.accessToken;
      } else {
        throw new Error(data.message || "Failed to refresh access token");
      }
    } 
    catch (error: any) {
      
      throw error;
    }
  };

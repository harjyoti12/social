// import { useNavigate } from "react-router-dom";
// import { createContext, useContext, useEffect, useState } from "react";

// import { IUser } from "@/lib/types";
// import { getCurrentUser } from "@/lib/appwrite/api";


// export const INITIAL_USER = {
//   id: "",
//   name: "",
//   username: "",
//   email: "",
//   imageUrl: "",
//   bio: "",
// };

// const INITIAL_STATE = {
//   user: INITIAL_USER,
//   isLoading: false,
//   isAuthenticated: false,
//   setUser: () => {},
//   setIsAuthenticated: () => {},
//   checkAuthUser: async () => false as boolean,
// };

// type IContextType = {
//   user: IUser;
//   isLoading: boolean;
//   setUser: React.Dispatch<React.SetStateAction<IUser>>;
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   checkAuthUser: () => Promise<boolean>;
// };

// const AuthContext = createContext<IContextType>(INITIAL_STATE);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<IUser>(INITIAL_USER);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const checkAuthUser = async () => {
//     setIsLoading(true); 
//     try {
//       const currentAccount = await getCurrentUser();
//       if (currentAccount) {
//         setUser({
//           id: currentAccount.$id,
//           name: currentAccount.name,
//           username: currentAccount.username,
//           email: currentAccount.email,
//           imageUrl: currentAccount.imageUrl,
//           bio: currentAccount.bio,
//         });
//         setIsAuthenticated(true);

//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error(error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cookieFallback = localStorage.getItem("cookieFallback");
//     if (
//       cookieFallback === "[]" ||
//       cookieFallback === null ||
//       cookieFallback === undefined
//     )  navigate("/sign-in");
    

//     checkAuthUser();
//   }, []);

//   const value = {
//     user,
//     setUser,
//     isLoading,
//     isAuthenticated,
//     setIsAuthenticated,
//     checkAuthUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useUserContext = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "@/lib/types";
import { getCurrentUser, signOutAccount } from "@/lib/appwrite/api";
import { toast } from "@/hooks/use-toast";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  logout: async () => {}, // Added logout function
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  logout: () => Promise<void>; // Added logout type
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is authenticated
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Authentication check failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOutAccount(); // Call the Appwrite logout API
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      navigate("/sign-in");
      toast({ title: "Logout Successfully!", variant: "destructive" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (!cookieFallback || cookieFallback === "[]") {
      setIsAuthenticated(false);
      navigate("/sign-in");
    } else {
      checkAuthUser();
    }
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);

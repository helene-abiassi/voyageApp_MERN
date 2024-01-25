import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../types/customTypes";
import { LogInCredentials, LogInResponse } from "../components/Login";

interface AuthContextType {
  user: User | null;
  loginCredentials: LogInCredentials | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  logIn: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setLoginCredentials: (loginCredentials: LogInCredentials) => void;
  logOut: () => void;
  getProfile: () => void;
  deleteProfile: (userID: string) => void;
  authenticateUser: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthInitContext = {
  user: null,
  loginCredentials: null,
  isLoading: true,
  isLoggedIn: false,
  setIsLoggedIn: () => console.log("context not initialized"),
  setUser: () => console.log("context not initialized"),
  logIn: () => console.log("context not initialized"),
  setLoginCredentials: () => console.log("context not initialized"),
  logOut: () => console.log("context not initialized"),
  getProfile: () => console.log("context not initialized"),
  deleteProfile: () => console.log("context not initialized"),
  authenticateUser: () => console.log("context not initialized"),
};

export const AuthContext = createContext<AuthContextType>(AuthInitContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginCredentials, setLoginCredentials] =
    useState<LogInCredentials | null>(null);

  const logIn = async () => {
    setIsLoggedIn(false);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", loginCredentials!.email);
    urlencoded.append("password", loginCredentials!.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/users/login",
        requestOptions
      );

      if (response.ok) {
        const results: LogInResponse = await response.json();

        const token = results.token;
        if (token) {
          localStorage.setItem("token", token);
          setUser(results.user);
          setIsLoggedIn(true);
        }
      }
      if (response.status === 404) {
        await alert("This email does not exist!");
        return;
      }
      // if (response.status === 401) {
      //   await alert("Wrong password!");
      //   return;
      // }
    } catch (err) {
      const error = err as Error;
      console.log("error when logging in :>> ", error);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("you need to log in first!");
      setUser(null);
    }
    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:5005/api/users/profile",
          requestOptions
        );

        if (!response.ok) {
          setIsLoading(false);
        }

        if (response.ok) {
          const result = await response.json();
          const user = result.userProfile as User;

          setUser(user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        const error = err as Error;
        setIsLoading(false);
      }
    }
  };
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");

    return token ? true : false;
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  const deleteProfile = async (userID: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // console.log("No token available!");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `http://localhost:5005/api/users//deleteuser/${userID}`,
        requestOptions
      );
      // console.log("Response status:", response.status);

      if (response.ok) {
        // console.log("profile deleted successfully!");
        setUser(null);
      } else {
      }
    } catch (error) {}
  };

  const authenticateUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:5005/api/users/profile",
          requestOptions
        );

        if (response.ok) {
          const result = await response.json();
          const user = result.userProfile as User;
          setUser(user);
          setIsLoggedIn(true);
          setIsLoading(false);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setIsLoading(false);
        }
      } catch (err) {
        const error = err as Error;
        setIsLoading(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, [user?.username]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logOut,
        getProfile,
        logIn,
        loginCredentials,
        setLoginCredentials,
        isLoading,
        setIsLoggedIn,
        isLoggedIn,
        authenticateUser,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

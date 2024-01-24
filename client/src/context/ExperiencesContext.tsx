import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Experience } from "../types/customTypes";
import { AuthContext } from "./AuthContext";
// import useMyFetch from "../hooks/useMyFetch";

interface ExperiencesContextType {
  experiences: Experience[] | null;
  // urlParams: string;
  fetchExperiences: () => Promise<void>;
  deleteExperience: (experienceID: string) => void;
  bookmarkExperience: (experienceID: string) => void;
  removeBookmark: (experienceID: string) => void;
  // setUrlParams: (urlParams: string) => void;

  // loading: boolean;
  // error: string;
}
const initialContext: ExperiencesContextType = {
  experiences: null,
  fetchExperiences: () => Promise.resolve(),
  deleteExperience: (experienceID: string) =>
    console.log("context not initialized"),
  removeBookmark: (experienceID: string) =>
    console.log("context not initialized"),
  bookmarkExperience: (experienceID: string) =>
    console.log("context not initialized"),
};

interface ProviderPropsType {
  children: ReactNode;
}

export const ExperiencesContext =
  createContext<ExperiencesContextType>(initialContext);

export const ExperiencesContextProvider = (props: ProviderPropsType) => {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);

  const { user } = useContext(AuthContext);

  const fetchExperiences = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const results = await fetch(
        `http://localhost:5005/api/experiences/all`,
        requestOptions
      );

      if (results.status === 200) {
        const data = await results.json();
        // console.log("data  of fetchExp:>> ", data);
        const experienceList = data.data as Experience[];

        // console.log("experienceList :>> ", experienceList);

        // setUrlParams(urlParams);
        setExperiences(experienceList);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const bookmarkExperience = async (experienceID: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token available");
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", user!.email);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `http://localhost:5005/api/experiences/bookmarkexperience/${experienceID}`,
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();

        fetchExperiences();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const removeBookmark = async (experienceID: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token available!");
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", user!.email);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        `http://localhost:5005/api/experiences/removebookmark/${experienceID}`,
        requestOptions
      );

      if (response.ok) {
        const results = await response.json();

        fetchExperiences();
      }
    } catch (error) {
      console.log("error when removing bookmark:>> ", error);
    }
  };

  const deleteExperience = async (experienceID: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found!");
    }
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    try {
      if (window.confirm("Are you SURE you want to delete your submission?")) {
        const response = await fetch(
          `http://localhost:5005/api/experiences/deleteexperience/${experienceID}`,
          requestOptions
        );

        if (response.ok) {
          console.log("experience deleted successfully!");
        } else {
          console.log("error with response when deleting experience");
        }
      }
    } catch (error) {
      console.log("error when deleting experience:>> ", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <ExperiencesContext.Provider
      value={{
        experiences,
        fetchExperiences,
        deleteExperience,
        bookmarkExperience,
        removeBookmark,
      }}
    >
      {props.children}
    </ExperiencesContext.Provider>
  );
};

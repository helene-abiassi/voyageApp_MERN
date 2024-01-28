import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { ExperiencesContextProvider } from "./context/ExperiencesContext";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./views/Home";
import SignUp from "./views/SignUp";
import LogIn from "./views/LogIn";
import About from "./views/About";
import Experiences from "./views/Experiences";
import Map from "./views/Map";
import Profile from "./views/Profile";
import ExperienceDetails from "./views/ExperienceDetails";
import Update from "./views/Update";
import UpdateProfileView from "./views/UpdateProfile";
import ErrorPage from "./views/ErrorPage";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ExpLayout from "./components/ExpLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Submit from "./views/Submit";
import "../src/styles/main.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="experiences" element={<ExpLayout />}>
          <Route path=":experienceType" element={<Experiences />} />
        </Route>

        <Route
          path="experiences/id/:experienceID"
          element={<ExperienceDetails />}
        />
        <Route
          path="updateexperience/:experienceId"
          element={
            <ProtectedRoute>
              <Update />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateprofile/:profileId"
          element={
            <ProtectedRoute>
              <UpdateProfileView />
            </ProtectedRoute>
          }
        />
        <Route path="map" element={<Map />} />
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="submit"
          element={
            <ProtectedRoute>
              <Submit />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return (
    <>
      <div className="mainBody">
        <AuthContextProvider>
          <ExperiencesContextProvider>
            <RouterProvider router={router} />
          </ExperiencesContextProvider>
          <Footer />
        </AuthContextProvider>
      </div>
    </>
  );
}

const Root = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;

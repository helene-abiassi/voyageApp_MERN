import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Loader from "./Loader";

interface ProtectedRouteProp {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProp) {
  const { user, isLoading } = useContext(AuthContext);

  return (
    <>
      {user ? (
        children
      ) : isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <div>
          <h1>not allowed here</h1> <Link to={"/"}>Go back home</Link>
        </div>
      )}
    </>
  );
}

export default ProtectedRoute;

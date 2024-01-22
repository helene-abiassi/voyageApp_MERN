import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface ProtectedRouteProp {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProp) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        children
      ) : (
        <div>
          <h1>not allowed here</h1> <Link to={"/"}>Go back home</Link>
        </div>
      )}
    </>
  );
}

export default ProtectedRoute;

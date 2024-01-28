import { useEffect } from "react";
import Login from "../components/Login";

function LogIn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h1>please log in</h1>
      <Login />
    </div>
  );
}

export default LogIn;

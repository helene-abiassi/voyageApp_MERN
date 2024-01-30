import { useEffect } from "react";
import Signup from "../components/Signup";

function SignUp() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pageBody">
      <h1>please sign up</h1>
      <Signup />
      <br />
    </div>
  );
}

export default SignUp;

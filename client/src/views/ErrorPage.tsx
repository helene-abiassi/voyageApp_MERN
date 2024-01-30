import { Link, useRouteError } from "react-router-dom";
import { RouteErrorType } from "../types/customTypes";
import { useEffect } from "react";

function ErrorPage() {
  const error = useRouteError() as RouteErrorType;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pageAlignment pageBody">
      <h1>nothing to see here</h1>
      <p>{error.error?.message}</p>
      <Link className="nakdButton" to={"/"}>
        go back home
      </Link>
    </div>
  );
}

export default ErrorPage;

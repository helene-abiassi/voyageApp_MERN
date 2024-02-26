import { Link, useRouteError } from "react-router-dom";
import { RouteErrorType } from "../types/customTypes";

function ErrorPage() {
  const error = useRouteError() as RouteErrorType;

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

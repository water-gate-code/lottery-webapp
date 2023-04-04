import { useRouteError } from "react-router-dom";
import { Topbar } from "./Topbar";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <Topbar />

      <div className="App container text-center mt-5">
        <h1 className="display-6">Oops!</h1>
        <p className="lead">Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}

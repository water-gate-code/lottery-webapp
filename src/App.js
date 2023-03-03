import Dice from "./Dice";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  Outlet,
  Link,
} from "react-router-dom";

import "./App.css";
import { AccountProvider } from "./Dice/context/Account";

function Topbar() {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to={`/`}>
          Barsino
        </Link>
      </div>
    </nav>
  );
}

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <Topbar />

      <div
        className="App container text-center"
        style={{ width: 500, marginTop: 150 }}
      >
        <h1 className="display-6">Oops!</h1>
        <p className="lead">Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}

function Game() {
  return <h1 class="display-1">Game Panel</h1>;
}

function Layout() {
  return (
    <div>
      <Topbar />
      <div className="row">
        <div className="col-2">
          <h1 className="display-6">Games</h1>
          <div className="list-group">
            <Link
              className="list-group-item list-group-item-action"
              to={`games/1`}
            >
              Game A
            </Link>
            <Link
              className="list-group-item list-group-item-action"
              to={`games/2`}
            >
              Game B
            </Link>
          </div>
        </div>
        <div className="col-10">
          <div className="App container">
            <Outlet />
            {/* <AccountProvider>
              <Dice />
            </AccountProvider> */}
          </div>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "games/:gameId",
        element: <Game />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

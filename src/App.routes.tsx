import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewStream from "./pages/Stream/NewStream";
import AddressBook from "./pages/AddressBook";
import OutgoingStream from "./pages/Stream/OutgoingStream";
import IncomingStream from "./pages/IncomingStream";
import ErrorPage from "./pages/ErrorPage";

export const routes = [
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "stream/outgoing",
        element: <OutgoingStream/>,
      },
      {
        path: "stream/incoming",
        element: <IncomingStream/>,
      },
      {
        path: "address_book",
        element: <AddressBook/>,
      },
      {
        path: "stream/new",
        element: <NewStream/>,
      }
    ]
  },
];

export default routes;
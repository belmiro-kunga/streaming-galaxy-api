import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { Animation } from "@/pages/Animation";
import { Dorama } from "@/pages/Dorama";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/animation",
    element: <Animation />,
  },
  {
    path: "/dorama",
    element: <Dorama />,
  },
]); 
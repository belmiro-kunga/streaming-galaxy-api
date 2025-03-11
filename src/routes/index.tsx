
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { Animation } from "@/pages/Animation";
import { Dorama } from "@/pages/Dorama";
import { Acao } from "@/pages/Acao";
import { Aventura } from "@/pages/Aventura";
import { Comedia } from "@/pages/Comedia";
import { Drama } from "@/pages/Drama";
import { Faroeste } from "@/pages/Faroeste";
import NotFound from "@/pages/NotFound";

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
  {
    path: "/acao",
    element: <Acao />,
  },
  {
    path: "/aventura",
    element: <Aventura />,
  },
  {
    path: "/comedia",
    element: <Comedia />,
  },
  {
    path: "/drama",
    element: <Drama />,
  },
  {
    path: "/faroeste",
    element: <Faroeste />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

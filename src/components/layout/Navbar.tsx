import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { mainMenuItems, getHamburgerItems } from "@/config/menu-items";

export function Navbar() {
  const location = useLocation();
  const hamburgerItems = getHamburgerItems(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link to="/" className="mr-6 font-bold">
            StreamingGalaxy
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {mainMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden md:block">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-2 mt-4">
                {hamburgerItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg transition-all",
                      location.pathname === item.path
                        ? "bg-secondary text-foreground"
                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <Link
                  to="/login"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50"
                >
                  Entrar
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 
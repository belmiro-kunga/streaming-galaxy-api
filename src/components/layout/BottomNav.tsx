import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mainMenuItems } from "@/config/menu-items";

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container flex h-16">
        {mainMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              location.pathname === item.path
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 
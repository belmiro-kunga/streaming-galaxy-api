import { Header } from "../ui/Header";
import { BottomNav } from "./BottomNav";
import { cn } from "../../lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  showHero?: boolean;
}

export function MainLayout({ children, showHero = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#010B2C]">
      <Header />
      
      {showHero && (
        <div className="relative w-full h-[70vh] md:h-[80vh] -mt-14">
          <div className="absolute inset-0 bg-gradient-to-b from-[#010B2C]/0 via-[#010B2C]/60 to-[#010B2C]" />
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Streaming Galaxy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up">
              Explore um universo de entretenimento ilimitado. Filmes, séries, animes e muito mais, tudo em um só lugar.
            </p>
          </div>
        </div>
      )}

      <main className={cn(
        "flex-1 container mx-auto px-4 md:px-6",
        showHero ? "-mt-16 relative z-10" : "pt-20 pb-20 md:pb-8"
      )}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
} 
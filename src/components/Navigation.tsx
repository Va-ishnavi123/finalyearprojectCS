import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hand, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-primary rounded-xl p-2 shadow-glow transition-smooth group-hover:scale-110">
            <Hand className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SilentTalk
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button
            variant={location.pathname === "/recognize" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/recognize">
              <Hand className="h-4 w-4 mr-2" />
              Start Recognition
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

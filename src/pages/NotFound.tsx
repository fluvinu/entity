import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Hexagon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Hexagon className="h-20 w-20 text-muted-foreground opacity-30 mb-6" />
      <h1 className="text-6xl font-bold text-muted-foreground mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Entity Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">The entity you are looking for does not exist in the universal graph.</p>
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button></Link>
        <Link to="/entities"><Button>Entity Explorer</Button></Link>
      </div>
    </div>
  );
}

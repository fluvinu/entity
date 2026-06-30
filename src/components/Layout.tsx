import { Outlet, NavLink, useLocation } from "react-router";
import { useState } from "react";
import { Box, Network, Settings, ChevronLeft, ChevronRight, Hexagon, Plus, Activity, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { path: "/", label: "Dashboard", icon: Activity },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/entities", label: "Entity Explorer", icon: Box },
  { path: "/entities/new", label: "New Entity", icon: Plus },
  { path: "/graph", label: "Graph Viewer", icon: Network },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      <aside className={`flex flex-col border-r bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex items-center gap-3 px-4 h-16">
          <Hexagon className="h-8 w-8 text-primary flex-shrink-0" />
          {!collapsed && <div className="flex flex-col"><span className="font-bold text-sm leading-tight">UEA Platform</span><span className="text-[10px] text-muted-foreground">Universal Entity Architecture</span></div>}
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`} title={collapsed ? item.label : undefined}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4 mr-2" />Collapse</>}
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center px-6 gap-4 bg-card/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hexagon className="h-4 w-4" /><span>/</span>
            {location.pathname === "/" && <span>Dashboard</span>}
            {location.pathname === "/entities" && <span>Entity Explorer</span>}
            {location.pathname === "/entities/new" && <span>New Entity</span>}
            {location.pathname === "/graph" && <span>Graph Viewer</span>}
            {location.pathname === "/settings" && <span>Settings</span>}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6"><Outlet /></div>
      </main>
    </div>
  );
}

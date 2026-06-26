import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Box, Network, Zap, Activity, ArrowRight, Plus, Hexagon, Layers,
} from "lucide-react";

export default function Dashboard() {
  const { data: entityStats, isLoading: entityLoading } = trpc.entity.stats.useQuery();
  const { data: recentEntities, isLoading: recentLoading } = trpc.entity.recent.useQuery({ limit: 8 });
  const { data: relationStats } = trpc.relation.stats.useQuery();
  const { data: behaviorStats } = trpc.behavior.behaviorStats.useQuery();
  const { data: roleStats } = trpc.behavior.roleStats.useQuery();

  const stats = [
    { title: "Total Entities", value: entityStats?.total ?? 0, icon: Box, description: "Universal primitives", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Relations", value: relationStats?.totalRelations ?? 0, icon: Network, description: "Graph connections", color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Behaviors", value: behaviorStats?.total ?? 0, icon: Zap, description: "Defined actions", color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Entity Kinds", value: entityStats?.byKind?.length ?? 0, icon: Layers, description: "Unique types", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Hexagon className="h-8 w-8 text-primary" />
            Universal Entity Architecture
          </h1>
          <p className="text-muted-foreground mt-1">Everything is an Entity. No exceptions.</p>
        </div>
        <Link to="/entities/new">
          <Button><Plus className="h-4 w-4 mr-2" />Create Entity</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">
                      {entityLoading ? <Skeleton className="h-8 w-16" /> : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Entities
              </CardTitle>
              <CardDescription>Recently created entities in the system</CardDescription>
            </div>
            <Link to="/entities">
              <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLoading ? (
              <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : recentEntities && recentEntities.length > 0 ? (
              <div className="space-y-2">
                {recentEntities.map((entity) => (
                  <Link key={entity.id} to={`/entities/${entity.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group">
                    <div className="flex items-center gap-3">
                      <Box className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="font-medium text-sm">{entity.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {entity.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{entity.kind}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Box className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No entities yet</p>
                <Link to="/entities/new">
                  <Button variant="outline" size="sm" className="mt-3"><Plus className="h-4 w-4 mr-2" />Create your first entity</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />Entity Kinds</CardTitle>
              <CardDescription>Distribution by kind</CardDescription>
            </CardHeader>
            <CardContent>
              {entityStats?.byKind && entityStats.byKind.length > 0 ? (
                <div className="space-y-2">
                  {entityStats.byKind.map((k) => (
                    <div key={k.kind} className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">{k.kind}</Badge>
                      <span className="text-sm font-medium">{k.count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-4">No data</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />Role Distribution</CardTitle>
              <CardDescription>Entities by assigned role</CardDescription>
            </CardHeader>
            <CardContent>
              {roleStats && roleStats.length > 0 ? (
                <div className="space-y-2">
                  {roleStats.map((r) => (
                    <div key={r.role} className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{r.role}</Badge>
                      <span className="text-sm font-medium">{r.count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-4">No roles assigned</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

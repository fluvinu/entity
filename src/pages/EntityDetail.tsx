import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Box, ArrowLeft, Pencil, Trash2, Network, Zap, Tag, FileJson, GitBranch, Layers } from "lucide-react";

export default function EntityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entityId = id ? parseInt(id) : 0;
  const { data: entity, isLoading } = trpc.entity.withDetails.useQuery({ id: entityId });
  const utils = trpc.useUtils();
  const deleteMutation = trpc.entity.delete.useMutation({
    onSuccess: () => {
      utils.entity.list.invalidate();
      utils.entity.stats.invalidate();
      navigate("/entities");
    },
  });
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) return <div className="space-y-6 max-w-5xl mx-auto"><Skeleton className="h-10 w-64" /><Card><CardContent className="p-6 space-y-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-full" /></CardContent></Card></div>;
  if (!entity) return <div className="flex flex-col items-center justify-center py-20"><Box className="h-16 w-16 text-muted-foreground opacity-50 mb-4" /><h2 className="text-xl font-semibold mb-2">Entity not found</h2><Link to="/entities"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Explorer</Button></Link></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/entities"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{entity.name}</h1>
              <Badge variant="secondary">{entity.kind}</Badge>
              <Badge variant="outline">v{entity.version}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Entity #{entity.id} · Created {new Date(entity.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/entities/${entity.id}/edit`}><Button variant="outline"><Pencil className="h-4 w-4 mr-2" />Edit</Button></Link>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entity</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete "{entity.name}"? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate({ id: entityId })} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview"><Box className="h-4 w-4 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="properties"><FileJson className="h-4 w-4 mr-1" />Properties</TabsTrigger>
          <TabsTrigger value="relations"><Network className="h-4 w-4 mr-1" />Relations</TabsTrigger>
          <TabsTrigger value="behaviors"><Zap className="h-4 w-4 mr-1" />Behaviors ({entity.behaviors?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="roles"><Tag className="h-4 w-4 mr-1" />Roles ({entity.roles?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ID</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{entity.id}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kind</CardTitle></CardHeader><CardContent><Badge variant="secondary" className="text-lg">{entity.kind}</Badge></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Version</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{entity.version}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5 text-primary" />Quick Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><p className="text-sm font-medium text-muted-foreground mb-2">Properties</p><pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-60">{JSON.stringify(entity.properties ?? {}, null, 2)}</pre></div>
                <div><p className="text-sm font-medium text-muted-foreground mb-2">State</p><pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-60">{JSON.stringify(entity.state ?? {}, null, 2)}</pre></div>
                <div><p className="text-sm font-medium text-muted-foreground mb-2">Metadata</p><pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-60">{JSON.stringify(entity.metadata ?? {}, null, 2)}</pre></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5 text-primary" />Properties</CardTitle><CardDescription>Describes what the Entity is.</CardDescription></CardHeader><CardContent><pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">{JSON.stringify(entity.properties ?? {}, null, 2)}</pre></CardContent></Card>
        </TabsContent>

        <TabsContent value="relations">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" />Outgoing Relations</CardTitle></CardHeader>
              <CardContent>
                {entity.outgoingRelations && entity.outgoingRelations.length > 0 ? entity.outgoingRelations.map((rel) => (
                  <div key={rel.id} className="flex items-center justify-between p-3 rounded-lg border mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{entity.name}</span>
                      <Badge variant="secondary" className="text-xs">{rel.relation}</Badge>
                      <Link to={`/entities/${rel.targetId}`}><Badge variant="outline" className="cursor-pointer hover:bg-accent">{rel.targetName ?? `Entity #${rel.targetId}`}</Badge></Link>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">No outgoing relations</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" />Incoming Relations</CardTitle></CardHeader>
              <CardContent>
                {entity.incomingRelations && entity.incomingRelations.length > 0 ? entity.incomingRelations.map((rel) => (
                  <div key={rel.id} className="flex items-center justify-between p-3 rounded-lg border mb-2">
                    <div className="flex items-center gap-3">
                      <Link to={`/entities/${rel.sourceId}`}><Badge variant="outline" className="cursor-pointer hover:bg-accent">{rel.sourceName ?? `Entity #${rel.sourceId}`}</Badge></Link>
                      <Badge variant="secondary" className="text-xs">{rel.relation}</Badge>
                      <span className="font-medium text-sm">{entity.name}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">No incoming relations</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behaviors">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Behaviors</CardTitle><CardDescription>Actions this entity can perform</CardDescription></CardHeader>
            <CardContent>
              {entity.behaviors && entity.behaviors.length > 0 ? entity.behaviors.map((behavior) => (
                <div key={behavior.id} className="p-4 rounded-lg border mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{behavior.name}</p>
                    <Badge variant="outline" className="text-xs">{behavior.behaviorType}</Badge>
                    {behavior.isActive ? <Badge variant="secondary" className="text-xs">Active</Badge> : <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                  </div>
                  {behavior.config && Object.keys(behavior.config).length > 0 && <pre className="bg-muted p-2 rounded text-xs mt-2">{JSON.stringify(behavior.config, null, 2)}</pre>}
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">No behaviors defined</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />Roles</CardTitle><CardDescription>Roles this entity plays in the system</CardDescription></CardHeader>
            <CardContent>
              {entity.roles && entity.roles.length > 0 ? <div className="flex flex-wrap gap-2">{entity.roles.map((role) => <Badge key={role.id} variant="secondary" className="text-sm px-3 py-1">{role.role}</Badge>)}</div> : <p className="text-sm text-muted-foreground text-center py-4">No roles assigned</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

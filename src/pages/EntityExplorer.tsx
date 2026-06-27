import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, Plus, Search, X, Layers, Clock, Hash } from "lucide-react";

export default function EntityExplorer() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = trpc.entity.list.useQuery({
    search: debouncedSearch || undefined,
    kind: kind || undefined,
    limit: 50,
  });
  const { data: stats } = trpc.entity.stats.useQuery();

  const handleSearch = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setKind("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Box className="h-8 w-8 text-primary" />
            Entity Explorer
          </h1>
          <p className="text-muted-foreground mt-1">Browse, search, and manage all entities in the system.</p>
        </div>
        <Link to="/entities/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Entity</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search entities by name..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger className="w-[180px]"><Layers className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kinds</SelectItem>
                {stats?.byKind?.map((k) => <SelectItem key={k.kind} value={k.kind}>{k.kind} ({k.count})</SelectItem>)}
              </SelectContent>
            </Select>
            {(search || kind) && <Button variant="outline" onClick={clearFilters}><X className="h-4 w-4 mr-2" />Clear</Button>}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {isLoading ? "Loading..." : `Showing ${data?.items?.length ?? 0} of ${data?.total ?? 0} entities`}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Card key={i}><CardContent className="p-5"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>)}
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((entity) => (
            <Link key={entity.id} to={`/entities/${entity.id}`} className="group">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10"><Box className="h-5 w-5 text-primary" /></div>
                    <Badge variant="outline">{entity.kind}</Badge>
                  </div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{entity.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Hash className="h-3 w-3" />ID: {entity.id}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(entity.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="py-16">
          <CardContent className="text-center">
            <Box className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No entities found</h3>
            <p className="text-sm text-muted-foreground mb-4">{search || kind ? "Try adjusting your search or filter criteria." : "Get started by creating your first entity."}</p>
            <div className="flex justify-center gap-3">
              {(search || kind) && <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>}
              <Link to="/entities/new"><Button><Plus className="h-4 w-4 mr-2" />Create Entity</Button></Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

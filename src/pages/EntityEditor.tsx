import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, ArrowLeft, Box, Tag, Settings, FileJson } from "lucide-react";

export default function EntityEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const entityId = id ? parseInt(id) : 0;

  const { data: existingEntity } = trpc.entity.byId.useQuery({ id: entityId }, { enabled: isEditing });
  const utils = trpc.useUtils();
  const createMutation = trpc.entity.create.useMutation({
    onSuccess: (data) => { utils.entity.list.invalidate(); utils.entity.stats.invalidate(); if (data?.id) navigate(`/entities/${data.id}`); },
  });
  const updateMutation = trpc.entity.update.useMutation({
    onSuccess: (data) => { utils.entity.list.invalidate(); utils.entity.byId.invalidate({ id: entityId }); if (data?.id) navigate(`/entities/${data.id}`); },
  });

  const [name, setName] = useState("");
  const [kind, setKind] = useState("entity");
  const [version, setVersion] = useState("1.0");
  const [propertiesJson, setPropertiesJson] = useState("{}");
  const [stateJson, setStateJson] = useState("{}");
  const [metadataJson, setMetadataJson] = useState("{}");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingEntity) {
      setName(existingEntity.name);
      setKind(existingEntity.kind);
      setVersion(existingEntity.version);
      setPropertiesJson(JSON.stringify(existingEntity.properties ?? {}, null, 2));
      setStateJson(JSON.stringify(existingEntity.state ?? {}, null, 2));
      setMetadataJson(JSON.stringify(existingEntity.metadata ?? {}, null, 2));
    }
  }, [existingEntity]);

  const validateJson = (str: string, field: string): Record<string, unknown> | null => {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed !== "object" || parsed === null) { setErrors((prev) => ({ ...prev, [field]: "Must be a valid JSON object" })); return null; }
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
      return parsed;
    } catch { setErrors((prev) => ({ ...prev, [field]: "Invalid JSON" })); return null; }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    const properties = validateJson(propertiesJson, "properties");
    const state = validateJson(stateJson, "state");
    const metadata = validateJson(metadataJson, "metadata");
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const payload = { name: name.trim(), kind, version, properties: properties ?? {}, state: state ?? {}, metadata: metadata ?? {} };
    if (isEditing) updateMutation.mutate({ id: entityId, ...payload });
    else createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={isEditing ? `/entities/${id}` : "/entities"}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Entity" : "New Entity"}</h1>
            <p className="text-muted-foreground text-sm">{isEditing ? `Editing entity #${id}` : "Create a new universal entity"}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}><Save className="h-4 w-4 mr-2" />Save Entity</Button>
      </div>

      <Tabs defaultValue="identity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="identity"><Tag className="h-4 w-4 mr-1" />Identity</TabsTrigger>
          <TabsTrigger value="properties"><FileJson className="h-4 w-4 mr-1" />Properties</TabsTrigger>
          <TabsTrigger value="state"><Settings className="h-4 w-4 mr-1" />State</TabsTrigger>
          <TabsTrigger value="metadata"><Box className="h-4 w-4 mr-1" />Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary" />Identity</CardTitle><CardDescription>Defines what uniquely identifies the Entity.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.name; return next; }); }} placeholder="Entity name" className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kind">Kind</Label>
                  <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} placeholder="entity" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5 text-primary" />Properties</CardTitle><CardDescription>Describes what the Entity is.</CardDescription></CardHeader>
            <CardContent><Textarea value={propertiesJson} onChange={(e) => setPropertiesJson(e.target.value)} rows={20} className={`font-mono text-sm ${errors.properties ? "border-red-500" : ""}`} placeholder={`{\n  "key": "value"\n}`} />{errors.properties && <p className="text-xs text-red-500 mt-2">{errors.properties}</p>}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />State</CardTitle><CardDescription>Represents runtime information.</CardDescription></CardHeader>
            <CardContent><Textarea value={stateJson} onChange={(e) => setStateJson(e.target.value)} rows={20} className={`font-mono text-sm ${errors.state ? "border-red-500" : ""}`} placeholder={`{\n  "loading": false\n}`} />{errors.state && <p className="text-xs text-red-500 mt-2">{errors.state}</p>}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Box className="h-5 w-5 text-primary" />Metadata</CardTitle><CardDescription>Extra information about the Entity.</CardDescription></CardHeader>
            <CardContent><Textarea value={metadataJson} onChange={(e) => setMetadataJson(e.target.value)} rows={20} className={`font-mono text-sm ${errors.metadata ? "border-red-500" : ""}`} placeholder={`{\n  "createdBy": "system"\n}`} />{errors.metadata && <p className="text-xs text-red-500 mt-2">{errors.metadata}</p>}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

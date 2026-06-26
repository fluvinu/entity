import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Network, Box, ZoomIn, ZoomOut, Maximize, Info } from "lucide-react";

interface GraphNode { id: number; x: number; y: number; name: string; kind: string; radius: number; }
interface GraphEdge { source: number; target: number; relation: string; }

export default function GraphViewer() {
  const { data: graph, isLoading } = trpc.relation.fullGraph.useQuery();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const nodes = useRef<GraphNode[]>([]);
  const edges = useRef<GraphEdge[]>([]);

  useEffect(() => {
    if (!graph) return;
    const centerX = 400, centerY = 300;
    const radius = Math.min(250, graph.entities.length * 20);
    nodes.current = graph.entities.map((entity, i) => {
      const angle = (2 * Math.PI * i) / Math.max(graph.entities.length, 1);
      return { id: entity.id, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle), name: entity.name, kind: entity.kind, radius: Math.max(20, Math.min(30, entity.name.length * 3)) };
    });
    edges.current = graph.relations.map((rel) => ({ source: rel.sourceId, target: rel.targetId, relation: rel.relation }));
    drawGraph();
  }, [graph]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    edges.current.forEach((edge) => {
      const source = nodes.current.find((n) => n.id === edge.source);
      const target = nodes.current.find((n) => n.id === edge.target);
      if (!source || !target) return;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      const midX = (source.x + target.x) / 2, midY = (source.y + target.y) / 2;
      ctx.fillStyle = "#64748b";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(edge.relation, midX, midY - 5);
    });
    nodes.current.forEach((node) => {
      const isSelected = selectedNode?.id === node.id;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? "#3b82f6" : "#e2e8f0";
      ctx.fill();
      ctx.strokeStyle = isSelected ? "#2563eb" : "#94a3b8";
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
      ctx.fillStyle = isSelected ? "#fff" : "#334155";
      ctx.font = `bold ${Math.max(10, node.radius / 2)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let displayName = node.name;
      if (displayName.length > 12) displayName = displayName.substring(0, 10) + "...";
      ctx.fillText(displayName, node.x, node.y);
    });
    ctx.restore();
  };

  useEffect(() => { drawGraph(); }, [zoom, offset, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    const clicked = nodes.current.find((node) => { const dx = x - node.x, dy = y - node.y; return Math.sqrt(dx * dx + dy * dy) < node.radius; });
    setSelectedNode(clicked ?? null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => { isDragging.current = true; dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }; };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => { if (!isDragging.current) return; setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }); };
  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><Network className="h-8 w-8 text-primary" />Graph Viewer</h1>
        <p className="text-muted-foreground mt-1">Visualize the entity graph and its connections.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div><CardTitle className="text-lg">Entity Graph</CardTitle><CardDescription>{graph?.entities?.length ?? 0} entities, {graph?.relations?.length ?? 0} relations</CardDescription></div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}><ZoomIn className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.3))}><ZoomOut className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}><Maximize className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[500px] w-full" /> : (
              <div className="border rounded-lg overflow-hidden cursor-grab active:cursor-grabbing">
                <canvas ref={canvasRef} width={800} height={600} className="w-full" style={{ height: 500 }} onClick={handleCanvasClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">Click on a node to select. Drag to pan. Use buttons to zoom.</p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Node Details</CardTitle></CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-3">
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selectedNode.name}</p></div>
                  <div><p className="text-xs text-muted-foreground">Kind</p><Badge variant="secondary">{selectedNode.kind}</Badge></div>
                  <div><p className="text-xs text-muted-foreground">ID</p><p className="text-sm">{selectedNode.id}</p></div>
                  <Link to={`/entities/${selectedNode.id}`}><Button variant="outline" size="sm" className="w-full mt-2">View Entity</Button></Link>
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-4">Click on a node to see details</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Graph Stats</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Entities</span><span className="font-medium">{graph?.entities?.length ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Relations</span><span className="font-medium">{graph?.relations?.length ?? 0}</span></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Entities</CardTitle></CardHeader>
            <CardContent><ScrollArea className="h-60"><div className="space-y-1">{graph?.entities?.map((entity) => (
              <button key={entity.id} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${selectedNode?.id === entity.id ? "bg-primary/10 text-primary" : "hover:bg-accent"}`} onClick={() => { const node = nodes.current.find((n) => n.id === entity.id); setSelectedNode(node ?? null); }}>
                <Box className="h-3 w-3 flex-shrink-0" /><span className="truncate">{entity.name}</span>
              </button>
            ))}</div></ScrollArea></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

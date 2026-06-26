import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Hexagon, Database, Server, Code, BookOpen, Github, FileText } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><SettingsIcon className="h-8 w-8 text-primary" />Settings</h1>
        <p className="text-muted-foreground mt-1">Platform information and architecture documentation.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Hexagon className="h-5 w-5 text-primary" />Universal Entity Architecture</CardTitle><CardDescription>Everything is an Entity. No exceptions.</CardDescription></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3"><Badge variant="secondary">v1.0</Badge><Badge variant="outline">Master Design</Badge></div>
          <p className="text-sm text-muted-foreground leading-relaxed">The UEA platform is built on a single idea: Everything is an Entity. The platform does not have special concepts such as Button, User, API, Database, Page, Workflow, Table, Dashboard, Agent, or Plugin. These are simply different interpretations of the same fundamental Entity.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" />Technology Stack</CardTitle><CardDescription>Open-source technologies powering the platform</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg"><div className="flex items-center gap-2 mb-3"><Server className="h-5 w-5 text-blue-500" /><p className="font-medium">Frontend</p></div><ul className="text-sm text-muted-foreground space-y-1"><li>React 19</li><li>TypeScript</li><li>Tailwind CSS</li><li>shadcn/ui</li><li>Vite</li></ul></div>
            <div className="p-4 border rounded-lg"><div className="flex items-center gap-2 mb-3"><Database className="h-5 w-5 text-green-500" /><p className="font-medium">Backend</p></div><ul className="text-sm text-muted-foreground space-y-1"><li>Hono (HTTP)</li><li>tRPC 11.x</li><li>Drizzle ORM</li><li>MySQL / TiDB</li><li>Zod Validation</li></ul></div>
            <div className="p-4 border rounded-lg"><div className="flex items-center gap-2 mb-3"><Hexagon className="h-5 w-5 text-purple-500" /><p className="font-medium">Architecture</p></div><ul className="text-sm text-muted-foreground space-y-1"><li>Universal Entity Model</li><li>Graph Relations</li><li>Runtime Engines</li><li>Event System</li><li>Plugin Architecture</li></ul></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Architecture Documents</CardTitle><CardDescription>Complete technical blueprint for the UEA platform</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { num: "01", title: "Vision & Philosophy", desc: "Why the system exists" },
              { num: "02", title: "Universal Entity Specification", desc: "The Entity model" },
              { num: "03", title: "Entity Relationship Model", desc: "Graph structure" },
              { num: "04", title: "Runtime Engine Specification", desc: "UI, Backend, AI, DB interpreters" },
              { num: "05", title: "Event & Action System", desc: "Communication and execution" },
              { num: "06", title: "Storage & Database Design", desc: "Persistence layer" },
              { num: "07", title: "API & Communication Protocol", desc: "Interface layer" },
              { num: "08", title: "Plugin & Extension Architecture", desc: "Extensibility model" },
              { num: "09", title: "Security & Permission Model", desc: "Access control" },
              { num: "10", title: "Developer Guide & Best Practices", desc: "Implementation guide" },
            ].map((doc) => (
              <div key={doc.num} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3"><span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{doc.num}</span><div><p className="font-medium text-sm">{doc.title}</p><p className="text-xs text-muted-foreground">{doc.desc}</p></div></div>
                <Badge variant="outline" className="text-xs"><FileText className="h-3 w-3 mr-1" />MD</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8" />
              <div><p className="font-medium">Open Source</p><p className="text-sm text-muted-foreground">UEA Platform is open source. View the code on GitHub.</p></div>
            </div>
            <a href="https://github.com/fluvinu/entity" target="_blank" rel="noopener noreferrer"><Button variant="outline"><Github className="h-4 w-4 mr-2" />View on GitHub</Button></a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

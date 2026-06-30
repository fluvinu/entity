import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

export default function TasksPage() {
  const [newTaskName, setNewTaskName] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.entity.list.useQuery({
    kind: "Task",
    limit: 100,
  });

  const createMutation = trpc.entity.create.useMutation({
    onSuccess: () => {
      utils.entity.list.invalidate({ kind: "Task" });
      setNewTaskName("");
    },
  });

  const updateMutation = trpc.entity.update.useMutation({
    onSuccess: () => {
      utils.entity.list.invalidate({ kind: "Task" });
    },
  });

  const deleteMutation = trpc.entity.delete.useMutation({
    onSuccess: () => {
      utils.entity.list.invalidate({ kind: "Task" });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    createMutation.mutate({
      name: newTaskName,
      kind: "Task",
      properties: { completed: false },
    });
  };

  const toggleTaskStatus = (task: { id: number; properties?: Record<string, unknown> | null }) => {
    const isCompleted = task.properties?.completed === true;
    updateMutation.mutate({
      id: task.id,
      properties: { ...task.properties, completed: !isCompleted },
    });
  };

  const handleDeleteTask = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const tasks = data?.items || [];
  const completedTasks = tasks.filter(t => t.properties?.completed === true);
  const pendingTasks = tasks.filter(t => t.properties?.completed !== true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your tasks. This page is built using the Universal Entity Architecture.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              disabled={createMutation.isPending}
            />
            <Button type="submit" disabled={createMutation.isPending || !newTaskName.trim()}>
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-blue-500" /> Pending ({pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No pending tasks.</p>
              ) : (
                <ul className="space-y-2">
                  {pendingTasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => toggleTaskStatus(task)}
                          disabled={updateMutation.isPending}
                        />
                        <span className="truncate font-medium">{task.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} disabled={deleteMutation.isPending} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> Completed ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No completed tasks.</p>
              ) : (
                <ul className="space-y-2">
                  {completedTasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-muted border rounded-lg opacity-80">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => toggleTaskStatus(task)}
                          disabled={updateMutation.isPending}
                        />
                        <span className="truncate font-medium line-through text-muted-foreground">{task.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} disabled={deleteMutation.isPending} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCustomRole, type ActiveRole } from "@/lib/skillpulse";

export function CustomRoleForm({ initialTitle, onSave, onCancel }: { initialTitle: string; onSave: (role: ActiveRole) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initialTitle);
  const [skills, setSkills] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const labels = ["Technical skill 1", "Technical skill 2", "Technical skill 3", "Tool skill", "Soft skill"];
  return (
    <form className="mt-4 space-y-4 border-y border-border py-5" onSubmit={(e) => {
      e.preventDefault();
      const role = createCustomRole(title, skills);
      if (!role) { setError("Enter a role name and five different skills."); return; }
      onSave(role);
    }}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-foreground">Add Your Own Role</h3>
        <Button type="button" variant="ghost" size="icon" aria-label="Cancel custom role" title="Cancel" onClick={onCancel}><X /></Button>
      </div>
      <label className="block text-sm font-medium">Role name
        <input required maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((skill, i) => <label key={i} className="text-sm font-medium">{labels[i]}
          <input required maxLength={100} value={skill} onChange={(e) => setSkills((prev) => prev.map((value, index) => index === i ? e.target.value : value))} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
        </label>)}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit"><Plus /> Save Custom Role</Button>
    </form>
  );
}
import { useId, useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_CATALOG, searchRoles } from "@/lib/role-catalog";
import { cleanRoleTitle } from "@/lib/role-text";
import { roleRefFromInput, type RoleRef } from "@/lib/skillpulse";

type Option = { kind: "role"; ref: RoleRef; group: string } | { kind: "custom"; ref: RoleRef };

export function RoleSearch({ onSelect }: { onSelect: (ref: RoleRef) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const options = useMemo<Option[]>(() => {
    const matches = searchRoles(query, 8).map<Option>((r) => ({
      kind: "role",
      ref: { id: r.id, title: r.title },
      group: r.group,
    }));
    const typed = cleanRoleTitle(query);
    const exact = roleRefFromInput(typed);
    if (typed.length >= 2 && exact && exact.id.startsWith("custom:")) {
      matches.push({ kind: "custom", ref: exact });
    }
    return matches;
  }, [query]);

  const choose = (opt: Option | undefined) => {
    if (!opt) return;
    onSelect(opt.ref);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(options[active] ?? options[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search job roles"
          aria-activedescendant={showList && options[active] ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={`Search ${ROLE_CATALOG.length}+ roles — e.g. React Developer, VLSI, Civil, SEO…`}
          className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-elevated"
        >
          {options.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">Type at least 2 letters to add a custom role.</li>
          )}
          {options.map((opt, i) => (
            <li
              key={opt.kind + opt.ref.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(opt)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                i === active ? "bg-accent text-accent-foreground" : "text-foreground",
                opt.kind === "custom" && "mt-1 border-t border-border",
              )}
            >
              {opt.kind === "role" ? (
                <>
                  <span className="font-medium">{opt.ref.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{opt.group}</span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Use “<strong className="font-semibold">{opt.ref.title}</strong>” as my role
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

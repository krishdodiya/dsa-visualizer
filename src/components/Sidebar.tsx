import { C } from "../theme";
import { ALGORITHMS, CATEGORIES } from "../algorithms";

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ selectedId, onSelect, collapsed, onToggleCollapse }: SidebarProps) {
  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center py-3 flex-shrink-0"
        style={{ width: 52, background: C.surf, borderRight: `1px solid ${C.border}` }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            color: C.text,
            fontSize: 14,
            cursor: "pointer",
            padding: "8px 10px",
            transition: "all 0.15s",
          }}
          title="Expand sidebar"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.cyan;
            e.currentTarget.style.color = C.cyan;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.color = C.text;
          }}
        >
          ☰
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: 240, background: C.surf, borderRight: `1px solid ${C.border}` }}
    >
      {/* Header with collapse */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: C.white,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Algorithms
        </span>
        <button
          onClick={onToggleCollapse}
          style={{
            background: "none",
            border: "none",
            color: C.muted,
            fontSize: 16,
            cursor: "pointer",
            padding: 4,
            lineHeight: 1,
            transition: "color 0.15s",
          }}
          title="Collapse sidebar"
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          ←
        </button>
      </div>

      {/* Algorithm list */}
      <div className="flex-1 overflow-y-auto py-2">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="mb-2">
            <div
              className="px-4 pt-2 pb-1.5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                color: C.muted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {cat}
            </div>
            {ALGORITHMS.filter((a) => a.category === cat).map((a) => {
              const isSelected = selectedId === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => onSelect(a.id)}
                  className="w-full text-left transition-all duration-150"
                  style={{
                    padding: "10px 16px",
                    background: isSelected ? `${a.color}12` : "transparent",
                    borderTop: "none",
                    borderRight: "none",
                    borderBottom: "none",
                    borderLeft: isSelected ? `3px solid ${a.color}` : "3px solid transparent",
                    color: isSelected ? a.color : C.text,
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 500,
                      marginBottom: 2,
                    }}
                  >
                    {a.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10,
                      color: C.muted,
                      lineHeight: 1.4,
                      opacity: isSelected ? 0.9 : 0.7,
                    }}
                  >
                    {a.description.slice(0, 55)}…
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: `1px solid ${C.border}`, background: C.card }}
      >
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 9,
            color: C.dimText,
            textAlign: "center",
          }}
        >
          {ALGORITHMS.length} algorithms available
        </div>
      </div>
    </div>
  );
}

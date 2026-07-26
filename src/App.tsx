import React, { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Todo[]) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") addTodo();
  };

  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = (): void => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  
  const tasksLeft = todos.filter((t) => !t.completed).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at 30% 20%, rgba(147,51,234,0.25), transparent 40%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.15), transparent 45%), #0d0b14",
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 720 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1
            style={{
              color: "#fff",
              fontSize: 42,
              fontWeight: 700,
              margin: 0,
              letterSpacing: 0.5,
            }}
          >
            Todo List
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              margin: "10px 0 2px",
              fontSize: 15,
            }}
          >
            Simple React todos with localStorage
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              fontSize: 15,
            }}
          >
            React todo app (डेटा localStorage में सेव होता है)
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Input row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(168,85,247,0.6)",
                borderRadius: 12,
                padding: "14px 18px",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                boxShadow: "0 0 0 3px rgba(168,85,247,0.15)",
              }}
            />
            <button
              onClick={addTodo}
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
                border: "none",
                borderRadius: 12,
                padding: "0 28px",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Add
            </button>
          </div>

          {/* Filters row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: 4,
                gap: 2,
              }}
            >
              {(["all", "active", "completed"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? "#fff" : "transparent",
                    color: filter === f ? "#1a1625" : "rgba(255,255,255,0.6)",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.15s ease",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 13.5,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                {tasksLeft} tasks left
              </span>
              <button
                onClick={clearCompleted}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c084fc",
                  cursor: "pointer",
                  fontSize: 13.5,
                  padding: 0,
                }}
              >
                Clear completed
              </button>
            </div>
          </div>

          {/* List / empty state */}
          {filteredTodos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "26px 0" }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  margin: "0 0 6px",
                  fontSize: 15,
                }}
              >
                {todos.length === 0
                  ? "No todos yet. Start by adding a task above."
                  : "No tasks match this filter."}
              </p>
              {todos.length === 0 && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  अभी कोई task नहीं है, ऊपर से add कीजिए।
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "#a855f7",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      color: todo.completed ? "rgba(255,255,255,0.35)" : "#fff",
                      textDecoration: todo.completed ? "line-through" : "none",
                      fontSize: 15,
                      wordBreak: "break-word",
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.35)",
                      cursor: "pointer",
                      fontSize: 18,
                      padding: "0 4px",
                      lineHeight: 1,
                    }}
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
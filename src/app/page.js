"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append("status", status);

        const res = await fetch(`http://localhost:4000/tasks?${queryParams.toString()}`);
        let data = await res.json();

        if (search) {
          const keyword = search.toLowerCase();
          data = data.filter(
            (task) =>
              task.title?.toLowerCase().includes(keyword) ||
              task.description?.toLowerCase().includes(keyword)
          );
        }

        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, status]);

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask({ title: "", description: "", status: "pending" });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Update task
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTask),
      });
      const updated = await res.json();

      setTasks(tasks.map((task) => (task._id === updated._id ? updated : task)));
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "#2563eb" }}>
          📋 Task Manager
        </h1>

        {/* Add New Task */}
        <form
          onSubmit={handleAddTask}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
          <input
            type="text"
            placeholder="Description..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ➕ Add Task
          </button>
        </form>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task._id}
                style={{
                  background: "white",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              >
                {editingTask && editingTask._id === task._id ? (
                  <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input
                      type="text"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <select
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="submit"
                        style={{ background: "green", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}
                      >
                        💾 Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        style={{ background: "gray", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{task.title}</h2>
                      <span
                        style={{
                          padding: "4px 10px",
                          fontSize: "12px",
                          borderRadius: "12px",
                          background:
                            task.status === "completed"
                              ? "#bbf7d0"
                              : task.status === "in-progress"
                              ? "#fde68a"
                              : "#fecaca",
                          color:
                            task.status === "completed"
                              ? "#166534"
                              : task.status === "in-progress"
                              ? "#854d0e"
                              : "#991b1b",
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p style={{ color: "#555", marginTop: "8px" }}>{task.description}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => setEditingTask(task)}
                        style={{ background: "orange", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{ background: "red", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>No tasks found</p>
          )}
        </ul>
      </div>
    </div>
  );
}

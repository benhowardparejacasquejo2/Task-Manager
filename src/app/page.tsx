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

        const res = await fetch(
          `http://localhost:4000/tasks?${queryParams.toString()}`
        );
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

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Handle update
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

      setTasks(
        tasks.map((task) =>
          task._id === updated._id ? updated : task
        )
      );
      setEditingTask(null); 
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          📋 Task Manager
        </h1>

        {/* Add New Task */}
        <form
          onSubmit={handleAddTask}
          className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-4 flex-wrap"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border rounded px-3 py-2 flex-1 focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            placeholder="Description..."
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1 focus:ring focus:ring-blue-300"
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            ➕ Add Task
          </button>
        </form>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 flex-1 focus:ring focus:ring-blue-300"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task._id}
                className="p-5 border rounded-lg shadow bg-white hover:shadow-lg transition"
              >
                {editingTask && editingTask._id === task._id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, title: e.target.value })
                      }
                      className="border rounded px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                    />
                    <select
                      value={editingTask.status}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          status: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        💾 Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-xl text-gray-800">
                        {task.title}
                      </h2>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          task.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : task.status === "in-progress"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No tasks found</p>
          )}
        </ul>
      </div>
    </div>
  );
}

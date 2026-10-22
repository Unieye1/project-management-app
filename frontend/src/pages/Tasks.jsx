import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

const PROJECTS = [];

const ASSIGNEES = [];

const INITIAL_TASKS = [];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  in_progress: "bg-violet-50 text-violet-700 ring-violet-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

function formatDate(date) {
  if (!date) return "No due date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function priorityLabel(priority) {
  if (priority <= 2) return "Low";
  if (priority === 3) return "Medium";
  return "High";
}

function blankForm() {
  return {
    title: "",
    description: "",
    project_id: "",
    priority: "3",
    status: "pending",
    due_date: "",
    assignee_name: "",
  };
}

function SummaryCard({ label, value, detail, tone }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`mt-1 h-3 w-3 rounded-full ${tone}`}
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nextId, setNextId] = useState(110);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingId(null);
        setForm(blankForm());
        setFormError("");
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [modalOpen]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/tasks", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tasks");
        }

        setTasks(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:3000/api/projects", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjects();
  }, []);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter(
      (task) =>
        (!query || task.title.toLowerCase().includes(query)) &&
        (!statusFilter || task.status === statusFilter) &&
        (!priorityFilter || priorityLabel(task.priority) === priorityFilter) &&
        (!projectFilter || String(task.project_id) === projectFilter),
    );
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(blankForm());
    setFormError("");
  }

  function openCreateModal() {
    setForm(blankForm());
    setEditingId(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      project_id: String(task.project_id),
      priority: String(task.priority),
      status: task.status,
      due_date: task.due_date || "",
      assignee_name: task.assignee_name || "",
    });
    setEditingId(task.id);
    setFormError("");
    setModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();
    const project = projects.find(
      (item) => String(item.id) === form.project_id,
    );
    if (!title || !project) {
      setFormError("Please enter a task title and select a project.");
      return;
    }

    if (editingId !== null) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== editingId) return task;
          return {
            ...task,
            title,
            description: form.description.trim(),
            project_id: project.id,
            project_name: project.name,
            priority: Number(form.priority),
            status: form.status,
            due_date: form.due_date || null,
            assigned_at: form.assignee_name
              ? task.assignee_name === form.assignee_name
                ? task.assigned_at
                : new Date().toISOString()
              : null,
            assignee_name: form.assignee_name || null,
          };
        }),
      );
      setFeedback("Task updated.");
    } else {
      setTasks((currentTasks) => [
        {
          id: nextId,
          project_id: project.id,
          project_name: project.name,
          title,
          description: form.description.trim(),
          priority: Number(form.priority),
          due_date: form.due_date || null,
          assigned_at: form.assignee_name ? new Date().toISOString() : null,
          assignee_name: form.assignee_name || null,
          status: form.status,
        },
        ...currentTasks,
      ]);
      setNextId((id) => id + 1);
      setFeedback("Task created.");
    }
    closeModal();
  }

  function deleteTask(task) {
    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== task.id),
    );
    setFeedback(`“${task.title}” was deleted.`);
  }

  function updateStatus(taskId, status) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
    setFeedback("Task status updated.");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setProjectFilter("");
  }

  const selectClass =
    "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  return (
    <>
      <Navbar />

      <div className="flex min-h-[calc(100vh-48px)] bg-slate-50">
        <Sidebar />

        <main className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Tasks
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Plan, prioritize, and track work across your projects.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:self-auto"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  +
                </span>
                New Task
              </button>
            </header>

            <section
              aria-label="Task summary"
              className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <SummaryCard
                label="Total Tasks"
                value={counts.total}
                detail="Across all projects"
                tone="bg-violet-500"
              />
              <SummaryCard
                label="Pending"
                value={counts.pending}
                detail="Ready to be picked up"
                tone="bg-amber-400"
              />
              <SummaryCard
                label="In Progress"
                value={counts.inProgress}
                detail="Currently being worked on"
                tone="bg-blue-500"
              />
              <SummaryCard
                label="Completed"
                value={counts.completed}
                detail="Successfully finished"
                tone="bg-emerald-500"
              />
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4 sm:p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Search tasks by title</span>
                    <svg
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="8.8"
                        cy="8.8"
                        r="5.8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="m13.2 13.2 4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search tasks..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex">
                    <label>
                      <span className="sr-only">Filter by status</span>
                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(event.target.value)
                        }
                        className={`${selectClass} w-full xl:w-40`}
                      >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Filter by priority</span>
                      <select
                        value={priorityFilter}
                        onChange={(event) =>
                          setPriorityFilter(event.target.value)
                        }
                        className={`${selectClass} w-full xl:w-40`}
                      >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Filter by project</span>
                      <select
                        value={projectFilter}
                        onChange={(event) =>
                          setProjectFilter(event.target.value)
                        }
                        className={`${selectClass} w-full xl:w-48`}
                      >
                        <option value="">All Projects</option>
                        {PROJECTS.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className="border-b border-emerald-100 bg-emerald-50 px-5 py-2.5 text-sm text-emerald-800"
                >
                  {feedback}
                  <button
                    type="button"
                    onClick={() => setFeedback("")}
                    className="ml-3 font-medium underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    aria-label="Dismiss notification"
                  >
                    Dismiss
                  </button>
                </p>
              )}

              {visibleTasks.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600"
                    aria-hidden="true"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-slate-900">
                    No tasks found
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Try adjusting your search or filters to find what you’re
                    looking for.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-800 focus:outline-none focus:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th scope="col" className="px-5 py-3.5">
                          Task
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Project
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Priority
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Due Date
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Assignee
                        </th>
                        <th scope="col" className="px-5 py-3.5">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visibleTasks.map((task) => {
                        const dueDate = formatDate(task.due_date);
                        return (
                          <tr
                            key={task.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <th
                              scope="row"
                              className="max-w-sm px-5 py-4 align-middle font-normal"
                            >
                              <p className="font-medium text-slate-900">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                  {task.description}
                                </p>
                              )}
                            </th>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                              {task.project_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-2 text-sm ${priorityLabel(task.priority) === "High" ? "text-rose-700" : priorityLabel(task.priority) === "Medium" ? "text-amber-700" : "text-slate-600"}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${priorityLabel(task.priority) === "High" ? "bg-rose-500" : priorityLabel(task.priority) === "Medium" ? "bg-amber-500" : "bg-slate-400"}`}
                                  aria-hidden="true"
                                />
                                {priorityLabel(task.priority)}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <label>
                                <span className="sr-only">
                                  Change status for {task.title}
                                </span>
                                <select
                                  value={task.status}
                                  onChange={(event) =>
                                    updateStatus(task.id, event.target.value)
                                  }
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-violet-400 ${STATUS_STYLES[task.status] || STATUS_STYLES.pending}`}
                                >
                                  {STATUS_OPTIONS.map((status) => (
                                    <option
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                              {dueDate || (
                                <span className="text-slate-400">
                                  No due date
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {task.assignee_name ? (
                                <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                                  <span
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700"
                                    aria-hidden="true"
                                  >
                                    {task.assignee_name
                                      .split(" ")
                                      .map((part) => part[0])
                                      .join("")}
                                  </span>
                                  {task.assignee_name}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  Unassigned
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(task)}
                                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                  aria-label={`Edit ${task.title}`}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteTask(task)}
                                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                  aria-label={`Delete ${task.title}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {visibleTasks.length > 0 && (
                <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {visibleTasks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {tasks.length}
                  </span>{" "}
                  tasks
                </div>
              )}
            </section>
          </div>

          {modalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-xl"
              >
                <form onSubmit={handleSubmit}>
                  <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2
                        id="task-modal-title"
                        className="text-lg font-semibold text-slate-900"
                      >
                        {editingId === null ? "Create a task" : "Edit task"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {editingId === null
                          ? "Add a new item to your project work."
                          : "Update the details for this task."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                      aria-label="Close dialog"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="m5 5 10 10M15 5 5 15"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Task title <span className="text-rose-500">*</span>
                      </span>
                      <input
                        autoFocus
                        required
                        maxLength={160}
                        value={form.title}
                        onChange={(event) =>
                          setForm({ ...form, title: event.target.value })
                        }
                        placeholder="e.g. Review the launch plan"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Description{" "}
                        <span className="font-normal text-slate-400">
                          (optional)
                        </span>
                      </span>
                      <textarea
                        rows="3"
                        maxLength={1000}
                        value={form.description}
                        onChange={(event) =>
                          setForm({ ...form, description: event.target.value })
                        }
                        placeholder="Add a few details about this task..."
                        className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Project <span className="text-rose-500">*</span>
                      </span>
                      <select
                        required
                        value={form.project_id}
                        onChange={(event) =>
                          setForm({ ...form, project_id: event.target.value })
                        }
                        className={`${selectClass} w-full`}
                      >
                        <option value="" disabled>
                          Select a project
                        </option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Assignee
                      </span>
                      <select
                        value={form.assignee_name}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            assignee_name: event.target.value,
                          })
                        }
                        className={`${selectClass} w-full`}
                      >
                        <option value="">Unassigned</option>
                        {ASSIGNEES.map((assignee) => (
                          <option key={assignee} value={assignee}>
                            {assignee}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Priority
                      </span>
                      <select
                        value={form.priority}
                        onChange={(event) =>
                          setForm({ ...form, priority: event.target.value })
                        }
                        className={`${selectClass} w-full`}
                      >
                        <option value="1">Low</option>
                        <option value="3">Medium</option>
                        <option value="5">High</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Status
                      </span>
                      <select
                        value={form.status}
                        onChange={(event) =>
                          setForm({ ...form, status: event.target.value })
                        }
                        className={`${selectClass} w-full`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Due date
                      </span>
                      <input
                        type="date"
                        value={form.due_date}
                        onChange={(event) =>
                          setForm({ ...form, due_date: event.target.value })
                        }
                        className={`${selectClass} w-full`}
                      />
                    </label>
                    {formError && (
                      <p
                        role="alert"
                        className="text-sm text-rose-600 sm:col-span-2"
                      >
                        {formError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    >
                      {editingId === null ? "Create Task" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

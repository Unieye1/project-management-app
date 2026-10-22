import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectError, setProjectError] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  async function fetchDashboard() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/dashboard/summary",
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your session has expired. Please log in again."
            : "Failed to load dashboard",
        );
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="p-8">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  const projects = dashboardData ? dashboardData.recentProjects : [];

  const tasks = [...(dashboardData ? dashboardData.recentTasks : [])];

  const stats = [
    {
      label: "Total Projects",
      value: dashboardData ? dashboardData.stats.totalProjects : 0,
      detail: `${dashboardData ? dashboardData.stats.totalProjects : 0} projects`,
      color: "text-violet-600",
      bg: "bg-violet-50",
      icon: "▦",
    },
    {
      label: "Total Tasks",
      value: dashboardData ? dashboardData.stats.totalTasks : 0,
      detail: `${dashboardData ? dashboardData.stats.pendingTasks : 0} tasks`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "☷",
    },
    {
      label: "Completed",
      value: dashboardData ? dashboardData.stats.completedTasks : 0,
      detail: "Completed Tasks",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "✓",
    },
    {
      label: "Overdue",
      value: dashboardData ? dashboardData.stats.overdueTasks : 0,
      detail: "Need Attention",
      color: "text-rose-600",
      bg: "bg-rose-50",
      icon: "!",
    },
  ];

  async function handleCreateProject(event) {
    event.preventDefault();

    const name = projectName.trim();

    if (!name) {
      setProjectError("Please enter a project name.");
      return;
    }

    setCreatingProject(true);
    setProjectError("");

    try {
      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      setProjectName("");
      setShowProjectForm(false);

      // Reuse your existing project-fetching function.
      await fetchDashboard();
    } catch (error) {
      setProjectError(error.message || "Something went wrong.");
    } finally {
      setCreatingProject(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-[calc(100vh-48px)] bg-slate-50">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Welcome header */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-violet-600">
                  WORKSPACE OVERVIEW
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Here's what's happening with your projects today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProjectForm(true)}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                + New Project
              </button>
            </section>
            {showProjectForm && (
              <form
                onSubmit={handleCreateProject}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold">
                  Create a new project
                </h2>

                <label
                  htmlFor="project-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Enter project name"
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                {projectError && (
                  <p className="mt-2 text-sm text-red-600">{projectError}</p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={creatingProject}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {creatingProject ? "Creating..." : "Create Project"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectForm(false);
                      setProjectError("");
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Summary cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold ${stat.bg} ${stat.color}`}
                    >
                      {stat.icon}
                    </span>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">{stat.detail}</p>
                </div>
              ))}
            </section>

            {/* Recent projects */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Projects
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track the progress of your latest work.
                  </p>
                </div>

                <button
                  type="button"
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {projects.map((project) => {
                  const totalTasks = Number(project.total_tasks);
                  const completedTasks = Number(project.completed_tasks);

                  const progress =
                    totalTasks === 0
                      ? 0
                      : Math.round((completedTasks / totalTasks) * 100);

                  return (
                    <div
                      key={project.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                              project.status === "completed"
                                ? "bg-emerald-500"
                                : "bg-violet-500"
                            }`}
                          />

                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-800">
                              {project.name}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Created{" "}
                              {new Date(
                                project.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            project.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-semibold text-slate-700">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              project.status === "completed"
                                ? "bg-emerald-500"
                                : "bg-violet-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Task overview */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Task Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    A quick look at your latest tasks.
                  </p>
                </div>

                <button
                  type="button"
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Task</th>
                      <th className="px-6 py-4 font-semibold">Project</th>
                      <th className="px-6 py-4 font-semibold">Priority</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Due date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(dashboardData?.recentTasks ?? []).map((task) => (
                      <tr
                        key={task.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {task.title}
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {task.project_name}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`font-medium ${
                              task.priority === "High"
                                ? "text-rose-600"
                                : task.priority === "Medium"
                                  ? "text-amber-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              task.task_status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : task.task_status === "in_progress"
                                  ? "bg-blue-50 text-blue-700"
                                  : task.task_status === "cancelled"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {task.task_status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : "No due date"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;

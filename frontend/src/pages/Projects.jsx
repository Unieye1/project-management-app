import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

const projects = [];

const statusStyles = {
  active: "bg-sky-50 text-sky-700 ring-sky-600/15",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-600/15",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectError, setProjectError] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);


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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchProjects();
  }, []);

  const summaryCards = [
    {
      label: "Total",
      value: projects.length,
      accent: "bg-violet-100 text-violet-700",
      icon: "▦",
    },
    {
      label: "Active",
      value: projects.filter((project) => project.status === "active").length,
      accent: "bg-sky-100 text-sky-700",
      icon: "◉",
    },
    {
      label: "In Progress",
      value: projects.filter((project) => project.status === "in_progress")
        .length,
      accent: "bg-amber-100 text-amber-700",
      icon: "↗",
    },
    {
      label: "Completed",
      value: projects.filter((project) => project.status === "completed")
        .length,
      accent: "bg-emerald-100 text-emerald-700",
      icon: "✓",
    },
  ];

  if (loading) {
    return <p className="p-8">Loading projects...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

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
      await fetchProjects();
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
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-violet-600">WORKSPACE</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Projects
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Organize your team&apos;s work and keep every project moving.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProjectForm(true)}
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
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


            <section
              aria-label="Project summary"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${card.accent}`}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {card.label === "Total"
                      ? "Across your workspace"
                      : `${card.value} ${
                          card.value === 1 ? "project" : "projects"
                        }`}
                  </p>
                </div>
              ))}
            </section>

            <section aria-label="Projects">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    All Projects
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Browse and track your team&apos;s work.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative block">
                    <span className="sr-only">Search projects</span>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        cx="8.75"
                        cy="8.75"
                        r="5.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="m13 13 4 4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <input
                      type="search"
                      placeholder="Search projects..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-64"
                    />
                  </label>

                  <label>
                    <span className="sr-only">Filter projects by status</span>
                    <select
                      defaultValue="All statuses"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-44"
                    >
                      <option>All statuses</option>
                      <option>Active</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => {
                  const totalTasks = Number(project.total_tasks);
                  const completedTasks = Number(project.completed_tasks);
                  const progress =
                    totalTasks === 0
                      ? 0
                      : Math.round((completedTasks / totalTasks) * 100);

                  return (
                    <article
                      key={project.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-violet-700 bg-violet-100 ${project.accent}`}
                          >
                            {project.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          <h3 className="truncate font-semibold text-slate-900">
                            {project.name}
                          </h3>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                            statusStyles[project.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500">
                        {project.description || "No description provided."}
                      </p>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-600">
                            Task progress
                          </span>
                          <span className="text-slate-500">
                            {project.completedTasks} of {project.totalTasks}{" "}
                            tasks
                          </span>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`${project.name} task progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress}
                          className="h-2 overflow-hidden rounded-full bg-slate-100"
                        >
                          <div
                            className="h-full rounded-full bg-violet-600 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-right text-xs font-medium text-slate-500">
                          {progress}%
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Projects;

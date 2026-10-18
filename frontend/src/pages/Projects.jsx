import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description:
      "Refresh the marketing site with a clearer story and a more polished visual system.",
    status: "In Progress",
    completedTasks: 12,
    totalTasks: 18,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description:
      "Prepare the new mobile experience for release across iOS and Android.",
    status: "Active",
    completedTasks: 7,
    totalTasks: 20,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    id: 3,
    name: "Q4 Marketing Campaign",
    description:
      "Plan a coordinated campaign across email, social, and paid channels.",
    status: "In Progress",
    completedTasks: 9,
    totalTasks: 15,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    id: 4,
    name: "Customer Portal",
    description:
      "Give customers a simple place to manage their account and support requests.",
    status: "Active",
    completedTasks: 4,
    totalTasks: 16,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    name: "Design System",
    description:
      "Document and unify the reusable components used across the product.",
    status: "Completed",
    completedTasks: 24,
    totalTasks: 24,
    accent: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    id: 6,
    name: "Analytics Dashboard",
    description:
      "Bring key product and business metrics together in one clear dashboard.",
    status: "Completed",
    completedTasks: 14,
    totalTasks: 14,
    accent: "bg-indigo-100 text-indigo-700",
  },
];

const summaryCards = [
  {
    label: "Total",
    value: projects.length,
    accent: "bg-violet-100 text-violet-700",
    icon: "▦",
  },
  {
    label: "Active",
    value: projects.filter((project) => project.status === "Active").length,
    accent: "bg-sky-100 text-sky-700",
    icon: "◉",
  },
  {
    label: "In Progress",
    value: projects.filter((project) => project.status === "In Progress").length,
    accent: "bg-amber-100 text-amber-700",
    icon: "↗",
  },
  {
    label: "Completed",
    value: projects.filter((project) => project.status === "Completed").length,
    accent: "bg-emerald-100 text-emerald-700",
    icon: "✓",
  },
];

const statusStyles = {
  Active: "bg-sky-50 text-sky-700 ring-sky-600/15",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-600/15",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
};

function Projects() {
  return (
    <>
      <Navbar />

      <div className="flex min-h-[calc(100vh-48px)] bg-slate-50">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-violet-600">
                  WORKSPACE
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Projects
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Organize your team&apos;s work and keep every project moving.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                + New Project
              </button>
            </section>

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
                  const progress = Math.round(
                    (project.completedTasks / project.totalTasks) * 100,
                  );

                  return (
                    <article
                      key={project.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${project.accent}`}
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
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[project.status]}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500">
                        {project.description}
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
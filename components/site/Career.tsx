import { jobs, stackGroups } from "@/content/career";

export function Experience() {
  return (
    <section id="experiencia" className="section">
      <div className="wrap grid gap-x-6 gap-y-10 lg:grid-cols-12">
        <h2 className="h2 lg:col-span-5">Experiência</h2>
        <ol className="grid gap-12 lg:col-span-7 lg:gap-16">
          {jobs.map((job) => (
            <li key={job.company}>
              <h3 className="h3">
                {job.role}, {job.company}
              </h3>
              <p className="label mt-2 text-accent">{job.meta}</p>
              <ul className="mt-5 grid max-w-[44em] gap-2">
                {job.points.map((point) => (
                  <li key={point} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-muted">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" className="section">
      <div className="wrap">
        <h2 className="h2">Stack por área</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <li key={group.area} className="card p-6 lg:p-8">
              <h3 className="text-xl font-bold leading-7 tracking-tight">{group.area}</h3>
              <ul className="mt-4 grid gap-1.5 text-[15px] leading-6 text-muted">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

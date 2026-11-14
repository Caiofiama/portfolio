import { experienceFacts, jobs, stackGroups } from "@/content/career";
import SectionTitle from "@/components/site/SectionTitle";

export function Experience() {
  return (
    <section id="experiencia" className="section bg-surface">
      <div className="wrap grid gap-x-6 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle label="Experiência" title="De marketplace global a produto próprio." />
          <dl className="mt-8 grid grid-cols-2 gap-6 lg:sticky lg:top-28 lg:mt-12 lg:grid-cols-1 lg:gap-10">
            {experienceFacts.map((fact) => (
              <div key={fact.value} data-reveal>
                <dt className="stat__value">{fact.value}</dt>
                <dd className="mt-2 max-w-[18em] text-[15px] leading-6 text-muted">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ol className="grid gap-12 lg:col-span-7 lg:gap-16">
          {jobs.map((job) => (
            <li key={job.company} data-reveal>
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
        <SectionTitle label="Stack por área" title="Do PostgreSQL ao modelo de IA." />
        <ul className="mt-10 border-t border-line lg:mt-14">
          {stackGroups.map((group) => (
            <li key={group.area} className="row" data-reveal>
              <h3 className="label text-accent lg:col-span-3">{group.area}</h3>
              <ul className="flex flex-wrap gap-2 lg:col-span-9">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

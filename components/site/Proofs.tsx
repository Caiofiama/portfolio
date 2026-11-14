import { proofs } from "@/content/site";

// Four real numbers right after the hero: the proof a technical reader looks for first.
export default function Proofs() {
  return (
    <section className="proofs" aria-labelledby="provas-titulo">
      <div className="wrap">
        <h2 id="provas-titulo" className="sr-only">
          Números dos projetos
        </h2>
        <dl className="proofs__list">
          {proofs.map((proof) => (
            <div key={proof.label} className="flex flex-col-reverse justify-end">
              <dt className="proofs__label">{proof.label}</dt>
              <dd className="proofs__value">{proof.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

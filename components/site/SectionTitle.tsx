// A section heading: a short label for scanning, then a title that gives a reason to keep reading.
export default function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <hgroup data-reveal>
      <p className="label text-accent">{label}</p>
      <h2 className="h2 mt-3 max-w-[16em] text-balance">
        {title}
      </h2>
    </hgroup>
  );
}

import Link from "next/link";
import { projects } from "@/data/portfolio";
import { evidenceRows, shortNames, tagDestination } from "@/lib/evidence";

// Which case backs each technology: a lit dot links to the decision that used it.
export function EvidenceMatrix() {
  return (
    <div className="matrix-wrap" data-reveal>
      <table className="matrix">
        <caption className="sr-only">기술별 근거 프로젝트</caption>
        <thead>
          <tr>
            <td />
            {projects.map((p) => (
              <th key={p.id} scope="col">
                <Link href={`/projects/${p.id}`} title={p.title}>
                  <span>{p.number}</span>
                  {shortNames[p.id]}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {evidenceRows.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              {projects.map((p) => {
                const tag = p.tags.find((t) => t.toLowerCase().includes(row.query.toLowerCase()));
                return (
                  <td key={p.id}>
                    {tag ? (
                      <Link href={tagDestination(p, tag)} aria-label={`${p.title}에서 ${row.name} 사용 근거 보기`} title={tag} />
                    ) : (
                      <i aria-hidden="true" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

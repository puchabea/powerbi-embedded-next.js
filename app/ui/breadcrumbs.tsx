import Link from "next/link";

type Crumb = {
  label: string;
  href?: string; // si no tiene href, es el “actual”
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-zinc-900 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-900 font-medium">{item.label}</span>
              )}

              {!isLast && <span className="text-zinc-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

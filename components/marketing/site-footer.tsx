import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted">
              The self-serve HR benefits bot for Slack &amp; Teams. Answers from
              your own policies, cited to the page.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Product"
              items={[
                ["How it works", "#how"],
                ["Features", "#features"],
                ["Pricing", "#pricing"],
              ]}
            />
            <FooterCol
              title="Company"
              items={[
                ["About", "#"],
                ["Blog", "#"],
                ["Contact", "#"],
              ]}
            />
            <FooterCol
              title="Legal"
              items={[
                ["Privacy", "#"],
                ["Terms", "#"],
                ["Security", "#"],
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Policy Expert. All rights reserved.</p>
          <p>Made for the team-of-one HR manager.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-2">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { Mark, Wordmark } from "@/components/Logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const socials = [
    siteConfig.x && { label: "X", href: siteConfig.x },
    siteConfig.discord && { label: "Discord", href: siteConfig.discord },
    siteConfig.docs && { label: "Docs", href: siteConfig.docs },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark />
            <Wordmark />
          </div>
          <p className="t-small mt-4 max-w-[38ch] text-bone-muted">
            {siteConfig.tagline} Tokenized stocks, poured into one token you
            can hold, trade and redeem.
          </p>
        </div>

        <FooterColumn
          title="Product"
          items={[
            { label: "Explore portfolios", href: "/portfolios" },
            { label: "Forge yours", href: "/forge" },
            { label: "How it works", href: "/#how" },
            { label: "For creators", href: "/#creators" },
          ]}
        />
        <FooterColumn
          title="Trust"
          items={[
            { label: "What backs a token", href: "/#backing" },
            { label: "Redemption", href: "/#faq" },
            { label: "Fees", href: "/#creators" },
            { label: "Questions", href: "/#faq" },
          ]}
        />
        <div>
          <span className="t-label text-bone-soft">Community</span>
          {socials.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2.5">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="t-small text-bone-muted transition-colors hover:text-copper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-small mt-4 text-bone-muted">Links land at launch.</p>
          )}
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="t-small text-bone-muted">
            Robinhood Chain · Backed by Robinhood Stock Tokens · Not an offer of
            securities. Nothing here is investment advice.
          </p>
          <p className="t-label text-bone-muted">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <span className="t-label text-bone-soft">{title}</span>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="t-small text-bone-muted transition-colors hover:text-copper"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { AssetTile } from "@/components/ui/AssetTile";
import { assets } from "@/lib/assets";

/*
 * The universe, scrolling. Two copies of the list so the loop is seamless;
 * the second is hidden from assistive tech.
 */
export function AssetMarquee() {
  const row = assets.slice(0, 32);
  return (
    <div className="relative overflow-hidden border-b border-rule py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="animate-marquee flex w-max gap-3">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-3"
          >
            {row.map((asset) => (
              <li
                key={asset.symbol}
                className="flex items-center gap-2.5 rounded-full border border-rule bg-ink-2 py-1.5 pl-1.5 pr-4"
              >
                <AssetTile symbol={asset.symbol} size={26} />
                <span className="t-mono text-bone">{asset.symbol}</span>
                <span className="t-small hidden text-bone-muted sm:inline">
                  {asset.name}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

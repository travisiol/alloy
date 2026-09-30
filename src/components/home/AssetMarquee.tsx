import { AssetTile } from "@/components/ui/AssetTile";
import { assets } from "@/lib/assets";

/*
 * The universe, scrolling. Two copies of the list so the loop is seamless;
 * the second is hidden from assistive tech.
 */
export function AssetMarquee() {
  const row = assets.slice(0, 32);
  return (
    <div className="relative overflow-hidden py-4">
      <div className="hairline absolute inset-x-0 top-0" aria-hidden />
      <div className="hairline absolute inset-x-0 bottom-0" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-void to-transparent" />
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
                className="flex items-center gap-2.5 rounded-full bg-white/4 py-1.5 pl-1.5 pr-4 ring-1 ring-inset ring-white/8"
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

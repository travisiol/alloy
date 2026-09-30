import { clsx } from "clsx";
import { assetHue, assetMark } from "@/lib/assets";

/**
 * A stock's mark: two letters on a tinted square. There are no logos on
 * this site — a wall of brand marks makes every basket look like the same
 * basket — so each ticker gets a colour of its own and keeps it everywhere.
 */
export function AssetTile({
  symbol,
  size = 36,
  className,
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const hue = assetHue(symbol);
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-[28%] font-mono font-semibold",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        letterSpacing: "0.02em",
        color: `hsl(${hue} 40% 84%)`,
        background: `linear-gradient(145deg, hsl(${hue} 22% 24%), hsl(${hue} 22% 15%))`,
        boxShadow: `inset 0 1px 0 hsl(${hue} 30% 38% / 0.6)`,
      }}
    >
      {assetMark(symbol)}
    </span>
  );
}

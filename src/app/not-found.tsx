import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6">
      <p className="t-label text-copper">404</p>
      <h1 className="t-display mt-3 text-bone">
        Nothing forged <em>here.</em>
      </h1>
      <ButtonLink href="/" variant="ghost" className="mt-8">
        Back to the forge
      </ButtonLink>
    </div>
  );
}

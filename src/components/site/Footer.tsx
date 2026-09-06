import { Logo } from "./Logo";
import { nav, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream-100/10 bg-roast-950 pt-20 pb-10">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="text-cream-50" />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-cream-200/60">
              {site.tagline}. Roasted, poured and washed up by the same people,
              on {site.address.split(",")[0]}.
            </p>
          </div>

          <nav className="md:col-span-3 md:col-start-7" aria-label="Footer">
            <p className="label-tech text-roast-400">Sections</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-cream-200/75 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label-tech text-roast-400">Find us</p>
            <ul className="mt-5 space-y-3 text-sm text-cream-200/75">
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                >
                  {site.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark bled off the bottom edge as a sign-off. */}
        <p
          aria-hidden
          className="mt-24 mb-6 select-none font-display text-[19vw] leading-[0.86] font-light tracking-[-0.04em] text-cream-100/[0.06]"
        >
          {site.name}
        </p>

        <div className="flex flex-col gap-3 border-t border-cream-100/10 pt-6 label-tech text-roast-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Tashkent, Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { procedures } from "@/data/procedures";
import { treatments } from "@/data/treatments";

const quickLinks = [
  { href: "/about", label: "About us" },
  { href: "/#experts", label: "Experts" },
  { href: "/#treatments", label: "What we treat" },
  { href: "/#beliefs", label: "How we treat" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/#videos", label: "Videos" },
];

function isCurrentPath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState("");

  const topLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/exercise", label: "Exercises" },
      { href: "/blog", label: "Blogs" },
      { href: "/contact-us", label: "Contact us" },
    ],
    []
  );

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileDropdown("");
  };

  const toggleDropdown = (name) => {
    setOpenMobileDropdown((current) => (current === name ? "" : name));
  };

  const navClassName = [
    "main-nav",
    isMenuOpen ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const treatmentActive = router.pathname.startsWith("/treatments");
  const procedureActive = router.pathname.startsWith("/procedures");

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link className="brand" href="/" aria-label="Jain Pain Clinic home">
          <img src="/assets/logo.png" alt="Jain Pain Clinic" />
        </Link>

        <nav className={navClassName} aria-label="Primary">
          <Link
            href="/"
            className={isCurrentPath(router.pathname, "/") ? "is-current" : ""}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={isCurrentPath(router.pathname, "/about") ? "is-current" : ""}
            onClick={closeMenu}
          >
            About
          </Link>

          <div className={`nav-dropdown ${openMobileDropdown === "treatments" ? "is-open" : ""}`}>
            <a
              href="#"
              className={treatmentActive ? "is-current" : ""}
              onClick={(event) => {
                if (window.innerWidth <= 780) {
                  event.preventDefault();
                  toggleDropdown("treatments");
                }
              }}
            >
              Treatment <span aria-hidden="true">▾</span>
            </a>
            <div className="nav-dropdown__menu">
              {treatments.map((item) => (
                <Link key={item.slug} href={`/treatments/${item.slug}`} onClick={closeMenu}>
                  {item.navLabel}
                </Link>
              ))}
            </div>
          </div>

          <div className={`nav-dropdown ${openMobileDropdown === "procedures" ? "is-open" : ""}`}>
            <a
              href="#"
              className={procedureActive ? "is-current" : ""}
              onClick={(event) => {
                if (window.innerWidth <= 780) {
                  event.preventDefault();
                  toggleDropdown("procedures");
                }
              }}
            >
              Procedures <span aria-hidden="true">▾</span>
            </a>
            <div className="nav-dropdown__menu">
              {procedures.map((item) => (
                <Link key={item.slug} href={`/procedures/${item.slug}`} onClick={closeMenu}>
                  {item.navLabel}
                </Link>
              ))}
            </div>
          </div>

          {topLinks.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isCurrentPath(router.pathname, item.href) ? "is-current" : ""}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}

          <div className="nav-mobile-links">
            <div className="nav-mobile-links__col">
              <h3>Treatments</h3>
              {treatments.map((item) => (
                <Link key={item.slug} href={`/treatments/${item.slug}`} onClick={closeMenu}>
                  {item.navLabel}
                </Link>
              ))}
            </div>

            <div className="nav-mobile-links__col">
              <h3>Procedures</h3>
              {procedures.map((item) => (
                <Link key={item.slug} href={`/procedures/${item.slug}`} onClick={closeMenu}>
                  {item.navLabel}
                </Link>
              ))}
            </div>

            <div className="nav-mobile-links__col">
              <h3>Quick links</h3>
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <a
            className="pill-button pill-button--small header-cta"
            href="https://wa.me/919211281009?text=Hi%2C%20I%20want%20to%20live%20pain%20free"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
            <span>Consult now</span>
          </a>
          <button
            className={`hamburger ${isMenuOpen ? "is-active" : ""}`}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

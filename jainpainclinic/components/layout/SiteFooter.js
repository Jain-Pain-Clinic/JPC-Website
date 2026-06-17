import Link from "next/link";
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

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img className="footer-logo" src="/assets/logo-small.png" width="600" height="150" loading="lazy" decoding="async" alt="Jain Pain Clinic" />

          <div className="footer-socials">
            <a href="https://www.facebook.com/jainpainandspineclinic/" aria-label="Facebook" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="https://x.com/DrAshuKumarJain" aria-label="X" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-x-twitter" aria-hidden="true"></i>
            </a>
            <a href="https://www.instagram.com/drashukumarjain/" aria-label="Instagram" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://www.youtube.com/@DrAshuKumarJain" aria-label="YouTube" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-youtube" aria-hidden="true"></i>
            </a>
          </div>

          <div className="footer-locations">
            <p>Locations</p>
            <a href="https://maps.google.com/?q=Artemis+Hospital+sector+51+Gurugram+Haryana" target="_blank" rel="noreferrer">
              Artemis Hospital, Sector-51, Gurugram, Haryana
            </a>
          </div>
        </div>

        <div className="footer-columns-row">
          <div className="footer-column">
            <h3>Treatments</h3>
            {treatments.map((item) => (
              <Link key={item.slug} href={`/treatments/${item.slug}`}>
                {item.navLabel}
              </Link>
            ))}
          </div>

          <div className="footer-column">
            <h3>Procedures</h3>
            {procedures.map((item) => (
              <Link key={item.slug} href={`/procedures/${item.slug}`}>
                {item.navLabel}
              </Link>
            ))}
          </div>

          <div className="footer-column">
            <h3>Quick links</h3>
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="wrap">
          <p>© Jain Pain Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

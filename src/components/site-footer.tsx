import Link from "next/link";
import { Github, Linkedin, Mail } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">Available for the right problems</p>
          <h2>Let’s build something useful.</h2>
          <p className="footer-copy">I’m interested in product and full-stack roles, as well as focused client work where operations, data and customer experience meet.</p>
        </div>
        <div className="footer-actions">
          <a href="mailto:cthandoc@gmail.com"><Mail /> Email</a>
          <a href="https://www.linkedin.com/in/conold/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          <a href="https://github.com/thvndx" target="_blank" rel="noreferrer"><Github /> GitHub</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} Conold Thando Chisinahama</p>
        <Link href="/work">Selected work</Link>
      </div>
    </footer>
  );
}

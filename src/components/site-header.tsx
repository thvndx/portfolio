"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Close, Menu } from "@/components/icons";

const links = [
  ["Work", "/work"],
  ["About", "/about"],
  ["Resume", "/resume"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Conold Chisinahama, home" onClick={() => setOpen(false)}>
          <span className="brand-mark">CC</span>
          <span>Conold Chisinahama</span>
        </Link>
        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-nav" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <Close /> : <Menu />}
        </button>
        <nav id="primary-nav" className={open ? "nav nav-open" : "nav"} aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href || pathname.startsWith(`${href}/`) ? "nav-link nav-link-active" : "nav-link"}>{label}</Link>)}
          <a className="button button-small" href="mailto:cthandoc@gmail.com">Let’s talk</a>
        </nav>
      </div>
    </header>
  );
}

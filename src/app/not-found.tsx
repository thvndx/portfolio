import Link from "next/link";

export default function NotFound() { return <section className="page shell not-found"><p className="eyebrow">404</p><h1>This page is not part of the system.</h1><p>The link may have changed, or the project may not be public.</p><Link className="button" href="/work">Return to selected work</Link></section>; }

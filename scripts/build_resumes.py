from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "documents"
OUTPUT.mkdir(parents=True, exist_ok=True)

INK = RGBColor(23, 32, 29)
MUTED = RGBColor(76, 88, 83)
ACCENT = RGBColor(29, 102, 101)
FONT = "Arial"


def set_font(run, size=None, bold=None, color=INK):
    run.font.name = FONT
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), FONT)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), FONT)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    run.font.color.rgb = color


def configure_document(doc, compact=False):
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    margin = 0.58 if compact else 0.68
    section.top_margin = Inches(margin)
    section.bottom_margin = Inches(margin)
    section.left_margin = Inches(0.72)
    section.right_margin = Inches(0.72)

    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    normal.font.size = Pt(9.5 if compact else 10.25)
    normal.font.color.rgb = INK
    normal.paragraph_format.space_after = Pt(3 if compact else 4)
    normal.paragraph_format.line_spacing = 1.0 if compact else 1.05

    for name, size, before, after in [
        ("Title", 25 if compact else 27, 0, 2),
        ("Heading 1", 11, 9 if compact else 11, 4),
        ("Heading 2", 10.5, 5, 1),
    ]:
        style = doc.styles[name]
        style.font.name = FONT
        style._element.rPr.rFonts.set(qn("w:ascii"), FONT)
        style._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    doc.styles["Title"].paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    title_properties = doc.styles["Title"]._element.get_or_add_pPr()
    title_borders = title_properties.find(qn("w:pBdr"))
    if title_borders is not None:
        title_properties.remove(title_borders)
    doc.styles["Heading 1"].font.all_caps = True
    doc.styles["Heading 1"].font.letter_spacing = Pt(0.7)

    if "Resume Meta" not in doc.styles:
        meta = doc.styles.add_style("Resume Meta", WD_STYLE_TYPE.PARAGRAPH)
        meta.base_style = doc.styles["Normal"]
        meta.font.name = FONT
        meta.font.size = Pt(9)
        meta.font.color.rgb = MUTED
        meta.paragraph_format.space_after = Pt(1)


def add_header(doc, subtitle):
    title = doc.add_paragraph(style="Title")
    title.add_run("Conold Thando Chisinahama")
    title_properties = title._p.get_or_add_pPr()
    paragraph_borders = title_properties.find(qn("w:pBdr"))
    if paragraph_borders is not None:
        title_properties.remove(paragraph_borders)
    role = doc.add_paragraph()
    role.paragraph_format.space_after = Pt(4)
    run = role.add_run(subtitle)
    set_font(run, 11, True, ACCENT)
    contact = doc.add_paragraph(style="Resume Meta")
    contact.add_run("Johannesburg, South Africa | +27 82 886 8556 | cthandoc@gmail.com | linkedin.com/in/conold | github.com/thvndx")


def add_section(doc, title):
    doc.add_heading(title, level=1)


def add_role(doc, title, company, dates, location=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(title)
    set_font(run, 10.5, True)
    run = p.add_run(f" | {company}")
    set_font(run, 10.5, True, MUTED)
    meta = doc.add_paragraph(style="Resume Meta")
    text = dates if not location else f"{dates} | {location}"
    meta.add_run(text)


def add_bullet(doc, text, compact=False):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.first_line_indent = Inches(-0.14)
    p.paragraph_format.space_after = Pt(1.4 if compact else 2.4)
    p.paragraph_format.line_spacing = 1.0 if compact else 1.04
    set_font(p.add_run(text), 9.35 if compact else 10)


def add_skills(doc, lines, compact=False):
    for label, values in lines:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(1 if compact else 2)
        set_font(p.add_run(f"{label}: "), 9.2 if compact else 9.8, True)
        set_font(p.add_run(values), 9.2 if compact else 9.8, False, MUTED)


def add_footer(doc, label):
    footer = doc.sections[0].footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = footer.add_run(label)
    set_font(run, 8, False, MUTED)


def build_concise():
    doc = Document()
    configure_document(doc, compact=True)
    add_header(doc, "Full-Stack Software Developer | Customer Success Lead")

    add_section(doc, "Profile")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    set_font(p.add_run("Full-stack software developer with a customer-success foundation, building secure operational products from problem definition through deployment. Leads a four-person support operation, with two direct reports, while delivering internal AI, analytics and workflow tools adopted across the team and adjacent departments."), 9.35)

    add_section(doc, "Technical Skills")
    add_skills(doc, [
        ("Engineering", "TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Supabase"),
        ("Delivery", "API integrations, data modeling, automation, testing, GitHub Actions, Railway, Vercel"),
        ("Product", "Product discovery, operational analytics, customer-success systems, AI-assisted development"),
    ], compact=True)

    add_section(doc, "Experience")
    add_role(doc, "Customer Success Lead", "Connectivity and e-commerce business", "January 2023 - Present", "Remote / Johannesburg")
    for text in [
        "Lead two direct reports within a four-person support operation spanning customer communication, technical escalation, call queues and shared inboxes.",
        "Maintain measured email response and callback times below two hours, with CSAT above 80%.",
        "Define, build, test and deploy internal full-stack products for customer context, quality assurance, experience analysis and performance reporting.",
        "Reduced customer-context gathering from approximately 20 minutes to 30 seconds per interaction by consolidating fragmented provider data.",
        "Reduced KPI report generation and QA selection/compilation from approximately two hours to about one minute while retaining human review.",
        "Drove adoption across all four support agents and adjacent departments; reduced recurring software costs through vendor negotiation and provider changes.",
    ]:
        add_bullet(doc, text, compact=True)

    add_section(doc, "Selected Product Work")
    products = [
        ("Support Quality Platform", "AI-assisted, evidence-backed conversation QA with explicit manual, automation and reporting controls."),
        ("Customer Operations Workbench", "Unified customer context across support, call and commerce systems with fail-closed identity review."),
        ("Operations Performance Hub", "Provider-backed KPI reporting with explicit data freshness, eligibility and request-budget controls."),
        ("PromoStudio", "Approval-first AI campaign generation, scheduling and social-provider integration."),
        ("Recalibrate", "Local-first mobile planning built around adaptive scheduling and supervised guidance."),
    ]
    for name, description in products:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(1.5)
        set_font(p.add_run(f"{name}: "), 9.2, True)
        set_font(p.add_run(description), 9.2, False, MUTED)

    add_section(doc, "Earlier Experience and Education")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    set_font(p.add_run("Technical Sales and Support, 2020-2023 | Technician, 2019 | Technical Sales Consultant, 2015-2017"), 9.1)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    set_font(p.add_run("National Diploma in Business Information Technology, University of Johannesburg, 2014-2018"), 9.1, True)
    p = doc.add_paragraph()
    set_font(p.add_run("Peplink Certified Engineer, awarded November 2025, valid through November 2027"), 9.1)
    add_footer(doc, "Conold Thando Chisinahama | Software and Product Resume")
    doc.save(OUTPUT / "conold-chisinahama-resume-concise.docx")


def build_master():
    doc = Document()
    configure_document(doc, compact=False)
    add_header(doc, "Full-Stack Software Developer | Customer Success Lead")

    add_section(doc, "Professional Summary")
    doc.add_paragraph("Customer-success leader and hands-on full-stack developer who turns operational problems into secure, production-ready software. Combines direct customer and team leadership with product strategy, TypeScript application development, provider integrations, data modeling, testing, deployment and operational verification. Builds with AI assistance transparently while retaining responsibility for architecture, safety boundaries and the final result.")

    add_section(doc, "Core Skills")
    add_skills(doc, [
        ("Languages and frameworks", "TypeScript, JavaScript, React, Next.js, Node.js, Python, React Native, Expo"),
        ("Data and integrations", "PostgreSQL, Supabase, REST APIs, Shopify, Front, Aircall, OAuth, background jobs"),
        ("Quality and delivery", "Vitest, Playwright, GitHub Actions, Railway, Vercel, responsive and accessibility testing"),
        ("Leadership and product", "Customer success, team leadership, process design, KPI definition, vendor negotiation, product discovery"),
    ])

    add_section(doc, "Professional Experience")
    add_role(doc, "Customer Success Lead", "Connectivity and e-commerce business", "January 2023 - Present", "Remote / Johannesburg")
    for text in [
        "Lead two direct reports within a four-person support operation; coordinate customer communication, technical escalation, call queues and shared inboxes.",
        "Maintain measured email response and callback times below two hours, with customer satisfaction above 80%.",
        "Identify recurring operational problems and translate them into deployed products for customer context, quality assurance, customer-experience analysis and performance reporting.",
        "Reduced customer-context gathering from approximately 20 minutes to 30 seconds per interaction by consolidating provider data into a safer support workspace.",
        "Reduced recurring KPI report generation from approximately two hours to about one minute through normalized data, persisted reporting and responsive manager views.",
        "Reduced QA selection and report compilation from approximately two hours to about one minute while preserving human review and explicit automation controls.",
        "Reduced CSAT investigation and calculation from approximately 30 minutes to about one minute with evidence-backed product and support experience scoring.",
        "Drove adoption across all four support agents and additional departments; reduced recurring software costs through contract negotiation and provider changes.",
        "Own product definition, architecture, full-stack implementation, testing, deployment and post-release verification for the internal products I build.",
    ]:
        add_bullet(doc, text)

    doc.add_page_break()
    add_section(doc, "Selected Product Engineering")
    product_lines = [
        ("Support Quality Platform", "Built AI-assisted conversation scoring, role-based manual review, automated sampling, reporting and production controls."),
        ("Customer Operations Workbench", "Integrated support, call and commerce context with explicit review when identifiers point to conflicting customers."),
        ("Operations Performance Hub", "Built provider-backed KPI analytics with raw-outcome accounting, attribution rules, data-freshness states and budgeted synchronization."),
        ("PromoStudio", "Built an approval-first campaign product with authentication, persisted briefs, AI generation, scheduling and controlled external publishing."),
        ("Recalibrate", "Designed and built a local-first mobile planning MVP with adaptive scheduling and supervised guidance."),
    ]
    for name, detail in product_lines:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2.4)
        set_font(p.add_run(f"{name}: "), 9.8, True)
        set_font(p.add_run(detail), 9.8, False, MUTED)

    add_role(doc, "Sales Assistant - Technical Sales and Support", "Connectivity business", "May 2020 - January 2023", "Remote / Irvine, California")
    add_bullet(doc, "Provided remote technical and sales support for customers selecting, installing and troubleshooting connectivity equipment.")
    add_bullet(doc, "Translated technical constraints into clear recommendations for home and commercial environments.")

    add_role(doc, "Technician", "JJ Communications PTY LTD", "February 2019 - November 2019", "Johannesburg, South Africa")
    add_bullet(doc, "Installed, maintained and programmed nurse-call, smoke detection, access-control, public-address and evacuation systems for hospital environments across Southern Africa.")

    add_role(doc, "Technical Sales Consultant", "iStore - Apple Premium Reseller", "September 2015 - January 2017", "Johannesburg, South Africa")
    add_bullet(doc, "Helped customers choose, configure and troubleshoot technology by combining technical diagnosis with practical sales guidance.")

    add_section(doc, "Earlier Software Work")
    add_bullet(doc, "Co-built an early Python returns-rate dashboard with a colleague over approximately two to three months before the later production platform; retain explicit collaborative credit for the work.")
    add_bullet(doc, "Built SlykPark as a 2017 university capstone: a wallet-funded parking application connecting number-plate recognition, vehicle entry, time on site and automated payment.")

    add_section(doc, "Education")
    add_role(doc, "National Diploma - Business Information Technology", "University of Johannesburg", "2014 - 2018", "Johannesburg, South Africa")

    add_section(doc, "Certification")
    add_role(doc, "Peplink Certified Engineer", "Peplink", "Awarded 17 November 2025 | Valid through 17 November 2027")

    add_section(doc, "Languages")
    doc.add_paragraph("English - Native or bilingual | isiZulu - Professional working | Afrikaans - Limited working | French - Elementary")

    add_footer(doc, "Conold Thando Chisinahama | Master Resume")
    doc.save(OUTPUT / "conold-chisinahama-resume-master.docx")


if __name__ == "__main__":
    build_concise()
    build_master()
    print("Created concise and master resume DOCX files.")

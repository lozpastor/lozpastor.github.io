from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
OUTPUTS = [
    ROOT / "Alejandro-Lozano-Technical-Product-Manager-CV.pdf",
    ROOT / "public" / "Alejandro-Lozano-Technical-Product-Manager-CV.pdf",
]

NAVY = HexColor("#061A24")
TEAL = HexColor("#2C8E83")
MUTED = HexColor("#53666D")
LINE = HexColor("#CAD4D6")
WHITE = HexColor("#FFFFFF")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Name",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=29,
        textColor=NAVY,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Positioning",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=TEAL,
        spaceBefore=12,
        spaceAfter=6,
        uppercase=True,
    )
)
styles.add(
    ParagraphStyle(
        name="Role",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=NAVY,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Meta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=MUTED,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="BodySmall",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.7,
        leading=12.3,
        textColor=NAVY,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Contact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=NAVY,
        alignment=TA_RIGHT,
    )
)


def bullet(text: str) -> Paragraph:
    return Paragraph(f"• {text}", styles["BodySmall"])


def section(title: str) -> list:
    return [
        Paragraph(title.upper(), styles["Section"]),
        Table([[""]], colWidths=[178 * mm], rowHeights=[0.35 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), LINE)]),
        Spacer(1, 2.5 * mm),
    ]


def story() -> list:
    elements = []
    header = Table(
        [
            [
                [
                    Paragraph("Alejandro Lozano", styles["Name"]),
                    Paragraph("Technical Product Manager with a data and BI backbone", styles["Positioning"]),
                ],
                Paragraph(
                    "Barcelona, Spain<br/>"
                    '<link href="mailto:lozpastor@gmail.com">lozpastor@gmail.com</link><br/>'
                    '<link href="https://linkedin.com/in/alejandro-lozano-pastor">linkedin.com/in/alejandro-lozano-pastor</link>',
                    styles["Contact"],
                ),
            ]
        ],
        colWidths=[112 * mm, 66 * mm],
        hAlign="LEFT",
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    elements.extend([header, Spacer(1, 4 * mm)])
    elements.append(
        Paragraph(
            "I spent two years building the data that banking risk decisions run on. "
            "Now I decide what gets built on top of it. Product decisions land better "
            "when you know what the pipeline can actually do.",
            styles["BodySmall"],
        )
    )

    elements.extend(section("Experience"))
    elements.append(
        KeepTogether(
            [
                Paragraph("Product Management Office — Recoveries & Underwriting", styles["Role"]),
                Paragraph("Management Solutions · Barcelona · Sep 2025–Present", styles["Meta"]),
                bullet("Own the product backlog across core banking initiatives involving business, technology, risk and operations."),
                bullet("Write user stories and acceptance criteria in Jira; maintain functional documentation in Confluence."),
                bullet("Run Agile/Scrum ceremonies, validate UAT evidence and track roadmap milestones and operational KPIs."),
                Spacer(1, 2 * mm),
            ]
        )
    )
    elements.append(
        KeepTogether(
            [
                Paragraph("Data Engineer — Risk & Regulatory Data", styles["Role"]),
                Paragraph("Management Solutions · Barcelona · Nov 2023–Aug 2025", styles["Meta"]),
                bullet("Consolidated more than 100 recurring risk reports into six Power BI dashboards, reducing reporting workload by over 90%."),
                bullet("Designed and optimised SAS and SQL pipelines for COREP regulatory capital reporting at a G-SIB."),
                bullet("Added reconciliation and quality controls across provisions, RWA and CET1; regulatory ETL efficiency improved by over 50%."),
            ]
        )
    )

    elements.extend(section("Selected build"))
    elements.append(Paragraph("Macroeconomic Dashboard", styles["Role"]))
    elements.append(Paragraph("Personal project · Jun 2025", styles["Meta"]))
    elements.append(
        bullet(
            "Rebuilt a Power BI concept as a responsive HTML, CSS and JavaScript application for economic KPIs, time series and multi-country comparison."
        )
    )

    elements.extend(section("Capabilities"))
    capabilities = Table(
        [
            [
                Paragraph("<b>Product & Delivery</b><br/>Backlog ownership · User stories · Roadmaps · UAT · Agile/Scrum · Stakeholders", styles["BodySmall"]),
                Paragraph("<b>Data & BI</b><br/>SQL · SAS · Power BI · ETL design · Data modelling · KPI design", styles["BodySmall"]),
                Paragraph("<b>Banking</b><br/>Credit risk · Recoveries · Underwriting · COREP · IFRS 9 · RWA / CET1", styles["BodySmall"]),
            ]
        ],
        colWidths=[59.3 * mm] * 3,
    )
    capabilities.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    elements.append(capabilities)
    elements.append(Paragraph("<font color='#53666D'>Tools: Jira · Confluence · Excel · PowerPoint</font>", styles["BodySmall"]))

    elements.extend(section("Education & credentials"))
    credentials = Table(
        [
            [
                Paragraph(
                    "<b>MSc Business Consulting, Data Science</b><br/>ICADE · 2023–2025<br/><br/>"
                    "<b>BSc Computer Engineering</b><br/>Universidad Miguel Hernández · 2019–2023",
                    styles["BodySmall"],
                ),
                Paragraph(
                    "<b>Certifications</b><br/>Generative AI with LLMs · DeepLearning.AI · 2025<br/>"
                    "Python 101 for Data Science · IBM · 2022<br/>Data Analysis with Python · IBM · 2022",
                    styles["BodySmall"],
                ),
                Paragraph(
                    "<b>Languages</b><br/>Spanish · Native<br/>Catalan · Native<br/>"
                    "English · Professional<br/>Mandarin · Beginner",
                    styles["BodySmall"],
                ),
            ]
        ],
        colWidths=[59.3 * mm] * 3,
    )
    credentials.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    elements.append(credentials)
    return elements


def build_pdf(path: Path) -> None:
    document = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
        title="Alejandro Lozano — Technical Product Manager",
        author="Alejandro Lozano",
        subject="Technical Product Manager CV",
    )
    document.build(story())


for output in OUTPUTS:
    output.parent.mkdir(parents=True, exist_ok=True)
    build_pdf(output)

#!/usr/bin/env python3
"""Generate a polished PDF from the markdown test plan in this folder."""
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Image,
    Table,
    TableStyle,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import inch
from reportlab.lib import colors
import os
import re

ROOT = os.path.dirname(__file__)
MD = os.path.join(ROOT, 'testplan_vwo_login.md')
OUT = os.path.join(ROOT, 'testplan_vwo_login.pdf')


def _find_company_logo():
    candidates = [
        os.path.join(ROOT, '..', '01_advance-skills', 'testplan-creator-skill-a', 'misc', 'CompanyLogo.jpeg'),
        os.path.join(ROOT, '..', '01_advance-skills', 'testplan-creator-skill-a', 'misc', 'CompanyLogo.jpg'),
        os.path.join(ROOT, 'logo.png'),
    ]
    for path in candidates:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path
    return None


def _add_page_number(canvas_obj, doc):
    canvas_obj.saveState()
    page_num_text = f"Page {doc.page}"
    canvas_obj.setFont('Helvetica', 9)
    canvas_obj.setFillColor(colors.grey)
    canvas_obj.drawRightString(7.5 * inch, 0.65 * inch, page_num_text)
    canvas_obj.restoreState()


def _flush_table(story, rows):
    if not rows:
        return
    max_cols = max(len(r) for r in rows)
    normalized = []
    for row in rows:
        padded = list(row) + [''] * (max_cols - len(row))
        normalized.append([cell.strip() for cell in padded])

    table = Table(normalized, colWidths=[1.5 * inch, 2.6 * inch, 2.1 * inch])
    table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F3F7FB')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#B8C9D9')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ])
    )
    story.append(table)
    story.append(Spacer(1, 0.15 * inch))


def md_to_pdf(md_path, out_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()

    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54,
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle('CoverTitle', parent=styles['Title'], alignment=TA_CENTER, fontSize=24, leading=28, spaceAfter=10, textColor=colors.HexColor('#1F4E79')))
    styles.add(ParagraphStyle('Subtitle', parent=styles['Normal'], alignment=TA_CENTER, fontSize=10, leading=14, textColor=colors.HexColor('#4B5563')))
    styles.add(ParagraphStyle('SectionTitle', parent=styles['Heading1'], fontSize=17, textColor=colors.HexColor('#1F4E79'), spaceBefore=16, spaceAfter=8, leading=20))
    styles.add(ParagraphStyle('SubSectionTitle', parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#0F172A'), spaceBefore=10, spaceAfter=6, leading=18))
    styles.add(ParagraphStyle('Body', parent=styles['BodyText'], fontSize=9.5, leading=13, alignment=TA_LEFT))
    styles.add(ParagraphStyle('Meta', parent=styles['Normal'], alignment=TA_CENTER, fontSize=9, leading=12, textColor=colors.HexColor('#334155')))
    story = []

    first_line = next((line.strip() for line in lines if line.strip()), '')
    if first_line.startswith('# '):
        title = first_line[2:].strip()
        story.append(Spacer(1, 0.75 * inch))
        logo_path = _find_company_logo()
        if logo_path:
            try:
                img = Image(logo_path, width=2.2 * inch, height=2.2 * inch)
                img.hAlign = 'CENTER'
                story.append(img)
                story.append(Spacer(1, 0.25 * inch))
            except Exception:
                pass
        story.append(Paragraph(title, styles['CoverTitle']))
        meta_lines = []
        for line in lines[1:12]:
            s = line.strip()
            if s:
                meta_lines.append(s)
        for m in meta_lines:
            story.append(Paragraph(m, styles['Meta']))
        story.append(Spacer(1, 0.4 * inch))
        story.append(Paragraph('Test Plan Document', styles['Subtitle']))
        story.append(PageBreak())

    story.append(Paragraph('Table of Contents', styles['SectionTitle']))
    for line in lines:
        s = line.strip()
        if s.startswith('## '):
            story.append(Paragraph('• ' + s[3:].strip(), styles['Body']))
        elif s.startswith('### '):
            story.append(Paragraph('    • ' + s[4:].strip(), styles['Body']))
    story.append(PageBreak())

    pending_table = []
    for line in lines:
        s = line.strip()
        if not s:
            if pending_table:
                _flush_table(story, pending_table)
                pending_table = []
            story.append(Spacer(1, 0.08 * inch))
            continue

        if s.startswith('---'):
            if pending_table:
                _flush_table(story, pending_table)
                pending_table = []
            story.append(Spacer(1, 0.12 * inch))
            continue

        if s.startswith('|') and s.endswith('|'):
            row = [cell.strip() for cell in s.strip('|').split('|')]
            if row and any(cell for cell in row):
                pending_table.append(row)
            continue

        if pending_table:
            _flush_table(story, pending_table)
            pending_table = []

        if s.startswith('# '):
            continue
        if s.startswith('## '):
            story.append(Paragraph(s[3:].strip(), styles['SectionTitle']))
            continue
        if s.startswith('### '):
            story.append(Paragraph(s[4:].strip(), styles['SubSectionTitle']))
            continue
        if s.startswith('#### '):
            story.append(Paragraph(s[5:].strip(), styles['SubSectionTitle']))
            continue
        if re.match(r'^[0-9]+\.', s):
            story.append(Paragraph(s, styles['Body']))
            continue
        if s.startswith('- ') or s.startswith('* '):
            story.append(Paragraph('• ' + s[2:].strip(), styles['Bullet']))
            continue
        if s.startswith('> '):
            story.append(Paragraph(s[2:].strip(), styles['Body']))
            continue

        story.append(Paragraph(s, styles['Body']))

    if pending_table:
        _flush_table(story, pending_table)

    story.append(PageBreak())
    story.append(Paragraph('Sign-off', styles['SectionTitle']))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph('Product Owner: ____________________   Date: ____________', styles['Body']))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph('Test Lead: ________________________   Date: ____________', styles['Body']))

    doc.build(story, onFirstPage=_add_page_number, onLaterPages=_add_page_number)


if __name__ == '__main__':
    if not os.path.exists(MD):
        print('Markdown file not found:', MD)
        raise SystemExit(1)
    md_to_pdf(MD, OUT)
    print('PDF generated at', OUT)

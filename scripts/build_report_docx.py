from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "docs" / "NyayaSaathi_Project_Report.md"
OUTPUT_PATH = ROOT / "docs" / "NyayaSaathi_Project_Report.docx"


def parse_markdown(source_text: str) -> list[tuple[str, str]]:
    blocks: list[tuple[str, str]] = []
    paragraph_lines: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph_lines
        if paragraph_lines:
            text = " ".join(line.strip() for line in paragraph_lines).strip()
            if text:
                blocks.append(("paragraph", text))
            paragraph_lines = []

    for raw_line in source_text.splitlines():
        line = raw_line.rstrip()

        if not line.strip():
            flush_paragraph()
            continue

        if line.startswith("# "):
            flush_paragraph()
            blocks.append(("title", line[2:].strip()))
            continue

        if line.startswith("## "):
            flush_paragraph()
            blocks.append(("heading", line[3:].strip()))
            continue

        if line.startswith("- "):
            flush_paragraph()
            blocks.append(("bullet", line[2:].strip()))
            continue

        paragraph_lines.append(line)

    flush_paragraph()
    return blocks


def paragraph_xml(text: str, kind: str) -> str:
    escaped = escape(text)

    if kind == "title":
        return (
            "<w:p>"
            "<w:pPr><w:spacing w:after=\"240\"/></w:pPr>"
            "<w:r><w:rPr><w:b/><w:sz w:val=\"34\"/></w:rPr>"
            f"<w:t>{escaped}</w:t></w:r>"
            "</w:p>"
        )

    if kind == "heading":
        return (
            "<w:p>"
            "<w:pPr><w:spacing w:before=\"220\" w:after=\"120\"/></w:pPr>"
            "<w:r><w:rPr><w:b/><w:sz w:val=\"28\"/></w:rPr>"
            f"<w:t>{escaped}</w:t></w:r>"
            "</w:p>"
        )

    if kind == "bullet":
        return (
            "<w:p>"
            "<w:pPr>"
            "<w:ind w:left=\"720\" w:hanging=\"360\"/>"
            "<w:spacing w:after=\"80\"/>"
            "</w:pPr>"
            "<w:r><w:t xml:space=\"preserve\">- </w:t></w:r>"
            f"<w:r><w:t>{escaped}</w:t></w:r>"
            "</w:p>"
        )

    return (
        "<w:p>"
        "<w:pPr><w:spacing w:after=\"120\"/></w:pPr>"
        f"<w:r><w:t>{escaped}</w:t></w:r>"
        "</w:p>"
    )


def build_document_xml(blocks: list[tuple[str, str]]) -> str:
    body = "".join(paragraph_xml(text, kind) for kind, text in blocks)
    body += (
        "<w:sectPr>"
        "<w:pgSz w:w=\"12240\" w:h=\"15840\"/>"
        "<w:pgMar w:top=\"1440\" w:right=\"1080\" w:bottom=\"1440\" w:left=\"1080\" "
        "w:header=\"720\" w:footer=\"720\" w:gutter=\"0\"/>"
        "</w:sectPr>"
    )

    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
        "<w:document xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" "
        "xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" "
        "xmlns:o=\"urn:schemas-microsoft-com:office:office\" "
        "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" "
        "xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" "
        "xmlns:v=\"urn:schemas-microsoft-com:vml\" "
        "xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" "
        "xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" "
        "xmlns:w10=\"urn:schemas-microsoft-com:office:word\" "
        "xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" "
        "xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" "
        "xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" "
        "xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" "
        "xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" "
        "xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" "
        "mc:Ignorable=\"w14 wp14\">"
        f"<w:body>{body}</w:body>"
        "</w:document>"
    )


def write_docx(document_xml: str, output_path: Path) -> None:
    content_types_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""

    package_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""

    core_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>NyayaSaathi Project Report</dc:title>
  <dc:creator>OpenAI Codex</dc:creator>
  <cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy>
</cp:coreProperties>
"""

    app_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
</Properties>
"""

    with ZipFile(output_path, "w", compression=ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types_xml)
        archive.writestr("_rels/.rels", package_rels_xml)
        archive.writestr("docProps/core.xml", core_xml)
        archive.writestr("docProps/app.xml", app_xml)
        archive.writestr("word/document.xml", document_xml)


def main() -> None:
    source_text = SOURCE_PATH.read_text(encoding="utf-8")
    blocks = parse_markdown(source_text)
    document_xml = build_document_xml(blocks)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    write_docx(document_xml, OUTPUT_PATH)
    print(f"Created {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

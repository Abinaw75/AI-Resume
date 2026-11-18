
from io import BytesIO

import fitz
from docx import Document


def extract_pdf_text(file_content: bytes) -> str:
    """Extract text from a PDF resume."""

    try:
        pdf = fitz.open(
            stream=file_content,
            filetype="pdf"
        )

        extracted_text = []

        for page in pdf:
            text = page.get_text()
            extracted_text.append(text)

        pdf.close()

        return "\n".join(extracted_text).strip()

    except Exception as error:
        raise ValueError(
            f"PDF text extraction failed: {error}"
        ) from error


def extract_docx_text(file_content: bytes) -> str:
    """Extract text from a DOCX resume."""

    try:
        document = Document(
            BytesIO(file_content)
        )

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs).strip()

    except Exception as error:
        raise ValueError(
            f"DOCX text extraction failed: {error}"
        ) from error


def extract_resume_text(
    file_content: bytes,
    filename: str
) -> str:

    extension = filename.lower().split(".")[-1]

    if extension == "pdf":
        text = extract_pdf_text(file_content)

    elif extension == "docx":
        text = extract_docx_text(file_content)

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

    if not text:
        raise ValueError(
            "No readable text found in the resume."
        )

    return text

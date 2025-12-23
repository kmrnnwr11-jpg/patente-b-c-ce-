import fitz  # PyMuPDF
import json
import re

pdf_path = '/Users/kmrnnwr/Downloads/patente-b-2-o-90dd4c9a2c9c/Manuale di teoria.pdf'

# Open PDF
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")
print(f"First 10 pages preview:\n")

# Extract first few pages to understand structure
for page_num in range(min(10, len(doc))):
    page = doc[page_num]
    text = page.get_text()
    print(f"\n=== PAGE {page_num + 1} ===")
    print(text[:500] if len(text) > 500 else text)
    print("...")

doc.close()

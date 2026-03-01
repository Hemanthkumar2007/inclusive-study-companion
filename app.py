from flask import Flask, render_template, request, send_file
import PyPDF2
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

app = Flask(__name__)

# ----------------------------
# Simple Summary (No AI)
# ----------------------------
def generate_summary(text):
    sentences = text.split(".")
    summary = ". ".join(sentences[:5])
    return summary


# ----------------------------
# Extract Key Points
# ----------------------------
def extract_key_points(text):
    sentences = text.split(". ")
    return sentences[:5]


# ----------------------------
# Home Route
# ----------------------------
@app.route("/")
def home():
    return render_template("index.html")


# ----------------------------
# Upload Route
# ----------------------------
@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("pdf_file")
    extracted_text = ""

    if file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text

    if extracted_text.strip() == "":
        extracted_text = "No readable text found in this PDF."

    summary = generate_summary(extracted_text)
    key_points = extract_key_points(extracted_text)

    return render_template(
        "index.html",
        extracted_text=extracted_text,
        summary=summary,
        key_points=key_points
    )


# ----------------------------
# Download Summary as PDF
# ----------------------------
@app.route("/download_summary")
def download_summary():
    summary = request.args.get("summary", "")

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    elements = [Paragraph(summary, styles["Normal"])]
    doc.build(elements)
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="summary.pdf",
        mimetype="application/pdf"
    )


# ----------------------------
# Run App
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)
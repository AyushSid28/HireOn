from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import tempfile
from pathlib import Path
import PyPDF2
from docx import Document
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Resume Parser API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini (free tier)
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE"))
model = genai.GenerativeModel('gemini-2.5-pro')

# Define the resume schema
class Education(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    field_of_study: Optional[str] = None

class Experience(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class ResumeSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
    return text

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")
    return text

def parse_resume_with_llm(text: str) -> dict:
    """Use Gemini to parse resume text into structured format"""
    prompt = f"""
    Extract information from the following resume text and return it in JSON format.
    Be accurate and only include information that is explicitly mentioned in the resume.
    If a field is not found, use null.
    
    Expected JSON structure:
    {{
        "name": "string or null",
        "email": "string or null",
        "phone": "string or null",
        "location": "string or null",
        "summary": "string or null",
        "skills": ["array of skills"],
        "education": [
            {{
                "degree": "string or null",
                "institution": "string or null",
                "year": "string or null",
                "field_of_study": "string or null"
            }}
        ],
        "experience": [
            {{
                "job_title": "string or null",
                "company": "string or null",
                "duration": "string or null",
                "description": "string or null"
            }}
        ],
        "certifications": ["array of certifications"],
        "languages": ["array of languages"]
    }}
    
    Resume text:
    {text}
    
    Return only valid JSON, no additional text or markdown.
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        json_text = response.text.strip()
        # Remove markdown code blocks if present
        if json_text.startswith("```json"):
            json_text = json_text[7:]
        if json_text.startswith("```"):
            json_text = json_text[3:]
        if json_text.endswith("```"):
            json_text = json_text[:-3]
        
        import json
        parsed_data = json.loads(json_text.strip())
        return parsed_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume with LLM: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Resume Parser API is running"}

@app.post("/parse-resume", response_model=ResumeSchema)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse a resume file (PDF or DOCX) and return structured data.
    The file is saved to the uploads folder before parsing.
    """
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    uploads_dir = Path(__file__).parent / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    saved_path = uploads_dir / file.filename

    # Save uploaded file to uploads folder
    with open(saved_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(str(saved_path))
        else:
            text = extract_text_from_docx(str(saved_path))

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")

        # Parse with LLM
        parsed_data = parse_resume_with_llm(text)

        # Validate and return
        resume = ResumeSchema(**parsed_data)
        return resume

    finally:
        # Optionally, clean up the uploaded file after parsing
        if saved_path.exists():
            os.remove(saved_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# main.py (FastAPI Backend)
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import PyPDF2 as pdf
from io import BytesIO
import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords

# Initialize FastAPI app
app = FastAPI(title="ATS Resume Analyzer API")

# CORS Configuration for React Frontend
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skill Categories (from app.py)
SKILL_CATEGORIES = {
    'Programming Languages': ['python', 'java', 'javascript', 'js', 'typescript', 'ts', 'c++', 'c#', 'csharp', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab', 'c', 'cpp'],
    'Web Technologies': ['html', 'html5', 'css', 'css3', 'react', 'reactjs', 'angular', 'vue', 'nodejs', 'node.js', 'django', 'flask', 'express', 'jquery', 'bootstrap', 'sass', 'less', 'webpack', 'vite', 'nextjs', 'graphql', 'rest api', 'restful'],
    'Database': ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'oracle', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'cassandra', 'mariadb', 'sqlite', 'nosql'],
    'Cloud & DevOps': ['aws', 'amazon', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'jenkins', 'terraform', 'ci/cd', 'cicd', 'git', 'github', 'gitlab', 'bitbucket', 'linux', 'unix', 'bash', 'shell'],
    'Data Science': ['machine learning', 'ml', 'deep learning', 'dl', 'nlp', 'natural language processing', 'pandas', 'numpy', 'scipy', 'scikit-learn', 'sklearn', 'tensorflow', 'pytorch', 'keras', 'computer vision', 'cv', 'ai', 'artificial intelligence', 'data mining', 'statistics'],
    'Soft Skills': ['leadership', 'communication', 'teamwork', 'team player', 'problem solving', 'analytical', 'project management', 'agile', 'scrum', 'time management', 'collaboration', 'critical thinking', 'attention to detail', 'multitasking']
}

EDUCATION_TERMS = [
    'bachelor', 'master', 'phd', 'degree',
    'b.tech', 'b.e', 'm.tech', 'bsc', 'msc',
    'computer science', 'cs', 'information technology', 'it',
    'engineering', 'technology', 'computer engineering',
    'software engineering', 'information systems',
    'artificial intelligence', 'data science',
    'university', 'college', 'institute',
    'gpa', 'cgpa', 'grade', 'honors', 'distinction'
]

# Initialize NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

STOP_WORDS = set(stopwords.words('english'))

# Pydantic Models
class AnalysisRequest(BaseModel):
    job_description: str

class AnalysisResponse(BaseModel):
    jd_match: str
    profile_summary: str
    key_strengths: List[str]
    missing_keywords: List[str]
    education: str
    experience: str
    projects: List[str]
    achievements: List[str]
    category_matches: Dict[str, float]
    skill_gaps: Dict[str, List[str]]
    recommendations: List[str]

# Helper Functions (from app.py)
def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from PDF bytes"""
    try:
        pdf_file = BytesIO(file_bytes)
        reader = pdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            try:
                extracted = page.extract_text() or ""
            except Exception:
                extracted = ""
            text += extracted + "\n"
        return text.strip()
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"PDF parsing failed: {str(error)}")

def extract_skills_and_keywords(text: str):
    """Extract skills and keywords from text"""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    
    categorized_skills = {category: {} for category in SKILL_CATEGORIES}
    
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            pattern = r'\b' + re.escape(skill) + r'\b'
            matches = re.finditer(pattern, text)
            for match in matches:
                context_start = max(0, match.start() - 50)
                context_end = min(len(text), match.end() + 50)
                context = text[context_start:context_end]
                
                confidence = 0.8
                tech_indicators = ['developed', 'implemented', 'built', 'created', 'designed', 'managed', 'led']
                if any(indicator in context for indicator in tech_indicators):
                    confidence = 0.9
                if any(tech in context for tech in ['project', 'application', 'system', 'software']):
                    confidence = 1.0
                
                categorized_skills[category][skill] = max(
                    confidence,
                    categorized_skills[category].get(skill, 0)
                )
    
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalnum() and word.lower() not in STOP_WORDS]
    
    bigrams = [' '.join(pair) for pair in zip(words[:-1], words[1:])]
    trigrams = [' '.join(triple) for triple in zip(words[:-2], words[1:-1], words[2:])]
    
    all_terms = words + bigrams + trigrams
    term_freq = Counter(all_terms)
    
    terms = [term for term, freq in term_freq.most_common(100) if len(term) > 2 or freq > 2]
    
    categorized_skills = {k: [skill for skill, conf in v.items() if conf >= 0.8] 
                         for k, v in categorized_skills.items()}
    categorized_skills = {k: v for k, v in categorized_skills.items() if v}
    
    return terms, categorized_skills

def calculate_match_percentage(resume_text: str, jd_text: str) -> float:
    """Calculate resume-JD match percentage"""
    try:
        resume_keywords, resume_categories = extract_skills_and_keywords(resume_text)
        jd_keywords, jd_categories = extract_skills_and_keywords(jd_text)
        
        tech_categories = ['Programming Languages', 'Web Technologies', 'Database', 'Cloud & DevOps', 'Data Science']
        tech_scores = []
        
        for category in tech_categories:
            if category in jd_categories and jd_categories[category]:
                jd_skills = set(jd_categories[category])
                resume_skills = set(resume_categories.get(category, []))
                
                exact_matches = len(jd_skills & resume_skills)
                partial_matches = sum(
                    1 for js in jd_skills for rs in resume_skills
                    if js != rs and (js in rs or rs in js)
                )
                
                match_score = (exact_matches + 0.5 * partial_matches) / len(jd_skills)
                tech_scores.append(match_score)
        
        tech_similarity = sum(tech_scores) / len(tech_scores) if tech_scores else 0.5
        
        soft_skills_score = 0.0
        if 'Soft Skills' in jd_categories and jd_categories['Soft Skills']:
            jd_soft_skills = set(jd_categories['Soft Skills'])
            resume_soft_skills = set(resume_categories.get('Soft Skills', []))
            soft_skills_score = len(jd_soft_skills & resume_soft_skills) / len(jd_soft_skills)
        
        def preprocess_text(raw_text):
            cleaned = raw_text.lower()
            cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', cleaned)
            tokens = [w for w in cleaned.split() if w not in STOP_WORDS]
            return ' '.join(tokens)
        
        processed_resume = preprocess_text(resume_text)
        processed_jd = preprocess_text(jd_text)
        
        vectorizer = TfidfVectorizer(ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([processed_resume, processed_jd])
        keyword_similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        exp_edu_score = 0.0
        education = analyze_education(resume_text)
        experience = analyze_experience(resume_text)
        
        if education and any(term in education.lower() for term in ['computer science', 'it', 'software', 'engineering']):
            exp_edu_score += 0.5
        
        if experience:
            exp_words = experience.lower()
            years_pattern = r'\b\d+\s*(?:\+\s*)?years?\b'
            if re.search(years_pattern, exp_words):
                exp_edu_score += 0.5
        
        final_score = (
            0.45 * tech_similarity +
            0.15 * soft_skills_score +
            0.25 * keyword_similarity +
            0.15 * exp_edu_score
        )
        
        if final_score > 0.6:
            final_score = 0.6 + (final_score - 0.6) * 1.5
        elif final_score < 0.4:
            final_score = 0.4 * (final_score / 0.4)
        
        final_score = max(0, min(1, final_score))
        return round(final_score * 100, 1)

    except Exception as e:
        return 50.0

def analyze_education(text: str) -> str:
    """Analyze education from text"""
    text_lower = text.lower()
    sentences = [sentence.strip() for sentence in sent_tokenize(text_lower)]
    edu_sentences = [s for s in sentences if any(term in s for term in EDUCATION_TERMS)]
    
    is_cs = any(term in text_lower for term in ['computer science', 'cs', 'information technology', 'it', 'software engineering'])
    
    if edu_sentences:
        main_edu = edu_sentences[0]
        if is_cs and 'computer science' not in main_edu and 'cs' not in main_edu:
            main_edu += ' (Computer Science/IT background)'
        return main_edu
    
    if is_cs:
        return "Computer Science/IT background detected"
    
    return ""

def analyze_experience(text: str) -> str:
    """Analyze experience from text"""
    text_lower = text.lower()
    sentences = [s.strip() for s in sent_tokenize(text_lower)]

    experiences = {
        'work': [],
        'projects': [],
        'internships': []
    }
    
    for sentence in sentences:
        if any(word in sentence for word in ['experience', 'worked', 'working']):
            experiences['work'].append(sentence)
        elif any(word in sentence for word in ['project', 'developed', 'built', 'created', 'implemented']):
            experiences['projects'].append(sentence)
        elif 'intern' in sentence:
            experiences['internships'].append(sentence)
    
    years_exp = 0
    for sentence in experiences['work']:
        year_matches = re.findall(r'\d+\+?\s*(?:year|yr)', sentence)
        if year_matches:
            try:
                years_exp = max(years_exp, int(re.findall(r'\d+', year_matches[0])[0]))
            except:
                pass
    
    experience_summary = []
    if years_exp > 0:
        experience_summary.append(f"{years_exp}+ years of experience")
    
    if experiences['work']:
        experience_summary.append(experiences['work'][0])
    if experiences['internships']:
        experience_summary.append(f"Has internship experience: {experiences['internships'][0]}")
    if experiences['projects']:
        experience_summary.append(f"Project experience: {experiences['projects'][0]}")
    
    return ' | '.join(experience_summary) if experience_summary else ""

def analyze_projects(text: str) -> List[str]:
    """Analyze projects from text"""
    text_lower = text.lower()
    sentences = [s.strip() for s in sent_tokenize(text_lower)]
    projects = [s for s in sentences if any(word in s for word in ['project', 'developed', 'built', 'created', 'implemented'])]
    return projects[:3]

def analyze_achievements(text: str) -> List[str]:
    """Analyze achievements from text"""
    text_lower = text.lower()
    sentences = [s.strip() for s in sent_tokenize(text_lower)]
    achievements = [s for s in sentences if any(word in s for word in 
        ['achieved', 'awarded', 'won', 'recognized', 'selected', 'ranked', 'improved', 
         'increased', 'decreased', 'reduced', 'saved', 'delivered', 'led', 'managed'])]
    return achievements[:3]

def get_key_strengths(resume_keywords: List[str], jd_keywords: List[str]) -> List[str]:
    """Get key strengths"""
    strengths = list(set(resume_keywords) & set(jd_keywords))
    return sorted(strengths, key=lambda x: len(x), reverse=True)[:5]

def get_ats_feedback(resume_text: str, jd_text: str) -> dict:
    """Generate complete ATS feedback"""
    resume_keywords, resume_categories = extract_skills_and_keywords(resume_text)
    jd_keywords, jd_categories = extract_skills_and_keywords(jd_text)
    
    missing_keywords = list(set(jd_keywords) - set(resume_keywords))
    key_strengths = get_key_strengths(resume_keywords, jd_keywords)
    
    match_percentage = calculate_match_percentage(resume_text, jd_text)
    
    education = analyze_education(resume_text)
    experience = analyze_experience(resume_text)
    projects = analyze_projects(resume_text)
    achievements = analyze_achievements(resume_text)
    
    profile_parts = []
    if education:
        profile_parts.append(education.strip().capitalize())
    if experience:
        profile_parts.append(experience)
    profile_summary = ' | '.join(profile_parts)
    
    skill_gaps = {}
    for category in SKILL_CATEGORIES:
        jd_skills = set(jd_categories.get(category, []))
        resume_skills = set(resume_categories.get(category, []))
        if jd_skills:
            missing = sorted(jd_skills - resume_skills)
            if missing:
                skill_gaps[category] = missing
    
    category_matches = {}
    for category in SKILL_CATEGORIES:
        jd_skills = set(jd_categories.get(category, []))
        resume_skills = set(resume_categories.get(category, []))
        if jd_skills:
            match = len(jd_skills & resume_skills) / len(jd_skills) * 100
            category_matches[category] = round(max(0.0, min(100.0, match)), 1)
    
    recommendations = []
    
    if not education:
        recommendations.append("Add your educational background prominently")
    elif 'computer science' in education.lower() or 'cs' in education.lower():
        recommendations.append("Your CS background is relevant - highlight any specialized coursework or projects")
    
    if not experience:
        recommendations.append("Add any internships, projects, or relevant work experience")
    elif 'internship' in experience.lower():
        recommendations.append("Quantify your internship achievements with specific metrics")
    
    if not projects:
        recommendations.append("Add relevant projects showcasing your technical skills")
    elif len(projects) < 3:
        recommendations.append("Consider adding more projects demonstrating your expertise")
    
    if not achievements:
        recommendations.append("Add quantifiable achievements and metrics to strengthen your impact")
    
    tech_categories = ['Programming Languages', 'Web Technologies', 'Database', 'Cloud & DevOps']
    missing_tech = [cat for cat in tech_categories if cat in skill_gaps and skill_gaps[cat]]
    
    if missing_tech:
        for category in missing_tech[:2]:
            gaps = skill_gaps[category][:3]
            if gaps:
                recommendations.append(f"Add {category} skills: {', '.join(gaps)}")
    
    if len(resume_text.split()) < 200:
        recommendations.append("Your resume seems concise - consider adding more detail to your experiences")
    
    response = {
        "jd_match": f"{match_percentage}%",
        "profile_summary": profile_summary if profile_summary else "No profile information available",
        "key_strengths": key_strengths,
        "missing_keywords": missing_keywords[:5],
        "education": education.strip().capitalize() if education else "No education details found",
        "experience": experience.strip().capitalize() if experience else "No experience details found",
        "projects": projects,
        "achievements": achievements,
        "category_matches": category_matches,
        "skill_gaps": skill_gaps,
        "recommendations": recommendations
    }
    
    return response

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "ATS Resume Analyzer API is running", "status": "healthy"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    """
    Analyze resume against job description
    
    - **job_description**: The job description text
    - **resume**: PDF file of the resume
    """
    # Validate file type
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Read PDF content
    pdf_bytes = await resume.read()
    
    # Validate file size (10MB limit)
    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    # Extract text from PDF
    try:
        resume_text = extract_pdf_text(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")
    
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded PDF does not contain readable text")
    
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")
    
    # Get ATS feedback
    try:
        feedback = get_ats_feedback(resume_text, job_description)
        return AnalysisResponse(**feedback)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

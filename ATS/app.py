import streamlit as st

# Configure the Streamlit page settings
st.set_page_config(
    page_title="AI Resume Evaluator | ATS Scanner", 
    layout="wide",               
    initial_sidebar_state="collapsed"  
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    /* CSS Variables - Design Tokens */
    :root {
        --primary-600: #4f46e5;
        --primary-700: #4338ca;
        --primary-50: #eef2ff;
        --primary-100: #e0e7ff;
        --violet-50: #faf5ff;
        --violet-600: #7c3aed;
        --violet-700: #6d28d9;
        --success-500: #10b981;
        --success-50: #ecfdf5;
        --warning-500: #f59e0b;
        --warning-50: #fffbeb;
        --error-500: #ef4444;
        --error-50: #fef2f2;
        --neutral-50: #fafafa;
        --neutral-100: #f5f5f5;
        --neutral-200: #e5e5e5;
        --neutral-300: #d4d4d4;
    --neutral-400: #555555;
    --neutral-500: #333333;
    --neutral-600: #111111;
    --neutral-700: #0a0a0a;
    --neutral-900: #000000;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-xl: 16px;
        --radius-full: 9999px;
    }
    
    /* Global Resets */
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Main App Container */
    .stApp {
        background: var(--neutral-50);
    }
    
    .main .block-container {
        max-width: 1280px;
        padding: 2rem 1.5rem;
        margin: 0 auto;
    }
    
    /* Header Section */
    .app-header {
        text-align: center;
        padding: 3rem 1rem 2rem;
        margin-bottom: 3rem;
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%);
        border-radius: var(--radius-xl);
        position: relative;
        overflow: hidden;
    }
    
    .app-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.4;
    }
    
    .app-header-content {
        position: relative;
        z-index: 1;
    }
    
    .app-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.025em;
    }
    
    .app-subtitle {
        font-size: 1.125rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
    }
    
    /* Input Section */
    .input-section {
        background: white;
        border-radius: var(--radius-xl);
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: var(--shadow-md);
    }
    
    .section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--neutral-700);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }
    
    .section-helper {
        font-size: 0.875rem;
        color: #000000;
        margin-bottom: 1rem;
    }
    
    /* Text Area Styling */
    .stTextArea > label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--neutral-700);
        margin-bottom: 0.5rem;
    }
    
    .stTextArea textarea {
        border-radius: var(--radius-md) !important;
        border: 1.5px solid var(--neutral-200) !important;
        font-size: 0.9375rem !important;
        line-height: 1.6 !important;
        transition: all 0.2s ease !important;
        background: white !important;
        padding: 1rem !important;
        color: #000000 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    
    .stTextArea textarea::placeholder {
        color: var(--neutral-400) !important;
    }
    
    .stTextArea textarea:focus {
        border-color: var(--primary-600) !important;
        box-shadow: 0 0 0 3px var(--primary-50) !important;
        outline: none !important;
    }
    
    /* File Uploader */
    [data-testid="stFileUploader"] {
        background: linear-gradient(135deg, var(--primary-50) 0%, var(--violet-50) 100%);
        padding: 2rem;
        border-radius: var(--radius-lg);
        border: 2px dashed var(--primary-600);
        transition: all 0.3s ease;
        position: relative;
    }
    
    [data-testid="stFileUploader"]:hover {
        border-color: var(--violet-600);
        background: linear-gradient(135deg, var(--primary-100) 0%, rgba(124, 58, 237, 0.1) 100%);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    [data-testid="stFileUploader"] section {
        border: none !important;
        padding: 1.5rem !important;
        background: transparent !important;
    }
    
    [data-testid="stFileUploader"] section > div {
        text-align: center;
    }

    [data-testid="stFileUploader"] p,
    [data-testid="stFileUploader"] span,
    [data-testid="stFileUploader"] label,
    [data-testid="stFileUploader"] small {
        color: #1e3a8a !important;
        font-weight: 600 !important;
    }

    [data-testid="stFileUploader"] p {
        font-size: 1rem !important;
    }

    [data-testid="stFileUploader"] small {
        font-size: 0.875rem !important;
    }

    [data-testid="stFileUploader"] svg path,
    [data-testid="stFileUploader"] svg circle {
        stroke: #1e3a8a !important;
        fill: transparent !important;
    }

    [data-testid="stFileUploader"] svg rect {
        stroke: transparent !important;
        fill: transparent !important;
    }
    
    /* File uploader text */
    [data-testid="stFileUploader"] small {
        color: var(--neutral-600) !important;
        font-size: 0.875rem !important;
    }
    
    /* Upload button */
    [data-testid="stFileUploader"] button {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: var(--radius-md) !important;
        padding: 0.75rem 2rem !important;
        font-weight: 600 !important;
        font-size: 0.9375rem !important;
        transition: all 0.2s ease !important;
        box-shadow: var(--shadow-sm) !important;
        margin: 0.5rem auto !important;
        display: inline-block !important;
    }
    
    [data-testid="stFileUploader"] button:hover {
        background: linear-gradient(135deg, var(--primary-700) 0%, var(--violet-700) 100%) !important;
        transform: translateY(-1px);
        box-shadow: var(--shadow-md) !important;
    }
    
    /* Uploaded file display */
    [data-testid="stFileUploader"] [data-testid="stFileUploaderFileName"] {
        background: white !important;
        border-radius: var(--radius-md) !important;
        padding: 0.75rem 1rem !important;
        border: 1px solid var(--neutral-200) !important;
        color: var(--neutral-900) !important;
        font-weight: 500 !important;
    }
    
    /* Delete button for uploaded file */
    [data-testid="stFileUploader"] [data-testid="stFileUploaderDeleteBtn"] {
        background: var(--error-50) !important;
        color: var(--error-500) !important;
        border-radius: var(--radius-md) !important;
        padding: 0.5rem !important;
    }
    
    [data-testid="stFileUploader"] [data-testid="stFileUploaderDeleteBtn"]:hover {
        background: var(--error-500) !important;
        color: white !important;
    }
    
    /* Primary Button */
    .stButton > button {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--violet-600) 100%) !important;
        color: white !important;
        border: none !important;
        padding: 1rem 2.5rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        border-radius: var(--radius-full) !important;
        transition: all 0.2s ease !important;
        box-shadow: var(--shadow-md) !important;
        width: auto !important;
        letter-spacing: 0.01em;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: var(--shadow-lg) !important;
    }
    
    .stButton > button:active {
        transform: translateY(0) !important;
    }
    
    /* Hero Score Card */
    .hero-score-card {
        background: white;
        border-radius: var(--radius-xl);
        padding: 2.5rem;
        margin: 2rem 0;
        box-shadow: var(--shadow-xl);
        text-align: center;
        border: 1px solid var(--neutral-200);
    }
    
    .score-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    
    .score-circle {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        margin: 1.5rem auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3.5rem;
        font-weight: 800;
        color: white;
        position: relative;
        box-shadow: var(--shadow-xl);
    }
    
    .score-circle::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        padding: 4px;
        background: linear-gradient(135deg, var(--primary-600), var(--violet-600));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.3;
    }
    
    .score-label {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 1rem 0 0.5rem 0;
        color: var(--neutral-900);
    }
    
    .score-description {
        font-size: 1rem;
        color: var(--neutral-600);
        margin: 0;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background: transparent;
        border-bottom: 2px solid var(--neutral-200);
        padding: 0;
    }
    
    .stTabs [data-baseweb="tab"] {
        padding: 1rem 1.5rem;
        font-weight: 600;
        font-size: 0.9375rem;
        color: var(--neutral-600);
        background: transparent;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        transition: all 0.2s ease;
        border: none;
    }
    
    .stTabs [data-baseweb="tab"]:hover {
        background: var(--neutral-100);
        color: var(--neutral-900);
    }
    
    .stTabs [aria-selected="true"] {
        background: white !important;
        color: var(--primary-600) !important;
        border-bottom: 3px solid var(--primary-600);
    }
    
    .stTabs [data-baseweb="tab-panel"] {
        padding-top: 2rem;
    }
    
    /* Result Cards */
    .result-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--neutral-200);
        margin-bottom: 1rem;
        transition: all 0.2s ease;
        color: #000000;
    }
    
    .result-card:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--neutral-300);
    }
    
    .card-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #000000;
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Progress Bars */
    .stProgress > div {
        background-color: var(--neutral-200);
        border-radius: var(--radius-full);
        height: 8px;
    }
    
    .stProgress > div > div {
        border-radius: var(--radius-full);
        background: linear-gradient(90deg, var(--primary-600) 0%, var(--violet-600) 100%);
    }
    
    /* Skill Badge */
    .skill-badge {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0.25rem;
    }
    
    .skill-matched {
        background: var(--success-50);
        color: #047857;
    }
    
    .skill-missing {
        background: var(--error-50);
        color: #dc2626;
    }
    
    /* Alert Boxes */
    .stAlert {
        border-radius: var(--radius-md);
        border: 1px solid;
        padding: 1rem;
        font-size: 0.9375rem;
    }
    
    /* Recommendations List */
    .recommendation-item {
        background: var(--neutral-50);
        padding: 1rem;
        border-radius: var(--radius-md);
        border-left: 4px solid var(--primary-600);
        margin-bottom: 0.75rem;
        font-size: 0.9375rem;
        line-height: 1.6;
        color: #000000;
    }
    
    .recommendation-item strong {
        color: var(--primary-600);
        font-weight: 700;
    }
    
    /* Footer */
    .app-footer {
        text-align: center;
        padding: 2rem 1rem;
        margin-top: 4rem;
        border-top: 1px solid var(--neutral-200);
        color: var(--neutral-600);
        font-size: 0.875rem;
    }
    
    /* Hide Streamlit Elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .app-title {
            font-size: 1.875rem;
        }
        
        .score-circle {
            width: 140px;
            height: 140px;
            font-size: 2.5rem;
        }
        
        .main .block-container {
            padding: 1rem;
        }
        
        .input-section {
            padding: 1.5rem;
        }
        
        .stTabs [data-baseweb="tab"] {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
        }
    }
</style>
""", unsafe_allow_html=True)

import re
from collections import Counter

import PyPDF2 as pdf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords


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


@st.cache_resource
def ensure_nltk_resources():
    resources = {
        'tokenizers/punkt': 'punkt',
        'tokenizers/punkt_tab': 'punkt_tab',
        'corpora/stopwords': 'stopwords'
    }

    for resource_path, resource_name in resources.items():
        try:
            nltk.data.find(resource_path)
        except LookupError:
            with st.spinner(f'Downloading NLTK resource: {resource_name}...'):
                nltk.download(resource_name)

    return {
        'stop_words': set(stopwords.words('english'))
    }

NLTK_DATA = ensure_nltk_resources()
STOP_WORDS = NLTK_DATA['stop_words']

@st.cache_data
def extract_skills_and_keywords(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    
    categorized_skills = {category: {} for category in SKILL_CATEGORIES}
    
    def find_skill_variations(skill):
        variations = [skill]
        skill_variations = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'cpp': 'c++',
            'react': 'reactjs',
            'vue': 'vuejs',
            'node': 'nodejs',
            'aws': 'amazon web services',
            'ml': 'machine learning',
            'ai': 'artificial intelligence',
            'dl': 'deep learning',
            'nlp': 'natural language processing',
            'db': 'database',
            'ui': 'user interface',
            'ux': 'user experience',
            'api': 'application programming interface'
        }
        if skill in skill_variations:
            variations.append(skill_variations[skill])
        for abbr, full in skill_variations.items():
            if skill == full:
                variations.append(abbr)
        return variations
    
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            variations = find_skill_variations(skill)
            for variation in variations:
                pattern = r'\b' + re.escape(variation) + r'\b'
                matches = re.finditer(pattern, text)
                for match in matches:
                    context_start = max(0, match.start() - 50)
                    context_end = min(len(text), match.end() + 50)
                    context = text[context_start:context_end]
                    
                    confidence = 0.8  # Base confidence
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
    
    terms = [term for term, freq in term_freq.most_common(100) 
             if len(term) > 2 or freq > 2]  # Filter out short, infrequent terms
    
    categorized_skills = {k: [skill for skill, conf in v.items() if conf >= 0.8] 
                         for k, v in categorized_skills.items()}
    
    categorized_skills = {k: v for k, v in categorized_skills.items() if v}
    
    return terms, categorized_skills
def calculate_match_percentage(resume_text, jd_text):
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
                    1
                    for js in jd_skills
                    for rs in resume_skills
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
        print(f"Error in calculate_match_percentage: {str(e)}")
        return 50
def extract_pdf_text(uploaded_file):
    try:
        reader = pdf.PdfReader(uploaded_file)
        text = ""
        for page in reader.pages:
            try:
                extracted = page.extract_text() or ""
            except Exception:
                extracted = ""
            text += extracted + "\n"
        return text.strip()
    except Exception as error:
        st.error("Unable to read the PDF. Please make sure the file is not password protected or corrupted.")
        raise RuntimeError(f"PDF parsing failed: {error}")
def analyze_education(text):
    text_lower = text.lower()

    sentences = [sentence.strip() for sentence in sent_tokenize(text_lower)]
    edu_sentences = [s for s in sentences if any(term in s for term in EDUCATION_TERMS)]
    
    is_cs = any(term in text_lower for term in ['computer science', 'cs', 'information technology', 'it', 'software engineering'])
    
   
    if edu_sentences:
        main_edu = edu_sentences[0]  # Take the first education-related sentence
    
        if is_cs and 'computer science' not in main_edu and 'cs' not in main_edu:
            main_edu += ' (Computer Science/IT background)'
        return main_edu
    
    if is_cs:
        return "Computer Science/IT background detected"
    
    return ""

def analyze_experience(text):
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
        year_matches = re.findall(r'\d+\+?\s*(?:year|yr)', sentence)  # Match patterns like "5+ years" or "3 yr"
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

def get_key_strengths(resume_keywords, jd_keywords):
    strengths = list(set(resume_keywords) & set(jd_keywords))
    return sorted(strengths, key=lambda x: len(x), reverse=True)[:5]

def analyze_projects(text):
    text_lower = text.lower()
    sentences = [s.strip() for s in sent_tokenize(text_lower)]
    
    projects = [s for s in sentences if any(word in s for word in ['project', 'developed', 'built', 'created', 'implemented'])]
    return projects

def analyze_achievements(text):
    text_lower = text.lower()
    sentences = [s.strip() for s in sent_tokenize(text_lower)]
    
    achievements = [s for s in sentences if any(word in s for word in 
        ['achieved', 'awarded', 'won', 'recognized', 'selected', 'ranked', 'improved', 
         'increased', 'decreased', 'reduced', 'saved', 'delivered', 'led', 'managed'])]
    return achievements

@st.cache_data 
def get_ats_feedback(resume_text, jd_text):
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
    elif any(str(i) in experience.lower() for i in range(1, 6)):
        recommendations.append("Highlight leadership roles and team contributions in your experience")
    
    if not projects:
        recommendations.append("Add relevant projects showcasing your technical skills")
    elif len(projects) < 3:
        recommendations.append("Consider adding more projects demonstrating your expertise")
    
    if not achievements:
        recommendations.append("Add quantifiable achievements and metrics to strengthen your impact")
    
    tech_categories = ['Programming Languages', 'Web Technologies', 'Database', 'Cloud & DevOps']
    missing_tech = [cat for cat in tech_categories if cat in skill_gaps and skill_gaps[cat]]
    
    if missing_tech:
        for category in missing_tech[:2]:  # Suggest skills from top 2 categories
            gaps = skill_gaps[category][:3]  # Suggest top 3 missing skills
            if gaps:
                recommendations.append(f"Add {category} skills: {', '.join(gaps)}")
   
    if len(resume_text.split()) < 200:
        recommendations.append("Your resume seems concise - consider adding more detail to your experiences")
    
    response = {
        "JD Match": f"{match_percentage}%",
        "Profile Summary": profile_summary,
        "Key Strengths": key_strengths,
        "Missing Keywords": missing_keywords[:5],
        "Education": education.strip().capitalize() if education else "No education details found",
        "Experience": experience.strip().capitalize() if experience else "No experience details found",
        "Projects": projects[:3] if projects else [], 
        "Achievements": achievements[:3] if achievements else [], 
        "Category Matches": category_matches,
        "Skill Gaps": skill_gaps,
        "Recommendations": recommendations
    }
    
    return response

# Streamlit App Interface

# Header
st.markdown("""
    <div class="app-header">
        <div class="app-header-content">
            <h1 class="app-title">VerQ Resume Analyzer</h1>
            <p class="app-subtitle">Intelligent ATS Scanner · Match Analysis · Career Insights</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Input Section
st.markdown("""
    <div class="input-section">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e3a8a; margin: 0;">
                Get Started
            </h2>
            <p style="color: var(--neutral-600); margin-top: 0.5rem;">
                Upload your resume and paste the job description to receive instant insights
            </p>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Two-column input layout
col1, col2 = st.columns([1, 1], gap="large")

with col1:
    st.markdown("""
        <div class="section-title">📋 Job Description</div>
        <div class="section-helper">Paste the complete job posting or requirements</div>
    """, unsafe_allow_html=True)
    
    jd_input = st.text_area(
        "Job Description",
        height=320,
        placeholder="Paste the job description here...\n\nExample: We are looking for a Software Engineer with experience in Python, React, and cloud technologies...",
        label_visibility="collapsed"
    )

with col2:
    st.markdown("""
        <div class="section-title">📄 Resume Upload</div>
        <div class="section-helper">Upload your resume in PDF format (max 10MB)</div>
    """, unsafe_allow_html=True)
    
    uploaded_resume = st.file_uploader(
        "Upload Resume",
        type=["pdf"],
        label_visibility="collapsed",
        help="Only PDF files are accepted"
    )
    
    if not uploaded_resume:
        st.markdown("""
            <div style='background: white; padding: 1.25rem; border-radius: var(--radius-md); 
                 margin-top: 1rem; border: 1px solid var(--neutral-200);'>
                <div style='text-align: center; margin-bottom: 0.75rem;'>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C7 18.5304 7.21071 19.0391 7.58579 19.4142C7.96086 19.7893 8.46957 20 9 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V9C17 8.46957 16.7893 7.96086 16.4142 7.58579C16.0391 7.21071 15.5304 7 15 7H13V4C13 3.46957 12.7893 2.96086 12.4142 2.58579C12.0391 2.21071 11.5304 2 11 2H9C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V18Z" 
                    stroke="#1e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H15C15.5304 22 16.0391 21.7893 16.4142 21.4142C16.7893 21.0391 17 20.5304 17 20V18" 
                    stroke="#1e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div style='font-size: 0.875rem; color: #1e3a8a; line-height: 1.6;'>
                    <div style='font-weight: 600; color: #1e3a8a; margin-bottom: 0.5rem;'>
                        💡 Resume Best Practices
                    </div>
                    • Use a clean, ATS-friendly format<br>
                    • Include relevant keywords naturally<br>
                    • Quantify your achievements<br>
                    • Keep file size under 10MB
                </div>
            </div>
        """, unsafe_allow_html=True)
    else:
        # Show success message when file is uploaded
        st.markdown(f"""
            <div style='background: var(--success-50); padding: 1rem; border-radius: var(--radius-md); 
                 margin-top: 1rem; border: 1px solid var(--success-500);'>
                <div style='display: flex; align-items: center; gap: 0.5rem;'>
                    <span style='color: var(--success-500); font-size: 1.25rem;'>✓</span>
                    <div>
                        <div style='font-weight: 600; color: var(--success-500); font-size: 0.875rem;'>
                            Resume Uploaded Successfully
                        </div>
                        <div style='color: var(--neutral-600); font-size: 0.8125rem; margin-top: 0.25rem;'>
                            {uploaded_resume.name}
                        </div>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)

# Analyze button
st.markdown("<br>", unsafe_allow_html=True)
col1, col2, col3 = st.columns([1, 1, 1])
with col2:
    evaluate_btn = st.button("Analyze Resume", use_container_width=True, type="primary")

# Evaluate button and results display
if evaluate_btn:
    # Check if both inputs are provided
    if uploaded_resume and jd_input.strip():
        # Show loading spinner while processing
        with st.spinner("Analyzing Resume..."):
            try:
                resume_text = extract_pdf_text(uploaded_resume)
            except RuntimeError:
                st.stop()

            if not resume_text.strip():
                st.warning("The uploaded PDF does not contain readable text. Please verify the file and try again.")
                st.stop()

            ats_response = get_ats_feedback(resume_text, jd_input)

        if ats_response:
            results = ats_response
        else:
            st.error("❌ Could not generate ATS feedback. Please try again.")
            st.stop()
        
        # Display match percentage with enhanced design
        match_pct = float(results['JD Match'].strip('%'))
        match_pct = max(0.0, min(100.0, match_pct))
        results['JD Match'] = f"{match_pct}%"
        
        # Determine color and status based on score
        if match_pct >= 80:
            color = '#10b981'
            gradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            badge_bg = '#ecfdf5'
            badge_color = '#047857'
            status = 'Excellent Match'
            icon = '✓'
        elif match_pct >= 60:
            color = '#f59e0b'
            gradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            badge_bg = '#fffbeb'
            badge_color = '#d97706'
            status = 'Good Match'
            icon = '◐'
        else:
            color = '#ef4444'
            gradient = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            badge_bg = '#fef2f2'
            badge_color = '#dc2626'
            status = 'Needs Improvement'
            icon = '○'
        
        # Hero Score Card
        st.markdown(f"""
            <div class="hero-score-card">
                <div class="score-badge" style="background: {badge_bg}; color: {badge_color};">
                    {icon} {status}
                </div>
                <div class="score-circle" style="background: {gradient};">
                    {match_pct:.0f}%
                </div>
                <h2 class="score-label">ATS Match Score</h2>
                <p class="score-description">Based on skills, keywords, and experience alignment</p>
            </div>
        """, unsafe_allow_html=True)
        
        # Create three tabs for organized results display
        tab1, tab2, tab3 = st.tabs(["Overview", "Skills Analysis", "Recommendations"])
        
        # Tab 1: Overview - Display basic profile information
        with tab1:
            # Show profile summary in a card
            st.markdown("""
                <div class='result-card'>
                    <h3 class='card-title'>👤 Profile Summary</h3>
                </div>
            """, unsafe_allow_html=True)
            st.info(results['Profile Summary'])
            
            # Display education and experience in two columns
            st.markdown("<br>", unsafe_allow_html=True)
            col1, col2 = st.columns(2, gap="medium")
            with col1:
                st.markdown("""
                    <div class='result-card'>
                        <h3 class='card-title'>🎓 Education</h3>
                        <p style='font-size: 0.9375rem; color: var(--neutral-700); line-height: 1.6; margin: 0;'>
                """ + results['Education'] + """
                        </p>
                    </div>
                """, unsafe_allow_html=True)
            with col2:
                st.markdown("""
                    <div class='result-card'>
                        <h3 class='card-title'>💼 Experience</h3>
                        <p style='font-size: 0.9375rem; color: var(--neutral-700); line-height: 1.6; margin: 0;'>
                """ + results['Experience'] + """
                        </p>
                    </div>
                """, unsafe_allow_html=True)
            
            # Display projects and achievements if available
            if results['Projects'] or results['Achievements']:
                st.markdown("<br>", unsafe_allow_html=True)
                
                col1, col2 = st.columns(2, gap="medium")
                
                # Show top 3 projects
                with col1:
                    if results['Projects']:
                        st.markdown("""
                            <div class='result-card'>
                                <h3 class='card-title'>🚀 Notable Projects</h3>
                        """, unsafe_allow_html=True)
                        for i, project in enumerate(results['Projects'], 1):
                            st.markdown(f"""
                                <div style='padding: 0.75rem; margin-bottom: 0.5rem; background: var(--neutral-50); 
                                     border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                                    <small style='color: var(--neutral-600); font-weight: 600;'>Project {i}</small><br>
                                    <span style='color: var(--neutral-700); font-size: 0.875rem;'>{project.capitalize()}</span>
                                </div>
                            """, unsafe_allow_html=True)
                        st.markdown("</div>", unsafe_allow_html=True)
                
                # Show top 3 achievements
                with col2:
                    if results['Achievements']:
                        st.markdown("""
                            <div class='result-card'>
                                <h3 class='card-title'>🏆 Key Achievements</h3>
                        """, unsafe_allow_html=True)
                        for i, achievement in enumerate(results['Achievements'], 1):
                            st.markdown(f"""
                                <div style='padding: 0.75rem; margin-bottom: 0.5rem; background: var(--neutral-50); 
                                     border-radius: var(--radius-md); border-left: 3px solid var(--success-500);'>
                                    <small style='color: var(--neutral-600); font-weight: 600;'>Achievement {i}</small><br>
                                    <span style='color: var(--neutral-700); font-size: 0.875rem;'>{achievement.capitalize()}</span>
                                </div>
                            """, unsafe_allow_html=True)
                        st.markdown("</div>", unsafe_allow_html=True)
        
        # Tab 2: Skills Analysis - Show detailed skill matching and gaps
        with tab2:
            st.markdown("""
                <div class='result-card'>
                    <h3 class='card-title'>📊 Category-wise Skills Match</h3>
                    <p style='color: var(--neutral-600); margin: 0; font-size: 0.875rem;'>
                        Compare your skills against job requirements across different categories
                    </p>
                </div>
            """, unsafe_allow_html=True)
            
            # Display skill categories with match percentages
            for category, match in results['Category Matches'].items():
                safe_match = max(0.0, min(100.0, match))
                
                # Determine status and color
                if safe_match >= 80:
                    status_color = '#10b981'
                    status_bg = '#ecfdf5'
                    status_text = 'Strong'
                elif safe_match >= 60:
                    status_color = '#f59e0b'
                    status_bg = '#fffbeb'
                    status_text = 'Good'
                else:
                    status_color = '#ef4444'
                    status_bg = '#fef2f2'
                    status_text = 'Weak'
                
                st.markdown(f"""
                    <div style='margin: 1.5rem 0;'>
                        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;'>
                            <span style='font-weight: 600; font-size: 0.9375rem; color: var(--neutral-900);'>{category}</span>
                            <span style='background: {status_bg}; color: {status_color}; padding: 0.25rem 0.75rem; 
                                  border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 600;'>
                                {status_text} · {safe_match:.0f}%
                            </span>
                        </div>
                """, unsafe_allow_html=True)
                
                st.progress(safe_match/100)
                
                # Show missing skills in each category
                if category in results['Skill Gaps'] and results['Skill Gaps'][category]:
                    missing = results['Skill Gaps'][category][:5]  # Show max 5
                    st.markdown(f"""
                        <div style='margin-top: 0.5rem; font-size: 0.8125rem;'>
                            <span style='color: var(--neutral-600);'>Missing skills: </span>
                            <span style='color: {status_color};'>{', '.join(missing)}</span>
                        </div>
                    """, unsafe_allow_html=True)
                
                st.markdown("</div>", unsafe_allow_html=True)
            
            # Display strengths and areas for improvement side by side
            st.markdown("<br>", unsafe_allow_html=True)
            col1, col2 = st.columns(2, gap="medium")
            
            with col1:
                st.markdown("""
                    <div class='result-card' style='background: var(--success-50); border-color: var(--success-500);'>
                        <h3 class='card-title' style='color: var(--success-500);'>✓ Your Strengths</h3>
                    </div>
                """, unsafe_allow_html=True)
                if results['Key Strengths']:
                    for strength in results['Key Strengths']:
                        st.markdown(f"""
                            <span class='skill-badge skill-matched'>{strength}</span>
                        """, unsafe_allow_html=True)
                else:
                    st.markdown("<p style='color: var(--neutral-600); font-size: 0.875rem;'>No specific strengths identified</p>", unsafe_allow_html=True)
                    
            with col2:
                st.markdown("""
                    <div class='result-card' style='background: var(--warning-50); border-color: var(--warning-500);'>
                        <h3 class='card-title' style='color: var(--warning-500);'>+ Skills to Add</h3>
                    </div>
                """, unsafe_allow_html=True)
                if results['Missing Keywords']:
                    for keyword in results['Missing Keywords']:
                        st.markdown(f"""
                            <span class='skill-badge skill-missing'>{keyword}</span>
                        """, unsafe_allow_html=True)
                else:
                    st.markdown("<p style='color: var(--neutral-600); font-size: 0.875rem;'>All key areas covered!</p>", unsafe_allow_html=True)
        
        # Tab 3: Recommendations - Provide actionable feedback
        with tab3:
            st.markdown("""
                <div class='result-card'>
                    <h3 class='card-title'>🎯 Personalized Recommendations</h3>
                    <p style='color: var(--neutral-600); margin: 0; font-size: 0.875rem;'>
                        Actionable steps to improve your resume and increase your match score
                    </p>
                </div>
            """, unsafe_allow_html=True)
            
            # Show personalized recommendations with enhanced styling
            if results['Recommendations']:
                for i, rec in enumerate(results['Recommendations'], 1):
                    st.markdown(f"""
                        <div class='recommendation-item'>
                            <strong>#{i}</strong> {rec}
                        </div>
                    """, unsafe_allow_html=True)
            else:
                st.info("No specific recommendations at this time. Your resume looks solid!")
            
            # Display general resume improvement tips
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown("""
                <div class='result-card' style='background: linear-gradient(135deg, var(--primary-50) 0%, var(--violet-50) 100%); 
                     border: 1px solid var(--primary-100);'>
                    <h3 class='card-title' style='color: var(--primary-700);'>💎 ATS Optimization Tips</h3>
                    <div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;'>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>📝 Structure</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Use clear section headings like "Experience", "Education", and "Skills"
                            </div>
                        </div>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>🔑 Keywords</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Mirror job description language naturally throughout your resume
                            </div>
                        </div>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>📊 Metrics</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Quantify achievements with numbers, percentages, and outcomes
                            </div>
                        </div>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>✨ Format</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Keep formatting clean and simple - avoid tables, headers, footers
                            </div>
                        </div>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>🏅 Credentials</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Include relevant certifications, licenses, and professional development
                            </div>
                        </div>
                        <div style='background: white; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-600);'>
                            <div style='font-weight: 600; color: var(--neutral-900); margin-bottom: 0.5rem;'>📄 File Type</div>
                            <div style='font-size: 0.875rem; color: var(--neutral-600); line-height: 1.6;'>
                                Always save and submit as PDF to preserve formatting
                            </div>
                        </div>
                    </div>
                </div>
            """, unsafe_allow_html=True)
    # Show warning if inputs are missing
    else:
        st.markdown("""
            <div style='background: var(--warning-50); border: 1px solid var(--warning-500); 
                 border-radius: var(--radius-md); padding: 1.5rem; text-align: center; margin: 2rem 0;'>
                <div style='font-size: 1.5rem; margin-bottom: 0.5rem;'>⚠️</div>
                <div style='color: var(--warning-500); font-weight: 600; font-size: 1rem;'>
                    Missing Required Information
                </div>
                <div style='color: var(--neutral-600); font-size: 0.875rem; margin-top: 0.5rem;'>
                    Please upload your resume (PDF) and paste the job description to continue
                </div>
            </div>
        """, unsafe_allow_html=True)

# Footer
st.markdown("""
    <div class="app-footer">
        <div style='margin-bottom: 0.5rem;'>
            <strong style='background: linear-gradient(135deg, var(--primary-600), var(--violet-600)); 
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
                   background-clip: text; font-size: 1rem;'>
                AI Resume Evaluator
            </strong>
        </div>
        <div style='color: var(--neutral-500); font-size: 0.8125rem;'>
            Powered by Advanced Machine Learning & Natural Language Processing
        </div>
        <div style='margin-top: 0.75rem; color: var(--neutral-400); font-size: 0.75rem;'>
            © 2025 All rights reserved · Built with Streamlit
        </div>
    </div>
""", unsafe_allow_html=True)

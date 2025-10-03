import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Student/StudentDetailsForm.css';
import PersonalInfo from './Student-Detail-Components/PersonalInfo';
import Internships from './Student-Detail-Components/Internships';
import Volunteering from './Student-Detail-Components/Volunteering';
import Skills from './Student-Detail-Components/Skills';
import Projects from './Student-Detail-Components/Projects';
import Accomplishments from './Student-Detail-Components/Accomplishments';
import ExtraCurricular from './Student-Detail-Components/ExtraCurricular';
import Competitions from './Student-Detail-Components/Competitions';
import ProfilePicture from './Student-Detail-Components/ProfilePicture';
import Navigation from './Student-Detail-Components/Navigation';
import Progress from './Student-Detail-Components/Progress';

const StudentDetailsForm = ({ onFormSubmit }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [savedSections, setSavedSections] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      instituteRollNo: '',
    },
    internships: [{
      company: '',
      position: '',
      location: '',
      sector: '',
      startDate: '',
      endDate: '',
      stipend: ''
    }],
    volunteering: [{
      organization: '',
      location: '',
      sector: '',
      task: '',
      startDate: '',
      endDate: ''
    }],
    skills: [{ name: '', proficiency: '' }],
    projects: [{
      title: '',
      description: '',
      techStack: '',
      link: '',
      role: ''
    }],
    accomplishments: [{
      title: '',
      institution: '',
      type: '',
      description: '',
      date: '',
      rank: ''
    }],
    extraCurricular: [{
      activity: '',
      role: '',
      organization: '',
      duration: ''
    }],
    competitions: [{
      name: '',
      date: '',
      role: '',
      achievement: '',
      skills: ''
    }],
    profilePicture: null
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const newArray = [...formData[section]];
      newArray[index][field] = value;
      setFormData({ ...formData, [section]: newArray });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value }
      });
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const sections = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'internships', label: 'Internships' },
    { id: 'volunteering', label: 'Volunteering' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'accomplishments', label: 'Accomplishments' },
    { id: 'extraCurricular', label: 'Extra-Curricular Activities' },
    { id: 'competitions', label: 'Competitions & Events' },
    { id: 'profilePicture', label: 'Profile Picture' },
  ];

  const activeSectionIndex = sections.findIndex(section => section.id === activeSection);

  const addItem = (section) => {
    const sectionData = [...formData[section]];
    const emptyItem = Object.keys(sectionData[0]).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormData({ ...formData, [section]: [...sectionData, emptyItem] });
  };

  const removeItem = (section, index) => {
    const sectionData = [...formData[section]];
    if (sectionData.length > 1) {
      sectionData.splice(index, 1);
      setFormData({ ...formData, [section]: sectionData });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Only PNG, JPG, and JPEG files are allowed');
        return;
      }
      setFormData({
        ...formData,
        profilePicture: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if all sections are saved
      const unsavedSections = sections.filter(
        section => !savedSections.includes(section.id)
      );

      if (unsavedSections.length > 0) {
        alert(`Please save these sections first: ${unsavedSections.map(s => s.label).join(', ')}`);
        return;
      }

      // Final submission logic
      console.log('Final form data:', formData);

      if (onFormSubmit) {
        onFormSubmit();
      }

      alert('Profile completed successfully!');
      navigate('/default');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to complete profile. Please try again.');
    }
  };



  const handleSkipToDefault = () => {
    if (onFormSubmit) {
      onFormSubmit();
    }
    navigate('/default');
  };

  // fuunction to track saved sections
  const handleSectionSave = (sectionId) => {
    setSavedSections(prev => [...new Set([...prev, sectionId])]);
  };

  return (
    <div className={`profile-container ${darkMode ? 'dark-theme' : ''}`}>
      <Navigation
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setMenuOpen={setMenuOpen}
      />

      <Progress
        activeSectionIndex={activeSectionIndex}
        sections={sections}
      />

      <div className={menuOpen ? 'hidden' : ''}>
        {activeSection === 'personal' && (
          <PersonalInfo
            formData={formData.personal}
            handleInputChange={handleInputChange}
            onSave={() => handleSectionSave('personal')}
          />
        )}

        {activeSection === 'internships' && (
          <Internships
            internships={formData.internships}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'volunteering' && (
          <Volunteering
            volunteering={formData.volunteering}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'skills' && (
          <Skills
            skills={formData.skills}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'projects' && (
          <Projects
            projects={formData.projects}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'accomplishments' && (
          <Accomplishments
            accomplishments={formData.accomplishments}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'extraCurricular' && (
          <ExtraCurricular
            extraCurricular={formData.extraCurricular}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'competitions' && (
          <Competitions
            competitions={formData.competitions}
            handleInputChange={handleInputChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}

        {activeSection === 'profilePicture' && (
          <ProfilePicture
            profilePicture={formData.profilePicture}
            handleFileChange={handleFileChange}
            handleSkipToDefault={handleSkipToDefault}
          />
        )}

        <div className="navigation-buttons">
          {activeSectionIndex > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveSection(sections[activeSectionIndex - 1].id);
              }}
            >
              Previous
            </button>
          )}

          {activeSectionIndex < sections.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                setActiveSection(sections[activeSectionIndex + 1].id);
              }}
            >
              Next
            </button>
          ) : (
            <button type="submit">
              Submit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsForm;
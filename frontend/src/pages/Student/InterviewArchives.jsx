import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/InterviewArchives.css';

const InterviewArchives = () => {
  const { darkMode } = useContext(ThemeContext);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState({
    dsa: true,
    technical: true,
    aptitude: true,
    hr: true
  });

  // Sample data for interview questions organized by categories
  const interviewData = {
    dsa: [
      {
        id: 1,
        company: 'Google',
        year: 2023,
        topic: 'Data Structures',
        difficulty: 'Hard',
        question: 'Implement a balanced binary search tree with insert, delete, and search operations.',
        answer: 'The solution involves implementing AVL tree or Red-Black tree operations with proper rotations to maintain balance.'
      },
      {
        id: 2,
        company: 'Amazon',
        year: 2022,
        topic: 'Algorithms',
        difficulty: 'Medium',
        question: 'Find the longest substring without repeating characters.',
        answer: 'Use sliding window technique with hash set to track characters in current window.'
      },
      {
        id: 4,
        company: 'Google',
        year: 2023,
        topic: 'Algorithms',
        difficulty: 'Hard',
        question: 'Given a large social network, find the shortest path between two people.',
        answer: 'Bidirectional BFS is efficient for social network graphs.'
      },
      {
        id: 6,
        company: 'Apple',
        year: 2022,
        topic: 'Data Structures',
        difficulty: 'Medium',
        question: 'Implement a LRU (Least Recently Used) cache.',
        answer: 'Combine hash map with doubly linked list for O(1) operations.'
      },
      {
        id: 7,
        company: 'Uber',
        year: 2023,
        topic: 'Algorithms',
        difficulty: 'Hard',
        question: 'Find the median from a data stream.',
        answer: 'Use two heaps (max-heap for lower half, min-heap for upper half) to maintain median in O(log n) time.'
      },
      {
        id: 8,
        company: 'Adobe',
        year: 2022,
        topic: 'Data Structures',
        difficulty: 'Easy',
        question: 'Reverse a linked list.',
        answer: 'Iterate through the list and reverse the pointers. Can be done iteratively or recursively.'
      },
      {
        id: 9,
        company: 'Goldman Sachs',
        year: 2023,
        topic: 'Algorithms',
        difficulty: 'Medium',
        question: 'Count the number of ways to make change for a given amount.',
        answer: 'Dynamic programming solution with O(n*m) time complexity where n is amount and m is number of coins.'
      },
      {
        id: 14,
        company: 'LinkedIn',
        year: 2022,
        topic: 'Algorithms',
        difficulty: 'Medium',
        question: 'Given two sorted arrays, find the kth smallest element in their union.',
        answer: 'Use a modified binary search approach that compares elements at specific indices to eliminate half of the search space each time.'
      }
    ],
    technical: {
      'System Design': [
        {
          id: 3,
          company: 'Microsoft',
          year: 2023,
          topic: 'System Design',
          difficulty: 'Hard',
          question: 'Design a scalable URL shortening service like bit.ly.',
          answer: 'Discuss hash generation, database partitioning, caching, and rate limiting.'
        },
        {
          id: 5,
          company: 'Netflix',
          year: 2023,
          topic: 'System Design',
          difficulty: 'Hard',
          question: 'Design a recommendation system for movies.',
          answer: 'Discuss collaborative filtering, content-based filtering, and hybrid approaches with scalability considerations.'
        },
        {
          id: 12,
          company: 'Twitter',
          year: 2022,
          topic: 'System Design',
          difficulty: 'Medium',
          question: 'How would you design Twitter\'s trending topics feature?',
          answer: 'Use a distributed system with counters for hashtags, sliding time windows, and probabilistic data structures like Count-Min Sketch for efficiency.'
        }
      ],
      'Operating Systems': [
        {
          id: 10,
          company: 'Intel',
          year: 2022,
          topic: 'Operating Systems',
          difficulty: 'Hard',
          question: 'Explain how virtual memory works.',
          answer: 'Virtual memory allows processes to use more memory than physically available through paging/segmentation, with pages swapped to disk when needed.'
        }
      ],
      'Computer Architecture': [
        {
          id: 11,
          company: 'Nvidia',
          year: 2023,
          topic: 'Computer Architecture',
          difficulty: 'Hard',
          question: 'What are the differences between CPU and GPU architectures?',
          answer: 'CPUs have few complex cores optimized for sequential tasks, while GPUs have many simple cores optimized for parallel processing of similar operations.'
        }
      ],
      'Database': [
        {
          id: 13,
          company: 'Airbnb',
          year: 2023,
          topic: 'Database',
          difficulty: 'Medium',
          question: 'How would you optimize a slow SQL query?',
          answer: 'Analyze query plan, add proper indexes, rewrite query to avoid full table scans, consider denormalization, or add caching layer.'
        }
      ],
      'Security': [
        {
          id: 15,
          company: 'PayPal',
          year: 2023,
          topic: 'Security',
          difficulty: 'Hard',
          question: 'How would you prevent SQL injection in a web application?',
          answer: 'Use parameterized queries/prepared statements, input validation, principle of least privilege for database accounts, and ORM frameworks that handle sanitization.'
        }
      ]
    },
    aptitude: [
      {
        id: 16,
        company: 'TCS',
        year: 2022,
        topic: 'Quantitative',
        difficulty: 'Easy',
        question: 'If a train travels 300 km in 5 hours, what is its speed?',
        answer: 'Speed = Distance/Time = 300/5 = 60 km/h'
      },
      {
        id: 17,
        company: 'Infosys',
        year: 2023,
        topic: 'Logical',
        difficulty: 'Medium',
        question: 'Complete the series: 2, 6, 12, 20, 30, ...',
        answer: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, etc. Next number is 6×7=42.'
      },
      {
        id: 18,
        company: 'Wipro',
        year: 2022,
        topic: 'Verbal',
        difficulty: 'Easy',
        question: 'Choose the correct antonym of "EPHEMERAL": a) Eternal b) Temporary c) Fleeting d) Transient',
        answer: 'a) Eternal'
      },
      {
        id: 19,
        company: 'Accenture',
        year: 2023,
        topic: 'Quantitative',
        difficulty: 'Medium',
        question: 'A clock shows 2:15. What is the angle between the hour and minute hands?',
        answer: 'At 2:15, hour hand is at 67.5° (30° per hour + 0.5° per minute) and minute hand at 90°, so angle is 22.5°.'
      },
      {
        id: 20,
        company: 'Cognizant',
        year: 2022,
        topic: 'Logical',
        difficulty: 'Hard',
        question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
        answer: 'Yes, this is a classic syllogism where Bloops ⊂ Razzies ⊂ Lazzies implies Bloops ⊂ Lazzies.'
      },
      {
        id: 21,
        company: 'Microsoft',
        year: 2023,
        topic: 'Logic',
        difficulty: 'Easy',
        question: 'You have two eggs and a 100-story building. Find the highest floor from which an egg can be dropped without breaking.',
        answer: 'Optimal solution involves dropping first egg from floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, then linear search with second egg.'
      },
      {
        id: 22,
        company: 'Google',
        year: 2022,
        topic: 'Math',
        difficulty: 'Hard',
        question: 'Measure 45 minutes using two ropes that each take exactly 1 hour to burn, but burn at non-uniform rates.',
        answer: 'Light both ends of first rope and one end of second rope. When first rope burns out (30 min), light other end of second rope.'
      },
      {
        id: 23,
        company: 'Amazon',
        year: 2023,
        topic: 'Logic',
        difficulty: 'Medium',
        question: 'There are 3 mislabeled jars. One contains only apples, one only oranges, and one a mix. You can pick one fruit from one jar. How do you correctly label all jars?',
        answer: 'Pick from jar labeled "mix". If apple, it must be apples jar. Then the one labeled oranges must be mix (since it can\'t be oranges), and remaining is oranges.'
      },
      {
        id: 24,
        company: 'Goldman Sachs',
        year: 2022,
        topic: 'Probability',
        difficulty: 'Hard',
        question: 'What is the probability that two people in a room of 30 share the same birthday?',
        answer: 'Approximately 70.6%. Calculated as 1 - (365/365 × 364/365 × ... × 336/365).'
      },
      {
        id: 25,
        company: 'Facebook',
        year: 2023,
        topic: 'Logic',
        difficulty: 'Medium',
        question: 'You have 8 identical balls. One is slightly heavier. Find it using a balance scale in minimum weighings.',
        answer: 'Weigh 3 vs 3. If equal, weigh remaining 2. If not, take heavier 3 and weigh 1 vs 1. Maximum 2 weighings needed.'
      }
    ],
    hr: [
      {
        id: 26,
        company: 'Apple',
        year: 2023,
        topic: 'Projects',
        difficulty: 'Medium',
        question: 'Tell us about a challenging problem you faced in your project and how you solved it.',
        answer: 'Example answer could describe debugging a race condition in a distributed system.'
      },
      {
        id: 27,
        company: 'Amazon',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Medium',
        question: 'Describe a time you disagreed with your team and how you handled it.',
        answer: 'Example answer could focus on constructive conflict resolution.'
      },
      {
        id: 28,
        company: 'Facebook',
        year: 2023,
        topic: 'Projects',
        difficulty: 'Medium',
        question: 'What would you improve about your last project if you had more time?',
        answer: 'Example answer could discuss adding monitoring or improving test coverage.'
      },
      {
        id: 29,
        company: 'Google',
        year: 2022,
        topic: 'Behavioral',
        difficulty: 'Easy',
        question: 'Why do you want to work at our company?',
        answer: 'Should demonstrate research about the company and alignment with personal values/career goals.'
      },
      {
        id: 30,
        company: 'Microsoft',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Medium',
        question: 'Tell me about a time you failed and what you learned.',
        answer: 'Should show growth mindset, ability to learn from mistakes, and resilience.'
      },
      {
        id: 31,
        company: 'Netflix',
        year: 2022,
        topic: 'Culture Fit',
        difficulty: 'Hard',
        question: 'What does "freedom and responsibility" mean to you in a work context?',
        answer: 'Should demonstrate understanding of Netflix culture - autonomy with accountability, making informed decisions.'
      },
      {
        id: 32,
        company: 'Uber',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Medium',
        question: 'Describe a time you had to learn something new quickly.',
        answer: 'Example should show adaptability, learning strategies, and application of new knowledge.'
      },
      {
        id: 33,
        company: 'Adobe',
        year: 2022,
        topic: 'Projects',
        difficulty: 'Easy',
        question: 'Walk me through your favorite project in your portfolio.',
        answer: 'Should demonstrate clear communication, technical depth, and enthusiasm for the work.'
      },
      {
        id: 34,
        company: 'Goldman Sachs',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Hard',
        question: 'How do you prioritize when you have multiple urgent tasks?',
        answer: 'Should demonstrate systematic approach (e.g., Eisenhower matrix), communication skills, and stress management.'
      },
      {
        id: 35,
        company: 'Intel',
        year: 2022,
        topic: 'Career Goals',
        difficulty: 'Medium',
        question: 'Where do you see yourself in 5 years?',
        answer: 'Should show ambition aligned with company growth opportunities while being realistic.'
      },
      {
        id: 36,
        company: 'Nvidia',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Medium',
        question: 'Tell me about a time you had to persuade someone.',
        answer: 'Should demonstrate communication skills, empathy, and ability to build consensus.'
      },
      {
        id: 37,
        company: 'Twitter',
        year: 2022,
        topic: 'Ethics',
        difficulty: 'Hard',
        question: 'How would you handle a situation where you disagree with company policy?',
        answer: 'Should demonstrate professional approach - understanding rationale, constructive feedback channels, and ultimate respect for decisions.'
      },
      {
        id: 38,
        company: 'Airbnb',
        year: 2023,
        topic: 'Culture Fit',
        difficulty: 'Medium',
        question: 'What does "belonging" mean to you in a workplace?',
        answer: 'Should demonstrate understanding of inclusive culture and personal experiences with diversity.'
      },
      {
        id: 39,
        company: 'LinkedIn',
        year: 2022,
        topic: 'Behavioral',
        difficulty: 'Easy',
        question: 'How do you stay updated with technology trends?',
        answer: 'Example could include blogs, conferences, online courses, open source contributions, or professional networks.'
      },
      {
        id: 40,
        company: 'PayPal',
        year: 2023,
        topic: 'Behavioral',
        difficulty: 'Medium',
        question: 'Describe a time you went above and beyond for a customer or user.',
        answer: 'Should demonstrate customer-centric approach and creative problem solving.'
      }
    ]
  };

  // Filter questions based on active filters
  const filterQuestions = (questions) => {
    return questions.filter(q => {
      const matchesCompany = companyFilter === 'all' || q.company === companyFilter;
      const matchesYear = yearFilter === 'all' || q.year === parseInt(yearFilter);
      const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           q.company.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCompany && matchesYear && matchesDifficulty && matchesSearch;
    });
  };

  // Extract unique values for filters
  const getAllCompanies = () => {
    const allQuestions = [
      ...interviewData.dsa,
      ...Object.values(interviewData.technical).flat(),
      ...interviewData.aptitude,
      ...interviewData.hr
    ];
    return [...new Set(allQuestions.map(q => q.company))];
  };

  const getAllYears = () => {
    const allQuestions = [
      ...interviewData.dsa,
      ...Object.values(interviewData.technical).flat(),
      ...interviewData.aptitude,
      ...interviewData.hr
    ];
    return [...new Set(allQuestions.map(q => q.year))];
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
      <div className="breadcrumb-container">
        <div className="breadcrumbs">
          <span>Interview Archives</span>
        </div>
      </div>

      <div className={`interview-archives-container ${darkMode ? 'dark' : 'light'}`}>
        <p className="page-description">
          Browse through questions asked by companies in previous campus recruitment drives.
          Filter by category, company, or year to find relevant questions.
        </p>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search questions, topics, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`search-input ${darkMode ? 'dark' : 'light'}`}
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label class = "company-label">Company:</label>
            <select 
              value={companyFilter} 
              onChange={(e) => setCompanyFilter(e.target.value)}
              className={darkMode ? 'dark' : 'light'}
            >
              <option value="all">All Companies</option>
              {getAllCompanies().map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year:</label>
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className={darkMode ? 'dark' : 'light'}
            >
              <option value="all">All Years</option>
              {getAllYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty:</label>
            <select 
              value={difficultyFilter} 
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className={darkMode ? 'dark' : 'light'}
            >
              <option value="all">All Levels</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Sections */}
        <div className="sections-container">
          {/* DSA Section */}
          <div className={`section-card ${darkMode ? 'dark' : 'light'}`}>
            <div 
              className="section-header"
              onClick={() => toggleSection('dsa')}
            >
              <h2>Data Structures & Algorithms</h2>
              <span className="toggle-icon">
                {expandedSection.dsa ? '−' : '+'}
              </span>
            </div>
            {expandedSection.dsa && (
              <div className="questions-grid">
                {filterQuestions(interviewData.dsa).length > 0 ? (
                  filterQuestions(interviewData.dsa).map((q) => (
                    <div key={q.id} className={`question-card ${darkMode ? 'dark' : 'light'}`}>
                      <div className="question-header">
                        <span className="company-tag">{q.company}</span>
                        <span className="year-tag">{q.year}</span>
                        <span className={`difficulty-tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span className="topic-tag">{q.topic}</span>
                      </div>
                      <div className="question-content">
                        <h3>{q.question}</h3>
                        <div className="answer-section">
                          <details>
                            <summary>View Answer</summary>
                            <p>{q.answer}</p>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No DSA questions match your current filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Technical Section */}
          <div className={`section-card ${darkMode ? 'dark' : 'light'}`}>
            <div 
              className="section-header"
              onClick={() => toggleSection('technical')}
            >
              <h2>Technical (Core Subjects)</h2>
              <span className="toggle-icon">
                {expandedSection.technical ? '−' : '+'}
              </span>
            </div>
            {expandedSection.technical && (
              <div className="subsections-container">
                {Object.entries(interviewData.technical).map(([subcategory, questions]) => {
                  const filteredSubQuestions = filterQuestions(questions);
                  if (filteredSubQuestions.length === 0) return null;
                  
                  return (
                    <div key={subcategory} className="subsection">
                      <h3 className="subsection-title">{subcategory}</h3>
                      <div className="questions-grid">
                        {filteredSubQuestions.map((q) => (
                          <div key={q.id} className={`question-card ${darkMode ? 'dark' : 'light'}`}>
                            <div className="question-header">
                              <span className="company-tag">{q.company}</span>
                              <span className="year-tag">{q.year}</span>
                              <span className={`difficulty-tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                              <span className="topic-tag">{q.topic}</span>
                            </div>
                            <div className="question-content">
                              <h3>{q.question}</h3>
                              <div className="answer-section">
                                <details>
                                  <summary>View Answer</summary>
                                  <p>{q.answer}</p>
                                </details>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {Object.values(interviewData.technical).flatMap(q => filterQuestions(q)).length === 0 && (
                  <div className="no-results">
                    <p>No Technical questions match your current filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Aptitude Section */}
          <div className={`section-card ${darkMode ? 'dark' : 'light'}`}>
            <div 
              className="section-header"
              onClick={() => toggleSection('aptitude')}
            >
              <h2>Aptitude & Puzzles</h2>
              <span className="toggle-icon">
                {expandedSection.aptitude ? '−' : '+'}
              </span>
            </div>
            {expandedSection.aptitude && (
              <div className="questions-grid">
                {filterQuestions(interviewData.aptitude).length > 0 ? (
                  filterQuestions(interviewData.aptitude).map((q) => (
                    <div key={q.id} className={`question-card ${darkMode ? 'dark' : 'light'}`}>
                      <div className="question-header">
                        <span className="company-tag">{q.company}</span>
                        <span className="year-tag">{q.year}</span>
                        <span className={`difficulty-tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span className="topic-tag">{q.topic}</span>
                      </div>
                      <div className="question-content">
                        <h3>{q.question}</h3>
                        <div className="answer-section">
                          <details>
                            <summary>View Answer</summary>
                            <p>{q.answer}</p>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No Aptitude questions match your current filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HR Section */}
          <div className={`section-card ${darkMode ? 'dark' : 'light'}`}>
            <div 
              className="section-header"
              onClick={() => toggleSection('hr')}
            >
              <h2>HR & Behavioral</h2>
              <span className="toggle-icon">
                {expandedSection.hr ? '−' : '+'}
              </span>
            </div>
            {expandedSection.hr && (
              <div className="questions-grid">
                {filterQuestions(interviewData.hr).length > 0 ? (
                  filterQuestions(interviewData.hr).map((q) => (
                    <div key={q.id} className={`question-card ${darkMode ? 'dark' : 'light'}`}>
                      <div className="question-header">
                        <span className="company-tag">{q.company}</span>
                        <span className="year-tag">{q.year}</span>
                        <span className={`difficulty-tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span className="topic-tag">{q.topic}</span>
                      </div>
                      <div className="question-content">
                        <h3>{q.question}</h3>
                        <div className="answer-section">
                          <details>
                            <summary>View Answer</summary>
                            <p>{q.answer}</p>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No HR questions match your current filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewArchives;
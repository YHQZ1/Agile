import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaThumbsUp, FaThumbsDown, FaComment, FaBookmark, FaShare, FaEllipsisH, FaTimes } from 'react-icons/fa';
import '../../styles/Student/Forum.css';

const Forum = () => {
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabName] = useState("Forum");
  const [breadcrumbs] = useState([activeTabName]);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'Interview Prep',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Sample forum threads
  const [forumThreads, setForumThreads] = useState([
    // Same thread data...
    {
      id: 1,
      title: "How to prepare for Google SWE interviews?",
      author: "Rahul Patel",
      avatar: "RP",
      date: "2 hours ago",
      category: "Interview Prep",
      tags: ["Google", "SWE", "DSA"],
      content: "I have an interview in 3 weeks. What topics should I focus on for coding rounds?",
      upvotes: 24,
      downvotes: 2,
      comments: 12,
      isBookmarked: false,
      isAnnouncement: false,
    },
    {
      id: 2,
      title: "Amazon Internship Experience 2025",
      author: "Priya Sharma",
      avatar: "PS",
      date: "1 day ago",
      category: "Internships",
      tags: ["Amazon", "SDE Intern", "Experience"],
      content: "Sharing my interview experience and tips for Amazon's internship process.",
      upvotes: 45,
      downvotes: 1,
      comments: 18,
      isBookmarked: true,
      isAnnouncement: false,
    },
    {
      id: 3,
      title: "Important: Placement Drive Updates",
      author: "Admin",
      avatar: "AD",
      date: "3 days ago",
      category: "Announcements",
      tags: ["Placements", "Updates"],
      content: "Microsoft and Goldman Sachs are visiting next week. Check the schedule!",
      upvotes: 102,
      downvotes: 0,
      comments: 25,
      isBookmarked: false,
      isAnnouncement: true,
    },
    {
      id: 4,
      title: "Best resources for System Design?",
      author: "Amit Kumar",
      avatar: "AK",
      date: "5 days ago",
      category: "Study Resources",
      tags: ["System Design", "Books", "Courses"],
      content: "Looking for recommendations on books/videos for system design prep.",
      upvotes: 32,
      downvotes: 3,
      comments: 14,
      isBookmarked: false,
      isAnnouncement: false,
    },
  ]);

  // Detect when keyboard opens/closes (for mobile devices)
  useEffect(() => {
    // This works for iOS Safari and some Android browsers
    const detectKeyboard = () => {
      const isKeyboard = window.innerHeight < window.outerHeight * 0.75;
      setIsKeyboardVisible(isKeyboard);
    };

    window.addEventListener('resize', detectKeyboard);
    return () => window.removeEventListener('resize', detectKeyboard);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showNewThreadModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showNewThreadModal]);

  // Handle new thread input changes
  const handleNewThreadChange = (e) => {
    const { name, value } = e.target;
    setNewThread(prev => ({ ...prev, [name]: value }));
  };

  // Add tag to new thread
  const handleAddTag = () => {
    if (tagInput.trim() && !newThread.tags.includes(tagInput.trim())) {
      setNewThread(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag from new thread
  const handleRemoveTag = (tagToRemove) => {
    setNewThread(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Submit new thread
  const handleSubmitThread = (e) => {
    e.preventDefault();
    
    const newThreadObj = {
      id: Math.max(...forumThreads.map(t => t.id)) + 1,
      title: newThread.title,
      author: "Current User", // Replace with actual user data
      avatar: "CU",
      date: "Just now",
      category: newThread.category,
      tags: newThread.tags,
      content: newThread.content,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      isBookmarked: false,
      isAnnouncement: false
    };

    setForumThreads([newThreadObj, ...forumThreads]);
    setShowNewThreadModal(false);
    setNewThread({
      title: '',
      content: '',
      category: 'Interview Prep',
      tags: []
    });
  };

  // Handle upvote/downvote
  const handleVote = (id, type) => {
    console.log(`${type} thread ${id}`);
  };

  // Handle bookmark
  const toggleBookmark = (id) => {
    console.log(`Toggled bookmark for thread ${id}`);
  };

  // Filter threads based on active tab & search query
  const filteredThreads = forumThreads.filter(thread => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'announcements' && thread.isAnnouncement) || 
      thread.category.toLowerCase().includes(activeTab);
    
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Blur active element when modal opens to hide keyboard
  const openNewThreadModal = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
    setShowNewThreadModal(true);
  };

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Forum</span>
          </div>
        </div>
        <div className="forum-container">
          {/* Forum Header */}
          <div className="forum-header">
            <h1>Community Forum</h1>
            <p>Ask questions, share experiences, and connect with peers</p>
            
            {/* Search Bar */}
            <div className="forum-search">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Forum Tabs */}
          <div className="forum-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Threads
            </button>
            <button
              className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              Interview Prep
            </button>
            <button
              className={`tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
              onClick={() => setActiveTab('internships')}
            >
              Internships
            </button>
            <button
              className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              Announcements
            </button>
          </div>

          {/* Thread List */}
          <div className="thread-list">
            <AnimatePresence>
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    className={`thread-card ${thread.isAnnouncement ? 'announcement' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Thread content remains the same... */}
                    <div className="thread-header">
                      <div className="author-avatar">{thread.avatar}</div>
                      <div className="thread-meta">
                        <span className="author-name">{thread.author}</span>
                        <span className="thread-date">{thread.date}</span>
                        <span className="thread-category">{thread.category}</span>
                      </div>
                      {thread.isAnnouncement && (
                        <div className="announcement-badge">Announcement</div>
                      )}
                    </div>

                    <div className="thread-content">
                      <h3>{thread.title}</h3>
                      <p>{thread.content}</p>
                      <div className="thread-tags">
                        {thread.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="thread-actions">
                      <div className="vote-buttons">
                        <button onClick={() => handleVote(thread.id, 'upvote')}>
                          <FaThumbsUp /> {thread.upvotes}
                        </button>
                        <button onClick={() => handleVote(thread.id, 'downvote')}>
                          <FaThumbsDown /> {thread.downvotes}
                        </button>
                      </div>
                      <div className="comment-count">
                        <FaComment /> {thread.comments}
                      </div>
                      <div className="action-buttons">
                        <button 
                          className={`bookmark-btn ${thread.isBookmarked ? 'active' : ''}`}
                          onClick={() => toggleBookmark(thread.id)}
                        >
                          <FaBookmark />
                        </button>
                        <button className="share-btn">
                          <FaShare />
                        </button>
                        <button className="more-btn">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-threads"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p>No threads found. Start a new discussion!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Create New Thread Button */}
          <motion.button
            className="create-thread-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openNewThreadModal}
          >
            + New Thread
          </motion.button>
        </div>

      {/* New Thread Modal - Improved for mobile */}
      <AnimatePresence>
        {showNewThreadModal && (
          <motion.div 
            className={`modal-overlay ${isKeyboardVisible ? 'keyboard-open' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewThreadModal(false)}
          >
            <motion.div 
              className="new-thread-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create New Thread</h2>
                <button 
                  className="close-modal"
                  onClick={() => setShowNewThreadModal(false)}
                  aria-label="Close modal"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmitThread}>
                <div className="form-group">
                  <label htmlFor="thread-title">Title</label>
                  <input
                    id="thread-title"
                    type="text"
                    name="title"
                    value={newThread.title}
                    onChange={handleNewThreadChange}
                    required
                    placeholder="What's your question or topic?"
                    autoComplete="off"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="thread-category">Category</label>
                  <select
                    id="thread-category"
                    name="category"
                    value={newThread.category}
                    onChange={handleNewThreadChange}
                    required
                  >
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Internships">Internships</option>
                    <option value="Study Resources">Study Resources</option>
                    <option value="Announcements">Announcements</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="thread-content">Content</label>
                  <textarea
                    id="thread-content"
                    name="content"
                    value={newThread.content}
                    onChange={handleNewThreadChange}
                    required
                    placeholder="Provide details about your question or topic..."
                    rows={4}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="thread-tags">Tags</label>
                  <div className="tags-input">
                    <input
                      id="thread-tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags (press Enter)"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      autoComplete="off"
                    />
                    <button 
                      type="button" 
                      className="add-tag-btn"
                      onClick={handleAddTag}
                    >
                      Add
                    </button>
                  </div>
                  <div className="tags-list">
                    {newThread.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Remove tag ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowNewThreadModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="submit-btn"
                  >
                    Post Thread
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forum;
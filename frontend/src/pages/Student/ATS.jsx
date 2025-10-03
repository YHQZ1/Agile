import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/ATS.css';

const MockInterviews = () => {
  const { darkMode } = useContext(ThemeContext);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
      {/* <div className="iframe-wrapper"> */}
        {!iframeLoaded && (
          <div className="iframe-loading">
            Loading ATS Evaluator...
          </div>
        )}
        <iframe
          src="https://cnzlpos2vevrdvuczcl2kw.streamlit.app/?embed=true&hide_streamlit_footer=true"
          title="ATS Resume Evaluator"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
          className={`ats-iframe ${iframeLoaded ? 'visible' : 'hidden'}`}
        />
      {/* </div> */}
    </div>
  );
};

export default MockInterviews;
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "../../styles/Student/UpcomingDrives.css";

const upcomingDrives = [
  { 
    id: 1, 
    company: "Google", 
    role: "AI Engineer", 
    location: "Remote", 
    date: "April 5, 2025",
    stipend: "$120,000/year",
    prerequisites: "Strong DSA, Machine Learning, Python, TensorFlow",
    eligibility: "B.Tech/M.Tech in CS or related fields",
    applyLink: "https://careers.google.com/"
  },
  { 
    id: 2, 
    company: "Microsoft", 
    role: "Software Engineer", 
    location: "Bangalore, India", 
    date: "April 10, 2025",
    stipend: "₹18 LPA",
    prerequisites: "DSA, OOPS, System Design, C++, Java",
    eligibility: "B.Tech in CS, IT, or ECE",
    applyLink: "https://careers.microsoft.com/"
  },
  { 
    id: 3, 
    company: "Amazon", 
    role: "Cloud Engineer", 
    location: "Seattle, USA", 
    date: "April 15, 2025",
    stipend: "$130,000/year",
    prerequisites: "AWS, Docker, Kubernetes, Cloud Security",
    eligibility: "Bachelor's/Master's in CS or related fields",
    applyLink: "https://www.amazon.jobs/"
  },
  { 
    id: 4, 
    company: "Apple", 
    role: "iOS Developer", 
    location: "San Francisco, USA", 
    date: "April 20, 2025",
    stipend: "$140,000/year",
    prerequisites: "Swift, Xcode, UIKit, Core Data",
    eligibility: "Bachelor's in CS, Software Engineering",
    applyLink: "https://jobs.apple.com/"
  },
  { 
    id: 5, 
    company: "Netflix", 
    role: "Full Stack Developer", 
    location: "Los Angeles, USA", 
    date: "April 25, 2025",
    stipend: "$135,000/year",
    prerequisites: "React, Node.js, Express, MongoDB",
    eligibility: "Bachelor's in CS or related field",
    applyLink: "https://jobs.netflix.com/"
  },
  { 
    id: 6, 
    company: "Meta", 
    role: "Machine Learning Engineer", 
    location: "Menlo Park, USA", 
    date: "April 30, 2025",
    stipend: "$145,000/year",
    prerequisites: "Deep Learning, NLP, PyTorch, TensorFlow",
    eligibility: "B.Tech/M.Tech in CS or AI fields",
    applyLink: "https://www.metacareers.com/"
  },
  { 
    id: 7, 
    company: "Tesla", 
    role: "Embedded Systems Engineer", 
    location: "Palo Alto, USA", 
    date: "May 5, 2025",
    stipend: "$125,000/year",
    prerequisites: "Embedded C, IoT, Microcontrollers, PCB Design",
    eligibility: "B.E./B.Tech in ECE, CS, or related fields",
    applyLink: "https://www.tesla.com/careers"
  },
  { 
    id: 8, 
    company: "Adobe", 
    role: "UI/UX Designer", 
    location: "Noida, India", 
    date: "May 10, 2025",
    stipend: "₹15 LPA",
    prerequisites: "Figma, Adobe XD, Wireframing, Prototyping",
    eligibility: "B.Des, B.Tech in CS, or related design fields",
    applyLink: "https://www.adobe.com/careers"
  },
  { 
    id: 9, 
    company: "IBM", 
    role: "Cloud Security Engineer", 
    location: "Bangalore, India", 
    date: "May 15, 2025",
    stipend: "₹20 LPA",
    prerequisites: "Cloud Security, DevSecOps, Penetration Testing",
    eligibility: "B.Tech/M.Tech in CS, Cybersecurity",
    applyLink: "https://www.ibm.com/employment"
  },
  { 
    id: 10, 
    company: "Salesforce", 
    role: "CRM Developer", 
    location: "San Francisco, USA", 
    date: "May 20, 2025",
    stipend: "$130,000/year",
    prerequisites: "Salesforce, Apex, Lightning Framework, JavaScript",
    eligibility: "B.Tech in CS or Software Engineering",
    applyLink: "https://www.salesforce.com/company/careers/"
  }
];

function UpcomingDrives() {
  const [activeTab] = useState("Upcoming Drives");
  const [breadcrumbs] = useState([activeTab]);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Upcoming Drives</span>
          </div>
        </div>
        <div className="drives-container">
          <div className="header-section">
            <p className="drives-subtitle">Explore upcoming opportunities from top companies</p>
          </div>

          <div className="grid-container">
            {upcomingDrives.map((drive) => (
              <div key={drive.id} className="grid-card">
                <h3>{drive.company}</h3>
                <h5>{drive.role}</h5>
                <p><strong>Location:</strong> {drive.location}</p>
                <p><strong>Date:</strong> {drive.date}</p>
                <p><strong>Stipend:</strong> {drive.stipend}</p>
                <p><strong>Prerequisites:</strong> {drive.prerequisites}</p>
                <p><strong>Eligibility:</strong> {drive.eligibility}</p>
                <Link 
                    to={{
                        pathname: `/apply/${drive.id}`,
                        state: { 
                        jobData: drive,
                        from: 'ongoing-drives' 
                          }
                      }}
                    className="custom-button apply-button">
                    Apply Now
                    </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingDrives;
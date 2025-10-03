import React, { useState, useContext } from 'react';
import "../../styles/Student/Roadmaps.css";
import { ThemeContext } from '../../context/ThemeContext';

const RoadmapFeature = () => {
  // Data for all roadmaps
  const roleBasedRoadmaps = [
    { name: "Frontend Developer", url: "https://roadmap.sh/frontend" },
    { name: "Backend Developer", url: "https://roadmap.sh/backend" },
    { name: "DevOps Engineer", url: "https://roadmap.sh/devops" },
    { name: "Full Stack Developer", url: "https://roadmap.sh/full-stack" },
    { name: "AI Engineer", url: "https://roadmap.sh/ai-engineer" },
    { name: "Data Analyst", url: "https://roadmap.sh/data-analyst" },
    { name: "AI and Data Scientist", url: "https://roadmap.sh/ai-data-scientist" },
    { name: "Android Developer", url: "https://roadmap.sh/android" },
    { name: "iOS Developer", url: "https://roadmap.sh/ios" },
    { name: "PostgreSQL Developer", url: "https://roadmap.sh/postgresql" },
    { name: "Blockchain Developer", url: "https://roadmap.sh/blockchain" },
    { name: "QA Engineer", url: "https://roadmap.sh/qa" },
    { name: "Software Architect", url: "https://roadmap.sh/software-architect" },
    { name: "Cyber Security Specialist", url: "https://roadmap.sh/cyber-security" },
    { name: "UX Designer", url: "https://roadmap.sh/ux" },
    { name: "Game Developer", url: "https://roadmap.sh/game" },
    { name: "Technical Writer", url: "https://roadmap.sh/technical-writing" },
    { name: "MLOps Engineer", url: "https://roadmap.sh/mlops" },
    { name: "Product Manager", url: "https://roadmap.sh/product-manager" },
    { name: "Engineering Manager", url: "https://roadmap.sh/engineering-manager" },
    { name: "Developer Relations", url: "https://roadmap.sh/devrel" }
  ];

  const skillBasedRoadmaps = [
    { name: "Computer Science", url: "https://roadmap.sh/computer-science" },
    { name: "React", url: "https://roadmap.sh/react" },
    { name: "Vue", url: "https://roadmap.sh/vue" },
    { name: "Angular", url: "https://roadmap.sh/angular" },
    { name: "JavaScript", url: "https://roadmap.sh/javascript" },
    { name: "Node.js", url: "https://roadmap.sh/nodejs" },
    { name: "TypeScript", url: "https://roadmap.sh/typescript" },
    { name: "Python", url: "https://roadmap.sh/python" },
    { name: "SQL", url: "https://roadmap.sh/sql" },
    { name: "System Design", url: "https://roadmap.sh/system-design" },
    { name: "API Design", url: "https://roadmap.sh/api-design" },
    { name: "ASP.NET Core", url: "https://roadmap.sh/aspnet-core" },
    { name: "Java", url: "https://roadmap.sh/java" },
    { name: "C++", url: "https://roadmap.sh/cpp" },
    { name: "Flutter", url: "https://roadmap.sh/flutter" },
    { name: "Spring Boot", url: "https://roadmap.sh/spring-boot" },
    { name: "Go", url: "https://roadmap.sh/go" },
    { name: "Rust", url: "https://roadmap.sh/rust" },
    { name: "GraphQL", url: "https://roadmap.sh/graphql" },
    { name: "Design and Architecture", url: "https://roadmap.sh/design-architecture" },
    { name: "Design Systems", url: "https://roadmap.sh/design-systems" },
    { name: "React Native", url: "https://roadmap.sh/react-native" },
    { name: "AWS", url: "https://roadmap.sh/aws" },
    { name: "Code Review", url: "https://roadmap.sh/code-review" },
    { name: "Docker", url: "https://roadmap.sh/docker" },
    { name: "Kubernetes", url: "https://roadmap.sh/kubernetes" },
    { name: "Linux", url: "https://roadmap.sh/linux" },
    { name: "MongoDB", url: "https://roadmap.sh/mongodb" },
    { name: "Prompt Engineering", url: "https://roadmap.sh/prompt-engineering" },
    { name: "Terraform", url: "https://roadmap.sh/terraform" },
    { name: "Data Structures & Algorithms", url: "https://roadmap.sh/dsa" },
    { name: "Git and GitHub", url: "https://roadmap.sh/git" },
    { name: "Redis", url: "https://roadmap.sh/redis" },
    { name: "PHP", url: "https://roadmap.sh/php" },
    { name: "Cloudflare", url: "https://roadmap.sh/cloudflare" }
  ];

  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
      <div className="breadcrumb-container">
        <div className="breadcrumbs">
          <span>Developer Roadmaps</span>
        </div>
      </div>

      <div className="roadmaps-container">
        <p className="subtitle">Browse through comprehensive roadmaps to guide your learning journey</p>

        <section className="roadmap-section">
          <h2 className="section-title">Role-based Roadmaps</h2>
          <div className="grid-container">
            {roleBasedRoadmaps.map((roadmap) => (
              <RoadmapCard 
                key={roadmap.name} 
                name={roadmap.name} 
                url={roadmap.url} 
              />
            ))}
          </div>
        </section>

        <section className="roadmap-section">
          <h2 className="section-title">Skill-based Roadmaps</h2>
          <div className="grid-container">
            {skillBasedRoadmaps.map((roadmap) => (
              <RoadmapCard 
                key={roadmap.name} 
                name={roadmap.name} 
                url={roadmap.url}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// RoadmapCard component remains the same
const RoadmapCard = ({ name, url, delay }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="grid-card" style={{ animationDelay: `${delay}s` }}>
      <h3>{name}</h3>
      <div className="card-footer">
        <span className="explore-link">
          Explore Roadmap <span className="arrow">→</span>
        </span>
      </div>
    </a>
  );
};


export default RoadmapFeature;
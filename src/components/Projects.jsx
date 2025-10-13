import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        fetchProjects();
        setNewProject({ name: '', description: '', imageUrl: '' });
      } else {
        console.error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="projects-container">
      <h2>Projects</h2>
      <div className="add-project-form">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={newProject.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={newProject.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newProject.imageUrl}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project._id} className="project-item">
            <img src={project.imageUrl} alt={project.name} />
            <div className="project-details">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

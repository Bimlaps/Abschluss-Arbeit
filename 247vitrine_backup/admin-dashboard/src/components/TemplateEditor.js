import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: '',
    thumbnail: '',
    html: '',
    css: '',
    js: ''
  });
  const [activeTab, setActiveTab] = useState('html');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (id === 'new') {
          setTemplate({
            name: '',
            description: '',
            category: '',
            thumbnail: 'https://via.placeholder.com/300x200',
            html: '<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a new template.</p>\n</div>',
            css: 'body {\n  font-family: Arial, sans-serif;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}',
            js: '// JavaScript code here'
          });
          setLoading(false);
        } else {
          const response = await axios.get(`${API_URL}/api/templates/${id}`);
          setTemplate(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value) => {
    setTemplate(prev => ({ ...prev, [activeTab]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await axios.post(`${API_URL}/api/templates`, template);
      } else {
        await axios.put(`${API_URL}/api/templates/${id}`, template);
      }
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="template-editor">
      <h2>{id === 'new' ? 'Create New Template' : 'Edit Template'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={template.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={template.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={template.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Thumbnail URL</label>
          <input
            type="text"
            name="thumbnail"
            value={template.thumbnail}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="editor-tabs">
          <button
            type="button"
            className={activeTab === 'html' ? 'active' : ''}
            onClick={() => setActiveTab('html')}
          >
            HTML
          </button>
          <button
            type="button"
            className={activeTab === 'css' ? 'active' : ''}
            onClick={() => setActiveTab('css')}
          >
            CSS
          </button>
          <button
            type="button"
            className={activeTab === 'js' ? 'active' : ''}
            onClick={() => setActiveTab('js')}
          >
            JavaScript
          </button>
        </div>
        
        <div className="editor-container">
          <Editor
            height="400px"
            language={activeTab}
            value={template[activeTab]}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        
        <div className="preview">
          <h3>Preview</h3>
          <iframe
            title="Template Preview"
            srcDoc={`
              <html>
                <head>
                  <style>${template.css}</style>
                </head>
                <body>
                  ${template.html}
                  <script>${template.js}</script>
                </body>
              </html>
            `}
            width="100%"
            height="400px"
          ></iframe>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/templates')}>Cancel</button>
          <button type="submit">Save Template</button>
        </div>
      </form>
    </div>
  );
}

export default TemplateEditor;

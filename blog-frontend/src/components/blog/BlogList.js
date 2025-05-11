import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './Blog.css';

const BlogList = ({ websiteId }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  const { isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        
        // Simuliere API-Aufruf mit Beispieldaten
        setTimeout(() => {
          const mockBlogPosts = [
            {
              _id: '1',
              title: 'Willkommen auf unserem Blog',
              summary: 'Dies ist unser erster Blog-Beitrag. Hier erfahren Sie mehr über unsere Dienstleistungen.',
              content: '# Willkommen\n\nDies ist unser erster Blog-Beitrag.',
              author: { firstName: 'Max', lastName: 'Mustermann' },
              createdAt: new Date().toISOString(),
              status: 'published',
              tags: ['Willkommen', 'Neuigkeiten'],
              categories: ['Allgemein']
            },
            {
              _id: '2',
              title: 'Unsere Dienstleistungen',
              summary: 'Erfahren Sie mehr über unsere Dienstleistungen und wie wir Ihnen helfen können.',
              content: '# Unsere Dienstleistungen\n\nWir bieten folgende Dienstleistungen an...',
              author: { firstName: 'Max', lastName: 'Mustermann' },
              createdAt: new Date().toISOString(),
              status: 'published',
              tags: ['Dienstleistungen', 'Angebote'],
              categories: ['Dienstleistungen']
            },
            {
              _id: '3',
              title: 'Neues Projekt abgeschlossen',
              summary: 'Wir haben ein neues Projekt erfolgreich abgeschlossen. Hier erfahren Sie mehr.',
              content: '# Neues Projekt\n\nWir haben ein neues Projekt erfolgreich abgeschlossen...',
              author: { firstName: 'Max', lastName: 'Mustermann' },
              createdAt: new Date().toISOString(),
              status: 'draft',
              tags: ['Projekte', 'Erfolge'],
              categories: ['Projekte']
            }
          ];
          
          setBlogPosts(mockBlogPosts);
          setPagination({
            page: 1,
            limit: 10,
            total: mockBlogPosts.length,
            pages: 1
          });
          setLoading(false);
        }, 1000);
        
        // Echter API-Aufruf (auskommentiert)
        /*
        const res = await axios.get(`/api/blog/website/${websiteId}`, {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            status: isAuthenticated ? undefined : 'published' // Nur veröffentlichte Beiträge für nicht angemeldete Benutzer
          }
        });
        
        setBlogPosts(res.data.blogPosts);
        setPagination(res.data.pagination);
        setLoading(false);
        */
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Fehler beim Laden der Blog-Beiträge');
        setLoading(false);
      }
    };
    
    if (websiteId) {
      fetchBlogPosts();
    }
  }, [websiteId, pagination.page, pagination.limit, isAuthenticated]);
  
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };
  
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      // Simuliere API-Aufruf
      // await axios.put(`/api/blog/${id}`, { status: newStatus });
      
      // Aktualisiere den Status in der lokalen Liste
      setBlogPosts(blogPosts.map(post => 
        post._id === id ? { ...post, status: newStatus } : post
      ));
    } catch (err) {
      console.error('Error toggling blog post status:', err);
      setError('Fehler beim Ändern des Status');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Blog-Beitrag löschen möchten?')) {
      try {
        // Simuliere API-Aufruf
        // await axios.delete(`/api/blog/${id}`);
        
        // Entferne den gelöschten Beitrag aus der lokalen Liste
        setBlogPosts(blogPosts.filter(post => post._id !== id));
      } catch (err) {
        console.error('Error deleting blog post:', err);
        setError('Fehler beim Löschen des Blog-Beitrags');
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Lädt Blog-Beiträge...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h2>Blog-Beiträge</h2>
        {isAuthenticated && (
          <Link to={`/blog/new?websiteId=${websiteId}`} className="btn btn-primary">
            Neuen Beitrag erstellen
          </Link>
        )}
      </div>
      
      {blogPosts.length === 0 ? (
        <div className="no-blog-posts">
          <p>Keine Blog-Beiträge gefunden.</p>
          {isAuthenticated && (
            <Link to={`/blog/new?websiteId=${websiteId}`} className="btn btn-outline">
              Ersten Blog-Beitrag erstellen
            </Link>
          )}
        </div>
      ) : (
        <div className="blog-posts-grid">
          {blogPosts.map(post => (
            <div key={post._id} className="blog-post-card">
              {post.featuredImage && (
                <div className="blog-post-image">
                  <img src={post.featuredImage} alt={post.title} />
                </div>
              )}
              
              <div className="blog-post-content">
                <h3 className="blog-post-title">
                  <Link to={`/blog/${post._id}`}>{post.title}</Link>
                </h3>
                
                <div className="blog-post-meta">
                  <span className="blog-post-date">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                  {post.author && (
                    <span className="blog-post-author">
                      von {post.author.firstName} {post.author.lastName}
                    </span>
                  )}
                  {isAuthenticated && (
                    <span className={`status-badge ${post.status === 'published' ? 'published' : 'draft'}`}>
                      {post.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  )}
                </div>
                
                <div className="blog-post-summary">
                  {post.summary}
                </div>
                
                <div className="blog-post-actions">
                  <Link to={`/blog/${post._id}`} className="btn btn-sm">
                    Weiterlesen
                  </Link>
                  
                  {isAuthenticated && (
                    <>
                      <Link to={`/blog/edit/${post._id}`} className="btn btn-sm btn-outline">
                        Bearbeiten
                      </Link>
                      <button 
                        className={`btn btn-sm ${post.status === 'published' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleStatusToggle(post._id, post.status)}
                      >
                        {post.status === 'published' ? 'Zurückziehen' : 'Veröffentlichen'}
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        Löschen
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-sm"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Zurück
          </button>
          
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`btn btn-sm ${pagination.page === page ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="btn btn-sm"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [commentStatus, setCommentStatus] = useState({
    submitting: false,
    success: false,
    error: ''
  });
  
  const { isAuthenticated, user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        
        const res = await axios.get(`/api/blog/${id}`);
        setBlogPost(res.data);
        
        // Wenn der Benutzer angemeldet ist, Formular vorausfüllen
        if (isAuthenticated && user) {
          setComment(prev => ({
            ...prev,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Fehler beim Laden des Blog-Beitrags');
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, isAuthenticated, user]);
  
  const handleCommentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setCommentStatus({
        submitting: true,
        success: false,
        error: ''
      });
      
      await axios.post(`/api/blog/${id}/comments`, comment);
      
      setCommentStatus({
        submitting: false,
        success: true,
        error: ''
      });
      
      // Formular zurücksetzen
      setComment({
        ...comment,
        content: ''
      });
      
      // Nach 3 Sekunden die Erfolgsmeldung ausblenden
      setTimeout(() => {
        setCommentStatus(prev => ({
          ...prev,
          success: false
        }));
      }, 3000);
    } catch (err) {
      console.error('Error submitting comment:', err);
      
      setCommentStatus({
        submitting: false,
        success: false,
        error: err.response?.data?.message || 'Fehler beim Senden des Kommentars'
      });
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Blog-Beitrag löschen möchten?')) {
      try {
        await axios.delete(`/api/blog/${id}`);
        navigate('/blog');
      } catch (err) {
        console.error('Error deleting blog post:', err);
        setError('Fehler beim Löschen des Blog-Beitrags');
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Lädt Blog-Beitrag...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!blogPost) {
    return <div className="not-found">Blog-Beitrag nicht gefunden</div>;
  }
  
  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <h1>{blogPost.title}</h1>
        
        <div className="blog-detail-meta">
          <span className="blog-detail-date">
            {new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString()}
          </span>
          {blogPost.author && (
            <span className="blog-detail-author">
              von {blogPost.author.firstName} {blogPost.author.lastName}
            </span>
          )}
          {isAuthenticated && (
            <span className={`status-badge ${blogPost.status === 'published' ? 'published' : 'draft'}`}>
              {blogPost.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
            </span>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="blog-detail-actions">
            <Link to={`/blog/edit/${blogPost._id}`} className="btn btn-primary">
              Bearbeiten
            </Link>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Löschen
            </button>
          </div>
        )}
      </div>
      
      {blogPost.featuredImage && (
        <div className="blog-detail-image">
          <img src={blogPost.featuredImage} alt={blogPost.title} />
        </div>
      )}
      
      <div 
        className="blog-detail-content"
        dangerouslySetInnerHTML={{ __html: blogPost.contentHtml }}
      />
      
      {blogPost.tags && blogPost.tags.length > 0 && (
        <div className="blog-detail-tags">
          <strong>Tags:</strong>
          {blogPost.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      
      <div className="blog-detail-comments">
        <h3>Kommentare ({blogPost.comments.filter(c => c.approved).length})</h3>
        
        {blogPost.comments.filter(c => c.approved).length === 0 ? (
          <p>Noch keine Kommentare. Hinterlassen Sie den ersten Kommentar!</p>
        ) : (
          <div className="comments-list">
            {blogPost.comments.filter(c => c.approved).map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <strong>{comment.name}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="comment-form-container">
          <h4>Kommentar hinterlassen</h4>
          
          {commentStatus.success && (
            <div className="success-message">
              Vielen Dank für Ihren Kommentar! Er wird nach Prüfung veröffentlicht.
            </div>
          )}
          
          {commentStatus.error && (
            <div className="error-message">
              {commentStatus.error}
            </div>
          )}
          
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={comment.name}
                onChange={handleCommentChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-Mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={comment.email}
                onChange={handleCommentChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Kommentar *</label>
              <textarea
                id="content"
                name="content"
                value={comment.content}
                onChange={handleCommentChange}
                required
                rows="5"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={commentStatus.submitting}
            >
              {commentStatus.submitting ? 'Wird gesendet...' : 'Kommentar senden'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

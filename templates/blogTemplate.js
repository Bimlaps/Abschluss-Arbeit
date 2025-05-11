/**
 * Generiert das HTML für die Blog-Übersichtsseite
 * @param {Array} blogPosts - Liste der Blog-Beiträge
 * @param {Object} website - Website-Daten
 * @returns {string} - HTML-Code für die Blog-Übersichtsseite
 */
exports.generateBlogListHTML = (blogPosts, website) => {
  return `
    <div class="blog-list">
      <h2>Blog</h2>
      
      <div class="blog-posts">
        ${blogPosts.map(post => `
          <div class="blog-post-card">
            ${post.featuredImage ? `
              <div class="blog-post-image">
                <img src="${post.featuredImage}" alt="${post.title}">
              </div>
            ` : ''}
            
            <div class="blog-post-content">
              <h3 class="blog-post-title">
                <a href="/blog/${post.slug}">${post.title}</a>
              </h3>
              
              <div class="blog-post-meta">
                <span class="blog-post-date">${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                ${post.author ? `<span class="blog-post-author">von ${post.author.firstName} ${post.author.lastName}</span>` : ''}
              </div>
              
              <div class="blog-post-summary">
                ${post.summary}
              </div>
              
              <a href="/blog/${post.slug}" class="blog-post-read-more">Weiterlesen</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

/**
 * Generiert das HTML für einen einzelnen Blog-Beitrag
 * @param {Object} blogPost - Blog-Beitrag-Daten
 * @param {Object} website - Website-Daten
 * @returns {string} - HTML-Code für den Blog-Beitrag
 */
exports.generateBlogPostHTML = (blogPost, website) => {
  return `
    <div class="blog-post">
      <h1 class="blog-post-title">${blogPost.title}</h1>
      
      <div class="blog-post-meta">
        <span class="blog-post-date">${new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString()}</span>
        ${blogPost.author ? `<span class="blog-post-author">von ${blogPost.author.firstName} ${blogPost.author.lastName}</span>` : ''}
      </div>
      
      ${blogPost.featuredImage ? `
        <div class="blog-post-featured-image">
          <img src="${blogPost.featuredImage}" alt="${blogPost.title}">
        </div>
      ` : ''}
      
      <div class="blog-post-content">
        ${blogPost.contentHtml}
      </div>
      
      ${blogPost.tags && blogPost.tags.length > 0 ? `
        <div class="blog-post-tags">
          <strong>Tags:</strong>
          ${blogPost.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
        </div>
      ` : ''}
      
      <div class="blog-post-comments">
        <h3>Kommentare (${blogPost.comments.filter(c => c.approved).length})</h3>
        
        ${blogPost.comments.filter(c => c.approved).map(comment => `
          <div class="comment">
            <div class="comment-header">
              <strong>${comment.name}</strong>
              <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="comment-content">
              ${comment.content}
            </div>
          </div>
        `).join('')}
        
        <div class="comment-form">
          <h4>Kommentar hinterlassen</h4>
          <form id="commentForm" data-post-id="${blogPost._id}">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="email">E-Mail *</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="content">Kommentar *</label>
              <textarea id="content" name="content" required></textarea>
            </div>
            
            <button type="submit" class="submit-button">Kommentar senden</button>
          </form>
          
          <div class="comment-success" style="display: none;">
            Vielen Dank für Ihren Kommentar! Er wird nach Prüfung veröffentlicht.
          </div>
          
          <div class="comment-error" style="display: none;">
            Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
          </div>
        </div>
      </div>
    </div>
    
    <script>
      document.getElementById('commentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = this;
        const postId = form.getAttribute('data-post-id');
        const submitButton = form.querySelector('.submit-button');
        const successMessage = document.querySelector('.comment-success');
        const errorMessage = document.querySelector('.comment-error');
        
        // Formular-Daten sammeln
        const formData = {
          name: form.name.value,
          email: form.email.value,
          content: form.content.value
        };
        
        // Button deaktivieren während des Sendens
        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet...';
        
        // Nachrichten zurücksetzen
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        try {
          // Anfrage senden
          const response = await fetch('/api/blog/' + postId + '/comments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          const result = await response.json();
          
          if (response.ok) {
            // Erfolgsfall
            successMessage.style.display = 'block';
            form.reset();
          } else {
            // Fehlerfall
            errorMessage.textContent = result.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
            errorMessage.style.display = 'block';
          }
        } catch (error) {
          // Netzwerkfehler oder andere Ausnahmen
          errorMessage.textContent = 'Es konnte keine Verbindung zum Server hergestellt werden. Bitte versuchen Sie es später erneut.';
          errorMessage.style.display = 'block';
          console.error('Kommentar-Fehler:', error);
        } finally {
          // Button wieder aktivieren
          submitButton.disabled = false;
          submitButton.textContent = 'Kommentar senden';
        }
      });
    </script>
  `;
};

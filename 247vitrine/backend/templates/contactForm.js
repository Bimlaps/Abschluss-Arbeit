/**
 * Generiert das HTML für ein Kontaktformular
 * @param {string} recipientEmail - E-Mail-Adresse des Empfängers
 * @returns {string} - HTML-Code für das Kontaktformular
 */
function generateContactForm(recipientEmail) {
  return `
    <div class="contact-form">
      <h3>Kontaktiere uns</h3>
      
      <div id="success-message" class="success-message" style="display: none;">
        <p>Vielen Dank für deine Nachricht! Wir werden uns so schnell wie möglich bei dir melden.</p>
        <button onclick="resetForm()">Neues Formular</button>
      </div>
      
      <form id="contact-form" onsubmit="submitContactForm(event)">
        <div class="form-group">
          <label for="name">Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-Mail *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Telefon</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone"
          />
        </div>
        
        <div class="form-group">
          <label for="message">Nachricht *</label>
          <textarea 
            id="message" 
            name="message" 
            required
          ></textarea>
        </div>
        
        <input type="hidden" id="recipient" name="recipient" value="${recipientEmail}" />
        
        <button 
          type="submit" 
          class="submit-button"
          id="submit-button"
        >
          Nachricht senden
        </button>
        
        <div id="error-message" class="error-message" style="display: none;">
          Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es später erneut.
        </div>
      </form>
    </div>
    
    <script>
      async function submitContactForm(event) {
        event.preventDefault();
        
        const submitButton = document.getElementById('submit-button');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        const form = document.getElementById('contact-form');
        
        // Deaktiviere den Submit-Button während des Sendens
        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet...';
        errorMessage.style.display = 'none';
        
        try {
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            recipient: document.getElementById('recipient').value
          };
          
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Zeige Erfolgsmeldung
            form.style.display = 'none';
            successMessage.style.display = 'block';
          } else {
            // Zeige Fehlermeldung
            errorMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Nachricht senden';
          }
        } catch (error) {
          console.error('Error sending message:', error);
          errorMessage.style.display = 'block';
          submitButton.disabled = false;
          submitButton.textContent = 'Nachricht senden';
        }
      }
      
      function resetForm() {
        const form = document.getElementById('contact-form');
        const successMessage = document.getElementById('success-message');
        const submitButton = document.getElementById('submit-button');
        
        // Formular zurücksetzen
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
        submitButton.disabled = false;
        submitButton.textContent = 'Nachricht senden';
      }
    </script>
  `;
}

module.exports = { generateContactForm };

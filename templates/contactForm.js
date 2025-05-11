/**
 * Generiert das HTML für ein Kontaktformular
 * @param {string} recipientEmail - E-Mail-Adresse des Empfängers
 * @returns {string} - HTML-Code für das Kontaktformular
 */
exports.generateContactForm = (recipientEmail) => {
  return `
    <div class="contact-form">
      <h3>Kontaktformular</h3>
      <div class="success-message" style="display: none;">
        Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.
      </div>
      <div class="error-message" style="display: none;">
        Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
      </div>
      <form id="contactForm">
        <input type="hidden" name="recipient" value="${recipientEmail}">
        
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
          <label for="email">E-Mail *</label>
          <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label for="phone">Telefon</label>
          <input type="tel" id="phone" name="phone">
        </div>
        
        <div class="form-group">
          <label for="message">Nachricht *</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        
        <button type="submit" class="submit-button">Nachricht senden</button>
      </form>
      
      <script>
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const form = this;
          const submitButton = form.querySelector('.submit-button');
          const successMessage = document.querySelector('.success-message');
          const errorMessage = document.querySelector('.error-message');
          
          // Formular-Daten sammeln
          const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
            recipient: form.recipient.value
          };
          
          // Button deaktivieren während des Sendens
          submitButton.disabled = true;
          submitButton.textContent = 'Wird gesendet...';
          
          // Nachrichten zurücksetzen
          successMessage.style.display = 'none';
          errorMessage.style.display = 'none';
          
          try {
            // Anfrage senden
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
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
            console.error('Kontaktformular-Fehler:', error);
          } finally {
            // Button wieder aktivieren
            submitButton.disabled = false;
            submitButton.textContent = 'Nachricht senden';
          }
        });
      </script>
    </div>
  `;
};

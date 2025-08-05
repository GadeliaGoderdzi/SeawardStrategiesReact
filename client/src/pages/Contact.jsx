import React from 'react';
import ContactForm from '../components/forms/ContactForm';

const Contact = () => {
  const handleContactSubmit = (formData) => {
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="contact">
      <div className="container">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <h3>Address</h3>
              <p>123 Main Street<br />City, State 12345</p>
            </div>
            <div className="info-item">
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>contact@example.com</p>
            </div>
          </div>
          <div className="contact-form-container">
            <ContactForm onSubmit={handleContactSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
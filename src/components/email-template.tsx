import React from 'react';
import type { EmailTemplateProps } from '../../types/types';

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    }}>
      <div style={{
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '20px',
        marginBottom: '20px',
      }}>
        <h1 style={{
          color: '#333333',
          fontSize: '24px',
          margin: '0',
        }}>New Contact Form Submission</h1>
      </div>
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>From:</strong> {name} ({email})
        </p>
      </div>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '5px',
      }}>
        <h2 style={{
          color: '#333333',
          fontSize: '18px',
          margin: '0 0 15px 0',
        }}>Message:</h2>
        <p style={{
          color: '#666666',
          lineHeight: '1.6',
          margin: '0',
          whiteSpace: 'pre-wrap',
        }}>{message}</p>
      </div>
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        fontSize: '12px',
        color: '#999999',
      }}>
        <p style={{ margin: '0' }}>
          This email was sent from the contact form on your website.
        </p>
      </div>
    </div>
  );
}

export function ConfirmationEmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    }}>
      <div style={{
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '20px',
        marginBottom: '20px',
      }}>
        <h1 style={{
          color: '#333333',
          fontSize: '24px',
          margin: '0',
        }}>Thank You for Contacting Us</h1>
      </div>
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          Dear {name},
        </p>
        <p style={{ margin: '0 0 15px 0', lineHeight: '1.6' }}>
          Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
        </p>
        <p style={{ margin: '0', lineHeight: '1.6' }}>
          For your reference, here&apos;s a copy of your message:
        </p>
      </div>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <p style={{
          color: '#666666',
          lineHeight: '1.6',
          margin: '0',
          whiteSpace: 'pre-wrap',
        }}>{message}</p>
      </div>
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        fontSize: '12px',
        color: '#999999',
      }}>
        <p style={{ margin: '0' }}>
          This is an automated confirmation email. Please do not reply to this message.
        </p>
      </div>
    </div>
  );
}

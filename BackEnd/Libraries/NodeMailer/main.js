
import { sendWelcomeEmail, sendPasswordResetEmail, sendPromotionalEmail } from './functions.js';

// Example usage
(async () => {
    try {
        // Send welcome email
        await sendWelcomeEmail('recipient@example.com', { name: 'John Doe', product: 'Our App' });

        // Send password reset email
        await sendPasswordResetEmail('recipient@example.com', { name: 'John Doe', resetLink: 'http://example.com/reset' });

        // Send promotional email
        await sendPromotionalEmail('recipient@example.com', { name: 'John Doe', offerDetails: '50% off on premium subscription!' });
    } catch (error) {
        console.error('Error sending email:', error);
    }
})();

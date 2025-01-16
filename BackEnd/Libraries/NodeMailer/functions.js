
import { transporter, defaultMailOptions } from './config.js';

// In template no need to import or provide path or anything nor .hbs
// As they will all be in the folder declared in the transpoter in config.js 
// However, If they are in nested folderes then write it as subfolder/template_name
// EX: If declared as my path is in templates folder and i have a sub folder called promotions nested in the templates folder and in that sub folder i have taxes.hbs then i will write in the template field promotions/taxes
// Function to send a welcome email
export const sendWelcomeEmail = async (recipientEmail, data) => {
    const mailOptions = {
        ...defaultMailOptions,
        to: recipientEmail,
        subject: 'Welcome to Our Service',
        template: 'welcome',
        context: {
            name: data.name,
            product: data.product,
        },
    };
    return transporter.sendMail(mailOptions);
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (recipientEmail, data) => {
    const mailOptions = {
        ...defaultMailOptions,
        to: recipientEmail,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context: {
            name: data.name,
            resetLink: data.resetLink,
        },
    };
    return transporter.sendMail(mailOptions);
};

// Function to send a promotional email
export const sendPromotionalEmail = async (recipientEmail, data) => {
    const mailOptions = {
        ...defaultMailOptions,
        to: recipientEmail,
        subject: 'Exciting Promotion Just for You!',
        template: 'promotion',
        context: {
            name: data.name,
            offerDetails: data.offerDetails,
        },
    };
    return transporter.sendMail(mailOptions);
};

// Template File Reference in `mailOptions`

// When using templates with nodemailer-express-handlebars, you don’t need to:
// - Import the template file.
// - Specify its full path.
// - Include the `.hbs` extension in the `template` field.
//
// Templates are automatically resolved based on the `viewPath` folder 
// declared in the transporter configuration. In these examples, the view Path is already configured to the templates folder. 

// Root-Level Templates:
// If the template file is directly in the `viewPath` folder, reference it 
// by its name only.
// Example: For `templates/welcome.hbs`, set `template: 'welcome'`.

// Nested Templates:
// If the template is in a subfolder within the `viewPath`, use the relative 
// folder structure to reference it.
// Example: If `taxes.hbs` is located in `templates/promotions`, 
// set `template: 'promotions/taxes'`.

// Example Folder Structure:
// templates/
// ├── welcome.hbs
// ├── password-reset.hbs
// └── promotions/
//     ├── taxes.hbs
//     └── offer.hbs

// Examples of Template Usage:
// - To use `welcome.hbs`: Set `template: 'welcome'`.
// - To use `taxes.hbs` inside `promotions`: Set `template: 'promotions/taxes'`.

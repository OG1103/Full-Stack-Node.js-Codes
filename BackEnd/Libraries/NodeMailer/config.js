import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

// Configuring the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set this in your .env file
    pass: process.env.EMAIL_PASS, // Set this in your .env file
  },
});

// Configure handlebars without layouts
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs", // File extension for Handlebars templates
      partialsDir: path.join(__dirname, "templates"), // Optional: Partials directory (if used)
      defaultLayout: false, // Disable layouts
    },
    viewPath: path.join(__dirname, "templates"), // Directory for templates
    extName: ".hbs", // Recognize .hbs extension
  })
);

// Default mail options
const defaultMailOptions = {
  from: "your-email@gmail.com",
};

export { transporter, defaultMailOptions };

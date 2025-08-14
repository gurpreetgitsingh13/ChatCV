ChatCV

ChatCV is a web application that lets you create a complete, well-formatted CV through a simple chat interface. As you answer questions, the resume preview updates in real time, and you can export it as a PDF or DOCX. The project combines a clean frontend with a functional backend so it can be used locally or deployed online.

Features

Conversational flow for collecting personal, education, work, and project details
Real-time A4 resume preview that updates as you type
Edit any section instantly using inline commands
Export options for DOCX (via python-docx) and PDF (browser print)
Simple deployment for both frontend and backend

Tech Stack

Frontend: HTML, CSS, Tailwind CSS, JavaScript
Backend: Python, Flask, flask-cors
Other: python-docx for document generation, JSON for data storage

Running Locally

Step 1) Go to the backend folder in the project and create a virtual environment.
Step 2) Activate the virtual environment.
Step 3) Install the required dependencies from the requirements.txt file.
Step 4) Run the server.py file in the backend folder to start the backend on your local machine.
Step 5) Open the index.html file inside the frontend folder directly in your browser, or run a simple local server to view it.
Step 6) The application will be ready to use with the frontend connected to the backend.

Deployment

Frontend can be hosted on Netlify, Vercel, or GitHub Pages.
Backend can be deployed to Render, Fly.io, or Heroku using the Python buildpack and pointing the start command to run the Flask application.

Data Entry Format

Work Experience: Company | Role | Dates | bullet one; bullet two; bullet three
Projects: Title | Stack | bullet one; bullet two
Education: School | Degree | Dates | Note
Edit Command: edit summary = Data analyst with fintech focus

Folder Structure

ChatCV/
frontend/
index.html
script.js
style.css
backend/
server.py
data/
outputs/
requirements.txt
README.md

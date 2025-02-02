const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

let currentQuestion = 0;
const responses = {};
const userAnswers = {}; // Stores yes/no responses for logic handling

const questions = [
    { text: "Enter your full name:", key: "full_name" },
    { text: "Enter your email:", key: "email" },
    { text: "Enter your phone number:", key: "phone_number" },
    { text: "Enter your LinkedIn URL:", key: "linkedin" },  
    { text: "Enter your GitHub URL:", key: "github" },
    { text: "Write a short professional summary:", key: "summary" },
    { text: "List your skills (comma separated):", key: "skills" },
    { text: "Would you like to add work experience? (yes/no):", key: "work_experience", type: "decision" },
    { text: "Add your Work Experience in this format: Company Name, Tenure, and Role:", key: "work_details", dependsOn: "work_experience" },
    { text: "Would you like to add education details? (yes/no):", key: "education", type: "decision" },
    { text: "List your education details in this format: School, Tenure, Major Field of Study:", key: "education_details", dependsOn: "education" },
    { text: "Do you have any certifications? (yes/no):", key: "certifications", type: "decision" },
    { text: "List your certifications (comma separated):", key: "certifications", dependsOn: "certifications" },
    { text: "Would you like to add a project? (yes/no):", key: "projectdetailst", type: "decision" },
    { text: "List your projects in given format: Title and Description", key: "project_details", dependsOn: "projectdetailst" }
];

function handleUserInput(event) {
    if (event.key === 'Enter' && userInput.value.trim() !== '') {
        let userMessage = userInput.value.trim();
        userInput.value = '';

        addMessage(userMessage, 'user-message');

        // Store response
        const currentQ = questions[currentQuestion];
        responses[currentQ.key] = userMessage;

        // Store yes/no responses for conditional logic
        if (currentQ.type === "decision") {
            userAnswers[currentQ.key] = userMessage.toLowerCase();
        }

        // Move to next valid question
        moveToNextQuestion();
    }
}

function moveToNextQuestion() {
    do {
        currentQuestion++;
    } while (
        currentQuestion < questions.length &&
        questions[currentQuestion].dependsOn &&
        userAnswers[questions[currentQuestion].dependsOn] !== "yes"
    );

    if (currentQuestion < questions.length) {
        setTimeout(() => {
            addMessage(questions[currentQuestion].text, 'bot-message');
        }, 1000);
    } else {
        // End of chat, show buttons for submission and download
        setTimeout(() => {
            addMessage("Resume data collected! Click below to download or submit.", 'bot-message');
            showButtons();
        }, 1000);
    }
}

function addMessage(message, className) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('message', className);
    newMessage.textContent = message;
    chatContainer.appendChild(newMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showButtons() {
    // Create Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = "Submit Info.";
    submitButton.onclick = sendDataToBackend;
    chatContainer.appendChild(submitButton);

    // Create Download JSON button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = "Download JSON";
    downloadButton.onclick = downloadJSON;
    chatContainer.appendChild(downloadButton);
}

function downloadJSON() {
    const jsonData = JSON.stringify(responses, null, 4);  // Pretty format JSON
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume_data.json";
    link.click();
}

function sendDataToBackend() {
    let textData = JSON.stringify(responses, null, 4);

    console.log("===== DEBUG: SENDING DATA TO BACKEND =====");
    console.log(textData);
    console.log("=========================================");

    fetch('http://127.0.0.1:5050/save_chat_data', {  // ✅ Corrected API URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: textData
    })
    .then(response => response.text())  // ✅ Expect plain text response
    .then(data => {
        console.log("✅ Server Response:", data);
        addMessage("Your responses have been saved!", "bot-message");
    })
    .catch(error => {
        console.error("🚨 Error sending data:", error);
        addMessage("Error saving data. Please try again.", "bot-message");
    });
}

// Start chat with first question
window.onload = () => {
    setTimeout(() => {
        addMessage(questions[currentQuestion].text, 'bot-message');
    }, 500);
};

// Attach event listener to input field
userInput.addEventListener('keypress', handleUserInput);

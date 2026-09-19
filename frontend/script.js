const API_BASE_URL = "";

const form = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");

const resultCard = document.getElementById("resultCard");
const predictedScore = document.getElementById("predictedScore");
const grade = document.getElementById("grade");
const performance = document.getElementById("performance");
const risk = document.getElementById("risk");


// =====================================================
// SCORE INPUTS
// =====================================================

const previousScoreInput =
    document.getElementById("previous_score");

const previousTotalInput =
    document.getElementById("previous_total");

const assignmentScoreInput =
    document.getElementById("assignment_score");

const assignmentTotalInput =
    document.getElementById("assignment_total");

const midtermScoreInput =
    document.getElementById("midterm_score");

const midtermTotalInput =
    document.getElementById("midterm_total");


// =====================================================
// PERCENTAGE DISPLAY
// =====================================================

const previousPercentage =
    document.getElementById("previousPercentage");

const assignmentPercentage =
    document.getElementById("assignmentPercentage");

const midtermPercentage =
    document.getElementById("midtermPercentage");


// =====================================================
// SCORE → PERCENTAGE
// =====================================================

function calculatePercentage(
    scoreInput,
    totalInput,
    displayElement
) {

    const score = Number(scoreInput.value);
    const total = Number(totalInput.value);

    // Both empty
    if (
        scoreInput.value === "" &&
        totalInput.value === ""
    ) {
        displayElement.textContent =
            "Percentage: —";

        return null;
    }

    // Only one field entered
    if (
        scoreInput.value === "" ||
        totalInput.value === ""
    ) {
        displayElement.textContent =
            "Enter score and total";

        return null;
    }

    // Invalid total
    if (total <= 0) {

        displayElement.textContent =
            "Invalid total";

        return null;
    }

    // Negative score
    if (score < 0) {

        displayElement.textContent =
            "Score cannot be negative";

        return null;
    }

    // Score greater than total
    if (score > total) {

        displayElement.textContent =
            "Score cannot exceed total";

        return null;
    }

    const percentage =
        (score / total) * 100;

    displayElement.textContent =
        `Percentage: ${percentage.toFixed(2)}%`;

    return percentage;
}


// =====================================================
// LIVE PERCENTAGE CALCULATION
// =====================================================

previousScoreInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            previousScoreInput,
            previousTotalInput,
            previousPercentage
        );

    }
);

previousTotalInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            previousScoreInput,
            previousTotalInput,
            previousPercentage
        );

    }
);


assignmentScoreInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            assignmentScoreInput,
            assignmentTotalInput,
            assignmentPercentage
        );

    }
);

assignmentTotalInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            assignmentScoreInput,
            assignmentTotalInput,
            assignmentPercentage
        );

    }
);


midtermScoreInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            midtermScoreInput,
            midtermTotalInput,
            midtermPercentage
        );

    }
);

midtermTotalInput.addEventListener(
    "input",
    () => {

        calculatePercentage(
            midtermScoreInput,
            midtermTotalInput,
            midtermPercentage
        );

    }
);


// =====================================================
// PREDICTION
// =====================================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // =================================================
        // CALCULATE PERCENTAGES
        // =================================================

        const previousPercentageValue =
            calculatePercentage(
                previousScoreInput,
                previousTotalInput,
                previousPercentage
            );

        const assignmentPercentageValue =
            calculatePercentage(
                assignmentScoreInput,
                assignmentTotalInput,
                assignmentPercentage
            );

        const midtermPercentageValue =
            calculatePercentage(
                midtermScoreInput,
                midtermTotalInput,
                midtermPercentage
            );


        // =================================================
        // CHECK PARTIAL INPUTS
        // =================================================

        if (
            (
                previousScoreInput.value !== "" &&
                previousTotalInput.value === ""
            ) ||
            (
                previousScoreInput.value === "" &&
                previousTotalInput.value !== ""
            )
        ) {

            alert(
                "Please enter both Previous Score and Total."
            );

            return;
        }


        if (
            (
                assignmentScoreInput.value !== "" &&
                assignmentTotalInput.value === ""
            ) ||
            (
                assignmentScoreInput.value === "" &&
                assignmentTotalInput.value !== ""
            )
        ) {

            alert(
                "Please enter both Assignment Score and Total."
            );

            return;
        }


        if (
            (
                midtermScoreInput.value !== "" &&
                midtermTotalInput.value === ""
            ) ||
            (
                midtermScoreInput.value === "" &&
                midtermTotalInput.value !== ""
            )
        ) {

            alert(
                "Please enter both Midterm Score and Total."
            );

            return;
        }


        // =================================================
        // BUTTON LOADING
        // =================================================

        predictButton.disabled = true;

        const originalButtonText =
            predictButton.querySelector(
                ".button-text"
            );

        if (originalButtonText) {

            originalButtonText.textContent =
                "ANALYZING...";

        }


        try {

            const response =
                await fetch(`${API_BASE_URL}/predict`, {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            age: Number(
                                document.getElementById(
                                    "age"
                                ).value
                            ),

                            study_hours: Number(
                                document.getElementById(
                                    "study_hours"
                                ).value
                            ),

                            attendance: Number(
                                document.getElementById(
                                    "attendance"
                                ).value
                            ),

                            previous_score:
                                previousPercentageValue,

                            assignment_score:
                                assignmentPercentageValue,

                            midterm_score:
                                midtermPercentageValue,

                            sleep_hours: Number(
                                document.getElementById(
                                    "sleep_hours"
                                ).value
                            ),

                            extracurricular: Number(
                                document.getElementById(
                                    "extracurricular"
                                ).value
                            )

                        })

                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Server error: ${response.status}`
                );

            }


            const data =
                await response.json();


            // =================================================
            // DISPLAY RESULT
            // =================================================

            predictedScore.textContent =
                `${Number(
                    data.predicted_score
                ).toFixed(1)}%`;

            grade.textContent =
                data.grade;

            performance.textContent =
                data.performance;

            risk.textContent =
                data.risk;


            resultCard.classList.add("show");


            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );

            alert(
                "Unable to connect to the AI server.\n\n" +
                "Make sure FastAPI is running on port 8001."
            );

        } finally {

            predictButton.disabled = false;

            if (originalButtonText) {

                originalButtonText.textContent =
                    "PREDICT PERFORMANCE";

            }

        }

    }
);


// =====================================================
// AI STUDENT ADVISOR CHATBOT
// =====================================================

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById("chatMessages");

const chatSendButton =
    document.getElementById("chatSendButton");


// =====================================================
// GET CURRENT STUDENT DATA
// =====================================================

function getStudentData() {

    const previousScore =
        calculatePercentage(
            previousScoreInput,
            previousTotalInput,
            previousPercentage
        );

    const assignmentScore =
        calculatePercentage(
            assignmentScoreInput,
            assignmentTotalInput,
            assignmentPercentage
        );

    const midtermScore =
        calculatePercentage(
            midtermScoreInput,
            midtermTotalInput,
            midtermPercentage
        );


    return {

        age: Number(
            document.getElementById("age").value
        ),

        study_hours: Number(
            document.getElementById(
                "study_hours"
            ).value
        ),

        attendance: Number(
            document.getElementById(
                "attendance"
            ).value
        ),

        previous_score:
            previousScore,

        assignment_score:
            assignmentScore,

        midterm_score:
            midtermScore,

        sleep_hours: Number(
            document.getElementById(
                "sleep_hours"
            ).value
        ),

        extracurricular: Number(
            document.getElementById(
                "extracurricular"
            ).value
        )

    };

}


// =====================================================
// CLEAN AI RESPONSE
// =====================================================

function cleanAIResponse(text) {

    if (!text) {
        return "";
    }

    return text
        .replace(/\r\n/g, "\n")

        // Remove backslashes added before Markdown
        .replace(/\\([*_`])/g, "$1")

        // Remove escaped hyphens
        .replace(/\\-/g, "-")

        // Remove excessive spaces
        .replace(/[ \t]+\n/g, "\n")

        // Remove excessive blank lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


// =====================================================
// FORMAT AI RESPONSE
// =====================================================

function formatAIResponse(text) {

    if (!text) {
        return "";
    }


    // First clean the response
    let cleaned =
        cleanAIResponse(text);


    // =================================================
    // MAKE INLINE NUMBERED LISTS INTO NEW LINES
    // =================================================

    cleaned =
        cleaned.replace(
            /(\s)(\d+)\.\s+(?=[A-Za-z*])/g,
            "$1\n$2. "
        );


    // =================================================
    // ESCAPE HTML
    // =================================================

    let formatted =
        escapeHTML(cleaned);


    // =================================================
    // HEADINGS
    // =================================================

    formatted =
        formatted.replace(
            /^###\s+(.+)$/gm,
            "<h4>$1</h4>"
        );

    formatted =
        formatted.replace(
            /^##\s+(.+)$/gm,
            "<h3>$1</h3>"
        );


    // =================================================
    // BOLD
    // =================================================

    formatted =
        formatted.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );


    // =================================================
    // NUMBERED LIST
    // =================================================

    formatted =
        formatted.replace(
            /^\s*(\d+)\.\s+(.+)$/gm,
            '<div class="ai-step">' +
            '<span class="ai-number">$1.</span> $2' +
            '</div>'
        );


    // =================================================
    // BULLET LIST
    // =================================================

    formatted =
        formatted.replace(
            /^\s*[-•]\s+(.+)$/gm,
            '<div class="ai-bullet">' +
            '<span class="ai-bullet-dot">•</span> $1' +
            '</div>'
        );


    // =================================================
    // LINE BREAKS
    // =================================================

    formatted =
        formatted.replace(
            /\n\n+/g,
            "<br><br>"
        );

    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;

}


// =====================================================
// TYPING ANIMATION
// =====================================================

async function typeAIResponse(
    element,
    text
) {

    if (!text) {
        return;
    }


    // Clean text before typing
    const cleanText =
        cleanAIResponse(text);


    // Clear message
    element.innerHTML = "";


    // =================================================
    // TYPE CHARACTER BY CHARACTER
    // =================================================

    for (
        let i = 0;
        i < cleanText.length;
        i++
    ) {

        // Use textContent while typing
        // This prevents HTML from breaking
        element.textContent =
            cleanText.substring(
                0,
                i + 1
            );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    10
                )
        );

    }


    // =================================================
    // APPLY FORMATTING AFTER TYPING
    // =================================================

    element.innerHTML =
        formatAIResponse(cleanText);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// =====================================================
// ADD CHAT MESSAGE
// =====================================================

function addChatMessage(
    message,
    sender
) {

    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        sender === "user"
            ? "chat-message user-message"
            : "chat-message bot-message";


    const avatar =
        sender === "user"
            ? "👤"
            : "✦";


    const senderName =
        sender === "user"
            ? "You"
            : "NeuroGrade AI";


    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>

        <div class="message-content">

            <strong>${senderName}</strong>

            <p></p>

        </div>
    `;


    const messageText =
        messageDiv.querySelector("p");


    if (sender === "bot") {

        messageText.innerHTML =
            formatAIResponse(message);

    } else {

        messageText.textContent =
            message;

    }


    chatMessages.appendChild(
        messageDiv
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;


    return messageText;

}


// =====================================================
// TYPING INDICATOR
// =====================================================

function createTypingIndicator() {

    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        "chat-message bot-message typing-message";


    messageDiv.innerHTML = `
        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <strong>NeuroGrade AI</strong>

            <p class="typing-indicator">

                <span></span>
                <span></span>
                <span></span>

            </p>

        </div>
    `;


    chatMessages.appendChild(
        messageDiv
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;


    return messageDiv;

}


// =====================================================
// SEND CHAT MESSAGE
// =====================================================

async function sendChatMessage() {

    const question =
        chatInput.value.trim();


    // Don't send empty message
    if (!question) {
        return;
    }


    // =================================================
    // USER MESSAGE
    // =================================================

    addChatMessage(
        question,
        "user"
    );


    chatInput.value = "";


    // Disable send button
    chatSendButton.disabled =
        true;


    // =================================================
    // TYPING INDICATOR
    // =================================================

    const typingMessage =
        createTypingIndicator();


    try {

        // =================================================
        // GET STUDENT DATA
        // =================================================

        const studentData =
            getStudentData();


        // =================================================
        // SEND TO FASTAPI
        // =================================================

        const response =
            await fetch(`${API_BASE_URL}/chat`, {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        question:
                            question,

                        student:
                            studentData

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        // =================================================
        // GET RESPONSE
        // =================================================

        const data =
            await response.json();


        // =================================================
        // REMOVE TYPING INDICATOR
        // =================================================

        if (typingMessage) {

            typingMessage.remove();

        }


        // =================================================
        // CREATE EMPTY AI MESSAGE
        // =================================================

        const botMessageText =
            addChatMessage(
                "",
                "bot"
            );


        // =================================================
        // TYPE RESPONSE
        // =================================================

        await typeAIResponse(
            botMessageText,
            data.answer
        );


    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        // Remove typing indicator
        if (typingMessage) {

            typingMessage.remove();

        }


        // Show error
        addChatMessage(
            "I couldn't connect to the AI advisor. Please try again later.",
            "bot"
        );


    } finally {

        chatSendButton.disabled =
            false;

        chatInput.focus();

    }

}


// =====================================================
// SUGGESTED QUESTIONS
// =====================================================

function askSuggestedQuestion(
    question
) {

    chatInput.value =
        question;

    sendChatMessage();

}


// =====================================================
// ENTER KEY
// =====================================================

chatInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendChatMessage();

        }

    }
);
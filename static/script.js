// =============================
// Voice Summary Functions
// =============================

function readSummary() {
    let summaryElement = document.getElementById("summaryText");

    if (!summaryElement) {
        alert("Summary not found.");
        return;
    }

    let text = summaryElement.innerText.trim();

    if (text === "") {
        alert("No summary available to read.");
        return;
    }

    window.speechSynthesis.cancel();

    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

function stopSummary() {
    window.speechSynthesis.cancel();
}

function pauseSummary() {
    window.speechSynthesis.pause();
}

function resumeSummary() {
    window.speechSynthesis.resume();
}


// =============================
// Voice Login
// =============================

function startVoiceLogin() {
    const output = document.getElementById("voiceOutput");

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser. Use Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    output.innerText = "Listening... 🎤";

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        output.innerText =
            "Recognized: " + transcript + " ✅ Login Successful!";
    };

    recognition.onerror = function () {
        output.innerText = "Voice recognition failed. Try again.";
    };
}


// =============================
// Accessibility Mode
// =============================

function setMode(mode) {
    document.body.classList.remove("blind-mode", "deaf-mode");

    if (mode === "blind") {
        document.body.classList.add("blind-mode");
        readSummary();
    }

    if (mode === "deaf") {
        document.body.classList.add("deaf-mode");
    }
}


// =============================
// Loading Animation
// =============================

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const loadingText = document.getElementById("loadingText");
    const uploadBtn = document.getElementById("uploadBtn");

    if (form) {
        form.addEventListener("submit", function () {
            if (loadingText) loadingText.style.display = "block";
            if (uploadBtn) {
                uploadBtn.disabled = true;
                uploadBtn.innerText = "Processing...";
            }
        });
    }
});


// =============================
// Theme Toggle
// =============================

function toggleTheme() {
    document.body.classList.toggle("light-mode");
}


// =============================
// Mindmap Download
// =============================

function downloadMindmap() {
    const element = document.querySelector(".mindmap-box");

    if (!element) return;

    html2canvas(element).then((canvas) => {
        const link = document.createElement("a");
        link.download = "mindmap.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}
const promptBox = document.getElementById("prompt");
const counter = document.getElementById("count");
const history = document.getElementById("history");

promptBox.addEventListener("input", () => {
    counter.innerText = promptBox.value.length;
});

async function generateUI() {

    const prompt = promptBox.value.trim();

    if (prompt === "") {
        alert("Please enter a prompt.");
        return;
    }

    const iframe = document.getElementById("preview");
    iframe.srcdoc = `
        <div style="padding:20px;font-family:Arial;text-align:center">
            <h2>⏳ Generating UI...</h2>
        </div>
    `;

    try {

        const response = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // Show Generated UI
        iframe.srcdoc = data.html;

        // Save Prompt History
        const li = document.createElement("li");
        li.innerText = prompt;
        history.prepend(li);

    } catch (error) {

        iframe.srcdoc = `
            <div style="padding:20px;color:red;font-family:Arial;">
                <h2>❌ Cannot connect to server.</h2>
            </div>
        `;

    }

}

function clearPrompt() {
    promptBox.value = "";
    counter.innerText = 0;
}

function copyHTML() {

    const html = document.getElementById("preview").srcdoc;

    navigator.clipboard.writeText(html);

    alert("HTML Copied Successfully!");

}

function downloadHTML() {

    const html = document.getElementById("preview").srcdoc;

    const blob = new Blob([html], {
        type: "text/html"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "generated.html";

    a.click();

}
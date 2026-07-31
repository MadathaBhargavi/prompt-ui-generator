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
        <div style="
            padding:20px;
            font-family:Arial;
            text-align:center;
        ">
            <h2>⏳ Generating UI...</h2>
            <p>Please wait...</p>
        </div>
    `;

    try {

        const response = await fetch(
            "https://prompt-ui-generator.vercel.app/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API request failed");
        }

        // Display generated HTML
        iframe.srcdoc = data.html;

        // Add prompt to history
        const li = document.createElement("li");

        li.innerText = prompt;

        history.prepend(li);

    } catch (error) {

        console.error("API Error:", error);

        iframe.srcdoc = `
            <div style="
                padding:20px;
                color:red;
                font-family:Arial;
                text-align:center;
            ">
                <h2>❌ Error generating UI</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}


function clearPrompt() {

    promptBox.value = "";

    counter.innerText = "0";
}


function copyHTML() {

    const html =
        document.getElementById("preview").srcdoc;

    navigator.clipboard.writeText(html);

    alert("HTML Copied Successfully!");
}


function downloadHTML() {

    const html =
        document.getElementById("preview").srcdoc;

    const blob = new Blob(
        [html],
        {
            type: "text/html"
        }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "generated.html";

    a.click();

    URL.revokeObjectURL(a.href);
}
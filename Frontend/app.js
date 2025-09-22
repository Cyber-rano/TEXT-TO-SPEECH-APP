const speakBtn = document.getElementById("speakBtn");
const textInput = document.getElementById("textInput");
const audioPlayer = document.getElementById("audioPlayer");
const waveform = document.getElementById("waveform");
const loadingText = document.getElementById("loadingText");

speakBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) return alert("Please enter some text.");

    loadingText.style.display = "block";
    waveform.style.display = "none";
    audioPlayer.src = "";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();          // Parse HTTP response
        const body = JSON.parse(data.body);          // Parse Lambda body string
        const audioUrl = body.audioUrl;              // Correct key

        if (!audioUrl) {
            console.error("Lambda did not return audioUrl:", body);
            alert("Failed to generate speech.");
            return;
        }

        audioPlayer.src = audioUrl;
        audioPlayer.play();
        waveform.style.display = "flex";

        audioPlayer.onended = () => waveform.style.display = "none";

    } catch (err) {
        console.error("Fetch or playback error:", err);
        alert("Failed to generate speech.");
    } finally {
        loadingText.style.display = "none";
    }
});

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user-message");
  userInput.value = "";

  // Temporary "typing" message
  const typingMsg = appendMessage("AI is typing...", "ai-message", true);

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();
    typingMsg.remove();
    appendMessage(data.reply || data.response || "No response", "ai-message");
  } catch (err) {
    typingMsg.remove();
    appendMessage(" Error: " + err.message, "ai-message");
  }
}

function appendMessage(text, className, isTemp = false) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${className}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (isTemp) return msg;
}

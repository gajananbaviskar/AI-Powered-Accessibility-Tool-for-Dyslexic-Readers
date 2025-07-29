// document.addEventListener("DOMContentLoaded", () => {
//     const inputText = document.getElementById("input-text");
//     const imageUpload = document.getElementById("image-upload");
//     const outputText = document.getElementById("output-text");
//     const simplifyBtn = document.getElementById("simplify-btn");
//     const playBtn = document.getElementById("play-btn");
//     const speedSlider = document.getElementById("speed-slider");
//     const speedValue = document.getElementById("speed-value");
//     const outputSection = document.querySelector(".output-section");
//     const playbackSpeed = document.querySelector(".playback-speed");
  
//     simplifyBtn.addEventListener("click", async () => {
//       const text = inputText.value.trim();
//       const file = imageUpload.files[0];
  
//       if (!text && !file) return alert("Please enter text or upload an image.");
  
//       simplifyBtn.disabled = true;
//       simplifyBtn.textContent = "Processing...";
  
//       const formData = new FormData();
//       if (text) formData.append("text", text);
//       if (file) formData.append("image", file);
  
//       try {
//         const response = await fetch("/process", {
//           method: "POST",
//           body: formData
//         });
//         const data = await response.json();
  
//         outputText.textContent = data.simplified_text;
//         outputSection.style.display = "block";
  
//         let audio = document.getElementById("tts-audio");
//         if (!audio) {
//           audio = document.createElement("audio");
//           audio.id = "tts-audio";
//           document.body.appendChild(audio);
//         }
//         audio.src = data.audio_url;
//       } catch (err) {
//         console.error("Error:", err);
//         alert("Something went wrong.");
//       }
  
//       simplifyBtn.disabled = false;
//       simplifyBtn.textContent = "Simplify Text";
//     });
  
//     let isPlaying = false;
//     playBtn.addEventListener("click", () => {
//       const audio = document.getElementById("tts-audio");
//       if (!audio) return alert("No audio available.");
  
//       if (!isPlaying) {
//         audio.playbackRate = parseFloat(speedSlider.value);
//         audio.play();
//         isPlaying = true;
//         playBtn.textContent = "Stop";
//         playbackSpeed.style.display = "flex";
  
//         audio.onended = () => {
//           isPlaying = false;
//           playBtn.textContent = "Play";
//           playbackSpeed.style.display = "none";
//         };
//       } else {
//         audio.pause();
//         isPlaying = false;
//         playBtn.textContent = "Play";
//         playbackSpeed.style.display = "none";
//       }
//     });
  
//     speedSlider.addEventListener("input", () => {
//       speedValue.textContent = speedSlider.value + "x";
//       const audio = document.getElementById("tts-audio");
//       if (audio) audio.playbackRate = parseFloat(speedSlider.value);
//     });
  
//     // Settings
//     const dyslexicFont = document.getElementById("dyslexic-font");
//     const fontSize = document.getElementById("font-size");
//     const lineSpacing = document.getElementById("line-spacing");
//     const wordSpacing = document.getElementById("word-spacing");
//     const letterSpacing = document.getElementById("letter-spacing");
//     const boldText = document.getElementById("bold-text");
  
//     function updateTextStyle() {
//       const style = `
//         font-size: ${fontSize.value}px;
//         line-height: ${lineSpacing.value};
//         word-spacing: ${wordSpacing.value}em;
//         letter-spacing: ${letterSpacing.value}em;
//         font-weight: ${boldText.checked ? "bold" : "normal"};
//       `;
//       inputText.style.cssText = style;
//       outputText.style.cssText = style;
//       document.body.classList.toggle("font-dyslexic", dyslexicFont.checked);
//     }
  
//     [dyslexicFont, fontSize, lineSpacing, wordSpacing, letterSpacing, boldText].forEach(setting => {
//       setting.addEventListener("input", updateTextStyle);
//     });
  
//     updateTextStyle();
  
//     // Voice input
//     const recordButton = document.getElementById("record-button");
//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new webkitSpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.continuous = false;
//       recognition.interimResults = false;
  
//       recordButton.addEventListener("click", () => {
//         recognition.start();
//         recordButton.textContent = "🎙️ Listening...";
//       });
  
//       recognition.onresult = (event) => {
//         inputText.value = event.results[0][0].transcript;
//       };
  
//       recognition.onerror = (e) => console.error("Speech error:", e);
//       recognition.onend = () => {
//         recordButton.textContent = "🎤 Start Recording";
//       };
//     }
  
//     // Chatbot logic (unchanged from your original)
//     // ...keep your existing chatbot code here...
//   });
  


//Chatbot start
document.addEventListener("DOMContentLoaded", () => {
  const chatbotButton = document.getElementById("chatbot-button");
  const chatbotPopup = document.getElementById("chatbot-popup");
  const closeChatbot = document.getElementById("close-chatbot");
  const sendMessage = document.getElementById("send-message");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotInput = document.getElementById("chatbot-input");

  chatbotButton.addEventListener("click", () => {
    chatbotPopup.style.display = chatbotPopup.style.display === "flex" ? "none" : "flex";

    if (chatbotMessages.children.length === 0) {
      chatbotMessages.innerHTML = `<div class="ai-message"><strong>AI:</strong> Hello! I'm your assistant. How can I help you today?</div>`;
    }
  });

  closeChatbot.addEventListener("click", () => {
    chatbotPopup.style.display = "none";
  });

  sendMessage.addEventListener("click", async () => {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    if (sendMessage.disabled) return;
    sendMessage.disabled = true;

    chatbotMessages.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;
    chatbotInput.value = "";
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("ai-message");
    loadingMessage.innerHTML = "<strong>AI:</strong> Typing...";
    chatbotMessages.appendChild(loadingMessage);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to reach Gemini API");

      const data = await response.json();
      chatbotMessages.removeChild(loadingMessage);

      const aiResponse = data?.reply || "⚠️ No response from AI.";
      chatbotMessages.innerHTML += `<div class="ai-message"><strong>AI:</strong> ${aiResponse}</div>`;
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    } catch (error) {
      chatbotMessages.removeChild(loadingMessage);
      chatbotMessages.innerHTML += `<div class="ai-message"><strong>AI:</strong> ❌ ${error.message}</div>`;
    } finally {
      sendMessage.disabled = false;
    }
  });

  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage.click();
  });
});
//Chatbot End

document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("input-text");
  const imageUpload = document.getElementById("image-upload");
  const outputText = document.getElementById("output-text");
  const simplifyBtn = document.getElementById("simplify-btn");
  const playBtn = document.getElementById("play-btn");
  const speedSlider = document.getElementById("speed-slider");
  const speedValue = document.getElementById("speed-value");
  const outputSection = document.querySelector(".output-section");
  const playbackSpeed = document.querySelector(".playback-speed");

  let isPlaying = false;
  let isHyphenated = false;
  let originalSimplifiedText = "";

  // Hyphenation toggle button
  const toggleHyphenationBtn = document.createElement("button");
  toggleHyphenationBtn.textContent = "Toggle Hyphenation";
  toggleHyphenationBtn.style.marginTop = "10px";
  toggleHyphenationBtn.style.display = "none";
  document.querySelector(".output-section").appendChild(toggleHyphenationBtn);

  const hindiCheckbox = document.createElement("input");
hindiCheckbox.type = "checkbox";
hindiCheckbox.id = "hindi-translate";
hindiCheckbox.style.marginRight = "5px";

const marathiCheckbox = document.createElement("input");
marathiCheckbox.type = "checkbox";
marathiCheckbox.id = "marathi-translate";
marathiCheckbox.style.marginLeft = "15px";
marathiCheckbox.style.marginRight = "5px";

const hindiLabel = document.createElement("label");
hindiLabel.textContent = "Hindi";
hindiLabel.htmlFor = "hindi-translate";

const marathiLabel = document.createElement("label");
marathiLabel.textContent = "Marathi";
marathiLabel.htmlFor = "marathi-translate";

const translationOptions = document.createElement("div");
translationOptions.style.marginTop = "10px";
translationOptions.append(hindiCheckbox, hindiLabel, marathiCheckbox, marathiLabel);

document.querySelector(".output-section").appendChild(translationOptions);


  toggleHyphenationBtn.addEventListener("click", () => {
    const output = document.getElementById("output-text");
    if (!isHyphenated) {
      fetch("/hyphenate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalSimplifiedText })
      })
      .then(res => res.json())
      .then(data => {
        output.textContent = data.hyphenated;
        isHyphenated = true;
      });
    } else {
      output.textContent = originalSimplifiedText;
      isHyphenated = false;
    }
  });

  simplifyBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    const file = imageUpload.files[0];

    if (!text && !file) return alert("Please enter text or upload an image.");

    simplifyBtn.disabled = true;
    simplifyBtn.textContent = "Processing...";

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("image", file);

    try {
      const response = await fetch("/process", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      originalSimplifiedText = data.simplified_text;
      outputText.textContent = originalSimplifiedText;
      outputSection.style.display = "block";
      toggleHyphenationBtn.style.display = "inline-block";
      isHyphenated = false;

      let audio = document.getElementById("tts-audio");
      if (!audio) {
        audio = document.createElement("audio");
        audio.id = "tts-audio";
        document.body.appendChild(audio);
      }
      audio.src = data.audio_url;

    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }

    simplifyBtn.disabled = false;
    simplifyBtn.textContent = "Simplify Text";
  });

  [hindiCheckbox, marathiCheckbox].forEach(checkbox => {
    checkbox.addEventListener("change", async () => {
      const targetLangs = [];
      if (hindiCheckbox.checked) targetLangs.push("hi");
      if (marathiCheckbox.checked) targetLangs.push("mr");
  
      if (targetLangs.length === 0) {
        outputText.textContent = originalSimplifiedText;
        return;
      }
  
      try {
        const response = await fetch("/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: originalSimplifiedText,
            languages: targetLangs
          }),
        });
        const data = await response.json();
        outputText.textContent = data.translated.join("\n\n");
      } catch (err) {
        console.error("Translation error:", err);
        alert("Translation failed.");
      }
    });
  });
  

  playBtn.addEventListener("click", () => {
    const audio = document.getElementById("tts-audio");
    if (!audio) return alert("No audio available.");

    if (!isPlaying) {
      audio.playbackRate = parseFloat(speedSlider.value);
      audio.play();
      isPlaying = true;
      playBtn.textContent = "Stop";
      playbackSpeed.style.display = "flex";

      audio.onended = () => {
        isPlaying = false;
        playBtn.textContent = "Play";
        playbackSpeed.style.display = "none";
      };
    } else {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "Play";
      playbackSpeed.style.display = "none";
    }
  });

  speedSlider.addEventListener("input", () => {
    speedValue.textContent = speedSlider.value + "x";
    const audio = document.getElementById("tts-audio");
    if (audio) audio.playbackRate = parseFloat(speedSlider.value);
  });

  // Accessibility settings
  const dyslexicFont = document.getElementById("dyslexic-font");
  const fontSize = document.getElementById("font-size");
  const lineSpacing = document.getElementById("line-spacing");
  const wordSpacing = document.getElementById("word-spacing");
  const letterSpacing = document.getElementById("letter-spacing");
  const boldText = document.getElementById("bold-text");

  function updateTextStyle() {
    const style = `
      font-size: ${fontSize.value}px;
      line-height: ${lineSpacing.value};
      word-spacing: ${wordSpacing.value}em;
      letter-spacing: ${letterSpacing.value}em;
      font-weight: ${boldText.checked ? "bold" : "normal"};
    `;
    inputText.style.cssText = style;
    outputText.style.cssText = style;
    document.body.classList.toggle("font-dyslexic", dyslexicFont.checked);
  
    // Update displayed values
    document.getElementById("font-size-value").textContent = fontSize.value;
    document.getElementById("line-spacing-value").textContent = lineSpacing.value;
    document.getElementById("word-spacing-value").textContent = wordSpacing.value;
    document.getElementById("letter-spacing-value").textContent = letterSpacing.value;
  }
  

  [dyslexicFont, fontSize, lineSpacing, wordSpacing, letterSpacing, boldText].forEach(setting => {
    setting.addEventListener("input", updateTextStyle);
  });

  updateTextStyle();

  // Speech recognition
  const recordButton = document.getElementById("record-button");
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recordButton.addEventListener("click", () => {
      recognition.start();
      recordButton.textContent = "🎙️ Listening...";
    });

    recognition.onresult = (event) => {
      inputText.value = event.results[0][0].transcript;
    };

    recognition.onerror = (e) => console.error("Speech error:", e);
    recognition.onend = () => {
      recordButton.textContent = "🎤 Start Recording";
    };
  }
});



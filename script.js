const introText = document.getElementById("intro-text");
const startBtn = document.getElementById("start-btn");
const cake = document.getElementById("cake");
const layers = document.querySelectorAll(".cake-layer");
const candle = document.getElementById("candle");
const flame = document.getElementById("flame");
const wishText = document.getElementById("wish-text");
const enjoyText = document.getElementById("enjoy-text");
const confettiContainer = document.getElementById("confetti-container");

startBtn.addEventListener("click", () => {
  introText.style.display = "none";
  startBtn.style.display = "none";
  cake.style.display = "block";

  const allLayers = [...layers].reverse();
  allLayers.forEach((layer, i) => {
    setTimeout(() => {
      layer.style.transform = "translateX(-50%) translateY(0)";
      layer.style.opacity = "1";
    }, i * 800);
  });

  setTimeout(() => {
    candle.style.transform = "translateX(-50%) translateY(0)";
    candle.style.opacity = "1";
    wishText.style.opacity = 1;
    listenToMic();
  }, allLayers.length * 800 + 500);
});

function listenToMic() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    const checkBlow = () => {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b, 0) / data.length;

      if (volume > 50) {
        flame.style.display = "none";
        wishText.style.opacity = 0;
        showConfetti();
        stream.getTracks().forEach(track => track.stop());
      } else {
        requestAnimationFrame(checkBlow);
      }
    };
    checkBlow();
  });
}

function showConfetti() {
  for (let i = 0; i < 300; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "12px";
    confetti.style.height = "12px";
    confetti.style.borderRadius = "50%";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-20px";
    confetti.style.animation = `fall ${3 + Math.random() * 5}s linear forwards`;
    confettiContainer.appendChild(confetti);
  }

  enjoyText.style.opacity = 1;
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);

let mediaRecorder;
let recordedChunks = [];

const startButton = document.getElementById("startRecording");
const stopButton = document.getElementById("stopRecording");
const videoElement = document.getElementById("recordedVideo");
const downloadLinkContainer = document.getElementById("downloadLink");

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

async function startRecording() {
  const displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    startButton.disabled = true;
    stopButton.disabled = false;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    mediaRecorder.start();

    // Add event listener for when the user stops sharing the screen
    stream.getVideoTracks()[0].addEventListener("ended", () => {
      console.log("User stopped sharing screen.");
      stopRecording();
    });
  } catch (error) {
    console.error("Error accessing display media:", error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  startButton.disabled = false;
  stopButton.disabled = true;
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

function handleStop() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const videoURL = URL.createObjectURL(blob);
  videoElement.src = videoURL;
  videoElement.controls = true;
  videoElement.style.display = "block"; // Show the video element
  videoElement.play();

  createDownloadLink(videoURL);

  recordedChunks = [];
}

function createDownloadLink(videoURL) {
  const downloadLink = document.createElement("a");
  downloadLink.href = videoURL;
  downloadLink.download = "recorded-video.webm";
  downloadLink.textContent = "Download Recording";

  downloadLinkContainer.innerHTML = "";
  downloadLinkContainer.appendChild(downloadLink);
}

// Add this function at the end of the file
function initializePage() {
  videoElement.style.display = "none"; // Hide the video element initially
}

// Call the initialization function when the page loads
window.addEventListener("load", initializePage);

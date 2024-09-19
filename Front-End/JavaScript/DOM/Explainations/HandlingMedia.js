/**
 * ==========================
 * Media Handling in the DOM
 * ==========================
 *
 * JavaScript provides several built-in APIs to interact with media elements
 * such as images, audio, and video in the DOM. Using these APIs, you can
 * dynamically control, manipulate, and respond to media events, allowing for
 * a richer, more interactive web experience.
 */

/**
 * 1. Working with Images in the DOM
 * ---------------------------------
 * You can dynamically create, modify, or remove images using JavaScript.
 * The `img` HTML element represents images and supports attributes like `src`, `alt`, etc.
 */

// a) Accessing and changing an image's source
const imgElement = document.getElementById("my-image"); // Assuming you have an <img> element with id="my-image"

// Set a new source for the image
imgElement.src = "new-image-url.jpg";

// b) Handling image load and error events
imgElement.addEventListener("load", () => {
  console.log("Image successfully loaded");
});

imgElement.addEventListener("error", () => {
  console.log("Error loading image");
  imgElement.src = "fallback-image.jpg"; // Load a fallback image if the original fails
});

// c) Creating and adding an image dynamically
const newImg = document.createElement("img");
newImg.src = "dynamic-image.jpg";
newImg.alt = "A dynamically created image";

// Add the image to the document
document.body.appendChild(newImg);

/**
 * 2. Working with Audio in the DOM
 * --------------------------------
 * The `audio` element in HTML allows you to embed audio files and control them using JavaScript.
 * The most common actions include play, pause, and modifying volume.
 */

// a) Accessing an audio element and controlling playback
const audioElement = document.getElementById("my-audio"); // Assuming you have an <audio> element with id="my-audio"

// Play the audio
audioElement.play();

// Pause the audio
audioElement.pause();

// Set the volume (range: 0.0 - 1.0)
audioElement.volume = 0.5;

// b) Listening to audio events
audioElement.addEventListener("play", () => {
  console.log("Audio started playing");
});

audioElement.addEventListener("pause", () => {
  console.log("Audio paused");
});

audioElement.addEventListener("ended", () => {
  console.log("Audio playback ended");
});

// c) Audio playback progress
audioElement.addEventListener("timeupdate", () => {
  console.log("Current time:", audioElement.currentTime); // Outputs the current playback time in seconds
});

// d) Creating and playing audio dynamically
const dynamicAudio = new Audio("audio-file.mp3"); // Dynamically create an audio element
dynamicAudio.play(); // Play the audio immediately

/**
 * 3. Working with Video in the DOM
 * --------------------------------
 * The `video` element allows you to embed videos in your HTML and control playback, volume,
 * fullscreen mode, and more through JavaScript.
 */

// a) Accessing and controlling a video element
const videoElement = document.getElementById("my-video"); // Assuming you have a <video> element with id="my-video"

// Play the video
videoElement.play();

// Pause the video
videoElement.pause();

// Set the volume of the video
videoElement.volume = 0.8;

// Set the playback speed (1 is normal speed, 0.5 is half-speed, 2 is double-speed)
videoElement.playbackRate = 1.5;

// b) Seeking to a specific time
videoElement.currentTime = 30; // Seek to 30 seconds

// c) Listening for video events
videoElement.addEventListener("play", () => {
  console.log("Video started playing");
});

videoElement.addEventListener("pause", () => {
  console.log("Video paused");
});

videoElement.addEventListener("ended", () => {
  console.log("Video ended");
});

// d) Entering fullscreen mode
// Not all browsers support this natively, but most modern ones do.
videoElement.requestFullscreen();

/**
 * 4. Media Events
 * ---------------
 * Both `audio` and `video` elements share many events that can be used to handle
 * changes in the media's state or playback. Some common events include:
 *
 * - `play`: Triggered when media starts playing.
 * - `pause`: Triggered when media is paused.
 * - `timeupdate`: Triggered as media plays, providing updates on the current time.
 * - `ended`: Triggered when media playback finishes.
 * - `volumechange`: Triggered when the volume is changed.
 * - `seeked`: Triggered when the user seeks (jumps) to a new time in the media.
 */

// Example: Listening for playback events on a video element
videoElement.addEventListener("timeupdate", () => {
  console.log(`Current playback time: ${videoElement.currentTime}`);
});

videoElement.addEventListener("volumechange", () => {
  console.log(`Current volume: ${videoElement.volume}`);
});

/**
 * 5. Controlling Media with JavaScript
 * ------------------------------------
 * Media elements provide several methods for controlling playback programmatically.
 * You can play, pause, change volume, mute, and control playback speed directly with JavaScript.
 */

// a) Play and pause
videoElement.play(); // Starts playback
videoElement.pause(); // Pauses playback

// b) Change the volume
videoElement.volume = 0.5; // Sets the volume to 50%

// c) Mute and unmute
videoElement.muted = true; // Mute the video
videoElement.muted = false; // Unmute the video

// d) Change the playback speed
videoElement.playbackRate = 2.0; // Double the playback speed
videoElement.playbackRate = 0.75; // Play at 75% speed

// e) Check if the media is paused
if (videoElement.paused) {
  console.log("The video is paused");
} else {
  console.log("The video is playing");
}

/**
 * 6. Preloading Media
 * -------------------
 * Media elements support a `preload` attribute that controls how the media file is loaded before playback.
 * The `preload` attribute can be set to:
 *  - `none`: Do not load the media until the user clicks play.
 *  - `metadata`: Load only the metadata (such as duration, dimensions).
 *  - `auto`: Load the entire media file as soon as possible.
 */

// Example of preloading a video
const preloadVideo = document.createElement("video");
preloadVideo.src = "video-file.mp4";
preloadVideo.preload = "auto"; // Preload the entire video

/**
 * 7. Handling Media Errors
 * ------------------------
 * Media elements provide error events that can be used to detect issues with loading or playing media.
 */

// Example: Handling media errors
audioElement.addEventListener("error", (e) => {
  console.log("Error occurred while playing audio:", e);
});

videoElement.addEventListener("error", (e) => {
  console.log("Error occurred while playing video:", e);
});

/**
 * 8. Using Tracks with Video (Subtitles, Captions)
 * ------------------------------------------------
 * You can add subtitles, captions, or other kinds of text tracks to a video using the `<track>` element.
 */

// Example: Adding a track to a video
const trackElement = document.createElement("track");
trackElement.kind = "subtitles"; // Can be `subtitles`, `captions`, or other types
trackElement.label = "English";
trackElement.srclang = "en";
trackElement.src = "subtitles-en.vtt"; // Link to a WebVTT file with subtitles

// Add the track to the video
videoElement.appendChild(trackElement);

/**
 * 9. Responsive Media Handling
 * ----------------------------
 * It’s essential to make sure your media adapts to different screen sizes. You can do this using CSS and JavaScript to control the size and layout of the media.
 */

// Example: Responsive video size using CSS
videoElement.style.width = "100%"; // Make the video take up the full width of its container

// Example: Dynamically adjust video size based on window size
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  videoElement.style.width = `${width * 0.8}px`; // Adjust video to 80% of the window width
});

/**
 * Conclusion:
 * -----------
 * Media handling in the DOM is a powerful tool that allows developers to create interactive,
 * engaging, and responsive web experiences with audio, video, and images. JavaScript provides
 * control over media playback, volume, fullscreen behavior, and much more, enabling rich
 * multimedia experiences in modern web development.
 *
 * You can handle events like play, pause, time updates, and errors to provide real-time feedback
 * to users and ensure media is loaded and played correctly. Combine this with responsive techniques
 * to adapt media to different screen sizes for an optimal user experience.
 */

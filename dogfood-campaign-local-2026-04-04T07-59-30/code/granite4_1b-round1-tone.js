// Global setup and cleanup
Tone.start();

// --- 1. Core Synthesis Modules ---

// Oscillator 1: Low, sustained drone (Sine wave for warmth)
const osc1 = new Tone.Oscillator(440, "sine").toDestination();
osc1.volume.value = -10;

// Oscillator 2: Mid-range texture (Saw wave for complexity)
const osc2 = new Tone.Oscillator(440, "sawtooth").toDestination();
osc2.volume.value = -8;

// Oscillator 3: High, subtle movement (Triangle wave)
const osc3 = new Tone.Oscillator(440, "triangle").toDestination();
osc3.volume.value = -12;

// --- 2. Modulation Source (LFO) ---
// Slow, subtle pitch wobble
const lfo = new Tone.LFO("0.1", 0.01, 0.01).start();

// Apply LFO modulation to the frequency of osc2
osc2.frequency.sync('LFO');
osc2.frequency.value = 440; // Start frequency

// --- 3. Effect Chain ---

// Reverb (Large space, ambient feel)
const reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.6
}).toDestination();

// Delay (Echoing, atmospheric)
const delay = new Tone.FeedbackDelay("2n", 0.5).connect(reverb);

// Merge all oscillators into a single signal path
const merger = new Tone.Merger().connect(delay);

// Connect the core tones to the merger
osc1.connect(merger);
osc2.connect(merger);
osc3.connect(merger);

// --- 4. Control and Playback ---

/**
 * Initializes and starts the ambient drone patch.
 */
function startDronePatch() {
    console.log("Starting Ambient Drone Patch...");

    // Set initial frequencies and volumes
    osc1.frequency.value = 20;
    osc2.frequency.value = 70;
    osc3.frequency.value = 100;

    // Start all oscillators
    osc1.start();
    osc2.start();
    osc3.start();

    // Start the LFO
    lfo.start();

    // Set a master volume for the whole patch
    Tone.Destination.volume.value = -10;
}

/**
 * Stops all oscillators and resets the patch.
 */
function stopDronePatch() {
    console.log("Stopping Drone Patch.");
    osc1.stop();
    osc2.stop();
    osc3.stop();
    lfo.stop();
    // Optional: Reset volumes/frequencies if needed
}

// --- Execution Example ---
// To run this, call the function in a browser environment with Tone.js loaded.
// Uncomment the line below and call it when the user interacts with the page.
// startDronePatch();

// Example: Start the drone 2 seconds after the script loads
setTimeout(startDronePatch, 2000);

// Example: Stop the drone after 20 seconds
setTimeout(stopDronePatch, 22000);
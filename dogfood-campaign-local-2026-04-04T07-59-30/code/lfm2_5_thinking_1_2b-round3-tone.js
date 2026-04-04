// Initialize Tone.js context
const context = new Tone.Context();

// --- 1. SYNTHESIS SOURCES (Multiple Oscillators) ---
// Sine: Smooth, foundational drone
const osc1 = new Tone.Oscillator(40, "sine").toDestination();
osc1.start();

// Saw: Rich harmonics, adds grit
const osc2 = new Tone.Oscillator(40, "sawtooth").toDestination();
osc2.start();

// Square: Adds buzzing overtones
const osc3 = new Tone.Oscillator(40, "square").toDestination();
osc3.start();

// --- 2. MODULATION SOURCES (LFOs) ---
// LFO 1: Slow frequency drift (for ambient movement)
const lfoFreq = new Tone.LFO("0.1", 0.98, 1.02).start();

// LFO 2: Slow amplitude/filter modulation
const lfoAmp = new Tone.LFO("1.5", 0.5, 1.0).start();

// --- 3. EFFECTS CHAIN SETUP ---
// Reverb: Large space ambience
const reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.5
}).toDestination();

// Delay: Echoing, repeating sound
const delay = new Tone.FeedbackDelay("2n", 0.4).connect(reverb);

// Filter: Shapes the drone frequency range
const filter = new Tone.Filter(150, "lowpass").connect(delay);

// --- 4. PATCHING AND ROUTING ---
// Connect Oscillators -> Filter -> Delay -> Reverb -> Output
osc1.connect(filter);
osc2.connect(filter);
osc3.connect(filter);

// --- 5. AUTOMATION AND MODULATION ---
// Modulate Filter Cutoff using LFO 2
filter.frequency.value = 150; // Start frequency
lfoAmp.connect(filter.frequency); // LFO modulates the frequency parameter

// Modulate Oscillator 1 Frequency using LFO 1 (Subtle vibrato/drift)
osc1.frequency.value = 40;
lfoFreq.connect(osc1.frequency); 

// --- 6. CONTROL FUNCTIONS ---

/**
 * Starts the ambient drone patch.
 */
function startDrone() {
    console.log("Drone started. Ambient textures engaged.");
    // Optional: Start the main tone context if it hasn't started yet
    Tone.start();
}

/**
 * Stops all oscillators and resets the patch.
 */
function stopDrone() {
    osc1.stop();
    osc2.stop();
    osc3.stop();
    lfoFreq.stop();
    lfoAmp.stop();
    console.log("Drone stopped.");
}

// Expose functions globally for easy testing (e.g., in a browser console)
window.startDrone = startDrone;
window.stopDrone = stopDrone;

// Example: Auto-run on load (Optional)
// startDrone();
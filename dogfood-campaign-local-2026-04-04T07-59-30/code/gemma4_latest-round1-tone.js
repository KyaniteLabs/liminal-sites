import * as Tone from 'tone';

// --- Global Setup ---

// Master Reverb for the entire patch
const reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.5,
    preDelay: 0.1
}).toDestination();

// Master Delay
const delay = new Tone.FeedbackDelay("1.5", 0.8).connect(reverb);

// Master Filter (Low Pass to keep it dark/ambient)
const filter = new Tone.Filter(300, "lowpass").connect(delay);

// --- Sound Sources ---

// 1. Primary Oscillator (Sine wave for smooth base)
const osc1 = new Tone.Oscillator({
    type: "sine",
    frequency: 80, // Start low
    volume: -10
}).connect(filter);

// 2. Secondary Oscillator (Saw wave for harmonic content)
const osc2 = new Tone.Oscillator({
    type: "sawtooth",
    frequency: 80,
    volume: -12
}).connect(filter);

// 3. LFO for slow frequency modulation (Vibrato/Wobble)
const lfo1 = new Tone.LFO({
    frequency: "0.1", // Very slow wobble rate
    depth: 5 // Small frequency depth
}).start();

// 4. LFO for slow amplitude modulation (Overall pulsing)
const lfo2 = new Tone.LFO({
    frequency: "0.2",
    depth: 0.1 // Small volume depth
}).start();

// --- Patch Connections ---

// Connect LFOs to modulate parameters
lfo1.connect(osc1.frequency); // Modulate base frequency
lfo1.connect(osc2.frequency).multiply(0.5); // Modulate secondary frequency slightly differently

// Connect LFO 2 to the volume of both oscillators
lfo2.connect(osc1.volume);
lfo2.connect(osc2.volume);

// Connect Oscillators to the Filter
osc1.start();
osc2.start();

// Connect the final output path: Oscillators -> Filter -> Delay -> Reverb -> Destination
// (The connections are already set up above, just ensuring the final chain is clear)

// --- Control Functions ---

/**
 * Initializes the drone sequence and starts playback.
 */
async function startDrone() {
    console.log("Starting Ambient Drone...");

    // Set initial fundamental frequencies (Tuning the 'root' of the drone)
    const baseFreq = 70;
    osc1.frequency.value = baseFreq;
    osc2.frequency.value = baseFreq * 1.2; // Slightly detuned second oscillator

    // Set initial filter cutoff
    filter.frequency.value = 350;

    // Start the loop/sustain
    Tone.Transport.bpm.value = 60; // Slow tempo reference
    Tone.Transport.start();

    // Schedule a gentle filter sweep over 30 seconds
    const sweep = new Tone.Sequence((time, note, duration) => {
        // Smoothly sweep filter cutoff from 350Hz up to 1000Hz over time
        filter.frequency.rampTo(1000, 1);
        // And then back down slowly
        setTimeout(() => {
             filter.frequency.rampTo(350, 3);
        }, 30000); // Wait 30 seconds total sweep time
    }, [0, 1], "0"); // Execute once
}

/**
 * Stops all components of the patch.
 */
function stopDrone() {
    console.log("Stopping Drone.");
    Tone.Transport.stop();
    osc1.stop();
    osc2.stop();
    lfo1.stop();
    lfo2.stop();
}

// --- Execution ---
// To run this in a browser environment, ensure you call startDrone() after a user interaction.
// Example usage in a browser:
// document.getElementById('startButton').addEventListener('click', async () => {
//     await Tone.start();
//     startDrone();
// });
// document.getElementById('stopButton').addEventListener('click', stopDrone);

// For demonstration purposes, we will start it immediately if Tone context is ready.
if (typeof window !== 'undefined' && window.AudioContext) {
    Tone.start();
    startDrone();
}
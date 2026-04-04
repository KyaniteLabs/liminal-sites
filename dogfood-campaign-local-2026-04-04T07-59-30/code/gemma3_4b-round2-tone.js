/**
 * Ambient Drone Synthesizer Patch using Tone.js
 * Features: Multiple oscillators, LFO modulation, Reverb, and Delay.
 */

async function setupAmbientDrone() {
    // Ensure the AudioContext is running
    await Tone.start();
    console.log("Audio Context started.");

    // --- 1. Initialize Effects ---

    // Reverb: Large hall setting for spaciousness
    const reverb = new Tone.Freeverb(4, 0.8).toDestination();
    reverb.wet.value = 0.6; // Moderate wet signal
    reverb.frequency.value = 2000;

    // Delay: Ping-pong delay for rhythmic texture
    const delay = new Tone.PingPongDelay("8n", 0.5).toDestination();
    delay.wet.value = 0.4;

    // --- 2. Sound Source (Oscillators) ---

    // Use multiple sine wave oscillators for a rich, harmonically complex drone base
    const baseOsc1 = new Tone.Oscillator({
        frequency: "C2",
        type: "sine",
        start: "now"
    }).connect(reverb);

    const baseOsc2 = new Tone.Oscillator({
        frequency: "E2",
        type: "sine",
        start: "now"
    }).connect(reverb);

    const baseOsc3 = new Tone.Oscillator({
        frequency: "G2",
        type: "sine",
        start: "now"
    }).connect(reverb);

    // --- 3. Modulation Sources (LFOs) ---

    // LFO 1: Slow frequency wobble (Affecting the entire group slightly)
    const lfoFreq = new Tone.LFO("0.1s", 0.05, 0.05).start();

    // LFO 2: Slow amplitude/filter sweep (Affecting overall texture)
    const lfoAmp = new Tone.LFO("2s", 0.8, 1.2).start();

    // --- 4. Connecting Modulation to Sound ---

    // Use a Filter to allow LFO to modulate the overall sound shape (subtle sweeping)
    const filter = new Tone.Filter(100, "lowpass").connect(delay);
    reverb.connect(filter); // Connect reverb output to filter

    // Connect the oscillators to the filter input
    baseOsc1.connect(filter);
    baseOsc2.connect(filter);
    baseOsc3.connect(filter);

    // Modulate Filter Cutoff using LFO 2 (Amplitude)
    filter.frequency.value = 200; // Base cutoff frequency
    filter.frequency.connect(lfoAmp);

    // Modulate overall volume/delay input using LFO 1 (Frequency modulation is more complex, so we use volume modulation on the delay for simplicity/effect)
    const volumeControl = new Tone.Volume(-12).toDestination(); // Volume control before delay
    filter.connect(volumeControl);
    volumeControl.connect(delay);

    // Connect Delay output to the final destination (Speakers)
    delay.toDestination();


    // --- 5. Setting up the Drone Behavior ---

    // Set initial state for the drone (Constant sustain)
    console.log("Drone initialized. Playing ambient sound.");

    // Optional: Use Tone.Loop to periodically shift the base frequency slightly
    const loop = new Tone.Loop(time => {
        // Gradually shift the base frequencies over time
        baseOsc1.frequency.setValueAtTime(Math.random() * 10 + 100, time);
        baseOsc2.frequency.setValueAtTime(Math.random() * 10 + 150, time);
        baseOsc3.frequency.setValueAtTime(Math.random() * 10 + 200, time);
    }, "8n").start(0);


    // --- 6. Controls and Cleanup ---
    return {
        stop: () => {
            loop.stop();
            baseOsc1.dispose();
            baseOsc2.dispose();
            baseOsc3.dispose();
            lfoFreq.dispose();
            lfoAmp.dispose();
            console.log("Drone patch stopped and resources cleaned up.");
        }
    };
}

// --- Execution Example ---
let droneController = null;

document.addEventListener('click', async () => {
    if (!droneController) {
        // Start the drone patch on the first click
        droneController = await setupAmbientDrone();
    } else {
        // If already running, just re-trigger a small event or do nothing
        console.log("Drone is already active.");
    }
}, { once: true }); // Only execute setup once on the first click

// Add a button to stop the sound
const stopButton = document.createElement('button');
stopButton.textContent = "Stop Drone";
document.body.appendChild(stopButton);

stopButton.addEventListener('click', () => {
    if (droneController) {
        droneController.stop();
        droneController = null;
        stopButton.disabled = true;
    }
});
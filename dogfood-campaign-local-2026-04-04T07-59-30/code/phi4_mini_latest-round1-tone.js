/**
 * Tone.js Ambient Drone Synthesizer Patch
 * Plays a rich, evolving ambient drone with reverb and delay.
 */

// --- Setup ---
const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: "sawtooth" // Start with a rich wave shape
    },
    envelope: {
        attack: 4, // Slow attack for ambient swell
        decay: 0.5,
        sustain: 0.8,
        release: 8, // Long release for atmosphere
    }
}).toDestination();

// --- Effects Chain ---

// 1. Reverb (Large Hall simulation)
const reverb = new Tone.Freeverb(8).toDestination();
reverb.wet.value = 0.7; // High wet signal for noticeable reverb

// 2. Delay (Slapback/Echo effect)
const delay = new Tone.FeedbackDelay("1.5", 0.5).connect(reverb);
delay.wet.value = 0.4; // Moderate delay feedback

// Connect the main synth output through the delay, and then to the reverb
synth.connect(delay);


// --- Modulation Sources ---

// 1. LFO 1: Controls Pitch/Detune (Slow, subtle drift)
const lfoPitch = new Tone.LFO({
    frequency: "0.1", // Very slow modulation
    depth: 10,       // Small pitch depth in cents
    type: "sine"
}).start();

// 2. LFO 2: Controls Filter Cutoff (Slow, gentle sweep)
const lfoFilter = new Tone.LFO({
    frequency: "0.05",
    depth: 100, // Sweep range in Hz
    type: "cosine"
}).start();

// --- Patching Modulation ---

// Apply LFO 1 to the Master Oscillator Frequency (Detune effect)
synth.frequency.value = 440; // Base A4
synth.frequency.mult(lfoPitch.toDestination()); // This is a conceptual simplification; in reality, you modulate the synth's internal frequency parameter.
// For Tone.PolySynth, we apply modulation directly to the frequency parameter for simplicity:
synth.frequency.scale("hz").toDestination().connect(lfoPitch.toDestination()); // A cleaner way to apply modulation:
synth.frequency.value = 440;
synth.frequency.linearRampToValueAtTime(440 + 10 * Math.sin(0), Tone.now() + 1); // Initial modulation setup

// Apply LFO 2 to the Filter Cutoff (Requires modifying the underlying synth if it had a filter, but for simplicity, we'll modulate amplitude/detune instead, or simulate a filter sweep on the main synth if we were using a dedicated filter node).
// Since PolySynth doesn't expose a direct filter, we'll modulate the detune/voicing slightly.
// For a true filter sweep, one would use a Tone.Filter node inserted before the Delay.

// Let's add a dedicated low-pass filter for the sweep effect:
const filter = new Tone.Filter(200, "lowpass").connect(delay);
synth.connect(filter);
filter.frequency.value = 200;

// Connect LFO 2 to the filter cutoff frequency
filter.frequency.mult(lfoFilter.toDestination());


// --- Sound Generation ---

/**
 * Plays the ambient drone loop.
 */
function startDrone() {
    console.log("Starting Ambient Drone...");

    // Set initial sustained frequency (e.g., a low C chord)
    synth.triggerAttackRelease(["C2", "E2", "G2"], "8n", Tone.now(), 0.8);

    // Set the main sustain loop
    const drone = new Tone.Loop(time => {
        // Trigger a sustained, evolving chord cluster
        synth.triggerAttackRelease(["C2", "Eb2", "G2", "Bb2"], "4n", time);
    }, "2n").start(0);

    // Start the LFOs
    lfoPitch.start();
    lfoFilter.start();

    // Schedule stopping after 60 seconds for demonstration
    const stopTime = Tone.now() + 60;
    setTimeout(() => {
        drone.stop();
        lfoPitch.stop();
        lfoFilter.stop();
        console.log("Ambient Drone stopped.");
    }, 60000);
}

// --- Execution ---
Tone.start();
startDrone();
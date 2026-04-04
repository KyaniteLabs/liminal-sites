import * as Tone from "tone";

/**
 * Creates and connects a lush, ambient drone synthesizer patch.
 * The sound uses multiple oscillating sources, modulated by LFOs,
 * and processed with extensive reverb and delay.
 */
async function createAmbientDrone() {
    // 1. Master Reverb
    const reverb = new Tone.Reverb({
        decay: 8,
        wet: 0.6,
        preDelay: 0.1
    }).toDestination();

    // 2. Master Delay
    const delay = new Tone.PingPongDelay("1.5", 0.5).connect(reverb);

    // 3. Polyphonic Envelope Follower (for subtle modulation shaping)
    const envelopeFollower = new Tone.EnvelopeFollower(0.1, 0.5).toDestination();

    // 4. Oscillators (Multiple sources for richness)
    const osc1 = new Tone.Oscillator({
        frequency: "C2",
        type: "sine",
        detune: -20,
    }).start();

    const osc2 = new Tone.Oscillator({
        frequency: "E2",
        type: "sawtooth",
        detune: 0,
    }).start();

    const osc3 = new Tone.Oscillator({
        frequency: "G2",
        type: "sine",
        detune: 50,
    }).start();

    // 5. Low Frequency Oscillators (LFOs) for subtle movement
    // LFO 1: Slow pitch wobble on Osc1
    const lfo1 = new Tone.LFO({
        frequency: "0.1", // Very slow cycle
        depth: 20,       // Small pitch deviation in cents
        type: "sine"
    }).start();

    // LFO 2: Slow amplitude modulation on Osc2
    const lfo2 = new Tone.LFO({
        frequency: "0.5", // Modulates volume slightly
        depth: 0.1,
        type: "sine"
    }).start();

    // 6. Connections and Modulation Graph

    // Connect LFOs to oscillators
    lfo1.connect(osc1.frequency); // Modulate frequency
    lfo2.connect(osc2.volume);  // Modulate volume

    // Connect Oscillators to the Delay
    osc1.connect(delay);
    osc2.connect(delay);
    osc3.connect(delay);

    // Connect the Delay to the Reverb
    // (Delay already connects to Reverb in the definition)

    // 7. Initial Setup and Scheduling

    // Set initial modulation for LFOs (if needed, otherwise the default connection handles it)
    // We'll use the LFOs to control parameters directly via the graph.

    console.log("Ambient Drone Patch Initialized.");
    console.log("Playing for 10 seconds...");

    // Schedule the sound to play for a duration
    const startTime = Tone.now();
    const duration = 10;

    // Start the sustained sound by setting the initial frequencies and volumes
    osc1.frequency.value = "C2";
    osc2.frequency.value = "E2";
    osc3.frequency.value = "G2";

    // Start the transport for the drone
    Tone.Transport.start();

    // Schedule a stop after the duration
    setTimeout(() => {
        Tone.Transport.stop();
        osc1.stop();
        osc2.stop();
        osc3.stop();
        console.log("Ambient Drone Patch Stopped.");
    }, (duration * 1000));
}

// Run the function to create and play the patch
createAmbientDrone();
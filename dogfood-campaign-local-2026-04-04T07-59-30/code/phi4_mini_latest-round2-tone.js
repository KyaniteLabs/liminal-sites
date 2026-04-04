import * as Tone from "tone";

/**
 * Creates and connects a rich, ambient drone synthesizer patch.
 * The drone uses multiple oscillators, an LFO for subtle modulation,
 * and applies Reverb and Delay effects for space and depth.
 */
function createAmbientDrone() {
    // 1. Master Effects Chain
    // Reverb: Creates a large, washed-out space
    const reverb = new Tone.Reverb({
        decay: 8, // Long decay time
        wet: 0.6, // Significant wet signal
    }).toDestination();

    // Delay: Adds rhythmic echoes
    const delay = new Tone.FeedbackDelay("4n", 0.5).connect(reverb);

    // 2. Oscillators (Sources of Sound)
    // We use three slightly detuned sawtooth waves for thickness
    const osc1 = new Tone.Oscillator({
        frequency: "C2",
        type: "sawtooth",
        detune: 0,
    }).start();

    const osc2 = new Tone.Oscillator({
        frequency: "C2",
        type: "sawtooth",
        detune: 15, // Slightly sharp
    }).start();

    const osc3 = new Tone.Oscillator({
        frequency: "C2",
        type: "sawtooth",
        detune: -15, // Slightly flat
    }).start();

    // 3. Modulation Source (LFO)
    // LFO slightly modulates the pitch of the oscillators for a "singing" or drifting effect
    const lfo = new Tone.LFO("2Hz", 1, 0.1).start(); // Sine wave, 2Hz rate, 1 octave range, 0.1 depth

    // 4. Amplifier/Filter (Shaping the sound)
    const filter = new Tone.Filter(200, "lowpass").frequency.value = 200;
    
    // A gentle envelope follower or simple Gain node can help control the overall texture
    const mainGain = new Tone.Gain(0.8);

    /* --- Connections --- */

    // Connect LFO to modulate the pitch (frequency) of the oscillators
    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);
    lfo.connect(osc3.frequency);

    // Connect Oscillators -> Filter -> Main Gain -> Delay -> Reverb -> Destination
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    
    filter.connect(mainGain);
    mainGain.connect(delay);
    
    // The reverb is connected to the destination, receiving the delayed signal
    delay.connect(reverb);

    console.log("Ambient Drone Synthesizer Initialized.");
    console.log("Playing drone for 8 seconds...");

    // 5. Scheduling the Drone
    // Use a Tone.Sequence or a time-based scheduling function for a sustained sound
    const duration = 8; 
    
    // Schedule a continuous tone for the specified duration
    Tone.Transport.scheduleRepeat(() => {
        // Optional: Modulate the filter cutoff slightly over time
        filter.frequency.rampTo(250, 1);
    }, "2n"); // Update filter every half note interval

    Tone.Transport.start();
    
    // Stop the drone after the duration
    setTimeout(() => {
        Tone.Transport.stop();
        console.log("Drone sequence finished.");
        
        // Clean up connections (optional but good practice)
        osc1.stop();
        osc2.stop();
        osc3.stop();
        lfo.stop();
        Tone.Transport.cancel();
    }, duration * 1000);

}

// Initialize the patch
createAmbientDrone();
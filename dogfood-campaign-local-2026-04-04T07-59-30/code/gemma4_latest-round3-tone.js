// Tone.js synthesizer patch for ambient drone with reverb and delay

/**
 * Initializes the ambient drone synthesizer.
 * @param {Tone.Transport} transport - The Tone.js Transport object.
 */
async function setupAmbientDrone(transport) {
    // 1. Set up the Master Chain Effects
    const reverb = new Tone.Reverb({
        decay: 8, // Long decay for ambient wash
        wet: 0.5, // Significant wet signal
        damping: 0.5
    }).toDestination();

    const delay = new Tone.FeedbackDelay("8n", 0.5).connect(reverb);
    const masterEffects = new Tone.ToneSequence(
        [delay, reverb],
        "0", // Start immediately
        "8n"
    ).toDestination(); // Connect the final output

    // 2. Oscillator Setup (Multiple sources for richness)
    const osc1 = new Tone.Oscillator(440, "sine").start();
    const osc2 = new Tone.Oscillator(220, "sawtooth").start();
    const osc3 = new Tone.Oscillator(170, "triangle").start();

    // Group oscillators and connect them to the delay input
    const oscillatorGroup = new Tone.Panner().connect(delay); // Panning can add width
    osc1.connect(oscillatorGroup);
    osc2.connect(oscillatorGroup);
    osc3.connect(oscillatorGroup);

    // 3. LFO Setup (Modulation sources)
    // LFO 1: Slow pitch wobble (Chorus/Detune effect)
    const lfoPitch = new Tone.Oscillator(0.1, "sine").start();
    lfoPitch.connect(osc1.frequency);

    // LFO 2: Slow amplitude variation (Tremolo effect)
    const lfoAmp = new Tone.Oscillator(0.15, "sine").start();
    // We will use this LFO to modulate the gain of a central voice or the oscillators directly (if using a specific synth wrapper)
    // For simplicity in this patch, we will use it to modulate the overall volume slightly.
    const volumeModulator = new Tone.Filter(20, "bandpass").connect(delay); // Using a filter as a visual place to connect the LFO if direct gain modulation is complex
    lfoAmp.connect(volumeModulator);

    // 4. Envelope/Attack Setup (Controlled onset)
    const attackEnv = new Tone.Envelope({
        attack: 4, // Slow attack for fading in
        decay: 1,
        sustain: 0.8,
        release: 6 // Long release for ambient decay
    }).toDestination();

    // Connect the primary signal path through the envelope for controlled starts/stops
    // Re-routing: Oscillator Group -> Envelope -> Delay -> Reverb -> Destination
    // Since we are simulating a continuous ambient sound, we will apply the envelope primarily to the initial signal trigger.
    // For a true drone, we keep the oscillators running and use the envelope mainly for transitions.

    // Reconnecting the main signal flow to incorporate the envelope's release:
    oscillatorGroup.disconnect(); // Disconnect from the original path
    oscillatorGroup.connect(attackEnv);
    attackEnv.connect(delay);


    // 5. Core Scheduling Function
    function startDrone() {
        console.log("Starting Ambient Drone...");

        // Start all components
        osc1.frequency.value = 440;
        osc2.frequency.value = 220;
        osc3.frequency.value = 170;

        lfoPitch.start();
        lfoAmp.start();
        attackEnv.triggerAttackRelease(10, "seconds"); // Trigger initial attack

        // Start the transport if it isn't running
        if (!transport.state === 'started') {
             transport.start();
        }

        // Set the oscillators to cycle continuously (or they will run indefinitely)
        osc1.volume.value = -12;
        osc2.volume.value = -18;
        osc3.volume.value = -24;

        // Schedule the sound to fade out softly after a long period for demonstration
        Tone.Transport.scheduleOnce(() => {
            console.log("Fading out drone after 60 seconds.");
            attackEnv.triggerAttackRelease(-Infinity, "seconds"); // Trigger release phase indefinitely
            // Optionally stop oscillators after fade
            // osc1.stop();
            // osc2.stop();
            // osc3.stop();
        }, 60);
    }

    // Expose a stop function
    const stopDrone = () => {
        console.log("Stopping Drone.");
        Tone.Transport.stop();
        osc1.stop();
        osc2.stop();
        osc3.stop();
        lfoPitch.stop();
        lfoAmp.stop();
        attackEnv.triggerRelease();
    };

    return { startDrone, stopDrone };
}

// --- Initialization Example ---
async function main() {
    await Tone.start();

    const transport = new Tone.Transport();
    const drone = await setupAmbientDrone(transport);

    // Start the sound after a short delay to allow user interaction
    setTimeout(() => {
        drone.startDrone();
    }, 1);

    // Set up a simple stop listener for demonstration purposes
    document.addEventListener('click', () => {
        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }
        // Simple toggle logic for demonstration
        if (Tone.Transport.state === 'started') {
             drone.stopDrone();
             setTimeout(() => Tone.Transport.stop(), 100);
        } else {
             drone.startDrone();
        }
    }, { once: true }); // Only runs once when the user clicks after setup

    console.log("Ambient Drone Initialized. Click anywhere to start/stop.");
}

// Run the main function
// main(); // Uncomment this line to run in a browser environment
// Tone.js Ambient Drone Synthesizer Patch

/**
 * Initializes and plays an ambient drone synthesizer patch.
 * The patch uses multiple oscillators, LFOs, reverb, and delay for a rich, evolving sound.
 */
async function createAmbientDrone() {
    // 1. Setup Audio Context and Master Group
    const context = new Tone.Context();
    await context.start();

    // Use a Tone.Destination or a dedicated group for processing
    const masterGroup = new Tone.ToneGroup().toDestination();

    // 2. Effects Chain Setup
    // Reverb: Large, diffused space
    const reverb = new Tone.Freeverb(5).toDestination();
    reverb.wet.value = 0.5; // Moderate wet signal
    reverb.frequency.value = 220; // Tune the reverb time center slightly

    // Delay: Slapback/medium feedback
    const delay = new Tone.FeedbackDelay("8n", 0.4).connect(reverb);
    delay.wet.value = 0.3; // Keep delay subtle

    // Connect the main signal flow: Oscillators -> Master Group -> Delay -> Reverb -> Destination
    masterGroup.connect(delay);
    delay.connect(reverb);
    reverb.toDestination();

    // 3. Sound Source Generation (Multiple Oscillators for richness)
    const oscillators = [];
    const baseFrequency = 60; // A2 - A good starting root note

    // Oscillator 1: Sine Wave (Foundation)
    const osc1 = new Tone.Oscillator({
        type: "sine",
        frequency: `${baseFrequency}Hz`,
        volume: -10
    }).start();
    oscillators.push(osc1);

    // Oscillator 2: Saw Wave (Harmonics/Brightness)
    const osc2 = new Tone.Oscillator({
        type: "sawtooth",
        frequency: `${baseFrequency * 1.05}Hz`, // Slight detuning
        volume: -12
    }).start();
    oscillators.push(osc2);

    // Oscillator 3: Square Wave (Mid-range texture)
    const osc3 = new Tone.Oscillator({
        type: "square",
        frequency: `${baseFrequency * 0.98}Hz`, // Another slight detune
        volume: -14
    }).start();
    oscillators.push(osc3);

    // Connect all oscillators to the master group
    oscillators.forEach(osc => {
        osc.connect(masterGroup);
    });

    // 4. Modulation Source (LFOs)
    // LFO 1: Pitch Wobble (Slow, subtle movement)
    const lfoPitch = new Tone.LFO("1Hz").start();

    // LFO 2: Filter Cutoff Modulation (Slow sweep)
    const lfoFilter = new Tone.LFO("0.5s").start();

    // 5. Voice/Envelope Control (Subtle amplitude cycling)
    const amplitudeEnvelope = new Tone.AmplitudeEnvelope({
        attack: 4, // Slow attack to fade in
        decay: 1,
        sustain: 0.8,
        release: 8
    }).toDestination(); // Connect to the output for overall shaping

    // Connect the base signal (Master Group) to the Amplitude Envelope
    masterGroup.connect(amplitudeEnvelope);
    amplitudeEnvelope.connect(reverb); // Route through the envelope before reverb

    // 6. Connecting Modulation Sources
    // Pitch Modulation: Modulate osc2's frequency slightly
    osc2.frequency.value = baseFrequency * 1.05;
    osc2.frequency.linearRampToValueAtTime(baseFrequency * 1.05 + 5, Tone.now() + 2);
    osc2.frequency.connect(lfoPitch.frequency); // Direct modulation (Requires careful handling, simpler to use Tone.js modulation)

    // A simpler, robust way to apply LFO pitch wobble:
    const wobbleFreq = new Tone.Random({ min: 0.98, max: 1.02 }).sync();
    osc1.frequency.linearRampToValueAtTime(baseFrequency, Tone.now());
    osc1.frequency.connect(wobbleFreq);


    // Filter modulation (Simulating a slow spectral drift using the master group's conceptual filter,
    // though we are using the group directly, we'll simulate the effect on the main signal strength)
    // For a true filter sweep, one would use a BiquadFilterNode. Here, we apply it conceptually via volume changes.
    // Let's connect the LFO to the master group volume for a gentle breathing effect.
    masterGroup.volume.connect(lfoFilter);
    lfoFilter.start();
    lfoFilter.frequency.setValueAtTime(0.5, Tone.now()); // 0.5 Hz cycling rate

    // 7. Scheduling the Playback
    const startTime = Tone.now();
    const duration = 60; // Play for 60 seconds

    // Initial message to start the drones
    console.log("Starting Ambient Drone...");
    console.log("Playing for approximately " + (duration / 60) + " minutes.");

    // Keep the sound playing until the duration passes
    Tone.Transport.scheduleRepeat((time) => {
        // Optionally change parameters over time for evolution
        if (Tone.Transport.seconds >= (duration / 2) && Tone.Transport.seconds < (duration / 2 + 1)) {
            console.log("Mid-point: Increasing reverb decay.");
            reverb.decay = 8;
        }
    }, "1m");

    Tone.Transport.start();

    // Stop the sound after the specified duration
    setTimeout(() => {
        Tone.Transport.stop();
        console.log("Ambient Drone Ended.");
    }, duration * 1000);
}

// Execute the function to run the patch
createAmbientDrone();
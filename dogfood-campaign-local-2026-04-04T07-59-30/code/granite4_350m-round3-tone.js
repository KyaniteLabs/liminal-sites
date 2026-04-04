(async function() {
    // Initialize AudioContext
    const context = new Tone.Context();
    await context.start();

    // 1. Create the Core Synthesizer Group
    const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: {
            attack: 4,    // Slow attack for ambient feel
            decay: 0.5,
            sustain: 1,   // High sustain for drone
            release: 8    // Long release
        }
    }).toDestination();

    // 2. Create and Apply Effects Chain
    const reverb = new Tone.Reverb({
        decay: 10,
        wet: 0.7
    }).toDestination();

    const delay = new Tone.FeedbackDelay("8n", 1).toDestination();

    // Connect synth -> delay -> reverb -> output
    synth.connect(delay);
    delay.connect(reverb);

    // 3. Ambient Drone Setup (Multiple Oscillators via low-frequency modulation)
    const baseFrequency = 60; // Low base frequency (A2)
    const notes = ["C2", "Eb2", "G2", "Bb2"];

    // 4. LFOs for Modulation
    // LFO 1: Slow frequency wobble (Subtle movement)
    const lfoFreq = new Tone.LFO("0.1", -5, 5).start();

    // LFO 2: Slow amplitude modulation (Breathing effect)
    const lfoAmp = new Tone.LFO("1", 0.8, 1.2).start();

    // 5. Scheduling the Drone
    console.log("Starting Ambient Drone...");

    // Start the sound immediately and sustain it
    const drone = Tone.Loop(time => {
        // Play multiple notes simultaneously (voicing)
        synth.triggerAttackRelease(notes, "4n", time);
    }, "2n").start(0);

    // Apply modulations
    // Modulate the LFO output to the overall frequency slightly (simulating chorus/detune)
    // We use a basic Gain node to modulate the amplitude slightly based on the LFO.
    const modGain = new Tone.Gain(1).connect(reverb);
    modGain.gain.value = 1;

    // Connect the LFO to the parameter of a component (e.g., slight detune on the main synth)
    // Since PolySynth doesn't expose direct detune modulation easily, we'll use the LFO to modulate the overall volume/filter cutoff for a perceived shift.

    // Simple modulation application (using LFO 1 to modulate the volume of the delay feedback)
    lfoFreq.connect(delay.feedback);

    // LFO 2 modulates the overall volume (Amplitude)
    Tone.Destination.volume.value = 0; // Set initial volume to zero
    lfoAmp.connect(Tone.Destination.volume);
    lfoAmp.start();

    // Keep the drone running for 60 seconds
    setTimeout(() => {
        console.log("Stopping Drone.");
        drone.stop();
        lfoFreq.stop();
        lfoAmp.stop();
        Tone.Destination.volume.rampTo(0, 5); // Smooth fade out
    }, 60000);

})();
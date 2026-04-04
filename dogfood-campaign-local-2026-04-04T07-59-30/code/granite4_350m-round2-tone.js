// Ensure Tone.js is loaded before running this code snippet

async function createAmbientDrone() {
    // 1. Initialize Effects Chain
    const reverb = new Tone.Reverb({
        decay: 8,
        preDelay: 0.1,
        wet: 0.7
    }).toDestination();

    const delay = new Tone.FeedbackDelay("8n", 0.7).connect(reverb);

    // 2. Initialize Oscillators (Multiple sources for richness)
    const synthA = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 4, decay: 2, sustain: 1, release: 6 }
    }).toDestination();

    const synthB = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 3, decay: 1, sustain: 0.8, release: 5 }
    }).toDestination();

    const synthC = new Tone.MonoSynth({
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 3, sustain: 1.2, release: 6 }
    }).toDestination();

    // Connect synths to the effects chain
    synthA.connect(delay);
    synthB.connect(delay);
    synthC.connect(delay);

    // 3. Initialize LFOs (Modulation sources)
    // LFO 1: Slow pitch drift (Low frequency movement)
    const lfoPitch = new Tone.Oscillator(0.01, "sine").start();

    // LFO 2: Subtle amplitude wobble (Textural movement)
    const lfoAmp = new Tone.Oscillator(0.2, "sine").start();

    // 4. Connect LFOs to modulate parameters
    // Modulate overall frequency (slow drift)
    lfoPitch.connect(synthA.frequency);
    lfoPitch.frequency.setValueAtTime(0.01, Tone.now());

    // Modulate amplitude (subtle breathing)
    lfoAmp.connect(synthB.volume);
    lfoAmp.frequency.setValueAtTime(0.2, Tone.now());


    // 5. Start the Drone
    const duration = "16m";
    const startNote = "C1";
    const endNote = "C2";

    // Set initial drone notes and sustain
    synthA.triggerAttackRelease(startNote, duration);
    synthB.triggerAttackRelease(startNote, duration * 0.8);
    synthC.triggerAttackRelease(startNote, duration * 0.6);

    // Start all elements
    Tone.start();
    lfoPitch.start();
    lfoAmp.start();
    console.log("Ambient Drone Activated.");
}

// Example usage: Call the function to start the patch
createAmbientDrone();
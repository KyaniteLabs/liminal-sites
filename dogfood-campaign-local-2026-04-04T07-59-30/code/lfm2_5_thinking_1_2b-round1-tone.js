// Global setup and context initialization
const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 }
}).toDestination();

// --- LFO Setup (for slow, evolving movement) ---
const lfo1 = new Tone.LFO({
    frequency: "0.1", // Very slow frequency change
    depth: 10,        // Modulates frequency by 10 cents
    type: "sine"
}).start();

// --- Effect Chain Setup ---

// 1. Reverb (Ambient space)
const reverb = new Tone.Reverb({
    decay: 10,
    wet: 0.8
}).toDestination();

// 2. Delay (Echo effect)
const delay = new Tone.FeedbackDelay("2n", 0.5).connect(reverb);

// 3. Connect the synth output through the effects chain
synth.connect(delay);

// 4. Connect the delay output to the final destination (Reverb -> Output)
delay.connect(reverb);


// --- Modulation Setup ---

// Modulate the poly-synth's frequency using LFO 1
// This makes the drone subtly waver over time.
synth.frequency.linearRampToValueAtTime(
    Tone.Frequency("C2"), 
    Tone.now()
);

// Apply LFO to the synth via the frequency parameter
// This creates the 'warble' effect.
synth.frequency.sync().connect(lfo1);


// --- Drone Playback Function ---

function startDrone() {
    // Initial notes (low, rich, consonant chords)
    const notes = ["C2", "G2", "C3", "E3"];
    
    // Set the drone notes and start the continuous sound
    synth.triggerAttackRelease(notes, "8m", Tone.now());

    // Start the LFO modulation
    lfo1.start();

    // Schedule the continuous playing (Drone loop)
    Tone.Transport.bpm.value = 60;
    Tone.Transport.start();

    // Use a repeating sequence to keep the sound alive
    Tone.Loop(time => {
        synth.triggerAttackRelease(notes, "2n", time);
    }, "4n");
}

// Start the entire patch
startDrone();
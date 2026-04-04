// Tone.js Ambient Drone Synthesizer Patch

/**
 * Initializes and connects the ambient drone synthesizer.
 * Uses multiple oscillators, LFOs, and effects (Reverb, Delay)
 * for a rich, evolving soundscape.
 */
async function setupAmbientDrone() {
    await Tone.start();

    // --- 1. Master Group and Effects Chain ---

    // Reverb Effect
    const reverb = new Tone.Reverb({
        decay: 6,
        wet: 0.5,
        dampening: 0.8
    }).toDestination();

    // Delay Effect
    const delay = new Tone.FeedbackDelay("1.5", 0.5).connect(reverb);

    // Connect the final output of the delay to the destination
    delay.connect(reverb);
    reverb.toDestination();


    // --- 2. Oscillators (The Sound Source) ---

    // Oscillator 1: Low, sustained sine wave foundation
    const osc1 = new Tone.Oscillator(40, "sine").start();
    osc1.connect(delay);

    // Oscillator 2: Mid-range, slightly detuned saw wave for complexity
    const osc2 = new Tone.Oscillator(45, "sawtooth").start();
    osc2.connect(delay);

    // Oscillator 3: High, gentle square wave for shimmer
    const osc3 = new Tone.Oscillator(50, "square").start();
    osc3.connect(delay);


    // --- 3. Modulation Sources (LFOs) ---

    // LFO A: Slow pitch modulation (Vibrato effect)
    const lfoPitch = new Tone.LFO("0.1", -2, 2).start();

    // LFO B: Slow amplitude modulation (Tremolo/Pulsing)
    const lfoAmp = new Tone.LFO("1.5", 0.2, 1.0).start();


    // --- 4. Connecting Modulation to Parameters ---

    // Connect LFO A (Pitch) to Oscillator 1's frequency (detune effect)
    osc1.frequency.value = 40; // Base frequency
    osc1.frequency.connect(lfoPitch.frequency); // Example: Using LFO to modulate frequency

    // Connect LFO B (Amplitude) to Oscillator 3's volume
    const gainNode3 = new Tone.Gain(1.0).connect(delay);
    osc3.connect(gainNode3);
    gainNode3.gain.value = 1.0;
    gainNode3.gain.connect(lfoAmp.frequency); // Example: Controlling amplitude envelope


    // --- 5. Dynamic Detuning/Panning (Subtle movement) ---
    // We'll use a simple frequency modulation on OSC2 to keep it evolving
    const modDepth = new Tone.LFO("5s", 0.0, 0.5).start();
    osc2.frequency.scale("hz").add(modDepth.toDestination()); // Connect LFO to frequency

    // --- 6. The Drone Patch Function ---

    function playDrone(duration) {
        console.log("Playing ambient drone...");

        // Start the sustained tones
        osc1.frequency.setValueAtTime(40, Tone.now());
        osc2.frequency.setValueAtTime(45, Tone.now());
        osc3.frequency.setValueAtTime(50, Tone.now());

        // Schedule the stop event
        Tone.Transport.scheduleOnce(time => {
            osc1.stop(time);
            osc2.stop(time);
            osc3.stop(time);
            lfoPitch.stop(time);
            lfoAmp.stop(time);
            modDepth.stop(time);
            console.log("Drone ended.");
        }, Tone.now() + duration);

        // Start the transport loop to keep the ambience going
        Tone.Transport.start();
    }

    // --- User Interaction ---
    document.getElementById('startButton').addEventListener('click', async () => {
        await Tone.start();
        console.log("Audio Context Started.");
        playDrone(20); // Play drone for 20 seconds
    });

    console.log("Ambient Drone Synth Ready. Click 'Start' button.");
}

// Setup the necessary HTML structure and run the initialization
document.body.innerHTML = `
    <button id="startButton">Start Ambient Drone</button>
    <p>(Requires user interaction to start audio context)</p>
`;

setupAmbientDrone();
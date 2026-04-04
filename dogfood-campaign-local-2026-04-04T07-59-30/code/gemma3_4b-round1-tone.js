import * as Tone from "tone";

function createAmbientDrone() {
    // 1. Reverb Effect
    const reverb = new Tone.Reverb({
        decay: 8,
        wet: 0.7,
        damping: 0.5
    }).toDestination();

    // 2. Delay Effect
    const delay = new Tone.FeedbackDelay("2s", 0.5).connect(reverb);

    // 3. Oscillators (Multiple sources for richness)
    const synth = new Tone.PolySynth(Tone.AMSynth, {
        oscillator: {
            type: "sine",
        },
        envelope: {
            attack: 4,
            decay: 0.5,
            sustain: 0.8,
            release: 6
        }
    }).connect(delay);

    // 4. Low Frequency Oscillator (LFO) for subtle modulation
    // Modulate the frequency slightly using a slow LFO
    const lfo = new Tone.LFO({
        frequency: "0.1", // Very slow wobble
        depth: 5,         // Small frequency shift (e.g., 5 cents)
        type: "sine"
    }).start();

    // Connect LFO to the main oscillator's frequency parameter
    // We use a slight modulation depth to keep it ambient, not jarring.
    synth.frequency.mult(1).connect(lfo); // Simple connection for demonstration, advanced modulation is often done via nodes

    // --- Setup the Drone Sound ---
    const rootNote = "C2";
    const notes = ["C2", "Eb2", "G2", "Bb2"]; // A simple, slightly dissonant chord voicing

    // 5. Scheduling the Drone Playback
    let startTime = Tone.Transport.seconds;

    // Schedule the notes to play continuously for a duration
    Tone.Transport.scheduleRepeat(time => {
        // Triggering the notes multiple times to maintain the drone texture
        synth.triggerAttackRelease(notes, "4n", time, 0.8);
    }, "2n"); // Repeats every half note

    // 6. Initializing and Starting
    console.log("--- Ambient Drone Synthesizer Loaded ---");
    console.log("Playing drone background sound. Click 'Start' button or wait for Tone.js context to resume.");

    // Start the transport to begin the looping sound
    Tone.Transport.start();

    // Return controls for user interaction
    return {
        stop: () => {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            console.log("Drone stopped.");
        },
        // In a real app, you'd expose controls to change LFO depth, reverb time, etc.
        reverb: reverb,
        delay: delay,
        synth: synth
    };
}

// Example Usage:
// To run this in a browser environment, you must trigger the audio context via a user gesture.
document.body.innerHTML = `
    <button id="startButton">Start Ambient Drone</button>
    <button id="stopButton" disabled>Stop Drone</button>
    <p>Check the console for status messages.</p>
`;

let droneControls = null;

document.getElementById('startButton').addEventListener('click', async () => {
    await Tone.start();
    droneControls = createAmbientDrone();
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (droneControls) {
        droneControls.stop();
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    }
});
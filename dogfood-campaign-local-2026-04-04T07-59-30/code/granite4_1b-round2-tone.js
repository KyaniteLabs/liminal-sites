// Initialize Tone.js context
const context = new Tone.context();

// 1. Sound Source (Multiple Oscillators)
const sawOsc = new Tone.Oscillator(440, "sawtooth").start();
const sineOsc = new Tone.Oscillator(440, "sine").start();

// 2. Effects Chain
const reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.5
}).toDestination();

const delay = new Tone.FeedbackDelay("8n", 1).connect(reverb);

// 3. Signal Routing
// Connect oscillators -> delay -> reverb -> destination
sawOsc.connect(delay);
sineOsc.connect(delay);

// 4. Modulation (LFOs)
// LFO 1: Pitch modulation (slow drift)
const lfoPitch = new Tone.LFO("0.1s", 430, 460).start();
sawOsc.frequency.connect(lfoPitch.output);

// LFO 2: Amplitude modulation (subtle wobble)
const lfoAmp = new Tone.LFO("1s", 0.9, 1.1).start();
sineOsc.volume.connect(lfoAmp.output);

// 5. Envelope/Control (Sustained Drone)
function playDrone() {
    // Set initial frequencies and volumes
    sawOsc.frequency.value = 440;
    sineOsc.volume.value = 1;

    // Start the LFOs and the sound
    lfoPitch.start();
    lfoAmp.start();

    // Use a Tone.Loop or simple scheduling for continuous sound
    Tone.Transport.scheduleRepeat((time) => {
        // Optional: slight frequency shift every few seconds
        sawOsc.frequency.setValueAtTime(Math.random() * 5 + 440, time);
    }, "2n");

    Tone.Transport.start();
}

// Start the sound after a small delay
document.body.addEventListener('click', () => {
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    playDrone();
}, { once: true });

// Initial state setup (optional, for testing)
// To run the code, you must click anywhere on the page.
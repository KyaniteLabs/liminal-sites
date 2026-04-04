// Global setup and safety checks
let synth, reverb, delay, lfo1, lfo2;

async function initializeDrone() {
    // Ensure Tone.js context is running
    await Tone.start();

    // 1. Setup Signal Chain and Effects
    reverb = new Tone.Freeverb("8s", 0.5).toDestination();
    delay = new Tone.PingPongDelay("4n", 0.5).connect(reverb);

    // 2. Setup Oscillators (Multiple voices for richness)
    const baseFreq = "C2"; // Root note
    const oscillators = [
        new Tone.Oscillator(baseFreq, "sine").start(),
        new Tone.Oscillator(baseFreq + 20, "triangle").start(), // Major third
        new Tone.Oscillator(baseFreq + 40, "sawtooth").start()  // Perfect fourth
    ];

    // Connect oscillators to the delay
    oscillators.forEach(osc => {
        osc.connect(delay);
    });

    // 3. Setup LFOs for modulation
    // LFO 1: Slow frequency modulation (Subtle movement)
    lfo1 = new Tone.LFO("0.1s", 0, 0.05).start();
    
    // LFO 2: Medium amplitude modulation (Pulsing)
    lfo2 = new Tone.LFO("2s", 0.5, 1.5).start();

    // 4. Apply Modulation
    // Modulate the frequency of the first oscillator
    lfo1.connect(oscillators[0].frequency); 

    // Modulate the amplitude of the second oscillator
    lfo2.connect(oscillators[1].volume); 

    // 5. Start the Drone
    console.log("Ambient Drone Activated.");
    
    // Set the initial frequency and sustain the sound
    oscillators.forEach(osc => {
        osc.frequency.value = parseFloat(baseFreq.match(/([a-g])([0-9])/)[0]) * 100; // Initial frequency setting
        osc.volume.value = -12; // Start at a manageable volume
    });
}

// User interaction handler to start the audio context
document.addEventListener('click', () => {
    if (!synth) {
        initializeDrone();
    } else {
        console.log("Drone already running.");
    }
}, { once: true });

// Optional: Add a stop function
window.stopDrone = () => {
    if (lfo1) lfo1.stop();
    if (lfo2) lfo2.stop();
    const oscillators = [
        new Tone.Oscillator("C2", "sine").toDestination(), // Dummy reference to access existing oscillators
        new Tone.Oscillator("C4", "triangle").toDestination(),
        new Tone.Oscillator("E4", "sawtooth").toDestination()
    ];
    oscillators.forEach(osc => osc.stop());
    console.log("Ambient Drone Stopped.");
};
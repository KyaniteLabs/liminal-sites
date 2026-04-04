// Global setup for Tone.js (assuming Tone.js is loaded)
let synth;
let reverb;
let delay;
let lfoPitch;
let lfoFilter;

async function setupDrone() {
    // 1. Initial Synthesis Setup (Multiple Oscillators)
    const osc1 = new Tone.Oscillator(60, "sine").toDestination();
    const osc2 = new Tone.Oscillator(62, "sine").toDestination();
    const osc3 = new Tone.Oscillator(65, "sine").toDestination();

    // Use a Tone.Merge to combine the signals
    const merger = new Tone.Merge();
    osc1.connect(merger);
    osc2.connect(merger);
    osc3.connect(merger);
    
    // 2. Aggressive Filtering (for character)
    const filter = new Tone.Filter(200, "lowpass").toDestination();
    merger.connect(filter);

    // 3. Effects Chain
    reverb = new Tone.Reverb({
        decay: 8, 
        wet: 0.5
    }).toDestination();
    
    delay = new Tone.FeedbackDelay("2n", 0.5).connect(reverb);
    
    // Connect the main signal through the delay and then to the reverb
    filter.connect(delay);
    
    // 4. Modulation Sources (LFOs)
    
    // LFO for subtle pitch drift (slow, sine wave)
    lfoPitch = new Tone.LFO("1.5s", 0.98, 1.02).start(); 
    
    // LFO for filter cutoff modulation (medium rate, saw wave for sweep)
    lfoFilter = new Tone.LFO("1s", 0.7, 1.3).start(); 

    // 5. Connecting Modulation
    
    // Modulate Pitch: Connect the LFO to the frequency parameter of the oscillators
    osc1.frequency.sync().value = 60;
    osc2.frequency.sync().value = 62;
    osc3.frequency.sync().value = 65;

    // Use LFO to modulate the base frequency of the oscillators
    osc1.frequency.connect(lfoPitch.toDestination());
    osc2.frequency.connect(lfoPitch.toDestination());
    osc3.frequency.connect(lfoPitch.toDestination());

    // Modulate Filter: Connect the LFO to the frequency parameter of the filter
    lfoFilter.connect(filter.frequency);

    // 6. Start the Sound
    
    // Set initial amplitude and start the oscillators
    osc1.volume.value = -10;
    osc2.volume.value = -10;
    osc3.volume.value = -10;

    // Start all components
    Tone.Transport.bpm.value = 60; // Set a stable base speed
    Tone.Transport.start();
    
    osc1.start();
    osc2.start();
    osc3.start();
    lfoPitch.start();
    lfoFilter.start();
    
    console.log("Ambient Drone Synth Active.");
}

// Execute setup when the user interacts (best practice for Tone.js)
document.addEventListener('click', setupDrone, { once: true });
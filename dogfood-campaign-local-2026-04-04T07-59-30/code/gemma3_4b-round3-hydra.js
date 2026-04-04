// Hydra Video Synth Patch: Chromatic Feedback Geometry
// Goal: Visually striking, self-modulating, color-shifting geometric patterns with heavy feedback.

// --- Global Setup ---
    resolution: 1920x1080;
    frame_rate: 60;
    feedback_depth: 0.85; // High feedback for strong visuals
    master_output: "Screen";

// --- Oscillators & Generators ---
    type: "Sawtooth";
    frequency: [3, 15]; // Low base frequency modulation
    mod_source: "LFO_A";
    output: "Wave_A";

    type: "Sine";
    frequency: [0.5, 5]; // Slow, evolving frequency
    mod_source: "LFO_B";
    output: "Wave_B";

// --- Noise & Texture ---
    type: "Perlin";
    scale: [0.01, 0.1]; // Controls pattern detail
    output: "Texture_Noise";

// --- Modulators (LFOs & Envelopes) ---
    type: "Sine";
    rate: [0.1, 1.5]; // Controls frequency/phase shifting
    output: "Mod_Rate_A";

    type: "Triangle";
    rate: [0.05, 0.8]; // Controls amplitude/geometry pulsing
    output: "Mod_Rate_B";

    type: "ADSR";
    attack: 1.0;
    decay: 0.5;
    sustain: 0.8;
    release: 2.0;
    output: "Mod_Env_Slow";

// --- Geometric Pattern Engine (Initial Structure) ---
// Uses Sine/Cosine mapping to create coordinates over time
    input_A: osc_1.output;
    input_B: osc_2.output;
    time_input: "Time";
    // Maps oscillating signals to X/Y coordinates (e.g., Lissajous curves or wave interference)
    output: "Pattern_Coords";

// --- Color Shifting & Hue Modulation ---
    input_signal: "Pattern_Coords";
    hue_source: "LFO_A"; // Use LFO A to sweep hue slowly
    saturation_source: "Mod_Env_Slow"; // Use Env to pulse saturation
    output: "Color_Shift";

// --- Feedback Loop Core (The Visual Engine) ---
    input_signal: "Pattern_Coords";
    feedback_depth: 0.85;
    feedback_source: "Feedback_Output"; // Connects output back to input
    output: "Feedback_Output";

// --- Final Synthesis & Blending ---
// Mix core elements: Geometry -> Color -> Feedback
    geometry_input: "Pattern_Coords";
    color_input: "Color_Shift";
    feedback_input: "Feedback_Output";
    
    // Apply the feedback loop to the rendered image itself for self-causality
    feedback_connection: feedback_processor.output; 
    
    // Use the noise texture to add high-frequency detail/grain
    texture_input: "Texture_Noise";
    
    // Final blending: Geometric structure modulated by color, stabilized by feedback, detailed by noise.
    blend_mode: "Overlay + Additive"; 
    output: "Master_Output";

// --- Connections ---
connect(lfo_A.output, osc_1.mod_source);
connect(lfo_B.output, osc_2.mod_source);

connect(osc_1.output, geometry_mapper.input_A);
connect(osc_2.output, geometry_mapper.input_B);
connect("Time", geometry_mapper.time_input);

connect(geometry_mapper.output, color_modulator.input_signal);
connect(lfo_A.output, color_modulator.hue_source);
connect(env_slow.output, color_modulator.saturation_source);

connect(geometry_mapper.output, feedback_processor.input_signal);
connect(feedback_processor.output, feedback_processor.feedback_source); // Feedback connection

connect(geometry_mapper.output, renderer.geometry_input);
connect(color_modulator.output, renderer.color_input);
connect(feedback_processor.output, renderer.feedback_input);
connect(noise_gen.output, renderer.texture_input);

// Visualize the final output
patch_output(renderer.output, "Master_Output");
.out(o0)
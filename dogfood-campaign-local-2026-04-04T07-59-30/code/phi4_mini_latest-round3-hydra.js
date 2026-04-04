// Hydra Video Synth Patch: Chromatic Feedback Geometry

    // --- Core Components ---

    // 1. Time/Pattern Source
    let time_source = time(frequency: 1.0);

    // 2. Color Modulation LFOs
    let hue_mod = lfo(frequency: 0.1, depth: 0.5);
    let sat_mod = lfo(frequency: 0.05, depth: 0.8);
    let lum_mod = lfo(frequency: 0.15, depth: 0.3);

    // 3. Geometric Pattern Generator (Interacting Sine Waves)
    // Creates a complex, oscillating wave pattern
    let pattern_A = sine(time_source * 2.0 + 0.0);
    let pattern_B = sine(time_source * 1.5 - 1.0);
    let pattern_C = sine(time_source * 1.8 + 2.0);

    // Combine patterns to define coordinates or shape parameters
    let geometry_input = mix(
        pattern_A,
        pattern_B,
        pattern_C,
        weights: [0.4, 0.3, 0.3]
    );

    // 4. Color Mixer (Applying modulation)
    let base_color = color(hue: 0.0, saturation: 1.0, luminosity: 0.8);
    let shifted_color = map_color(
        base_color,
        hue_offset: hue_mod * 10.0, // Modulate Hue
        saturation_offset: sat_mod * 1.0, // Modulate Saturation
        luminosity_offset: lum_mod * 0.5 // Modulate Brightness
    );

    // 5. Main Visualizer (Drawing the geometry with color)
    // This node takes the geometry data and colors it based on the modulated color
    let visual_output = draw_pattern(
        data: geometry_input,
        color: shifted_color,
        resolution: [1920, 1080],
        detail: 0.7
    );

    // 6. Feedback Loop Implementation
    // Create a delay/feedback node that echoes the visual signal
    let feedback_delay = delay(time_ms: 300, feedback: 0.6);

    // Route the main output through the delay, and then mix the delayed signal back in
    let feedback_signal = feedback_delay(visual_output);

    // Final Mixer: Combine the clean signal with the decaying, colored feedback trail
    let final_output = mix(
        visual_output,       // Current frame
        feedback_signal,     // Echo/Feedback trail
        weights: [0.8, 0.2]
    );

    // --- Output ---
    output(final_output);
.out(o0)
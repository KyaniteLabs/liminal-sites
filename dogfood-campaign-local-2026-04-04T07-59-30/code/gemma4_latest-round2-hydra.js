// Hydra Video Synth Patch: Feedback Kaleidoscope

// --- Global Settings ---
// Set a high refresh rate and resolution for visual impact
set_global_params(fps=60, resolution="1920x1080")

// --- Input Sources ---
// 1. Base Noise Source (For texture and randomness)
noise_input("NoiseSourceA", type="PerlinNoise", params={frequency: 0.01, octaves: 5, scale: 1.0})

// 2. Time/Clock Source (For rhythmic modulation)
clock_input("ClockSource", type="TimeSignal", params={rate: 1.0})

// 3. Color Cycling Source (For smooth hue transitions)
lfo_input("HueLFO", type="SinusoidalLFO", params={rate: 0.1, range: 1.0, offset: 0.0})

// --- Effects & Processing Blocks ---

// A. Geometric Pattern Generator (Sine Waves mapping)
// Creates structured, wave-like patterns based on time and space.
wave_pattern_node("GridWave", type="SineWaveMapper", params={
    amplitude: 1.0,
    frequency_mod: "ClockSource", // Modulated by time
    phase_shift: 0.0,
});

// B. Color Shifting & Modulation (Mapping LFO to Color Space)
// Mixes the core noise with the LFO output to drive color changes.
color_mixer_node("ColorDriver", type="HSV_Modulator", params={
    hue_input: "HueLFO",
    saturation_input: "NoiseSourceA",
});

// C. Feedback Loop Implementation (The core visual element)
// Use a feedback delay or buffer to make the output influence itself.
feedback_delay_node("FeedbackLoop", type="DelayBuffer", params={
    delay_time: 0.1, // Short delay for immediate feedback
    feedback_amount: 0.7, // Strong feedback to create trails
});

// D. Final Visualization/Output Stage
// Combines patterns, color, and feedback into the final output.
visualizer_node("FinalOutput", type="CompositeRenderer", params={
    geometry_source: "GridWave",
    color_source: "ColorDriver",
    feedback_source: "FeedbackLoop",
    blend_mode: "Additive", // High contrast blending
    intensity_boost: 1.5
});


// --- Connection Graph ---

// 1. Connect Time/Clock: Drives wave frequency and value modulation.
connect("ClockSource.output", "GridWave.frequency_mod")
connect("ClockSource.output", "ColorDriver.value_input")

// 2. Connect Noise: Provides texture/amplitude variation.
connect("NoiseSourceA.output", "ColorDriver.saturation_input")

// 3. Connect Color LFO: Drives hue cycling.
connect("HueLFO.output", "ColorDriver.hue_input")

// 4. Create Initial Pattern Output (Needs to be visible before feedback)
// The initial pattern output is fed into the feedback delay.
connect("GridWave.output", "FeedbackLoop.input_source")

// 5. Connect Feedback Output back into the system:
// The delayed, processed signal feeds back into the wave generator's geometry input
// to distort subsequent frames based on previous ones.
connect("FeedbackLoop.output", "GridWave.geometry_source")

// 6. Final Render Chain:
// The final visualizer takes the structured geometry, the shifted color, and the feedback trail.
connect("GridWave.output", "FinalOutput.geometry_source")
connect("ColorDriver.output", "FinalOutput.color_source")
connect("FeedbackLoop.output", "FinalOutput.feedback_source")

// --- Output ---
output("FinalOutput.output")
.out(o0)
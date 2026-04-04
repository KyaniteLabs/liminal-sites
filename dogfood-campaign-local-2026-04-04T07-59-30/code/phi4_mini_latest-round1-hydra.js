// Hydra Video Synth Patch: Psychedelic Feedback Geometry

// --- Global Settings ---
// Set resolution or context if necessary, assuming the environment handles it.

// --- 1. Core Pattern Generator (Geometric Base) ---
// Uses multiple sine/square waves combined to create complex, shifting patterns.
Oscillator(freq=10, wave="sine", name="Base_Osc_1") -> Waveshaper(name="Pattern_Warp", type="Saw")
Oscillator(freq=20, wave="square", name="Base_Osc_2") -> Waveshaper(name="Pattern_Warp", type="Square")
Oscillator(freq=15, wave="saw", name="Base_Osc_3") -> Waveshaper(name="Pattern_Warp", type="Triangle")

// Combine the warped signals to form the core geometric texture
Waveshaper("Pattern_Warp") -> Mixer(name="Geo_Mixer", inputs=3) -> VideoOutput(name="Geometric_Pattern")

// --- 2. Color Shifting Mechanism (LFO/Color Mapping) ---
// A slow, complex LFO driving hue/color parameters.
LFO(rate=0.1, shape="sine", name="Color_LFO_1") -> ColorMapper(input="Hue", scale=1.0)
LFO(rate=0.05, shape="random", name="Color_LFO_2") -> ColorMapper(input="Saturation", scale=1.5)

// Use the color mapper output to modulate parameters downstream (e.g., contrast, shift amount)
ColorMapper("Color_LFO_1") -> Gain(name="Hue_Mod")
ColorMapper("Color_LFO_2") -> Gain(name="Sat_Mod")

// --- 3. Feedback Loop (Psychedelic Element) ---
// Feed the output back into itself, modulated by a delay/feedback node.
VideoOutput("Geometric_Pattern") -> Delay(delay_time=0.1, feedback=0.5, name="Feedback_Delay")
Delay("Feedback_Delay") -> Mixer(name="Feedback_Mixer", inputs=2) // Mix with original signal

// --- 4. Final Assembly and Output ---
// Mix the clean geometric pattern with the rich, evolving feedback.
Mixer("Geo_Mixer") -> Mixer(name="Master_Mixer", inputs=2)
Mixer("Feedback_Mixer") -> Mixer("Master_Mixer", inputs=2)

// Apply final color/intensity adjustments using the modulators
Gain("Hue_Mod") -> ColorCorrection(param="HueShift", value_source="input")
Gain("Sat_Mod") -> ColorCorrection(param="Saturation", value_source="input")

// Final Output
ColorCorrection("Master_Mixer") -> Output(name="Striking_Synth_Output")
.out(o0)
// ===================================================================
// HYDRA PATCH: CHRONOS_FEEDBACK_SYNTH
// A visually dense, oscillating, color-shifting feedback matrix.
// ===================================================================

// --- Global Time and Noise Sources ---
TIME_SRC = [Clock](rate=1.0, output="time");
NOISE_SRC = [NoiseGenerator](seed=42, output="noise");

// --- Core Geometric Pattern Generators ---

// 1. Primary Sine Wave Oscillation (The Grid Base)
SINE_A = [Oscillator](type="sine", freq=1.0, output="sine_a");

// 2. Complex Pattern Driver (Cos/Sin Combination)
SIN_B = [Oscillator](type="cosine", freq=0.5, output="cosine_b");
COS_B = [Oscillator](type="cosine", freq=0.5, output="cosine_b_2");

// 3. Feedback Accumulator (The Self-Referential Element)
// This node takes its own output as input to create feedback loops.
FEEDBACK_LOOP = [Delay](max_samples=128, feedback_gain=0.7, input="in_fb", output="fb_out");

// --- Color and Intensity Shifting ---

// 4. Color Shift Driver (Mapping Time/Noise to Hue)
// Maps time input to a smooth hue cycle (0-1).
COLOR_HUE = [Mapper](input="time", output="hue_shift");

// 5. Intensity Modulation (Pulsing Brightness)
INTENSITY_MOD = [AmplitudeModulator](input="noise", output="intensity_pulse");

// --- Synthesis and Combination ---

// 6. Dynamic Pattern Generator (Combining geometric inputs)
// Sums and modulates the primary patterns for complexity.
PATTERN_DRIVER = [Mixer](inputs=["sine_a", "cosine_b", "cosine_b_2"], mix_mode="sum", output="geom_base");

// 7. Feedback Integration Stage
// The core feedback loop: Input -> Pattern Driver -> Feedback Loop -> Output
FEEDBACK_INPUT = [Mixer](inputs=["geom_base", "fb_out"], mix_mode="add", output="fb_input");

// 8. Main Visual Output Stage
// Combines the geometric pattern, the color shift, and the intensity modulation.
OUTPUT_SYNTH = [VisualSynth](
    pattern_source="fb_input",
    color_source="hue_shift",
    intensity_source="intensity_pulse",
    output="final_output"
);

// --- Connections and Flow ---

// 1. Time feeds Pattern and Color
[Connection](source="time", target="sine_a", param="freq");
[Connection](source="time", target="COLOR_HUE", param="input");

// 2. Noise feeds Intensity
[Connection](source="noise", target="INTENSITY_MOD", param="input");

// 3. Initial Pattern Build
[Connection](source="sine_a", target="PATTERN_DRIVER", param="inputs[0]");
[Connection](source="cosine_b", target="PATTERN_DRIVER", param="inputs[1]");
[Connection](source="cosine_b_2", target="PATTERN_DRIVER", param="inputs[2]");

// 4. Feedback Loop Setup
[Connection](source="PATTERN_DRIVER", target="FEEDBACK_LOOP", param="in_fb");

// 5. Feedback Integration
[Connection](source="FEEDBACK_LOOP", target="FEEDBACK_INPUT", param="inputs[1]");
[Connection](source="PATTERN_DRIVER", target="FEEDBACK_INPUT", param="inputs[0]");

// 6. Final Output Connection
[Connection](source="INPUT_SYNTH", target="OUTPUT_SYNTH", param="pattern_source");
[Connection](source="COLOR_HUE", target="OUTPUT_SYNTH", param="color_source");
[Connection](source="INTENSITY_MOD", target="OUTPUT_SYNTH", param="intensity_source");

// --- End of Patch ---
.out(o0)
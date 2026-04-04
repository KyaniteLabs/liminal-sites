// Hydra Video Synth Patch: Chromatic Feedback Bloom

// --- Global Setup ---
// Set up a deep, enveloping ambiance with complex modulation.
// We will use multiple interconnected sources and feedback loops.

// --- Core Oscillators / Sources ---

// 1. Main Carrier Osc (Sine/Saw for base tone/light)
osc_main(freq=440, wave=SAW, name="Carrier_Osc");

// 2. Noise Source (For texture and randomness)
noise_source(name="Texture_Noise");

// 3. LFO/Modulator Oscillator (Slow, sweeping movement)
lfo_slow(freq=0.1, depth=1.0, name="Mod_LFO");

// --- Geometric Pattern Generation ---

// A complex wave shape generator that reacts to modulation.
// Use a WaveShaper or a series of fast, interacting oscillators.
wave_shaper_geo(input_freq=2000, input_amp=1.0, name="Geo_Wave");

// Modulate the frequency of the geometry based on the LFO and noise.
mod_freq_geo(source1="Mod_LFO", source2="Texture_Noise", output_node="Geo_Modulator");
connect(source="Geo_Modulator", target="Geo_Wave", type="FreqMod");


// --- Color Shifting / Hue Control ---

// Use a slow sine wave to drive color coordinates (Hue shift).
color_osc(freq=0.05, wave=SIN, name="Color_Driver");

// Map the output of the color driver to the main output node's color control.
// This assumes the rendering environment supports HSL/HSV color control via parameters.
map_hue(source="Color_Driver", target="Output_Node", param="Hue", range=[0, 360]);


// --- Feedback Effects Loop ---

// 1. Delay Unit (Creates echoes and temporal smear)
delay(time=0.3, feedback=0.5, name="Echo_Delay");

// 2. Reverb/Convolution (Adds space and density)
reverb(mix=0.4, decay=2.0, name="Space_Reverb");

// 3. Feedback Connection
// Feed the output of the Reverb back into the input of the Delay, creating an unstable, growing tail.
connect(source="Space_Reverb", target="Echo_Delay", type="FeedbackIn");

// --- Signal Flow & Mixing ---

// 1. Primary Signal Path: Carrier -> Geo Pattern -> Mix
connect(source="Carrier_Osc", target="Mixer_Main", type="Signal");
connect(source="Geo_Wave", target="Mixer_Main", type="Signal");

// 2. Texture Integration: Noise mixed into the main body
connect(source="Texture_Noise", target="Mixer_Main", type="Mixer", amount=0.3);

// 3. Feedback Integration: The processed signal feeds into the main mix.
connect(source="Echo_Delay", target="Mixer_Main", type="Signal");

// 4. Final Processing Chain (The combined signal goes through the space and then to output)
connect(source="Mixer_Main", target="Space_Reverb", type="Signal");

// 5. Final Output Connection
connect(source="Space_Reverb", target="Output_Node", type="Signal");


// --- Visual Styling & Dynamics ---

// Global Parameter Modulation (Making it breathe)
// Modulate the overall amplitude of the mix based on the slow LFO.
connect(source="Mod_LFO", target="Mixer_Main", type="GainMod");

// Set initial global parameters for maximum visual impact
set_param("Output_Node", "Gain", 1.0);
set_param("Mixer_Main", "DryWet", 1.0);
set_param("Echo_Delay", "Feedback", 0.6); // Increase feedback slightly for instability
set_param("Color_Driver", "Amplitude", 0.5); // Keep color modulation subtle but present

// --- Summary ---
// This patch creates a self-sustaining, evolving soundscape.
// The 'Carrier_Osc' provides the core structure.
// The 'Geo_Wave' adds sharp, modulated visual/frequency content.
// The 'Echo_Delay' and 'Space_Reverb' create deep, decaying feedback tails.
// The 'Color_Driver' ensures the entire visual output shifts slowly through the spectrum.
.out(o0)
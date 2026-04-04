# Set global resolution/frame rate (assumed context)


# 1. Primary Pattern Generator (Geometric Basis)
# Uses multiple interacting sine waves for complex geometry (e.g., interference patterns)
osc_A = Oscillator(frequency_range=[0.1, 2.0], waveform="sine", name="Pattern_A")
osc_B = Oscillator(frequency_range=[0.2, 3.0], waveform="sine", name="Pattern_B")
osc_C = Oscillator(frequency_range=[0.05, 1.5], waveform="sine", name="Pattern_C")

lfo_1 = LFO(rate_range=[0.5, 5.0], shape="triangle", name="Global_Rate_Mod")
lfo_2 = LFO(rate_range=[0.1, 1.0], shape="sawtooth", name="Detail_Mod")

# 2. Color Shifting Mechanism (Hue Cycling)
# Use a slow, complex oscillator to drive the Hue channel over time
hue_driver = Oscillator(frequency_range=[0.01, 0.05], waveform="sine", name="Color_Cycle")
color_mapper = ColorMapper(input_signal=hue_driver, input_range=[0, 1], output_range=[0, 1], name="Hue_Output")

# 3. Feedback Loop Implementation
# The initial signal is processed, and a fraction of the output feeds back into the input mixer.
feedback_amount = 0.7  # Controls stability/intensity
feedback_node = Feedback(amount=feedback_amount, name="Main_Feedback_Loop")

# 4. Mixing and Output Stage
mixer_pattern = Mixer(inputs=[osc_A, osc_B, osc_C], mix_strategy="add", name="Pattern_Mixer")

# --- Patch Wiring (Connections) ---

# 1. Modulating Geometry (Movement)
osc_A.frequency.connect(lfo_1.output, scale=0.5)
osc_B.frequency.connect(lfo_2.output, scale=0.8)
osc_C.amplitude.connect(lfo_1.output, scale=0.2)

# 2. Color Linking (Visual Effect)
mixer_pattern.phase_mod.connect(color_mapper.output, scale=1.0)

# 3. Feedback Integration
# Input (Initial Signal) -> Pattern_Mixer -> Feedback_Node -> Input (Feedback)
feedback_input = mixer_pattern.output
feedback_output = feedback_node.process(feedback_input)

final_mixer = Mixer(inputs=[mixer_pattern.output, feedback_output], mix_strategy="multiply", name="Final_Visual_Mixer")

# 4. Final Output Routing
# The final output is passed through the color mapping adjustment before rendering.
final_output = final_mixer.output.connect(color_mapper.output, scale=1.0)

Renderer.set_output(final_output)
Renderer.set_color_mapping(color_mapper.output, target_channels=["R", "G", "B"], mode="HSV_SHIFT")
Renderer.set_feedback_intensity(feedback_amount * 1.2) # Slightly boost feedback visibility
Renderer.set_global_scale(1.0)
.out(o0)
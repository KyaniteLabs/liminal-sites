// --- Main Patch Definition: Psychedelic Feedback Engine ---

// 1. Core Generators
[NoiseGenerator](frequency=1.0, scale=0.5, output_range=-1.0 to 1.0) as N_Base;
[TimeSource](rate=60.0, phase_shift=0.0) as T_Clock;
[PatternSynth](type=Voronoi, seed=123, complexity=4) as P_Geom;

// 2. Color & Modulation Control
[ColorMapper](input_signal=N_Base.output, hue_source=T_Clock.output, saturation_mod=0.8) as C_Shift;
[Oscillator](type=Sine, freq_base=1.0, mod_depth=0.5) as O_Mod;

// 3. Pattern Processing & Feedback Loop 1 (Structure)
[LFO](type=Triangle, rate_base=0.1, depth=0.2) as L_Tempo;
[WaveShaper](input=P_Geom.output, curve_params=[0.5, 1.2]) as W_Shape;

// Feedback Loop 1: Feed the structured pattern back into the generator for self-distortion
W_Shape.output -> [FeedbackNode](rate=0.8, gain=0.7) as FB_Struct;
FB_Struct.output -> P_Geom.input_modifier;

// 4. Sound/Visual Processing Core (The Synth)
// Combine the modulated noise, the geometric pattern, and the color data
[Mixer](inputs=[N_Base.output, P_Geom.output, C_Shift.output], blend_weights=[0.4, 0.4, 0.2]) as M_Primary;

// 5. Secondary Feedback & Distortion Loop 2 (Psychedelic Effect)
[FilterBank](type=BandPass, cutoff_base=200.0, resonance_mod=L_Tempo.output) as F_Filter;

// Modulator for the filter cutoff, making it react to the time source
T_Clock.output -> [Scale](input=T_Clock.output, factor=5.0) as S_Cutoff;
S_Cutoff.output -> F_Filter.cutoff_frequency;

// Feedback Loop 2: Feed the filtered output back into the noise source (creating spectral feedback)
F_Filter.output -> [FeedbackNode](rate=0.6, gain=0.6) as FB_Spectral;
FB_Spectral.output -> N_Base.input_modifier;

// 6. Final Output Stage
[Distortion](input=M_Primary.output, drive_level=1.5, shape=Sawtooth) as D_Output;

// Final Visual Output (Connecting the processed signal)
D_Output.output -> [OutputDisplay](mode=HighContrast, palette=Psychedelic);

// --- Connections ---
// Primary Data Flow
T_Clock.output -> C_Shift.hue_source;

// Modulation Linkages
L_Tempo.output -> O_Mod.freq_base;
O_Mod.output -> P_Geom.seed_modifier; // Use LFO to modulate pattern seed

// Final Wiring
N_Base.output -> M_Primary.inputs[0];
P_Geom.output -> M_Primary.inputs[1];
C_Shift.output -> M_Primary.inputs[2];
.out(o0)
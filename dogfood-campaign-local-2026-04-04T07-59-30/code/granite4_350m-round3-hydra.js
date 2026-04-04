# --- Core Noise Source (The Engine) ---
    type: noise
    frequency: 0.001
    amplitude: 1.0

# --- Geometric Structure (The Pattern Generator) ---
# Generates structured, repeating patterns based on time and coordinates
        A: time * 0.5
        B: sin(frame_count * 0.01) * 0.5
        C: cos(frame_count * 0.008) * 0.5

# --- Time and Color Modulation (The Shifter) ---
# Creates a slow, cyclical color shift and secondary modulation source
    speed: 0.1
    palette: [0, 1, 0.5, 1] # Defines a rich, shifting palette

# --- Feedback Implementation (The Self-Sustainer) ---
# Takes the output and feeds it back into the structure, creating complex feedback trails
    intensity: 0.8

# --- Synthesis Stage (Combining Elements) ---

# 1. Combine Noise and Geometry: Creates the initial visual density
    inputs: [N_Base, G_Struct]

# 2. Color Application: Maps the density and structure to color space
    inputs: [D_Density, C_Shift]
    gradient: "hsv(t*0.1, 1.0, 1.0)"

# 3. Final Feedback Integration: Blends the structured feedback into the colored output
    inputs: [C_Output, F_Loop]
    mix_factor: 0.6

.out(o0)
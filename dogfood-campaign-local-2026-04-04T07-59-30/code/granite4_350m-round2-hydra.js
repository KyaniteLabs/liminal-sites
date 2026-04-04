// =============================================================================
// PATCH NAME: CHIMERA_SYNTH_FEEDBACK
// DESCRIPTION: Generates a self-referential, color-shifting, geometric video patch.
// =============================================================================

// -----------------
// 1. GLOBAL CONTROLS & TIMING
// -----------------
    TIME_SCALE: 1.0;
    RESOLUTION: 1920x1080;
    FRAME_COUNT: 60;
    FEEDBACK_STRENGTH: 0.85; // Controls persistence and feedback decay

// -----------------
// 2. INPUT & COORDINATE MAPPING
// -----------------
INPUT (UV_coords: [0, 1], TIME: <float>) {
    // Normalize coordinates and apply time offset
    U = UV_coords.x * 2.0 - 1.0;
    V = UV_coords.y * 2.0 - 1.0;
    T = TIME * 0.001 * TIME_SCALE;

// -----------------
// 3. GEOMETRIC PATTERN GENERATION (The Core Structure)
// -----------------
FUNCTION GEOMETRY_FIELD(u, v, t) {
    // Base pattern: Sine waves interacting with time and space
    float p1 = sin(u * 10.0 + t * 0.5) * 0.5 + 0.5;
    float p2 = cos(v * 12.0 - t * 0.3) * 0.5 + 0.5;

    // Introduce a fractal/noise element (pseudo-Perlin/Worley)
    float noise_factor = (sin(u * 3.14 + t*0.1) * 0.5 + 0.5);

    // Combine patterns—create a complex, structured mapping
    float pattern_value = abs(sin(p1 * p2 * noise_factor) * 1.5);

    // Output a normalized value between 0 and 1
    RETURN pattern_value;

// -----------------
// 4. COLOR SHIFTING & PALETTE MAPPING
// -----------------
FUNCTION COLOR_MAP(value, t) {
    // Time-based hue shift (Cycles through the color spectrum)
    float hue = (t * 0.1) + (value * 0.5);

    // Use HSV to manipulate color based on the geometric value and time.
    // H: Hue (0.0 to 1.0, time-driven)
    // S: Saturation (Kept high for striking contrast)
    // V: Value/Brightness (Controlled by the pattern magnitude)
    float saturation = 0.8;
    float brightness = value * 0.9 + 0.1;

    // Convert HSV to RGB (pseudo-function for simplicity)
    COLOR_RGB = HSL_TO_RGB(hue, saturation, brightness);

    RETURN COLOR_RGB;

// -----------------
// 5. FEEDBACK LOOP IMPLEMENTATION (The Recursive Element)
// -----------------
// State variable must persist across frames
    PREVIOUS_FRAME_OUTPUT: [R, G, B];

FUNCTION FEEDBACK_PROCESS(current_output, time) {
    // Mix the current output with a decayed version of the previous frame.
    float mix_factor = FEEDBACK_STRENGTH;

    // Interpolation: Current * (1 - mix) + Previous * (mix)
    float R_final = current_output.R * (1.0 - mix_factor) + STATE.PREVIOUS_FRAME_OUTPUT.R * mix_factor;
    float G_final = current_output.G * (1.0 - mix_factor) + STATE.PREVIOUS_FRAME_OUTPUT.G * mix_factor;
    float B_final = current_output.B * (1.0 - mix_factor) + STATE.PREVIOUS_FRAME_OUTPUT.B * mix_factor;

    // Update state for the next frame
    STATE.PREVIOUS_FRAME_OUTPUT = [R_final, G_final, B_final];

    RETURN [R_final, G_final, B_final];

// -----------------
// 6. MAIN PATCH EXECUTION FLOW
// -----------------
OUTPUT (u, v, t) {
    // STEP 1: Generate the raw geometric data
    float geometry = GEOMETRY_FIELD(u, v, t);

    // STEP 2: Apply color shifting based on geometry and time
    [R_raw, G_raw, B_raw] = COLOR_MAP(geometry, t);

    // STEP 3: Pass the raw color through the feedback loop
    [R_final, G_final, B_final] = FEEDBACK_PROCESS([R_raw, G_raw, B_raw], t);

    // Final Output Color (Normalized 0.0 to 1.0)
    RETURN [R_final, G_final, B_final];
.out(o0)
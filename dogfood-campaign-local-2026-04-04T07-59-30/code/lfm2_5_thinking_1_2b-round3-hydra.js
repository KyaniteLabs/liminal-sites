// CORE PATCH: CYCLIC_FRACTAL_FEEDBACK_SYNTH
// Parameters: Resolution (1920x1080), Frame Rate (60fps)


    // --- 1. GEOMETRIC GENERATOR (The Source Pattern) ---
    // Uses time and multiple frequencies to create complex, repeating geometry.
        Input: Time(t);
        Output: Vector(x, y, scale);
            'Lissajous(t * 0.8, t * 1.2, 0.1)', // Primary orbit
            'Sin(t * 0.5) * Cos(t * 0.3) * 0.5', // Secondary modulation
            'Frac(t * 0.01) * 50.0' // Pseudo-random offset
        ];
            'map(sin(t * 0.5) + cos(t * 0.8), -1, 1, 0.0, 1.0)', // X component
            'map(sin(t * 0.3) * 0.5, -1, 1, 0.0, 1.0)', // Y component
            'abs(sin(t * 0.1 * 0.9))' // Scale/Intensity
        ];

    // --- 2. COLOR SHIFTING (The Chromatic Engine) ---
    // Shifts the color palette based on time and geometric properties.
        Input: Geometry_Source.Output.Scale; // Uses scale as input modulation
        Output: Color(r, g, b);
            'H = mod(t * 0.05 + Geometry_Source.Output.Scale * 0.5, 1.0)', // Hue shifts over time and scale
            'S = 0.8', // Saturation fixed high
            'V = 0.9' // Value fixed high
        ];
            'hsv2rgb(H, S, V)'
        ];

    // --- 3. FEEDBACK LOOP (The Temporal Distortion) ---
    // Looping the output back through a delay and processing to create artifacts and persistence.
        Input: Color_Mapper.Output;
        Delay(D_t=0.1, D_max=1.0); // Short delay buffer
        Feedback_Gain(G=0.9, D_input=Delay_Out); // Reduce gain to prevent blow-up
            'Blend(Input, Delayed_Signal, G)', // Blend current frame with delayed, attenuated frame
            'Noise(t * 0.02 * G) * 0.1' // Add slight noise modulation to the feedback signal
        ];

    // --- 4. FINAL COMPOSER (The Renderer) ---
    // Combines all elements, applies intensity modulation, and outputs the final frame buffer.
        Input_A: Geometry_Source.Output;
        Input_B: Feedback_Loop.Output;
        Input_C: Color_Mapper.Output;

            'Intensity = Input_A.Scale * 1.5', // Use scale for overall brightness modulation
            'Final_Color = Input_C * (1.0 - exp(-0.1 * Intensity))', // Modulate color by dynamic intensity
            'Final_Output = Blend(Input_B, Final_Color, Intensity * 0.5)' // Blend feedback and new color
        ];

        Output: Final_Output;

// EXECUTION CALL
Synth_Patch.Renderer_Output.Run();
.out(o0)
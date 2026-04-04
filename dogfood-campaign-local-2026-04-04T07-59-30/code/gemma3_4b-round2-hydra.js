# hydra_video_synth_patch.py


WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 10  # seconds


def get_color_shift(t, freq_mod=0.5, amp_mod=0.1):
    """Generates a smoothly changing color shift based on time."""
    r_shift = np.sin(t * 0.5 + 0) * 0.5 + 0.5
    g_shift = np.sin(t * 0.5 + 2) * 0.5 + 0.5
    b_shift = np.sin(t * 0.5 + 4) * 0.5 + 0.5
    return r_shift, g_shift, b_shift

def generate_geometric_pattern(t, width, height, scale=0.01, complexity=5):
    """Creates a complex, evolving geometric pattern (e.g., fractal-like interference)."""
    Y, X = np.ogrid[:height, :width]
    center_x, center_y = width // 2, height // 2
    
    time_factor = t * 0.5
    
    # Combine multiple sine waves to create interference patterns (e.g., Lissajous curves or wave interference)
    wave1 = np.sin( (X - center_x) * scale * 5 + time_factor * 1.5)
    wave2 = np.cos( (Y - center_y) * scale * 5 + time_factor * 1.5)
    wave3 = np.sin( (np.sqrt((X - center_x)**2 + (Y - center_y)**2) * scale * 2 + time_factor * 1.0))
    
    intensity = (np.abs(wave1) + np.abs(wave2) + np.abs(wave3)) / 3.0
    
    distortion_map = np.sin(intensity * 10 + time_factor * 2) * 0.1
    
    # Create a base image structure (e.g., smooth gradients)
    base_img = np.zeros((height, width, 3), dtype=np.float32)
    base_img[..., 0] = np.clip(np.cos(X * scale * 0.005 + time_factor * 0.5) + 1, 0, 1)
    base_img[..., 1] = np.clip(np.sin(Y * scale * 0.005 + time_factor * 0.5) + 1, 0, 1)
    base_img[..., 2] = np.exp(-((X - center_x)**2 + (Y - center_y)**2) / (2 * (width/8)**2))
    
    # Apply the geometric pattern (scaled and mapped to color channels)
    pattern_color = np.clip(intensity[..., None] * 0.8 + 0.2, 0, 1)
    
    final_frame = (base_img * 0.5 + pattern_color[:, :, None] * 0.5).astype(np.float32)
    
    return (final_frame * 255).astype(np.uint8)

def apply_feedback_effect(input_frame, t, strength=0.6):
    """Simulates a simple feedback/echo effect by blending the current frame with a delayed/modified version."""
    # In a real video synth, this would involve frame buffering. 
    # Here, we simulate the effect by modifying the input based on time and the previous state (approximated).
    
    # Simple temporal feedback: blend current frame with a slightly shifted, dimmed version of itself.
    # For a true feedback loop, we'd need the previous frame buffer.
    
    # For this demonstration, we'll simulate 'energy decay' or 'ripple' feedback:
    time_ripple = np.sin(t * 1.5) * 0.1 + 0.9
    
    # Dim the input slightly, and add a ripple based on the time factor
    feedback_frame = cv2.addWeighted(input_frame, 0.9, input_frame, 0.1, 0)
    
    # Add a subtle, oscillating noise texture to enhance the 'synth' feel
    noise = np.random.randint(-30, 30, input_frame.shape, dtype=np.int16)
    output_frame = cv2.add(input_frame.astype(np.int16), noise)
    output_frame = np.clip(output_frame, 0, 255).astype(np.uint8)
    


def generate_video_sequence(output_path, width, height, fps, duration):
    print("Starting video synthesis...")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    num_frames = fps * duration
    
    for i in range(num_frames):
        t = i / fps  # Time in seconds
        
        # 1. Generate Core Geometric Pattern (The primary visual source)
        pattern_frame = generate_geometric_pattern(t, width, height)
        
        # 2. Apply Color Shifting (Modulating the overall palette)
        r_shift, g_shift, b_shift = get_color_shift(t)
        
        # Create a color overlay based on the shift (this acts like a global filter/wash)
        color_overlay = np.zeros((height, width, 3), dtype=np.uint8)
        color_overlay[..., 0] = int(r_shift * 255)
        color_overlay[..., 1] = int(g_shift * 255)
        color_overlay[..., 2] = int(b_shift * 255)
        
        # Mix the pattern with the color shift (multiplication for color toning)
        toned_frame = cv2.addWeighted(pattern_frame, 0.8, color_overlay, 0.2, 0)
        
        # 3. Apply Feedback/Distortion Effect (The 'Synth' element)
        final_frame = apply_feedback_effect(toned_frame, t)
        
        out.write(final_frame)
        
        if i % (fps * 2) == 0:
            print(f"Processing frame {i}/{num_frames}...")

    out.release()
    print(f"\n--- Synthesis Complete ---")
    print(f"Video saved successfully to {output_path}")

if __name__ == "__main__":
    output_filename = "hydra_synth_visualizer.mp4"
    
    # Note: Requires opencv-python and numpy to be installed.
        generate_video_sequence(
            output_path=output_filename,
            width=WIDTH,
            height=HEIGHT,
            fps=FPS,
            duration=DURATION
        )
        print(f"\nERROR: Could not generate video. Ensure OpenCV and NumPy are installed.")
        print(f"Details: {e}")
.out(o0)
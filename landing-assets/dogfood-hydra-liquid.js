// Liquid morphing with feedback trails
osc(20, 0.1, 1.5)
  .modulate(noise(3, 0.5))
  .rotate(0.5)
  .scale(1.01)
  .modulate(src(o0).scale(1.05))
  .color(0.5, 0.8, 1.0)
  .out(o0)

src(o0)
  .modulate(noise(2, 0.3))
  .color(1.0, 0.6, 0.8)
  .out(o1)

gradient()
  .modulate(noise(4))
  .out(o3)

// Final blend to screen
src(o0)
  .blend(o1, 0.5)
  .blend(o3, 0.3)
  .out()

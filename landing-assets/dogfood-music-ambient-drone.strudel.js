
bps(2)

s("bd:3").sound("kik").gain(0.8).pan(sine.slow(4).range(-0.5, 0.5))
.stack(
  s("bd:3").sound("kik").gain(0.8),
  s("~ hh*2 ~").sound("hat").gain(0.3).speed("1!4 1.5 2!3"),
  s("0 0 ~ 3 0 2 0 5").sound("sawtooth").release(0.5).gain(0.4).delay(0.3),
  s("0 ~ 5 ~ 3 ~ 7 ~").sound("square").n减速(sawtooth.range(0,3).slow(16)).gain(0.25).shape(0.6),
  s("{1*4 2*2 0*3 3*5,8}").sound("808sd").lpf(800).gain(0.35)
).hush()

every(4, x => s("[0 2 4 6 8 10 12]*4").sound("sawtooth").n(x*2).delay(0.4).room(0.5).gain(0.2))
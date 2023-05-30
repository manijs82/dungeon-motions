import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Rect, Grid, Line, Circle, Txt} from '@motion-canvas/2d/lib/components';
import {createRef, makeRef, range} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {all, waitFor} from '@motion-canvas/core/lib/flow';
import {DEFAULT, createSignal} from '@motion-canvas/core/lib/signals';

const RED = '#ff6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';

export default makeScene2D(function* (view) {
  const rects: Rect[] = [];

  view.add(
    <>
      <Grid
        size={1000}
        spacing={() => 100}
        stroke={'#999'}
        lineWidth={1}
        cache
      />

      <Rect
        ref={makeRef(rects, 0)}
        size={[300, 400]}
        position={[-250, 0]}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />

      <Rect
        ref={makeRef(rects, 1)}
        size={[400, 300]}
        position={[200, 50]}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />

      <Rect
        ref={makeRef(rects, 2)}
        size={[300, 400]}
        position={[-50, 200]}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />

    </>
    
  )

  yield* rects[0].position.x(-350, 0.5)
  yield* rects[1].position.y(250, 0.5)
  yield* rects[2].position.x(50, 0.5)
  yield* rects[2].position.y(-200, 0.5)

  const lines: Line[] = [];
  const texts: Txt[] = [];
  const progress = createSignal(0);

  const textStyle = {
    fontWeight: 700,
    fontSize: 56,
    offsetY: -1,
    padding: 20,
    cache: true,
  };

  const textStyle2 = {
    fontWeight: 700,
    fontSize: 56,
    cache: true,
  };

  view.add(
    <>
      <Line
      ref={makeRef(lines, 0)}
        points={[rects[0].position, Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />

      <Line
      ref={makeRef(lines, 1)}
        points={[rects[1].position, Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />

      <Line
      ref={makeRef(lines, 2)}
        points={[rects[2].position, Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />
    </>    
  )

  view.add(
    range(3).map(i =>(
      <>
        <Txt
          ref={makeRef(texts, i)}
          position={() => lines[i].getPointAtPercentage(progress()/2).position}
          text={() => `${lines[i].arcLength().toFixed() / 20.0}`}
          fill={'DarkRed'}
          {...textStyle}
        />
      </>
    ))
  )

  const fitness = createSignal(() => {
    let sum: number = 0;
    lines.forEach(a => sum += a.arcLength() / 20.0);
    return sum;
  });

  view.add(
    <Txt
      position={[400, -400]}
      text={() => `${fitness().toFixed(1)}`}
      fill={'DarkRed'}
      {...textStyle2}
    />  
  )

  yield* progress(1, 1)
  yield* waitFor(2)
});


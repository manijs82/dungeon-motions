import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Rect, Grid, Line, Circle, Txt, Node, Layout} from '@motion-canvas/2d/lib/components';
import {createRef, makeRef, range, useRandom} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {all, waitFor} from '@motion-canvas/core/lib/flow';
import {DEFAULT, createSignal} from '@motion-canvas/core/lib/signals';

const RED = '#ff6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';

const GRID_WIDTH = 10
const GRID_CELL_RES = 100

function CellToScreen(x: number, y: number): Vector2{
  return new Vector2(x * GRID_CELL_RES + GRID_CELL_RES/2, -y * GRID_CELL_RES + GRID_CELL_RES/2)
}

function CellToScreenCustom(x: number, y: number, cell_res: number): Vector2{
  return new Vector2(x * cell_res + cell_res/2, -y * cell_res + cell_res/2)
}

function IndexToScreen(x: number): number{
  return x * GRID_CELL_RES + GRID_CELL_RES/2
}

function RandomCell(): Vector2{
  const random = useRandom();
  const x = random.nextInt(-4, 5);
  const y = random.nextInt(-4, 5);

  return CellToScreen(x, y);
}

export default makeScene2D(function* (view) {
  const rects: Rect[] = [];
  const parent = createRef<Rect>();
  const group = createRef<Rect>();

  view.add(    
    <Rect ref={parent} size={[1000, 1000]} />
  )

  view.add(    
    <Rect ref={group} size={GRID_CELL_RES * GRID_WIDTH}>
      <Grid
        width={'100%'} height={'100%'}
        spacing={() => GRID_CELL_RES}
        stroke={'#999'}
        lineWidth={1}
        cache
      />
      <Rect
        ref={makeRef(rects, 0)}
        width={'10%'} height={'10%'}
        position={RandomCell()}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />
      <Rect
        ref={makeRef(rects, 1)}
        width={'10%'} height={'10%'}
        position={RandomCell()}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />
      <Rect
        ref={makeRef(rects, 2)}
        width={'10%'} height={'10%'}
        position={RandomCell()}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />
    </Rect>
  )

  yield* all(
    group().position(CellToScreenCustom(-2, 2, 250), 0.8),
    group().scale(0.25, 0.8)
  )

  yield* rects[0].position(RandomCell(), 0.5)
  yield* rects[1].position(RandomCell(), 0.5)
  yield* rects[2].position(RandomCell(), 0.5)

  /*
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

  yield* progress(1, 1) */
  yield* waitFor(3) 
});


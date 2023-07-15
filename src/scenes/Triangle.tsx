import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Rect, Grid, Line, Circle, Txt, Node, Layout, View2D} from '@motion-canvas/2d/lib/components';
import {Reference, createRef, makeRef, range, useRandom} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {all, sequence, waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {DEFAULT, createSignal} from '@motion-canvas/core/lib/signals';
import {CodeBlock, lines, edit, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';

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

function* AddTriangle(view: Rect, v0: Vector2, v1: Vector2, v2: Vector2): ThreadGenerator{
  const prog = createSignal(0);
  const lines: Line[] = [];

  view.add(
    <>  
      <Line
        ref={makeRef(lines, 0)}
        points={[v0, v1]}
        lineWidth={8}
        stroke={GREEN}
        end={prog}        
      />

      <Line
        ref={makeRef(lines, 1)}
        points={[v1, v2]}
        lineWidth={8}
        stroke={GREEN}
        end={prog}
      />

      <Line
        ref={makeRef(lines, 2)}
        points={[v2, v0]}
        lineWidth={8}
        stroke={GREEN}
        end={prog}
      />
    </>    
  )

  yield* prog(1, 0.8);
}

export default makeScene2D(function* (view) {
  
  const group = createRef<Rect>();
  const v0 = createRef<Circle>();
  const v1 = createRef<Circle>();
  const v2 = createRef<Circle>();
  const v3 = createRef<Circle>();
  const vertSize = createSignal(0);

  view.add(
    <Rect ref={group} scale={0.8}>
      <Circle
        ref={v0}
        fill={RED}
        size={vertSize}
        position={[-200, 350]}
      />

      <Circle 
        ref={v1}
        fill={RED}
        size={vertSize}
        position={[200, 150]}
      />

      <Circle 
        ref={v2}
        fill={RED}
        size={vertSize}
        position={[-200, 50]}
      />

      <Circle 
        ref={v3}
        fill={RED}
        size={vertSize}
        position={[100, -150]}
      />
    </Rect>
  );

  yield* vertSize(20, 0.5);

  yield* AddTriangle(group(), new Vector2(0, -500), new Vector2(-700, 500), new Vector2(700, 500));

  const superCircle = createRef<Circle>();
  group().add(
    <Circle 
      ref={superCircle}
      position={[0, 245]}
      size={20}
      scale={74.5}
      stroke={BLUE}
      lineWidth={0.1}
      opacity={0.4}
      startAngle={0}
      endAngle={0}
    />
  );
  yield* superCircle().endAngle(360, 1);
  
  yield* all(
    AddTriangle(group(), new Vector2(-200, 350), new Vector2(-700, 500), new Vector2(700, 500)),
    AddTriangle(group(), new Vector2(-200, 350), new Vector2(-700, 500), new Vector2(0, -500))
  );
  
  yield* superCircle().endAngle(0, 1);

  const circle1 = createRef<Circle>();
  group().add(
    <Circle 
      ref={circle1}
      position={[0, 1925]}
      size={20}
      scale={158.7648}
      stroke={BLUE}
      lineWidth={0.05}
      opacity={0.4}
      startAngle={0}
      endAngle={0}
    />
  );
  yield* circle1().endAngle(360, 1);

  const circle2 = createRef<Circle>();
  group().add(
    <Circle 
      ref={circle2}
      position={[316.9812, 23.11321]}
      size={20}
      scale={61.16572}
      stroke={BLUE}
      lineWidth={0.1}
      opacity={0.4}
      startAngle={0}
      endAngle={0}
    />
  );
  yield* circle2().endAngle(360, 1);

  const circle3 = createRef<Circle>();
  group().add(
    <Circle 
      ref={circle3}
      position={[-637.9746, -201.5823]}
      size={20}
      scale={70.43187}
      stroke={BLUE}
      lineWidth={0.1}
      opacity={0.4}
      startAngle={0}
      endAngle={0}
    />
  );
  yield* circle3().endAngle(360, 1);

  yield* waitFor(5);
});


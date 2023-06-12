import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Rect, Grid, Line, Circle, Txt, Node, Layout, View2D} from '@motion-canvas/2d/lib/components';
import {Reference, createRef, makeRef, range, useRandom} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {all, sequence, waitFor} from '@motion-canvas/core/lib/flow';
import {DEFAULT, createSignal} from '@motion-canvas/core/lib/signals';

class Dungeon{
  rects: Rect[];
  grid: Grid;
  group: Rect;

  public constructor(rects: Rect[], grid: Grid, group: Rect){
    this.rects = rects;
    this.grid = grid;
    this.group = group;
  }
}

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

function AddDungeonToView(view: View2D): Dungeon{
  const rects: Rect[] = [];
  const group = createRef<Rect>();
  const grid = createRef<Grid>();

  view.add(    
    <Rect ref={group} size={GRID_CELL_RES * GRID_WIDTH}>
      <Grid
        ref={grid}
        width={'100%'} height={'100%'}
        spacing={() => GRID_CELL_RES}
        stroke={'#999'}
        lineWidth={1}
        cache
      />
      <Rect
        ref={makeRef(rects, 0)}
        width={'30%'} height={'30%'}
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
        width={'30%'} height={'30%'}
        position={RandomCell()}
        fill={BLUE}
        radius={10}
        stroke={RED}
        lineWidth={8}
      />
    </Rect>
  )

  return new Dungeon(rects, grid(), group());
}

function AddDungeonCloneToView(dungeon: Dungeon, view: View2D): Dungeon{
  const rects: Rect[] = [];
  const group = createRef<Rect>();
  const grid = createRef<Grid>();

  const cloneGroup = dungeon.group.clone();
  cloneGroup.removeChildren();
  const cloneGrid = dungeon.grid.clone();
  cloneGroup.add(cloneGrid);
  let i = 0;
  dungeon.rects.forEach(rect => {
    const cloneRect = rect.clone();
    rects[i] = cloneRect;
    cloneGroup.add(rects[i]);
    i++;
  });

  view.add(cloneGroup);

  return new Dungeon(rects, cloneGrid, cloneGroup);
}

export default makeScene2D(function* (view) {
  const dungeons: Dungeon[] = [];

  let index = 0;
  for (let i = -1; i <= 0; i++) {
    for (let j = 1; j >= 0; j--) {
        let dungeon = AddDungeonToView(view);
        dungeons.push(dungeon);
        dungeon.group.position(CellToScreenCustom(i, j, 500))
        dungeon.group.scale(0)

        index++;
    }
  }

  yield* sequence(0.2,
    ...dungeons.map(dungeon => dungeon.group.scale(0.45, 0.8))
  )

  const validationLength = 1;
  const newLineWidth = 6;

  yield* waitFor(0.4)
  yield* all(
    dungeons[0].grid.stroke(GREEN, validationLength),
    dungeons[0].grid.lineWidth(newLineWidth, validationLength),
    dungeons[1].grid.stroke(RED, validationLength),
    dungeons[1].grid.lineWidth(newLineWidth, validationLength),
    dungeons[2].grid.stroke(GREEN, validationLength),
    dungeons[2].grid.lineWidth(newLineWidth, validationLength),
    dungeons[3].grid.stroke(RED, validationLength),
    dungeons[3].grid.lineWidth(newLineWidth, validationLength),
  )

  yield* all(
    dungeons[1].group.scale(0, 0.8),
    dungeons[3].group.scale(0, 0.8)
   )
   yield* waitFor(0.4)

  dungeons[1].group.remove();
  dungeons[3].group.remove();

  let d5 = AddDungeonCloneToView(dungeons[0], view);
  let d6 = AddDungeonCloneToView(dungeons[2], view);
  yield* all(d5.group.position(CellToScreenCustom(-1, 0, 500), 0.8),
  d6.group.position(CellToScreenCustom(0, 0, 500), 0.8));

  const moveTileDelay = 0.2;
  const moveTileTime = 0.4;

  yield* waitFor(0.4)
  yield* all(
    dungeons[0].grid.stroke('#999', validationLength),
    dungeons[0].grid.lineWidth(1, validationLength),
    dungeons[2].grid.stroke('#999', validationLength),
    dungeons[2].grid.lineWidth(1, validationLength),
    d5.grid.stroke('#999', validationLength),
    d5.grid.lineWidth(1, validationLength),
    d6.grid.stroke('#999', validationLength),
    d6.grid.lineWidth(1, validationLength)
  )

  yield* sequence(moveTileDelay,
    ...d5.rects.map(rect => rect.position(RandomCell(), moveTileTime))
  )
  yield* sequence(moveTileDelay,
    ...d6.rects.map(rect => rect.position(RandomCell(), moveTileTime))
  )

  
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

  d5.group.add(
    <>  
      <Line
        ref={makeRef(lines, 0)}
        points={[d5.rects[0].position(), Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />

      <Line
        ref={makeRef(lines, 1)}
        points={[d5.rects[1].position(), Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />

      <Line
        ref={makeRef(lines, 2)}
        points={[d5.rects[2].position(), Vector2.zero]}
        lineWidth={8}
        endArrow
        stroke={GREEN}
        end={progress}
      />
    </>    
  )

  d5.group.add(
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

  d5.group.add(
    <Txt
      position={[400, -540]}
      text={() => `${fitness().toFixed(1)}`}
      fill={'DarkRed'}
      {...textStyle2}
    />  
  )

  yield* progress(1, 1)
  yield* waitFor(3) 
});


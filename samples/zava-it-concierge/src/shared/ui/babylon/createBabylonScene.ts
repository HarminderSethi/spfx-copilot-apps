import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import '@babylonjs/core/Culling/ray';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Scene } from '@babylonjs/core/scene';

import type { IBabylonChartModel, IBabylonMark } from './chartModels';

export interface IBabylonSceneHandle {
  readonly engine: Engine;
  readonly scene: Scene;
  render(): void;
  resize(): void;
  dispose(): void;
}

function createMaterial(scene: Scene, color: string, alpha = 1): StandardMaterial {
  const material = new StandardMaterial(`material-${color}-${alpha}`, scene);
  material.diffuseColor = Color3.FromHexString(color);
  material.emissiveColor = Color3.FromHexString(color).scale(0.16);
  material.alpha = alpha;
  material.specularColor = new Color3(0.12, 0.12, 0.12);
  return material;
}

function addPickMetadata(mesh: { metadata: unknown; isPickable: boolean }, mark: IBabylonMark): void {
  mesh.metadata = { markId: mark.id };
  mesh.isPickable = true;
}

function createColumns(scene: Scene, model: IBabylonChartModel, depth = false): void {
  const maximum = Math.max(...model.marks.map((mark) => mark.value), 1);
  const columns = Math.min(model.marks.length, depth ? 8 : 10);
  model.marks.slice(0, columns).forEach((mark, index) => {
    const height = 0.8 + (mark.value / maximum) * 4.2;
    const mesh = MeshBuilder.CreateBox(`mark-${mark.id}`, { width: depth ? 0.7 : 0.86, height, depth: depth ? 1.2 : 0.62 }, scene);
    const row = depth ? Math.floor(index / 4) : 0;
    const column = depth ? index % 4 : index;
    mesh.position = new Vector3((column - (depth ? 1.5 : (columns - 1) / 2)) * 1.08, height / 2 - 2.1, row * 1.45 - 0.7);
    mesh.material = createMaterial(scene, mark.color);
    addPickMetadata(mesh, mark);
  });
}

function createRing(scene: Scene, model: IBabylonChartModel): void {
  model.marks.slice(0, 4).forEach((mark, ringIndex) => {
    const radius = 1.45 + ringIndex * 0.5;
    const track = MeshBuilder.CreateTorus(`track-${mark.id}`, { diameter: radius * 2, thickness: 0.13, tessellation: 72 }, scene);
    track.material = createMaterial(scene, '#9BA7B4', 0.18);
    track.rotation.x = Math.PI / 2;
    const path: Vector3[] = [];
    const segments = Math.max(8, Math.round(mark.value * 0.72));
    for (let segment = 0; segment <= segments; segment += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * mark.value * segment) / (100 * segments);
      path.push(new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.08));
    }
    const arc = MeshBuilder.CreateTube(`mark-${mark.id}`, { path, radius: 0.1, tessellation: 10, cap: 3 }, scene);
    arc.material = createMaterial(scene, mark.color);
    addPickMetadata(arc, mark);
  });
}

function createNetwork(scene: Scene, model: IBabylonChartModel): void {
  const positions = new Map<string, Vector3>();
  model.marks.forEach((mark, index) => {
    const radius = mark.group === 'incident' ? 0 : mark.group === 'service' ? 1.8 : mark.group === 'region' ? 2.8 : 4;
    const angle = index * 2.39996;
    const position = new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.58, (index % 3 - 1) * 0.35);
    positions.set(mark.id, position);
    const mesh = MeshBuilder.CreateSphere(`mark-${mark.id}`, { diameter: 0.28 + mark.value / 180, segments: 16 }, scene);
    mesh.position = position;
    mesh.material = createMaterial(scene, mark.color);
    addPickMetadata(mesh, mark);
  });
  model.marks.forEach((mark) => {
    if (mark.parentId && positions.has(mark.parentId)) {
      const line = MeshBuilder.CreateLines(`link-${mark.id}`, { points: [positions.get(mark.parentId) as Vector3, positions.get(mark.id) as Vector3] }, scene);
      line.color = Color3.FromHexString('#7A8998');
      line.alpha = 0.55;
      line.isPickable = false;
    }
  });
}

function createLine(scene: Scene, model: IBabylonChartModel, includeColumns = false): void {
  const maximum = Math.max(...model.marks.map((mark) => mark.value), 1);
  const points = model.marks.map((mark, index) => new Vector3((index - (model.marks.length - 1) / 2) * 1.4, (mark.value / maximum) * 3.6 - 1.8, 0));
  const line = MeshBuilder.CreateLines('trend-line', { points, updatable: false }, scene);
  line.color = Color3.FromHexString('#00B7C3');
  line.alpha = 0.9;
  line.isPickable = false;
  model.marks.forEach((mark, index) => {
    if (includeColumns) {
      const height = 0.4 + (mark.value / maximum) * 2.4;
      const column = MeshBuilder.CreateBox(`column-${mark.id}`, { width: 0.62, height, depth: 0.52 }, scene);
      column.position = new Vector3(points[index].x, height / 2 - 2, 0.5);
      column.material = createMaterial(scene, mark.color, 0.82);
      addPickMetadata(column, mark);
    }
    const node = MeshBuilder.CreateSphere(`mark-${mark.id}`, { diameter: 0.34, segments: 14 }, scene);
    node.position = points[index];
    node.material = createMaterial(scene, mark.color);
    addPickMetadata(node, mark);
  });
}

function createJourney(scene: Scene, model: IBabylonChartModel): void {
  const marks = model.marks.slice(0, 6);
  const points = marks.map((_mark, index) => new Vector3((index - (marks.length - 1) / 2) * 1.35, Math.sin(index * 0.7) * 0.5, 0));
  const path = MeshBuilder.CreateLines('journey-path', { points }, scene);
  path.color = Color3.FromHexString('#7A8998');
  path.alpha = 0.7;
  path.isPickable = false;
  marks.forEach((mark, index) => {
    const node = MeshBuilder.CreateCylinder(`mark-${mark.id}`, { diameter: 0.58, height: 0.22, tessellation: 24 }, scene);
    node.position = points[index];
    node.rotation.x = Math.PI / 2;
    node.material = createMaterial(scene, index <= 2 ? '#00B7C3' : mark.color);
    addPickMetadata(node, mark);
  });
}

function createProductStage(scene: Scene, model: IBabylonChartModel): void {
  model.marks.slice(0, 3).forEach((mark, index) => {
    const x = (index - 1) * 2.45;
    const plinth = MeshBuilder.CreateCylinder(`plinth-${mark.id}`, { diameter: 1.85, height: 0.18, tessellation: 48 }, scene);
    plinth.position = new Vector3(x, -1.6, 0);
    plinth.material = createMaterial(scene, '#7A8998', 0.3);
    plinth.isPickable = false;

    const screen = MeshBuilder.CreateBox(`mark-${mark.id}`, { width: 1.45, height: 0.92, depth: 0.12 }, scene);
    screen.position = new Vector3(x, -0.55, 0);
    screen.rotation.y = index === 0 ? -0.12 : index === 2 ? 0.12 : 0;
    screen.material = createMaterial(scene, mark.color);
    addPickMetadata(screen, mark);

    const base = MeshBuilder.CreateBox(`base-${mark.id}`, { width: 1.65, height: 0.1, depth: 0.88 }, scene);
    base.position = new Vector3(x, -1.05, 0.34);
    base.rotation.x = -0.18;
    base.material = createMaterial(scene, '#405667');
    base.isPickable = false;
  });
}

function createWaterfall(scene: Scene, model: IBabylonChartModel): void {
  const maximum = Math.max(...model.marks.map((mark) => mark.value), 1);
  model.marks.forEach((mark, index) => {
    const height = 0.45 + (mark.value / maximum) * 3.3;
    const mesh = MeshBuilder.CreateBox(`mark-${mark.id}`, { width: 0.82, height, depth: 0.75 }, scene);
    mesh.position = new Vector3((index - (model.marks.length - 1) / 2) * 1.2, height / 2 - 1.9 + (index === 0 || index === model.marks.length - 1 ? 0 : 0.6), 0);
    mesh.material = createMaterial(scene, mark.id === 'remaining' ? '#0F7B0F' : mark.id === 'budget' ? '#0078D4' : '#CA5010');
    addPickMetadata(mesh, mark);
  });
}

export function createBabylonScene(canvas: HTMLCanvasElement, model: IBabylonChartModel, isDark: boolean, onSelect: (markId: string) => void): IBabylonSceneHandle {
  if (!Engine.IsSupported) {
    throw new Error('WebGL is not supported.');
  }
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: false, antialias: true, adaptToDeviceRatio: true, limitDeviceRatio: 2, loseContextOnDispose: true });
  const scene = new Scene(engine);
  scene.clearColor = isDark ? new Color4(0.055, 0.075, 0.09, 1) : new Color4(0.965, 0.98, 0.99, 1);

  const camera = new ArcRotateCamera('zava-chart-camera', -Math.PI / 2, Math.PI / 2.25, model.kind === 'network' ? 11 : 12, Vector3.Zero(), scene);
  camera.inputs.clear();
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 14;
  scene.activeCamera = camera;

  const light = new HemisphericLight('zava-chart-light', new Vector3(0.3, 1, -0.4), scene);
  light.intensity = isDark ? 1.1 : 1.35;

  if (model.kind === 'ring') {
    createRing(scene, model);
  } else if (model.kind === 'landscape') {
    throw new Error('Estate geography is rendered by D3EstateRiskMap.');
  } else if (model.kind === 'network') {
    createNetwork(scene, model);
  } else if (model.kind === 'line') {
    createLine(scene, model);
  } else if (model.kind === 'pareto') {
    createLine(scene, model, true);
  } else if (model.kind === 'journey') {
    createJourney(scene, model);
  } else if (model.kind === 'product') {
    createProductStage(scene, model);
  } else if (model.kind === 'waterfall') {
    createWaterfall(scene, model);
  } else {
    createColumns(scene, model, model.kind === 'horizon');
  }

  scene.onPointerPick = (_event, pickInfo) => {
    const markId = pickInfo.pickedMesh?.metadata?.markId;
    if (typeof markId === 'string') {
      onSelect(markId);
    }
  };

  return {
    engine,
    scene,
    render: () => scene.render(),
    resize: () => {
      engine.resize();
      scene.render();
    },
    dispose: () => {
      engine.stopRenderLoop();
      scene.onPointerPick = undefined;
      scene.dispose();
      engine.dispose();
    }
  };
}
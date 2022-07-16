export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Vector2DLike = { x: number; y: number } | [number, number] | MouseEvent;

export interface Dimension {
  width: number;
  height: number;
}

export class Vector2D {
  constructor(public x: number, public y: number) {}

  set(vector2DLike: Vector2DLike) {
    if (vector2DLike instanceof MouseEvent) {
      this.x = vector2DLike.clientX;
      this.y = vector2DLike.clientY;
    } else if (vector2DLike.constructor === Array) {
      this.x = vector2DLike[0];
      this.y = vector2DLike[1];
    } else {
      let vector = vector2DLike as { x: number; y: number };
      this.x = vector.x;
      this.y = vector.y;
    }
  }

  add(vector2DLike: Vector2DLike) {
    if (vector2DLike instanceof MouseEvent) {
      this.x += vector2DLike.movementX;
      this.y += vector2DLike.movementY;
    } else if (vector2DLike.constructor === Array) {
      this.x += vector2DLike[0];
      this.y += vector2DLike[1];
    } else {
      let vector = vector2DLike as { x: number; y: number };
      this.x += vector.x;
      this.y += vector.y;
    }
  }

  copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  getRect(target: Vector2D, buffer: Rect = { width: 0, height: 0, x: 0, y: 0 }): Rect {
    let x = this.x < target.x ? this.x : target.x;
    let y = this.y < target.y ? this.y : target.y;

    return {
      x: x + buffer.x,
      y: y + buffer.y,
      width: Math.abs(target.x - this.x),
      height: Math.abs(target.y - this.y),
    };
  }

  equals(target: Vector2D): boolean {
    return target.x === this.x && target.y === this.y;
  }

  similar(target: Vector2D, buffer: number = 5): boolean {
    return Math.abs(target.x - this.x) < buffer && Math.abs(target.y - this.y) < buffer;
  }
}

export function computeCollision(rectA: Rect, rectB: Rect) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.height + rectA.y > rectB.y
  );
}

export function computeElementCollision(
  parent: HTMLElement,
  element: HTMLElement,
  target: Rect
): boolean {
  const root = parent.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  const actual: Rect = {
    x: rect.x - root.x,
    y: rect.y - root.y,
    width: rect.width,
    height: rect.height,
  };

  if (
    actual.x < target.x + target.width &&
    actual.x + actual.width > target.x &&
    actual.y < target.y + target.height &&
    actual.height + actual.y > target.y
  ) {
    return true;
  }

  return false;
}

export function computeElementCollisionFromRect(
  parent: HTMLElement,
  rect: DOMRect,
  target: Rect
): boolean {
  let collides = false;
  const root = parent.getBoundingClientRect();

  const actual: Rect = {
    x: rect.x - root.x,
    y: rect.y - root.y,
    width: rect.width,
    height: rect.height,
  };

  if (
    actual.x < target.x + target.width &&
    actual.x + actual.width > target.x &&
    actual.y < target.y + target.height &&
    actual.height + actual.y > target.y
  ) {
    collides = true;
  }

  return collides;
}

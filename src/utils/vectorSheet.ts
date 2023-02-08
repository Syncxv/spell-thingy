export function subtractVectors(v1: { x: number, y: number }, v2: { x: number, y: number }): { x: number, y: number } {
    return { x: v2.x - v1.x, y: v2.y - v1.y };
}

export function normalizeVector(v: { x: number, y: number }): { x: number, y: number } {
    const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / magnitude, y: v.y / magnitude };
}

export function calculateRotation(v: { x: number, y: number }): number {
    return Math.atan2(v.y, v.x);
}

export function getMagnitude(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
    const xDiff = p2.x - p1.x;
    const yDiff = p2.y - p1.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

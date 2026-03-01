/** Module: wish_cloud_layout. Handles wish cloud layout behavior. */

export const WISH_SLOT_ORDER = ['A', 'B', 'C', 'D', 'E'];

// 5-slot partitioned growth layout:
// fixed zones prevent overlaps when seed visuals are large.
export const WISH_LEAF_LAYOUT_BY_CODE = {
  A: { left: 5, bottom: 24, rotate: -5, scale: 1.0, z: 5, delay: 0.0 },   // lower-left
  B: { right: 6, bottom: 22, rotate: 4, scale: 1.0, z: 4, delay: 0.6 },   // lower-right
  C: { left: 8, top: 44, rotate: -3, scale: 1.0, z: 3, delay: 1.2 },      // mid-left
  D: { right: 9, top: 42, rotate: 3, scale: 1.0, z: 2, delay: 1.8 },      // mid-right
  E: { right: 22, top: 26, rotate: -4, scale: 1.0, z: 1, delay: 2.4 }     // upper-right
};

// Backward-compatible alias (legacy naming).
export const WISH_CLOUD_LAYOUT_BY_CODE = WISH_LEAF_LAYOUT_BY_CODE;

// Empty boats are docked just above the bottom 5 slots.
export const WISH_DOCK_LAYOUT_BY_CODE = {
  A: { left: 10, bottom: 20, rotate: -2, scale: 0.92, z: 3 },
  B: { left: 30, bottom: 20, rotate: 2, scale: 0.92, z: 3 },
  C: { left: 50, bottom: 20, rotate: -1, scale: 0.92, z: 3 },
  D: { left: 70, bottom: 20, rotate: 1, scale: 0.92, z: 3 },
  E: { left: 90, bottom: 20, rotate: -2, scale: 0.92, z: 3 }
};

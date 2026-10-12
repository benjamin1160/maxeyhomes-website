/**
 * Map furniture that is not a county boundary.
 *
 * Coastlines and the state line used to be hand-traced here; they now come for
 * free from the real county polygons in `county-shapes.generated.ts`, which
 * outline the coast far more accurately than a hand trace could. What is left is
 * the road network, traced roughly through its major exits — enough for a
 * local to orient themselves, not survey data.
 *
 * These are the three interstates a buyer around Norman navigates by: I-35
 * north–south through Norman and Oklahoma City, from Ardmore to Perry; I-40
 * east–west from Weatherford through El Reno, the city and Shawnee to
 * Henryetta; and I-44, the H.E. Bailey from Lawton up through Chickasha and the
 * Turner toward Tulsa. Retrace them if the map ever moves.
 */

type Coord = readonly [number, number];

export const HIGHWAYS: readonly {
  id: string;
  label: string;
  labelAt: Coord;
  path: readonly Coord[];
}[] = [
  {
    id: "i35",
    label: "35",
    labelAt: [34.62, -97.06],
    path: [
      [33.94, -97.12],
      [34.17, -97.13],
      [34.5, -97.12],
      [34.74, -97.21],
      [35.01, -97.37],
      [35.22, -97.45],
      [35.33, -97.48],
      [35.47, -97.5],
      [35.65, -97.45],
      [35.87, -97.41],
      [36.29, -97.29],
      [36.6, -97.34],
    ],
  },
  {
    id: "i40",
    label: "40",
    labelAt: [35.4, -96.62],
    path: [
      [35.52, -98.97],
      [35.53, -98.7],
      [35.53, -97.95],
      [35.5, -97.73],
      [35.46, -97.51],
      [35.45, -97.4],
      [35.33, -96.93],
      [35.27, -96.67],
      [35.43, -96.3],
      [35.44, -95.98],
      [35.48, -95.6],
    ],
  },
  {
    id: "i44",
    label: "44",
    labelAt: [34.86, -98.36],
    path: [
      [34.0, -98.47],
      [34.35, -98.33],
      [34.6, -98.4],
      [34.78, -98.29],
      [35.04, -97.94],
      [35.24, -97.6],
      [35.43, -97.55],
      [35.53, -97.45],
      [35.69, -97.06],
      [35.7, -96.88],
      [35.75, -96.66],
      [35.83, -96.39],
      [35.99, -96.11],
    ],
  },
];

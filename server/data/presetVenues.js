export const PRESET_VENUES = [
  {
    id: "v1",
    name: "Narendra Modi Stadium Ground",
    category: "Stadium",
    capacity: 100000,
    dimensions: { width: 800, height: 600 },
    nodes: [
      { id: "g1", label: "Gate 1 (North Entry)", type: "gate", x: 150, y: 80, crowd: 420, maxCapacity: 1000 },
      { id: "g2", label: "Gate 2 (East Main VIP)", type: "gate", x: 650, y: 100, crowd: 890, maxCapacity: 1000 },
      { id: "g3", label: "Gate 3 (South Public)", type: "gate", x: 650, y: 500, crowd: 950, maxCapacity: 1000 },
      { id: "g4", label: "Gate 4 (West Entry)", type: "gate", x: 150, y: 520, crowd: 310, maxCapacity: 1000 },
      
      { id: "fs1", label: "Food Court North", type: "stall", x: 300, y: 180, crowd: 620, maxCapacity: 700 },
      { id: "fs2", label: "Food Court South", type: "stall", x: 500, y: 420, crowd: 210, maxCapacity: 700 },
      { id: "fs3", label: "Merch & Snacks East", type: "stall", x: 620, y: 280, crowd: 480, maxCapacity: 500 },

      { id: "stage", label: "Main Arena Pitch", type: "stage", x: 400, y: 300, crowd: 4500, maxCapacity: 10000 },

      { id: "ex1", label: "Emergency Exit 1 (North)", type: "exit", x: 400, y: 50, crowd: 50, maxCapacity: 2000 },
      { id: "ex2", label: "Emergency Exit 2 (East)", type: "exit", x: 750, y: 300, crowd: 80, maxCapacity: 2000 },
      { id: "ex3", label: "Emergency Exit 3 (South)", type: "exit", x: 400, y: 550, crowd: 40, maxCapacity: 2000 },
      { id: "ex4", label: "Emergency Exit 4 (West)", type: "exit", x: 50, y: 300, crowd: 30, maxCapacity: 2000 }
    ],
    edges: [
      { from: "g1", to: "fs1", distance: 120 },
      { from: "g2", to: "fs3", distance: 90 },
      { from: "g3", to: "fs2", distance: 110 },
      { from: "g4", to: "stage", distance: 200 },
      { from: "fs1", to: "stage", distance: 150 },
      { from: "fs2", to: "stage", distance: 140 },
      { from: "fs3", to: "stage", distance: 130 },
      { from: "fs1", to: "ex1", distance: 100 },
      { from: "fs3", to: "ex2", distance: 110 },
      { from: "fs2", to: "ex3", distance: 120 },
      { from: "g4", to: "ex4", distance: 110 }
    ]
  },
  {
    id: "v2",
    name: "Pragati Maidan Trade Expo Hall 3",
    category: "Exhibition",
    capacity: 25000,
    dimensions: { width: 800, height: 600 },
    nodes: [
      { id: "g1", label: "Main Registration Gate A", type: "gate", x: 100, y: 150, crowd: 780, maxCapacity: 800 },
      { id: "g2", label: "Express Gate B", type: "gate", x: 100, y: 450, crowd: 180, maxCapacity: 800 },
      { id: "fs1", label: "Cafeteria Central", type: "stall", x: 400, y: 200, crowd: 590, maxCapacity: 600 },
      { id: "fs2", label: "Coffee Kiosk 2", type: "stall", x: 400, y: 400, crowd: 120, maxCapacity: 400 },
      { id: "stage", label: "Keynote Auditorium", type: "stage", x: 650, y: 300, crowd: 1200, maxCapacity: 2000 },
      { id: "ex1", label: "Exit Gate 1", type: "exit", x: 750, y: 150, crowd: 60, maxCapacity: 1500 },
      { id: "ex2", label: "Exit Gate 2", type: "exit", x: 750, y: 450, crowd: 40, maxCapacity: 1500 }
    ],
    edges: [
      { from: "g1", to: "fs1", distance: 150 },
      { from: "g2", to: "fs2", distance: 140 },
      { from: "fs1", to: "stage", distance: 160 },
      { from: "fs2", to: "stage", distance: 160 },
      { from: "stage", to: "ex1", distance: 110 },
      { from: "stage", to: "ex2", distance: 110 }
    ]
  }
];

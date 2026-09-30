// ===== EVOLT MOTORS — Vehicle Data =====
// All vehicle info lives here as plain JS objects. Swap "image" paths
// with real photos any time — just keep the same filenames.

const VEHICLES = [ 
  {
    id: 1, name: "EVOLT X1", type: "Bike",
    price: 95000, battery: "3.5 kWh", range: "100 km", speed: "70 km/h",
    chargingTime: "3–4 Hours", motorPower: "3 kW", seating: "2", warranty: "3 Years",
    image: "images/bikes/x1.jpg",
    badges: ["SMART EV"],
    features: ["LED Headlights", "Digital Display", "Disc Brakes", "USB Charging", "Anti-Theft System", "Regenerative Braking"],
    sound: "sounds/bike-start.mp3",
    tagline: "Smart. Fast. Electric."
  },
  {
    id: 2, name: "EVOLT X2 PRO", type: "Bike",
    price: 125000, battery: "5 kWh", range: "150 km", speed: "85 km/h",
    chargingTime: "4 Hours", motorPower: "5 kW", seating: "2", warranty: "3 Years",
    image: "images/bikes/x2pro.jpg",
    badges: ["FAST CHARGING", "GPS READY"],
    features: ["Smart Digital Display", "LED Lighting", "Fast Charging", "GPS Ready", "Anti-Theft System", "Multiple Riding Modes"],
    sound: "sounds/bike-start.mp3",
    tagline: "Smart. Fast. Electric."
  },
  {
    id: 3, name: "EVOLT A1", type: "Auto",
    price: 280000, battery: "10 kWh", range: "180 km", speed: "55 km/h",
    chargingTime: "4–5 Hours", motorPower: "7.5 kW", seating: "3 + Driver", warranty: "3 Years",
    image: "images/autos/a1.jpg",
    badges: ["LONG RANGE"],
    features: ["Spacious Cabin", "LED Lighting", "Digital Meter", "Anti-Theft System", "Regenerative Braking"],
    sound: "sounds/auto-start.mp3",
    tagline: "Built for Every Journey."
  },
  {
    id: 4, name: "EVOLT A2 PRO", type: "Auto",
    price: 320000, battery: "12 kWh", range: "220 km", speed: "60 km/h",
    chargingTime: "4 Hours", motorPower: "9 kW", seating: "3 + Driver", warranty: "4 Years",
    image: "images/autos/a2pro.jpg",
    badges: ["LONG RANGE", "FAST CHARGING"],
    features: ["Premium Seats", "Smart Display", "Fast Charging", "GPS Ready", "Anti-Theft System"],
    sound: "sounds/auto-start.mp3",
    tagline: "Built for Every Journey."
  },
  {
    id: 5, name: "EVOLT C1", type: "Car",
    price: 650000, battery: "30 kWh", range: "300 km", speed: "120 km/h",
    chargingTime: "5 Hours", motorPower: "50 kW", seating: "5", warranty: "5 Years",
    image: "images/cars/c1.jpg",
    badges: ["LONG RANGE", "SMART EV"],
    features: ["Touchscreen Console", "LED Matrix Headlights", "Regenerative Braking", "GPS Navigation", "Climate Control", "Anti-Theft System"],
    sound: "sounds/car-start.mp3",
    tagline: "Drive Beyond Limits."
  },
  {
    id: 6, name: "EVOLT C1 PRO", type: "Car",
    price: 850000, battery: "40 kWh", range: "400 km", speed: "140 km/h",
    chargingTime: "4 Hours", motorPower: "70 kW", seating: "5", warranty: "5 Years",
    image: "images/cars/c1pro.jpg",
    badges: ["LONG RANGE", "FAST CHARGING", "SMART EV"],
    features: ["Panoramic Display", "LED Matrix Headlights", "Autopilot Assist", "Fast Charging", "Premium Interior", "Anti-Theft System"],
    sound: "sounds/car-start.mp3",
    tagline: "Drive Beyond Limits."
  }
];

function getVehicleById(id) {
  return VEHICLES.find(v => v.id === Number(id));
}

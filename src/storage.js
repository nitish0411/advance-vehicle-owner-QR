/**
 * Data Storage & Persistence Manager for AutoGuard QR
 * Handles Vehicles, Emergency Family Contacts, and Live Alerts
 */

const STORAGE_KEYS = {
  VEHICLES: 'ag_vehicles_data',
  FAMILY: 'ag_family_contacts_data',
  ALERTS: 'ag_alerts_history',
  ADMIN_BATCHES: 'ag_admin_batches',
  SETTINGS: 'ag_owner_settings'
};

const DEFAULT_VEHICLES = [
  {
    id: 'veh-101',
    serialCode: 'AG-2026-PRO-9982',
    planName: 'Shield Pro Plan',
    name: 'BMW 330i M-Sport',
    plate: 'DL 01 AB 4492',
    category: '4-Wheeler (Car/Sedan)',
    type: '4-Wheeler',
    categoryIcon: '🚗',
    color: 'Mineral Grey Metallic',
    ownerName: 'Aryan Malhotra',
    ownerPhone: '+91 98765 12345',
    homeAddress: 'Flat 402, Royal Palms, Sector 62',
    homeGps: { lat: 28.6280, lng: 77.3750 },
    bloodGroup: 'O+',
    medicalNote: 'No Allergies',
    insuranceNo: 'HDFC-ERGO-9920182-V',
    insuranceExpiry: '2027-08-15',
    pucExpiry: '2027-04-10',
    rsaPhone: '1800-209-8899',
    note: 'Parked for quick 10-min errand. If blocking, please tap alert and I will move immediately!',
    status: 'available',
    phoneMasked: '***-***-8829',
    realPhone: '+919876543210'
  },
  {
    id: 'veh-102',
    serialCode: 'AG-2026-BIKE-3310',
    planName: 'Rider Shield Plan',
    name: 'Royal Enfield Hunter 350',
    plate: 'DL 07 CY 5521',
    category: '2-Wheeler (Bike/Scooter)',
    type: '2-Wheeler',
    categoryIcon: '🏍️',
    color: 'Dapper Ash Grey',
    ownerName: 'Rohan Deshmukh',
    ownerPhone: '+91 98221 44556',
    homeAddress: 'Pocket B, Green Park, South Delhi',
    homeGps: { lat: 28.5580, lng: 77.2020 },
    bloodGroup: 'A+',
    medicalNote: 'None',
    insuranceNo: 'BAJAJ-ALL-88192-B',
    insuranceExpiry: '2027-09-20',
    pucExpiry: '2027-06-11',
    rsaPhone: '1800-102-4455',
    note: 'Bike parked in bay. If blocking or fell over, please alert immediately!',
    status: 'available',
    phoneMasked: '***-***-4456',
    realPhone: '+919822144556'
  },
  {
    id: 'veh-103',
    serialCode: 'AG-2026-SUV-7721',
    planName: 'Family Safe Plan',
    name: 'Toyota Fortuner 4x4',
    plate: 'MH 02 CZ 8819',
    category: '4-Wheeler (SUV/4x4)',
    type: 'SUV',
    categoryIcon: '🚙',
    color: 'Pearl White',
    ownerName: 'Sunil Verma',
    ownerPhone: '+91 98112 23344',
    homeAddress: 'Villa 14, Palm Meadows, Bandra',
    homeGps: { lat: 19.0596, lng: 72.8295 },
    bloodGroup: 'B+',
    medicalNote: 'Diabetic',
    insuranceNo: 'ICICI-LOMB-33829-X',
    insuranceExpiry: '2027-11-20',
    pucExpiry: '2027-05-12',
    rsaPhone: '1800-102-4455',
    note: 'Family vehicle. In case of emergency or parking trouble, please alert.',
    status: 'available',
    phoneMasked: '***-***-9931',
    realPhone: '+919811223344'
  },
  {
    id: 'veh-104',
    serialCode: 'AG-2026-EV-9012',
    planName: 'Eco-Shield EV Plan',
    name: 'Tata Nexon EV Max',
    plate: 'KA 03 EV 2026',
    category: 'Electric Vehicle (EV)',
    type: 'EV',
    categoryIcon: '⚡',
    color: 'Signature Teal Blue',
    ownerName: 'Ananya Rao',
    ownerPhone: '+91 97401 88990',
    homeAddress: 'Indiranagar 100ft Road, Bengaluru',
    homeGps: { lat: 12.9784, lng: 77.6408 },
    bloodGroup: 'O+',
    medicalNote: 'No Allergies',
    insuranceNo: 'TATA-AIG-99120-E',
    insuranceExpiry: '2028-01-15',
    pucExpiry: '2028-01-15',
    rsaPhone: '1800-209-8899',
    note: 'EV on fast charging. When 100% full, please alert and I will clear the charging bay immediately.',
    status: 'available',
    phoneMasked: '***-***-8990',
    realPhone: '+919740188990'
  }
];

const DEFAULT_FAMILY = [
  {
    id: 'fam-1',
    name: 'Priya Sharma',
    relation: 'Spouse',
    phone: '+91 98765 00001',
    sosAlert: true,
    parkingAlert: false
  },
  {
    id: 'fam-2',
    name: 'Rajesh Sharma',
    relation: 'Father',
    phone: '+91 98765 00002',
    sosAlert: true,
    parkingAlert: true
  },
  {
    id: 'fam-3',
    name: 'Dr. Amit Verma',
    relation: 'Doctor / Friend',
    phone: '+91 98765 00003',
    sosAlert: true,
    parkingAlert: false
  }
];

const DEFAULT_ALERTS = [
  {
    id: 'alt-1',
    vehicleId: 'veh-101',
    vehicleName: 'BMW 330i M-Sport',
    category: 'wrong_parking',
    subTag: 'Blocking Driveway Gate',
    message: 'Car is parked near main society gate blocking exit path.',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    location: { lat: 28.6139, lng: 77.2090, address: 'Gate 2, Connaught Place' },
    isRead: false,
    status: 'pending',
    photoUrl: null
  },
  {
    id: 'alt-2',
    vehicleId: 'veh-101',
    vehicleName: 'BMW 330i M-Sport',
    category: 'hazard',
    subTag: 'Headlights Left ON',
    message: 'Front headlights are running and might drain your battery.',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(), // 1 hr ago
    location: null,
    isRead: true,
    status: 'resolved',
    photoUrl: null
  }
];

export const storage = {
  getVehicles() {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(DEFAULT_VEHICLES));
      return DEFAULT_VEHICLES;
    }
    return JSON.parse(raw);
  },

  saveVehicles(vehicles) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  getFamily() {
    const raw = localStorage.getItem(STORAGE_KEYS.FAMILY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(DEFAULT_FAMILY));
      return DEFAULT_FAMILY;
    }
    return JSON.parse(raw);
  },

  saveFamily(family) {
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(family));
  },

  getAlerts() {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(DEFAULT_ALERTS));
      return DEFAULT_ALERTS;
    }
    return JSON.parse(raw);
  },

  saveAlerts(alerts) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  },

  addAlert(alertData) {
    const alerts = this.getAlerts();
    const newAlert = {
      id: 'alt-' + Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
      status: 'pending',
      ...alertData
    };
    alerts.unshift(newAlert);
    this.saveAlerts(alerts);
    return newAlert;
  },

  maskPlate(plate) {
    if (!plate) return 'XX ••• XXXX';
    const parts = plate.trim().split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ••• ${parts[parts.length - 1]}`;
    }
    return plate.slice(0, 4) + ' ••• ' + plate.slice(-4);
  }
};

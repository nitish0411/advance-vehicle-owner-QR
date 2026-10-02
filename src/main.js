/**
 * AutoGuard QR • Main Application Orchestrator
 * High performance, modular vanilla JavaScript controller
 */

import { storage } from './storage.js';
import { soundEngine } from './soundEngine.js';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  createIcons,
  ShieldAlert,
  ShieldCheck,
  Shield,
  LayoutDashboard,
  QrCode,
  Printer,
  Users,
  UserPlus,
  Car,
  CarFront,
  AlertTriangle,
  Siren,
  CircleSlash2,
  MessageSquare,
  ChevronRight,
  MapPin,
  Camera,
  Send,
  PhoneCall,
  PhoneOff,
  Phone,
  MessageCircle,
  Flame,
  Sparkles,
  Lock,
  EyeOff,
  Zap,
  Info,
  HeartHandshake,
  Nfc,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Volume2,
  Radio,
  Sun,
  Moon,
  Inbox,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  ChevronLeft,
  Navigation,
  Fuel,
  Wrench,
  List,
  Map
} from 'lucide';

// Initialize Lucide Icons helper
function refreshIcons() {
  createIcons({
    icons: {
      ShieldAlert,
      ShieldCheck,
      Shield,
      LayoutDashboard,
      QrCode,
      Printer,
      Users,
      UserPlus,
      Car,
      CarFront,
      AlertTriangle,
      Siren,
      CircleSlash2,
      MessageSquare,
      ChevronRight,
      MapPin,
      Camera,
      Send,
      PhoneCall,
      PhoneOff,
      Phone,
      MessageCircle,
      Flame,
      Sparkles,
      Lock,
      EyeOff,
      Zap,
      Info,
      HeartHandshake,
      Nfc,
      Plus,
      Trash2,
      Edit2,
      Check,
      X,
      Volume2,
      Radio,
      Sun,
      Moon,
      Inbox,
      RefreshCw,
      CheckCircle2,
      DollarSign,
      ChevronLeft,
      Navigation,
      Fuel,
      Wrench,
      List,
      Map
    }
  });
}

// Comprehensive Real-World Issue Categories & 25+ Detailed Reason Tags
const ISSUE_CATEGORIES = {
  wrong_parking: {
    title: 'Wrong / Blocked Parking',
    tags: [
      'Blocking Main Society Gate / Ramp',
      'Blocking Hospital / Ambulance Emergency Bay',
      'Blocking Private Driveway / Garage',
      'Double Parked Behind Another Car',
      'Parked in Reserved / Disabled (Handicap) Spot',
      'Parked in Towing / Yellow Line Zone',
      'Encroaching Road / Tyres Outside Marking'
    ],
    defaultMsg: 'Your vehicle is currently blocking access. Kindly move it as soon as possible.'
  },
  hazard: {
    title: 'Vehicle Hazard & Safety Alert',
    tags: [
      'Headlights / Parking Lights Left ON',
      'Window Rolled Down / Open (Rain/Theft Risk)',
      'Flat / Punctured / Low Tyre Pressure',
      'Fluid / Coolant / Engine Oil Leakage',
      'Smoke / Burning Smell from Engine/Exhaust',
      'Sunroof Left Wide Open (Rain Danger)',
      'Fuel Tank Cap Open / Leaking'
    ],
    defaultMsg: 'Safety alert: Noticed a hazard with your vehicle (lights on, window open, or leakage). Please check.'
  },
  emergency: {
    title: 'Critical Emergency & Life SOS',
    tags: [
      '🚨 URGENT: Child or Pet Locked Inside in Heat',
      'Vehicle Hit, Scratched or Bumped (Accident)',
      'Towing Truck Approaching / Police Action',
      'Tree Branch / Construction Debris Fallen on Car',
      'Fire / Fuel Spark Hazard Near Vehicle',
      'Medical Emergency at Vehicle Location'
    ],
    defaultMsg: 'CRITICAL EMERGENCY: Urgent situation regarding your vehicle! Please attend immediately.'
  },
  security: {
    title: 'Door / Key / Security Notice',
    tags: [
      'Car Door or Boot (Trunk) Unlocked / Ajar',
      'Car Keys Left Inside Ignition / Seat',
      'Car Alarm Ringing Loudly / Horn Stuck',
      'Valuable Laptop / Bag Visible on Seat',
      'Suspicious Activity Near Vehicle'
    ],
    defaultMsg: 'Security notice: Your car door/trunk seems open or keys left inside. Please secure your vehicle.'
  },
  community: {
    title: 'Community / EV / Road Notice',
    tags: [
      '⚡ EV Charging Complete - Please Free Slot',
      'Society Pest Control / Fogging in Progress',
      'Road Construction / Tar Laying in Area',
      'Main Society Gate Closing Soon - Lockout Risk',
      'Water Tanker / Commercial Delivery Blocked'
    ],
    defaultMsg: 'Community notice: Please move vehicle due to maintenance, EV charging completion, or gate closing.'
  },
  custom_msg: {
    title: 'Send Custom Message',
    tags: [
      'Need to talk to owner briefly',
      'Parking space query',
      'Friendly neighbor note'
    ],
    defaultMsg: 'Hello, I am contacting you regarding your vehicle.'
  }
};

// Nearby Essential Services & Parking Guidance Dataset with Images & GPS coordinate offsets
const NEARBY_SERVICES_DATA = [
  {
    id: 'nb-1',
    name: 'Metro Multi-Level Parking Lot',
    type: 'parking',
    sub: 'Covered, 24x7 Security • 28 Slots Open',
    icon: '🅿️',
    bgClass: 'bg-parking',
    image: '/assets/parking.jpg',
    offset: { dLat: 0.0007, dLng: -0.0006 },
    baseLat: 28.6145,
    baseLng: 77.2085,
    mapsQuery: 'Metro Multi Level Parking'
  },
  {
    id: 'nb-2',
    name: 'Quick 24x7 Puncture & Tubeless Repair',
    type: 'mechanic',
    sub: 'Tyre Vulcanizing & Emergency Air Pump',
    icon: '🔧',
    bgClass: 'bg-mechanic',
    image: '/assets/mechanic.jpg',
    offset: { dLat: -0.0012, dLng: 0.0005 },
    baseLat: 28.6120,
    baseLng: 77.2095,
    mapsQuery: 'Tyre Puncture Repair'
  },
  {
    id: 'nb-3',
    name: 'IndianOil Fuel & Free Air/Water Station',
    type: 'fuel',
    sub: 'Petrol, Diesel, Nitrogen Air & Wash',
    icon: '⛽',
    bgClass: 'bg-fuel',
    image: '/assets/fuel.jpg',
    offset: { dLat: -0.0009, dLng: -0.0018 },
    baseLat: 28.6130,
    baseLng: 77.2070,
    mapsQuery: 'Petrol Pump'
  },
  {
    id: 'nb-4',
    name: 'City Mall Valet & Basement Parking',
    type: 'parking',
    sub: 'Underground Safe Parking • ₹30/hr',
    icon: '🅿️',
    bgClass: 'bg-parking',
    image: '/assets/parking.jpg',
    offset: { dLat: -0.0014, dLng: 0.0020 },
    baseLat: 28.6125,
    baseLng: 77.2110,
    mapsQuery: 'City Mall Parking'
  },
  {
    id: 'nb-5',
    name: 'Tata Power 60kW Fast DC EV Charger',
    type: 'fuel',
    sub: 'CCS2 Fast EV Charging • 4 Slots Open',
    icon: '⚡',
    bgClass: 'bg-fuel',
    image: '/assets/fuel.jpg',
    offset: { dLat: 0.0013, dLng: 0.0028 },
    baseLat: 28.6152,
    baseLng: 77.2120,
    mapsQuery: 'EV Charging Station'
  },
  {
    id: 'nb-6',
    name: 'Express Auto Repair & Battery Jumpstart',
    type: 'mechanic',
    sub: 'Jumpstart cables, Coolant, Oil top-up',
    icon: '🔧',
    bgClass: 'bg-mechanic',
    image: '/assets/mechanic.jpg',
    offset: { dLat: -0.0026, dLng: -0.0022 },
    baseLat: 28.6110,
    baseLng: 77.2065,
    mapsQuery: 'Car Mechanic'
  },
  {
    id: 'nb-7',
    name: 'Fortis City Care 24x7 Emergency Hospital',
    type: 'hospital',
    sub: '24x7 Emergency & ICU • Helpline: 102',
    icon: '🏥',
    bgClass: 'bg-hospital',
    image: '/assets/hospital.jpg',
    offset: { dLat: 0.0021, dLng: -0.0030 },
    baseLat: 28.6160,
    baseLng: 77.2060,
    mapsQuery: 'Emergency Hospital'
  },
  {
    id: 'nb-8',
    name: 'Sector 18 Traffic Police & Help Post',
    type: 'police',
    sub: 'Traffic Assistance & Towing Yard',
    icon: '🚓',
    bgClass: 'bg-police',
    image: '/assets/police.jpg',
    offset: { dLat: 0.0026, dLng: 0.0015 },
    baseLat: 28.6165,
    baseLng: 77.2105,
    mapsQuery: 'Traffic Police Station'
  },
  {
    id: 'nb-9',
    name: 'Apex Multi-Specialty Hospital',
    type: 'hospital',
    sub: '24x7 Ambulance & Emergency Trauma Bay',
    icon: '🏥',
    bgClass: 'bg-hospital',
    image: '/assets/hospital.jpg',
    offset: { dLat: 0.0041, dLng: 0.0045 },
    baseLat: 28.6180,
    baseLng: 77.2135,
    mapsQuery: 'Apex Hospital'
  }
];

class AutoGuardApp {
  constructor() {
    this.vehicles = storage.getVehicles();
    this.family = storage.getFamily();
    this.alerts = storage.getAlerts();
    this.activeVehicleId = this.vehicles[0]?.id || 'veh-101';
    
    // Scanner State
    this.selectedCategory = 'wrong_parking';
    this.selectedSubTag = ISSUE_CATEGORIES.wrong_parking.tags[0];
    this.scannerLocation = null;
    this.scannerPhotoData = null;

    // Call Simulation state
    this.callInterval = null;
    this.callSeconds = 0;

    // GPS & Proximity State
    this.userGpsLocation = null;

    // Wizard Step State
    this.currentWizardStep = 1;
    this.homeGpsLocation = { lat: 28.6280, lng: 77.3750 };

    this.init();
  }

  init() {
    this.checkScanModeFromUrl();
    this.bindEvents();
    this.renderDashboard();
    this.renderScannerView();
    this.renderStickerStudio();
    this.renderFamilyView();
    this.renderAdminView();
    this.initActivationWizard();
    this.detectDeviceGps(true);
    this.renderNearbyRadar('nearby-places-list', 'all');
    this.renderNearbyRadar('owner-nearby-places-list', 'all');
    this.setupTheme();
    refreshIcons();
  }

  // Detect if opened by phone scanning physical QR code (?scan=true&id=veh-101) or setup mode (?activate=true)
  checkScanModeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const isActivate = params.get('activate') === 'true' || params.get('setup') === 'true' || params.get('register') === 'true' || params.get('mode') === 'owner';
    const isScan = params.get('scan') === 'true' || params.has('id');
    const vehId = params.get('id');

    if (vehId && this.vehicles.some(v => v.id === vehId)) {
      this.activeVehicleId = vehId;
    }

    if (isActivate) {
      setTimeout(() => {
        this.switchView('activation');
        soundEngine.playScanChime();
        this.showToast('🚀 Vehicle Setup & Activation Form Ready', 'info');
      }, 100);
    } else if (isScan) {
      // Auto-switch to scanner portal view immediately
      setTimeout(() => {
        this.switchView('scanner');
        soundEngine.playScanChime();
        this.showToast(`Vehicle QR Code Scanned Successfully!`, 'success');
      }, 100);
    }
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const viewName = tab.dataset.view;
        this.switchView(viewName);
      });
    });

    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('ag_theme', isLight ? 'light' : 'dark');
      refreshIcons();
    });

    // Quick SOS Simulation button in Header
    document.getElementById('btn-quick-sos-sim')?.addEventListener('click', () => {
      this.triggerSOSBroadcast({
        category: 'emergency',
        subTag: 'Critical Emergency SOS Broadcast',
        message: '🚨 Emergency SOS broadcast triggered for vehicle. Immediate family alerted.',
        location: { lat: 28.6139, lng: 77.2090, address: 'Live GPS Pin Broadcast' }
      });
    });

    // Owner Status Pills
    document.querySelectorAll('#owner-status-selector .status-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#owner-status-selector .status-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const status = pill.dataset.status;
        this.updateActiveVehicleStatus(status);
      });
    });

    // Feed Filter buttons
    document.querySelectorAll('.feed-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.feed-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderAlertsFeed(btn.dataset.filter);
      });
    });

    // Vehicle Modal Open / Close
    document.getElementById('btn-add-vehicle')?.addEventListener('click', () => this.openVehicleModal());
    document.getElementById('btn-close-vehicle-modal')?.addEventListener('click', () => this.closeVehicleModal());
    document.getElementById('btn-cancel-vehicle')?.addEventListener('click', () => this.closeVehicleModal());
    document.getElementById('form-vehicle')?.addEventListener('submit', (e) => this.handleSaveVehicle(e));

    // Family Modal Open / Close
    document.getElementById('btn-add-family-member')?.addEventListener('click', () => this.openFamilyModal());
    document.getElementById('btn-close-family-modal')?.addEventListener('click', () => this.closeFamilyModal());
    document.getElementById('btn-cancel-family')?.addEventListener('click', () => this.closeFamilyModal());
    document.getElementById('form-family')?.addEventListener('submit', (e) => this.handleSaveFamily(e));
    document.getElementById('btn-test-family-sos-dispatch')?.addEventListener('click', () => {
      this.triggerSOSBroadcast({
        category: 'emergency',
        subTag: 'Family SOS System Test',
        message: 'This is a test broadcast of the emergency family network.',
        location: { lat: 28.6139, lng: 77.2090, address: 'Test Location Pin' }
      });
    });

    // Open Sticker Studio from dashboard promo
    document.getElementById('btn-goto-studio')?.addEventListener('click', () => {
      this.switchView('studio');
    });

    // Scanner Category Switching
    document.querySelectorAll('.issue-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.issue-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category;
        this.renderCategorySubForm();
      });
    });

    // Scanner Vehicle selector switch
    document.getElementById('scanner-vehicle-selector')?.addEventListener('change', (e) => {
      this.activeVehicleId = e.target.value;
      this.renderScannerVehicleInfo();
      this.renderStickerStudio();
    });

    // Scanner Owner Setup quick-link
    document.getElementById('btn-scanner-open-owner-setup')?.addEventListener('click', () => {
      this.switchView('activation');
      this.showToast('Opening Vehicle Setup & QR Activation Form', 'info');
    });

    // Scanner Attach Location
    document.getElementById('btn-attach-location')?.addEventListener('click', () => this.handleAttachLocation());

    // Scanner Attach Photo
    document.getElementById('photo-evidence-input')?.addEventListener('change', (e) => this.handlePhotoUpload(e));
    document.getElementById('btn-remove-photo')?.addEventListener('click', () => this.removePhotoEvidence());

    // Scanner Submit Alert
    document.getElementById('btn-send-scanner-alert')?.addEventListener('click', () => this.handleScannerAlertSubmit());

    // DIRECT 1-CLICK SOS CASCADING EMERGENCY MULTI-CALL (DIALS OWNER FIRST -> 2 FAMILY SECONDARY)
    document.getElementById('btn-scanner-cascade-sos-call')?.addEventListener('click', () => this.startCascadeSOSCall());
    document.getElementById('btn-trigger-instant-family-call')?.addEventListener('click', () => this.escalateToFamilyNow());

    // 1-CLICK DIRECT AMBULANCE (108), POLICE (112), AND FAMILY BROADCAST
    document.getElementById('btn-scanner-call-ambulance')?.addEventListener('click', () => this.startAmbulanceCall());
    document.getElementById('btn-scanner-call-police')?.addEventListener('click', () => this.startPoliceCall());
    document.getElementById('btn-scanner-family-sos')?.addEventListener('click', () => this.startFamilyBroadcastCall());

    // Scanner Normal Masked Voice Call
    document.getElementById('btn-scanner-call')?.addEventListener('click', () => this.startMaskedCall());
    document.getElementById('btn-end-sim-call')?.addEventListener('click', () => this.endMaskedCall());
    document.getElementById('btn-close-call-modal')?.addEventListener('click', () => this.endMaskedCall());
    document.getElementById('btn-sim-send-chat')?.addEventListener('click', () => this.sendSimChatMsg());
    document.getElementById('sim-chat-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendSimChatMsg();
    });

    // Scanner WhatsApp Alert
    document.getElementById('btn-scanner-whatsapp')?.addEventListener('click', () => this.triggerWhatsAppAlert());

    // Test Quick Fill Helpers
    document.getElementById('btn-fill-wrong-parking')?.addEventListener('click', () => {
      this.selectedCategory = 'wrong_parking';
      document.querySelectorAll('.issue-cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'wrong_parking');
      });
      this.renderCategorySubForm();
      this.showToast('Pre-filled "Wrong / Blocked Parking" scenario', 'info');
    });

    document.getElementById('btn-fill-hazard')?.addEventListener('click', () => {
      this.selectedCategory = 'hazard';
      document.querySelectorAll('.issue-cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'hazard');
      });
      this.renderCategorySubForm();
      this.showToast('Pre-filled "Headlights Left ON" scenario', 'info');
    });

    // Sticker Studio theme selectors
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const theme = chip.dataset.theme;
        this.updateStickerTheme(theme);
      });
    });

    // Sticker Studio text inputs
    document.getElementById('sticker-title-input')?.addEventListener('input', (e) => {
      const el = document.getElementById('preview-sticker-title');
      if (el) el.textContent = e.target.value || 'SCAN TO CONTACT VEHICLE OWNER';
    });

    // Vehicle Category Preset Title Switchers
    document.querySelectorAll('.cat-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.cat-preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const title = chip.dataset.title;
        const input = document.getElementById('sticker-title-input');
        const preview = document.getElementById('preview-sticker-title');
        if (input) input.value = title;
        if (preview) preview.textContent = title;
        this.showToast(`Sticker Header updated: "${title}"`, 'info');
      });
    });

    document.getElementById('studio-vehicle-select')?.addEventListener('change', (e) => {
      this.activeVehicleId = e.target.value;
      this.renderStickerStudio();
    });

    document.getElementById('studio-base-url')?.addEventListener('input', () => {
      this.renderStickerStudio();
    });

    document.getElementById('btn-detect-ip')?.addEventListener('click', () => {
      const input = document.getElementById('studio-base-url');
      if (input) {
        input.value = window.location.origin;
        this.renderStickerStudio();
        this.showToast('Target URL reset to current origin', 'info');
      }
    });

    // Sticker Print & Download
    document.getElementById('btn-print-sticker')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-download-sticker-png')?.addEventListener('click', () => {
      this.downloadStickerPNG();
    });

    // =========================================================================
    // ACTIVATION WIZARD EVENTS
    // =========================================================================
    document.querySelectorAll('.btn-next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.dataset.target, 10);
        this.setWizardStep(targetStep);
      });
    });

    document.querySelectorAll('.btn-prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.dataset.target, 10);
        this.setWizardStep(targetStep);
      });
    });

    document.querySelectorAll('.wizard-step-node').forEach(node => {
      node.addEventListener('click', () => {
        const step = parseInt(node.dataset.step, 10);
        this.setWizardStep(step);
      });
    });

    // Auto-fill Kit Serial Simulator
    document.getElementById('btn-scan-kit-code')?.addEventListener('click', () => {
      const serials = ['AG-2026-PRO-7741', 'AG-2026-PRO-9920', 'AG-2026-FLEET-3312'];
      const randomSerial = serials[Math.floor(Math.random() * serials.length)];
      const input = document.getElementById('act-qr-serial');
      if (input) input.value = randomSerial;
      soundEngine.playScanChime();
      this.showToast(`Scanned QR Kit Key: ${randomSerial}`, 'success');
    });

    // Auto-detect Home GPS
    document.getElementById('btn-fetch-home-gps')?.addEventListener('click', () => {
      const statusBadge = document.getElementById('home-gps-status');
      if (navigator.geolocation) {
        if (statusBadge) statusBadge.textContent = 'Fetching current GPS...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.homeGpsLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (statusBadge) statusBadge.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Saved)`;
            this.showToast('Home GPS Coordinates Saved!', 'success');
          },
          () => {
            this.homeGpsLocation = { lat: 28.6280, lng: 77.3750 };
            if (statusBadge) statusBadge.textContent = 'Lat: 28.6280, Lng: 77.3750 (Saved)';
            this.showToast('Default Home GPS Geotag Saved!', 'success');
          }
        );
      }
    });

    // Complete 1-Click QR Activation
    document.getElementById('btn-complete-activation')?.addEventListener('click', () => {
      this.handleCompleteActivation();
    });

    // =========================================================================
    // ADMIN CONSOLE EVENTS
    // =========================================================================
    document.getElementById('adm-customer-search')?.addEventListener('input', (e) => {
      this.renderAdminCustomers(e.target.value.trim().toLowerCase());
    });

    document.getElementById('btn-admin-gen-batch')?.addEventListener('click', () => {
      const newBatchId = 'BATCH-' + Math.floor(1000 + Math.random() * 9000);
      confetti({ particleCount: 50, spread: 60 });
      this.showToast(`Generated 50 New QR Serial Codes (${newBatchId})`, 'success');
      const totalTags = document.getElementById('adm-total-tags');
      if (totalTags) totalTags.textContent = '1,530';
    });

    document.getElementById('btn-admin-export-data')?.addEventListener('click', () => {
      this.exportAdminCSV();
    });

    // =========================================================================
    // NEARBY RADAR GPS SYNC, FILTER & MAP/LIST TOGGLE EVENTS
    // =========================================================================
    document.getElementById('btn-owner-refresh-gps')?.addEventListener('click', () => {
      this.syncDeviceGps();
    });

    document.getElementById('btn-scanner-refresh-gps')?.addEventListener('click', () => {
      this.syncDeviceGps();
    });

    document.querySelectorAll('.nearby-radar-widget .radar-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.nearby-radar-widget .radar-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderNearbyRadar('nearby-places-list', chip.dataset.type);
        this.updateRadarMapPins('scanner-radar-live-map', chip.dataset.type);
      });
    });

    document.querySelectorAll('.nearby-owner-radar .radar-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.nearby-owner-radar .radar-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderNearbyRadar('owner-nearby-places-list', chip.dataset.type);
        this.updateRadarMapPins('owner-radar-live-map', chip.dataset.type);
      });
    });

    // Scanner Radar List / Map View Toggles
    document.getElementById('btn-radar-list-view')?.addEventListener('click', () => {
      document.getElementById('btn-radar-list-view')?.classList.add('active');
      document.getElementById('btn-radar-map-view')?.classList.remove('active');
      document.getElementById('nearby-places-list')?.classList.remove('hidden');
      document.getElementById('scanner-radar-live-map')?.classList.add('hidden');
    });

    document.getElementById('btn-radar-map-view')?.addEventListener('click', () => {
      document.getElementById('btn-radar-map-view')?.classList.add('active');
      document.getElementById('btn-radar-list-view')?.classList.remove('active');
      document.getElementById('nearby-places-list')?.classList.add('hidden');
      const mapContainer = document.getElementById('scanner-radar-live-map');
      if (mapContainer) {
        mapContainer.classList.remove('hidden');
        this.initRadarLeafletMap('scanner-radar-live-map');
      }
    });

    // Owner Radar List / Map View Toggles
    document.getElementById('btn-owner-radar-list')?.addEventListener('click', () => {
      document.getElementById('btn-owner-radar-list')?.classList.add('active');
      document.getElementById('btn-owner-radar-map')?.classList.remove('active');
      document.getElementById('owner-nearby-places-list')?.classList.remove('hidden');
      document.getElementById('owner-radar-live-map')?.classList.add('hidden');
    });

    document.getElementById('btn-owner-radar-map')?.addEventListener('click', () => {
      document.getElementById('btn-owner-radar-map')?.classList.add('active');
      document.getElementById('btn-owner-radar-list')?.classList.remove('active');
      document.getElementById('owner-nearby-places-list')?.classList.add('hidden');
      const mapContainer = document.getElementById('owner-radar-live-map');
      if (mapContainer) {
        mapContainer.classList.remove('hidden');
        this.initRadarLeafletMap('owner-radar-live-map');
      }
    });
  }

  setupTheme() {
    const saved = localStorage.getItem('ag_theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  // =========================================================================
  // VIEW SWITCHING
  // =========================================================================
  switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const targetPanel = document.getElementById(`view-${viewName}`);
    const targetTab = document.getElementById(`tab-${viewName}`);

    if (targetPanel) targetPanel.classList.add('active');
    if (targetTab) targetTab.classList.add('active');

    if (viewName === 'studio') {
      this.renderStickerStudio();
    } else if (viewName === 'scanner') {
      this.renderScannerView();
    } else if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'activation') {
      this.initActivationWizard();
    } else if (viewName === 'family') {
      this.renderFamilyView();
    } else if (viewName === 'admin') {
      this.renderAdminView();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshIcons();
  }

  // =========================================================================
  // DASHBOARD RENDERING
  // =========================================================================
  renderDashboard() {
    this.vehicles = storage.getVehicles();
    this.alerts = storage.getAlerts();
    this.family = storage.getFamily();

    // Stats
    const carsCountEl = document.getElementById('stat-cars-count');
    if (carsCountEl) carsCountEl.textContent = `${this.vehicles.length} Vehicle${this.vehicles.length !== 1 ? 's' : ''}`;

    const alertsCountEl = document.getElementById('stat-alerts-count');
    if (alertsCountEl) {
      const unread = this.alerts.filter(a => !a.isRead).length;
      alertsCountEl.textContent = `${unread} New Alert${unread !== 1 ? 's' : ''}`;
    }

    const familyCountEl = document.getElementById('stat-family-count');
    if (familyCountEl) familyCountEl.textContent = `${this.family.length} Contacts`;

    // Render Vehicle Cards list
    const vehicleListEl = document.getElementById('vehicle-cards-list');
    if (vehicleListEl) {
      vehicleListEl.innerHTML = this.vehicles.map(v => `
        <div class="vehicle-card-item ${v.id === this.activeVehicleId ? 'active-selection' : ''}" data-id="${v.id}">
          <div class="vehicle-meta">
            <div class="vehicle-icon-box" style="font-size: 1.3rem; display: flex; align-items: center; justify-content: center;">
              ${v.categoryIcon || (v.type === '2-Wheeler' ? '🏍️' : '🚗')}
            </div>
            <div>
              <div class="vehicle-title" style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                <span>${v.name}</span>
                <span class="badge" style="font-size: 0.65rem; padding: 1px 5px; background: rgba(59, 130, 246, 0.15); color: var(--accent-blue);">${v.type || 'Vehicle'}</span>
              </div>
              <span class="vehicle-plate-pill">${storage.maskPlate(v.plate)}</span>
            </div>
          </div>
          <div class="vehicle-actions">
            <button class="icon-btn btn-make-active" title="Set Active in Studio & Scanner" data-id="${v.id}">
              <i data-lucide="${v.id === this.activeVehicleId ? 'check' : 'qr-code'}"></i>
            </button>
            <button class="icon-btn btn-edit-veh" title="Edit Vehicle" data-id="${v.id}">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="icon-btn btn-delete btn-delete-veh" title="Delete Vehicle" data-id="${v.id}">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `).join('');

      // Bind vehicle action buttons
      vehicleListEl.querySelectorAll('.btn-make-active').forEach(b => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          this.activeVehicleId = b.dataset.id;
          this.renderDashboard();
          this.renderScannerView();
          this.renderStickerStudio();
          this.showToast('Active vehicle updated', 'success');
        });
      });

      vehicleListEl.querySelectorAll('.btn-edit-veh').forEach(b => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openVehicleModal(b.dataset.id);
        });
      });

      vehicleListEl.querySelectorAll('.btn-delete-veh').forEach(b => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteVehicle(b.dataset.id);
        });
      });
    }

    // Render Mini QR Preview
    const miniQr = document.getElementById('mini-qr-preview');
    if (miniQr) {
      const activeVeh = this.getActiveVehicle();
      const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://192.168.1.6:${window.location.port || '5173'}`
        : window.location.origin;
      const realUrl = `${baseUrl.replace(/\/+$/, '')}/?scan=true&id=${activeVeh.id}`;

      QRCode.toCanvas(document.createElement('canvas'), realUrl, {
        width: 74,
        margin: 1,
        color: { dark: '#f59e0b', light: '#000000' }
      }, (err, canvas) => {
        if (!err && canvas) {
          miniQr.innerHTML = '';
          miniQr.appendChild(canvas);
        }
      });
    }

    // Render Alerts Feed
    this.renderAlertsFeed('all');
    refreshIcons();
  }

  renderAlertsFeed(filter = 'all') {
    const feedEl = document.getElementById('alerts-feed-list');
    if (!feedEl) return;

    let list = this.alerts;
    if (filter === 'parking') list = list.filter(a => a.category === 'wrong_parking');
    else if (filter === 'hazard') list = list.filter(a => a.category === 'hazard');
    else if (filter === 'sos') list = list.filter(a => a.category === 'emergency');

    if (list.length === 0) {
      feedEl.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
          <i data-lucide="shield-check" style="width: 36px; height: 36px; margin-bottom: 0.5rem; opacity: 0.5;"></i>
          <p>No alerts in this category. All clear!</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    feedEl.innerHTML = list.map(alert => {
      const isSOS = alert.category === 'emergency';
      const timeStr = this.formatTimeAgo(alert.timestamp);
      let tagClass = 'tag-chat';
      let iconName = 'message-square';

      if (alert.category === 'wrong_parking') {
        tagClass = 'tag-parking';
        iconName = 'circle-slash-2';
      } else if (alert.category === 'hazard') {
        tagClass = 'tag-hazard';
        iconName = 'alert-triangle';
      } else if (alert.category === 'emergency') {
        tagClass = 'tag-sos';
        iconName = 'siren';
      } else if (alert.category === 'security') {
        tagClass = 'tag-security';
        iconName = 'lock';
      } else if (alert.category === 'community') {
        tagClass = 'tag-community';
        iconName = 'zap';
      }

      return `
        <div class="alert-item-card ${alert.isRead ? '' : 'unread'} ${isSOS ? 'sos-alert' : ''}">
          <div class="alert-item-header">
            <span class="alert-type-tag ${tagClass}">
              <i data-lucide="${iconName}"></i>
              ${alert.subTag || alert.category}
            </span>
            <span class="alert-time">${timeStr}</span>
          </div>

          <div class="alert-body-text">${alert.message}</div>

          <div class="alert-meta-details">
            <span class="meta-chip"><i data-lucide="car"></i> ${alert.vehicleName}</span>
            ${alert.location ? `<span class="meta-chip"><i data-lucide="map-pin"></i> ${alert.location.address || 'GPS Attached'}</span>` : ''}
          </div>

          ${alert.photoUrl ? `
            <div class="alert-attachment-thumbnail">
              <img src="${alert.photoUrl}" alt="Evidence Thumbnail">
            </div>
          ` : ''}

          <!-- Quick Actions for Owner -->
          <div class="alert-quick-replies">
            <button class="quick-reply-btn" data-reply="Heading to my car right now!" data-id="${alert.id}">
              🏃 Moving Car Now
            </button>
            <button class="quick-reply-btn" data-reply="Thanks for informing, resolved!" data-id="${alert.id}">
              ✅ Thanks, Sorted!
            </button>
            <button class="quick-reply-btn" data-reply="Calling you back in 1 min." data-id="${alert.id}">
              📞 Calling Back
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind quick reply buttons
    feedEl.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const replyText = btn.dataset.reply;
        this.showToast(`Auto-Reply Sent: "${replyText}"`, 'success');
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#fff';
      });
    });

    refreshIcons();
  }

  // =========================================================================
  // SCANNER PORTAL LOGIC (WHAT BYSTANDER SEES)
  // =========================================================================
  renderScannerView() {
    this.renderScannerVehicleInfo();
    this.renderCategorySubForm();
    refreshIcons();
  }

  renderScannerVehicleInfo() {
    const activeVeh = this.getActiveVehicle();
    const selectEl = document.getElementById('scanner-vehicle-selector');
    if (selectEl) {
      selectEl.innerHTML = this.vehicles.map(v => `
        <option value="${v.id}" ${v.id === activeVeh.id ? 'selected' : ''}>${v.categoryIcon || '🚗'} ${v.name}</option>
      `).join('');
    }

    const nameEl = document.getElementById('scan-car-name');
    if (nameEl) nameEl.textContent = activeVeh.name;

    const catBadge = document.getElementById('scan-veh-category-badge');
    if (catBadge) catBadge.textContent = activeVeh.category || activeVeh.type || 'Vehicle';

    const avatarEl = document.getElementById('scan-veh-avatar');
    if (avatarEl) avatarEl.textContent = activeVeh.categoryIcon || (activeVeh.type === '2-Wheeler' ? '🏍️' : '🚗');

    const plateEl = document.getElementById('scan-car-plate');
    if (plateEl) plateEl.textContent = storage.maskPlate(activeVeh.plate);

    const noteEl = document.getElementById('scan-owner-note');
    if (noteEl) noteEl.textContent = `"${activeVeh.note || 'If blocking or emergency, please tap below to alert me.'}"`;

    const statusEl = document.getElementById('scan-owner-status');
    if (statusEl) {
      if (activeVeh.status === '5min') statusEl.textContent = 'Owner Nearby • Back in 5 Mins';
      else if (activeVeh.status === 'valet') statusEl.textContent = 'Valet / Key with Parking Staff';
      else if (activeVeh.status === 'dnd') statusEl.textContent = 'Do Not Disturb • Emergency SOS Allowed';
      else statusEl.textContent = 'Owner Active • Responds in < 2 mins';
    }
  }

  renderCategorySubForm() {
    const formContainer = document.getElementById('category-sub-form');
    if (!formContainer) return;

    const categoryData = ISSUE_CATEGORIES[this.selectedCategory] || ISSUE_CATEGORIES.wrong_parking;
    this.selectedSubTag = categoryData.tags[0];

    formContainer.innerHTML = `
      <div class="sub-tags-wrap">
        ${categoryData.tags.map((tag, idx) => `
          <button type="button" class="sub-tag-btn ${idx === 0 ? 'active' : ''}" data-tag="${tag}">
            ${tag}
          </button>
        `).join('')}
      </div>
      <textarea id="scanner-custom-note" class="custom-input-box" placeholder="Additional details / description (optional)...">${categoryData.defaultMsg}</textarea>
    `;

    formContainer.querySelectorAll('.sub-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        formContainer.querySelectorAll('.sub-tag-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedSubTag = btn.dataset.tag;
      });
    });
  }

  handleAttachLocation() {
    const locBtn = document.getElementById('btn-attach-location');
    const statusText = document.getElementById('loc-status-text');

    if (navigator.geolocation) {
      locBtn.classList.add('attached');
      statusText.textContent = 'Fetching GPS...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.scannerLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
          };
          statusText.textContent = '📍 GPS Location Attached';
          this.showToast('Live GPS coordinates attached to alert', 'success');
        },
        () => {
          // Fallback mock coordinates
          this.scannerLocation = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place Main Circle' };
          statusText.textContent = '📍 GPS Location Attached';
          this.showToast('GPS coordinates attached to alert', 'success');
        }
      );
    } else {
      this.scannerLocation = { lat: 28.6139, lng: 77.2090, address: 'Near Parking Spot #14' };
      locBtn.classList.add('attached');
      statusText.textContent = '📍 Location Attached';
    }
  }

  handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.scannerPhotoData = event.target.result;
      const previewBox = document.getElementById('photo-preview-box');
      const previewImg = document.getElementById('photo-preview-img');
      const statusText = document.getElementById('photo-status-text');

      if (previewBox && previewImg) {
        previewImg.src = this.scannerPhotoData;
        previewBox.classList.remove('hidden');
      }
      if (statusText) statusText.textContent = '📷 Photo Attached';
      this.showToast('Photo evidence attached', 'success');
    };
    reader.readAsDataURL(file);
  }

  removePhotoEvidence() {
    this.scannerPhotoData = null;
    const previewBox = document.getElementById('photo-preview-box');
    const statusText = document.getElementById('photo-status-text');
    if (previewBox) previewBox.classList.add('hidden');
    if (statusText) statusText.textContent = 'Attach Photo';
  }

  handleScannerAlertSubmit() {
    const noteInput = document.getElementById('scanner-custom-note');
    const customMessage = noteInput?.value || ISSUE_CATEGORIES[this.selectedCategory]?.defaultMsg;
    const activeVeh = this.getActiveVehicle();

    const newAlert = storage.addAlert({
      vehicleId: activeVeh.id,
      vehicleName: activeVeh.name,
      category: this.selectedCategory,
      subTag: this.selectedSubTag,
      message: customMessage,
      location: this.scannerLocation,
      photoUrl: this.scannerPhotoData
    });

    this.alerts = storage.getAlerts();

    // Sound effect
    if (this.selectedCategory === 'emergency') {
      soundEngine.playEmergencySiren();
    } else {
      soundEngine.playParkingAlert();
    }

    // Confetti celebration
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    this.showToast(`Alert dispatched to vehicle owner instantly!`, 'success');

    // Reset inputs
    if (noteInput) noteInput.value = '';
    this.removePhotoEvidence();

    // Auto-update dashboard feed in background
    this.renderDashboard();
  }

  // =========================================================================
  // SMART CASCADE SOS MULTI-PARTY CALLING ENGINE
  // =========================================================================
  startCascadeSOSCall() {
    const modal = document.getElementById('modal-call-sim');
    if (!modal) return;
    modal.classList.remove('hidden');

    const activeVeh = this.getActiveVehicle();
    this.family = storage.getFamily();
    this.callSeconds = 0;
    this.isEscalatedToFamily = false;

    // UI Configuration for SOS Emergency Mode
    const badge = document.getElementById('call-modal-mode-badge');
    const avatar = document.getElementById('call-avatar-indicator');
    const title = document.getElementById('call-main-title');
    const statusText = document.getElementById('call-timer-status');
    const waveform = document.getElementById('call-audio-waveform');
    const escalateBtn = document.getElementById('escalate-actions-bar');
    const linesContainer = document.getElementById('cascade-lines-container');
    const realFallback = document.getElementById('btn-real-phone-fallback');

    if (badge) badge.innerHTML = `<i data-lucide="siren"></i> <span style="color:var(--accent-red-sos); font-weight:800;">🚨 SMART CASCADE SOS EMERGENCY CALL</span>`;
    if (avatar) avatar.className = 'call-avatar-pulse sos-mode';
    if (title) title.textContent = `Dialing Vehicle Owner First...`;
    if (statusText) {
      statusText.className = 'call-status-text sos-text';
      statusText.textContent = `Dialing Owner (${activeVeh.phoneMasked}) • Auto-escalating to Family in 8s...`;
    }
    if (waveform) waveform.className = 'audio-waveform emergency';
    if (escalateBtn) escalateBtn.style.display = 'block';
    if (realFallback) realFallback.href = `tel:${activeVeh.realPhone || '+919876543210'}`;

    // Render Initial Line Statuses
    if (linesContainer) {
      linesContainer.innerHTML = `
        <div class="cascade-line-item calling" id="line-owner">
          <div class="line-info">
            <div class="line-avatar" style="background:var(--accent-blue);">${activeVeh.categoryIcon || '🚗'}</div>
            <div>
              <div style="font-weight:700;">Vehicle Owner (${activeVeh.name})</div>
              <small class="font-mono" style="color:var(--text-muted);">${activeVeh.phoneMasked}</small>
            </div>
          </div>
          <span class="line-status-pill pill-ringing" id="status-owner">🔵 Priority Dialing...</span>
        </div>

        ${this.family.map((f, idx) => `
          <div class="cascade-line-item" id="line-fam-${f.id}">
            <div class="line-info">
              <div class="line-avatar" style="background:rgba(255,255,255,0.1);">${f.name.charAt(0)}</div>
              <div>
                <div style="font-weight:600;">${f.name} (${f.relation})</div>
                <small class="font-mono" style="color:var(--text-muted);">${f.phone}</small>
              </div>
            </div>
            <span class="line-status-pill" style="background:rgba(255,255,255,0.06); color:var(--text-muted);" id="status-fam-${f.id}">⏳ Standby</span>
          </div>
        `).join('')}
      `;
    }

    soundEngine.playEmergencySiren();
    soundEngine.playRingtone();

    // Auto-escalation timer logic
    if (this.callInterval) clearInterval(this.callInterval);

    this.callInterval = setInterval(() => {
      this.callSeconds++;

      if (!this.isEscalatedToFamily) {
        const remaining = Math.max(0, 8 - this.callSeconds);
        if (statusText) statusText.textContent = `Calling Owner (${activeVeh.phoneMasked}) • Escalating to all family in ${remaining}s...`;

        if (this.callSeconds >= 8) {
          // AUTO-ESCALATE TO ALL FAMILY MEMBERS SIMULTANEOUSLY
          this.escalateToFamilyNow();
        }
      } else {
        const elapsed = this.callSeconds - 8;
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (statusText && this.callConnectedContact) {
          statusText.textContent = `🟢 Connected with ${this.callConnectedContact} (${timeStr})`;
        }
      }
    }, 1000);

    refreshIcons();
  }

  // Phase 2: Simultaneous Multi-Ring to All Listed Family Members
  escalateToFamilyNow() {
    if (this.isEscalatedToFamily) return;
    this.isEscalatedToFamily = true;

    const title = document.getElementById('call-main-title');
    const statusText = document.getElementById('call-timer-status');
    const ownerLine = document.getElementById('line-owner');
    const ownerStatus = document.getElementById('status-owner');
    const escalateBtn = document.getElementById('escalate-actions-bar');

    if (title) title.textContent = `🚨 Ringing ALL Family Members Simultaneously!`;
    if (statusText) statusText.textContent = `Owner Unreachable • Calling ${this.family.length} Family Contacts at the same time...`;
    if (escalateBtn) escalateBtn.style.display = 'none';

    if (ownerLine) ownerLine.className = 'cascade-line-item unanswered';
    if (ownerStatus) {
      ownerStatus.className = 'line-status-pill pill-unanswered';
      ownerStatus.textContent = '⚠️ No Answer (Timed Out)';
    }

    // Set ALL family lines to simultaneous ringing
    this.family.forEach(f => {
      const famLine = document.getElementById(`line-fam-${f.id}`);
      const famStatus = document.getElementById(`status-fam-${f.id}`);
      if (famLine) famLine.className = 'cascade-line-item simultaneous-ring';
      if (famStatus) {
        famStatus.className = 'line-status-pill pill-multiring';
        famStatus.textContent = '🚨 Ringing Now...';
      }
    });

    // Play urgent simultaneous multi-ring tone
    soundEngine.playEmergencyMultiRing();

    // In-call chat stream note
    const stream = document.getElementById('sim-chat-stream');
    if (stream) {
      const note = document.createElement('div');
      note.className = 'chat-bubble system';
      note.style.color = '#ff6b6b';
      note.innerHTML = `<i data-lucide="siren"></i> Vehicle Owner unanswered. Simultaneous emergency call broadcasted to ${this.family.length} family contacts.`;
      stream.appendChild(note);
      stream.scrollTop = stream.scrollHeight;
    }

    // Simulate first family member answering after 3.5 seconds
    setTimeout(() => {
      if (!this.isEscalatedToFamily) return;
      const firstContact = this.family[0] || { name: 'Priya Sharma', relation: 'Spouse', id: 'fam-1' };
      this.callConnectedContact = `${firstContact.name} (${firstContact.relation})`;

      const answeredLine = document.getElementById(`line-fam-${firstContact.id}`);
      const answeredStatus = document.getElementById(`status-fam-${firstContact.id}`);
      if (answeredLine) answeredLine.className = 'cascade-line-item connected';
      if (answeredStatus) {
        answeredStatus.className = 'line-status-pill pill-connected';
        answeredStatus.textContent = '🟢 Connected & Live';
      }

      if (title) title.textContent = `Connected with ${this.callConnectedContact}`;
      if (statusText) statusText.textContent = `🟢 Live Encrypted Voice Bridge Connected`;

      soundEngine.playCallConnected();

      if (stream) {
        const connMsg = document.createElement('div');
        connMsg.className = 'chat-bubble owner';
        connMsg.style.background = 'rgba(16, 185, 129, 0.2)';
        connMsg.style.borderColor = 'var(--accent-emerald)';
        connMsg.innerHTML = `<strong>${firstContact.name} (${firstContact.relation}):</strong> Hello! I received the vehicle SOS alert. Is everything okay? I am on the line.`;
        stream.appendChild(connMsg);
        stream.scrollTop = stream.scrollHeight;
      }
    }, 3500);

    refreshIcons();
  }

  // Standard Masked VoIP Call Simulator
  startMaskedCall() {
    const modal = document.getElementById('modal-call-sim');
    if (!modal) return;
    modal.classList.remove('hidden');

    const activeVeh = this.getActiveVehicle();
    this.callSeconds = 0;
    this.isEscalatedToFamily = false;

    // Normal mode UI
    const badge = document.getElementById('call-modal-mode-badge');
    const avatar = document.getElementById('call-avatar-indicator');
    const title = document.getElementById('call-main-title');
    const statusText = document.getElementById('call-timer-status');
    const waveform = document.getElementById('call-audio-waveform');
    const escalateBtn = document.getElementById('escalate-actions-bar');
    const linesContainer = document.getElementById('cascade-lines-container');
    const realFallback = document.getElementById('btn-real-phone-fallback');

    if (badge) badge.innerHTML = `<i data-lucide="shield-check"></i> <span>Encrypted Proxy Call Relay</span>`;
    if (avatar) avatar.className = 'call-avatar-pulse';
    if (title) title.textContent = `Connecting to Vehicle Owner...`;
    if (statusText) {
      statusText.className = 'call-status-text';
      statusText.textContent = `Ringing proxy gateway (${activeVeh.phoneMasked})...`;
    }
    if (waveform) waveform.className = 'audio-waveform';
    if (escalateBtn) escalateBtn.style.display = 'block';
    if (realFallback) realFallback.href = `tel:${activeVeh.realPhone || '+919876543210'}`;

    if (linesContainer) {
      linesContainer.innerHTML = `
        <div class="cascade-line-item calling">
          <div class="line-info">
            <div class="line-avatar" style="background:var(--accent-emerald);">${activeVeh.categoryIcon || '📞'}</div>
            <div>
              <div style="font-weight:700;">${activeVeh.name} (${activeVeh.type || 'Owner'})</div>
              <small class="font-mono" style="color:var(--text-muted);">${activeVeh.phoneMasked}</small>
            </div>
          </div>
          <span class="line-status-pill pill-ringing">Dialing...</span>
        </div>
      `;
    }

    soundEngine.playRingtone();

    if (this.callInterval) clearInterval(this.callInterval);

    this.callInterval = setInterval(() => {
      this.callSeconds++;
      if (this.callSeconds < 3) {
        if (statusText) statusText.textContent = `Connecting via Encrypted Proxy Gateway (${activeVeh.phoneMasked})...`;
      } else {
        const mins = Math.floor((this.callSeconds - 3) / 60);
        const secs = (this.callSeconds - 3) % 60;
        const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (statusText) statusText.textContent = `🟢 Connected • Masked Audio Relay (${timeFormatted})`;
      }
    }, 1000);
    refreshIcons();
  }

  // 1-CLICK DIRECT AMBULANCE DISPATCH (DIAL 108)
  startAmbulanceCall() {
    const modal = document.getElementById('modal-call-sim');
    if (!modal) return;
    modal.classList.remove('hidden');

    const activeVeh = this.getActiveVehicle();
    this.callSeconds = 0;
    this.isEscalatedToFamily = false;

    const badge = document.getElementById('call-modal-mode-badge');
    const avatar = document.getElementById('call-avatar-indicator');
    const title = document.getElementById('call-main-title');
    const statusText = document.getElementById('call-timer-status');
    const waveform = document.getElementById('call-audio-waveform');
    const escalateBtn = document.getElementById('escalate-actions-bar');
    const linesContainer = document.getElementById('cascade-lines-container');
    const realFallback = document.getElementById('btn-real-phone-fallback');

    if (badge) badge.innerHTML = `<i data-lucide="siren"></i> <span style="color:#ef4444; font-weight:800;">🚑 EMERGENCY MEDICAL DISPATCH (108)</span>`;
    if (avatar) avatar.className = 'call-avatar-pulse sos-mode';
    if (title) title.textContent = `Connecting to Ambulance Control (108)...`;
    if (statusText) {
      statusText.className = 'call-status-text sos-text';
      statusText.textContent = `Transmitting Vehicle Plate (${storage.maskPlate(activeVeh.plate)}) & Live GPS to 108 Dispatch...`;
    }
    if (waveform) waveform.className = 'audio-waveform emergency';
    if (escalateBtn) escalateBtn.style.display = 'none';
    if (realFallback) {
      realFallback.href = 'tel:108';
      realFallback.innerHTML = `<i data-lucide="phone"></i> Call 108 Cellular`;
    }

    if (linesContainer) {
      linesContainer.innerHTML = `
        <div class="cascade-line-item calling" id="line-ambulance">
          <div class="line-info">
            <div class="line-avatar" style="background:#ef4444;">🚑</div>
            <div>
              <div style="font-weight:700;">Ambulance Emergency Command (108)</div>
              <small class="font-mono" style="color:var(--text-muted);">Vehicle: ${activeVeh.name} • Plate: ${storage.maskPlate(activeVeh.plate)}</small>
            </div>
          </div>
          <span class="line-status-pill pill-ringing" id="status-ambulance">🚨 Connecting Dispatch...</span>
        </div>
      `;
    }

    // Chat stream log
    const stream = document.getElementById('sim-chat-stream');
    if (stream) {
      stream.innerHTML = `
        <div class="chat-bubble system" style="color:#ef4444;">
          <i data-lucide="siren"></i> <strong>Medical Trauma SOS Transmitted:</strong> Vehicle ${activeVeh.name} (${activeVeh.plate}) at live coordinates.
        </div>
      `;
    }

    soundEngine.playEmergencySiren();

    setTimeout(() => {
      const ambLine = document.getElementById('line-ambulance');
      const ambStatus = document.getElementById('status-ambulance');
      if (ambLine) ambLine.className = 'cascade-line-item connected';
      if (ambStatus) {
        ambStatus.className = 'line-status-pill pill-connected';
        ambStatus.textContent = '🟢 108 Operator Connected';
      }
      if (title) title.textContent = `Connected to Ambulance Dispatch (108)`;
      if (statusText) statusText.textContent = `🟢 Live Audio Relay • Ambulance Control Operator on Line`;
      soundEngine.playCallConnected();

      if (stream) {
        const opMsg = document.createElement('div');
        opMsg.className = 'chat-bubble owner';
        opMsg.style.background = 'rgba(239, 68, 68, 0.2)';
        opMsg.style.borderColor = 'var(--accent-rose)';
        opMsg.innerHTML = `<strong>108 Medical Dispatcher:</strong> Ambulance Emergency Control Room here. We have received vehicle ${storage.maskPlate(activeVeh.plate)} location. What is the medical emergency?`;
        stream.appendChild(opMsg);
        stream.scrollTop = stream.scrollHeight;
      }
    }, 2800);

    refreshIcons();
  }

  // 1-CLICK DIRECT POLICE DISPATCH (DIAL 112)
  startPoliceCall() {
    const modal = document.getElementById('modal-call-sim');
    if (!modal) return;
    modal.classList.remove('hidden');

    const activeVeh = this.getActiveVehicle();
    this.callSeconds = 0;
    this.isEscalatedToFamily = false;

    const badge = document.getElementById('call-modal-mode-badge');
    const avatar = document.getElementById('call-avatar-indicator');
    const title = document.getElementById('call-main-title');
    const statusText = document.getElementById('call-timer-status');
    const waveform = document.getElementById('call-audio-waveform');
    const escalateBtn = document.getElementById('escalate-actions-bar');
    const linesContainer = document.getElementById('cascade-lines-container');
    const realFallback = document.getElementById('btn-real-phone-fallback');

    if (badge) badge.innerHTML = `<i data-lucide="shield-alert"></i> <span style="color:var(--accent-blue); font-weight:800;">🚓 POLICE & TRAFFIC EMERGENCY DISPATCH (112)</span>`;
    if (avatar) avatar.className = 'call-avatar-pulse';
    if (title) title.textContent = `Connecting to Police Emergency (112)...`;
    if (statusText) {
      statusText.className = 'call-status-text';
      statusText.textContent = `Transmitting Vehicle Details (${storage.maskPlate(activeVeh.plate)}) & Coordinates to PCR...`;
    }
    if (waveform) waveform.className = 'audio-waveform';
    if (escalateBtn) escalateBtn.style.display = 'none';
    if (realFallback) {
      realFallback.href = 'tel:112';
      realFallback.innerHTML = `<i data-lucide="phone"></i> Call 112 Cellular`;
    }

    if (linesContainer) {
      linesContainer.innerHTML = `
        <div class="cascade-line-item calling" id="line-police">
          <div class="line-info">
            <div class="line-avatar" style="background:var(--accent-blue);">🚓</div>
            <div>
              <div style="font-weight:700;">Police PCR & Traffic Control (112)</div>
              <small class="font-mono" style="color:var(--text-muted);">Vehicle: ${activeVeh.name} • Plate: ${storage.maskPlate(activeVeh.plate)}</small>
            </div>
          </div>
          <span class="line-status-pill pill-ringing" id="status-police">🔵 Connecting PCR...</span>
        </div>
      `;
    }

    // Chat stream log
    const stream = document.getElementById('sim-chat-stream');
    if (stream) {
      stream.innerHTML = `
        <div class="chat-bubble system" style="color:var(--accent-blue);">
          <i data-lucide="shield"></i> <strong>Police Assistance Logged:</strong> Vehicle ${activeVeh.name} (${activeVeh.plate}) at location.
        </div>
      `;
    }

    soundEngine.playRingtone();

    setTimeout(() => {
      const polLine = document.getElementById('line-police');
      const polStatus = document.getElementById('status-police');
      if (polLine) polLine.className = 'cascade-line-item connected';
      if (polStatus) {
        polStatus.className = 'line-status-pill pill-connected';
        polStatus.textContent = '🟢 112 PCR Officer Live';
      }
      if (title) title.textContent = `Connected to Police Command (112)`;
      if (statusText) statusText.textContent = `🟢 Live Audio Relay • 112 PCR Duty Officer on Line`;
      soundEngine.playCallConnected();

      if (stream) {
        const polMsg = document.createElement('div');
        polMsg.className = 'chat-bubble owner';
        polMsg.style.background = 'rgba(59, 130, 246, 0.2)';
        polMsg.style.borderColor = 'var(--accent-blue)';
        polMsg.innerHTML = `<strong>112 Police Duty Officer:</strong> Police Central Control Room. Vehicle report registered for ${storage.maskPlate(activeVeh.plate)}. Please state your current location and issue.`;
        stream.appendChild(polMsg);
        stream.scrollTop = stream.scrollHeight;
      }
    }, 2800);

    refreshIcons();
  }

  // 1-CLICK DIRECT FAMILY BROADCAST (SIMULTANEOUS MULTI-PARTY CALL)
  startFamilyBroadcastCall() {
    this.startCascadeSOSCall();
    setTimeout(() => {
      this.escalateToFamilyNow();
    }, 600);
  }

  endMaskedCall() {
    const modal = document.getElementById('modal-call-sim');
    if (modal) modal.classList.add('hidden');
    if (this.callInterval) {
      clearInterval(this.callInterval);
      this.callInterval = null;
    }
    this.isEscalatedToFamily = false;
    this.callConnectedContact = null;
  }

  sendSimChatMsg() {
    const input = document.getElementById('sim-chat-input');
    const stream = document.getElementById('sim-chat-stream');
    if (!input || !stream || !input.value.trim()) return;

    const msg = input.value.trim();
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.style.cssText = 'background: var(--accent-blue); color: #fff; padding: 6px 10px; border-radius: 12px; margin: 4px 0; align-self: flex-end; max-width: 80%; margin-left: auto;';
    userBubble.textContent = msg;
    stream.appendChild(userBubble);
    input.value = '';

    stream.scrollTop = stream.scrollHeight;

    // Simulated auto-response
    setTimeout(() => {
      const ownerBubble = document.createElement('div');
      ownerBubble.className = 'chat-bubble owner';
      ownerBubble.style.cssText = 'background: rgba(255, 255, 255, 0.1); color: #fff; padding: 6px 10px; border-radius: 12px; margin: 4px 0; max-width: 80%;';
      ownerBubble.textContent = 'Owner/Family: Message received on emergency bridge, responding immediately!';
      stream.appendChild(ownerBubble);
      stream.scrollTop = stream.scrollHeight;
      soundEngine.playScanChime();
    }, 1200);
  }

  // Trigger WhatsApp Pre-filled Alert
  triggerWhatsAppAlert() {
    const activeVeh = this.getActiveVehicle();
    const text = `🚨 *AutoGuard QR Safety Alert*\n\nVehicle: *${activeVeh.name}* (${storage.maskPlate(activeVeh.plate)})\nIssue: *${this.selectedSubTag || 'Parking Alert'}*\n\nNote: Please attend to your vehicle. Sent via AutoGuard Privacy Relay.`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  }

  // Emergency SOS Broadcast to Owner + All Family Members
  triggerSOSBroadcast(customData) {
    const activeVeh = this.getActiveVehicle();
    soundEngine.playEmergencySiren();

    const newAlert = storage.addAlert({
      vehicleId: activeVeh.id,
      vehicleName: activeVeh.name,
      category: 'emergency',
      subTag: customData.subTag || '🚨 CRITICAL EMERGENCY SOS',
      message: customData.message || 'Emergency SOS triggered! Family circle notified with live coordinates.',
      location: customData.location || { lat: 28.6139, lng: 77.2090, address: 'Live GPS Pin Broadcast' },
      photoUrl: customData.photoUrl || null
    });

    this.alerts = storage.getAlerts();

    // Trigger full screen emergency toast
    this.showToast(`🚨 SOS Broadcast Dispatched to Owner & ${this.family.length} Family Contacts!`, 'sos');

    confetti({
      particleCount: 100,
      spread: 90,
      colors: ['#ef4444', '#f43f5e', '#ffffff']
    });

    this.renderDashboard();
    this.renderFamilyView();
  }

  // =========================================================================
  // STICKER STUDIO & PRINT MAKER
  // =========================================================================
  renderStickerStudio() {
    this.vehicles = storage.getVehicles();
    const activeVeh = this.getActiveVehicle();

    // Populate Vehicle Dropdown
    const selectEl = document.getElementById('studio-vehicle-select');
    if (selectEl) {
      selectEl.innerHTML = this.vehicles.map(v => `
        <option value="${v.id}" ${v.id === activeVeh.id ? 'selected' : ''}>${v.name} (${v.plate})</option>
      `).join('');
    }

    // Auto-populate target URL if empty or default
    const baseUrlInput = document.getElementById('studio-base-url');
    let baseUrl = baseUrlInput?.value?.trim();
    if (!baseUrl) {
      // Use local Wi-Fi IP or window location
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        baseUrl = `http://192.168.1.6:${window.location.port || '5173'}`;
      } else {
        baseUrl = window.location.origin;
      }
      if (baseUrlInput) baseUrlInput.value = baseUrl;
    }

    // Update Preview Text
    const plateEl = document.getElementById('preview-sticker-plate');
    if (plateEl) plateEl.textContent = `VEHICLE: ${storage.maskPlate(activeVeh.plate)}`;

    // Build real accessible scan URL
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const realScanUrl = `${cleanBase}/?scan=true&id=${activeVeh.id}`;

    // Render High Res QR
    const qrContainer = document.getElementById('live-qrcode-container');
    if (qrContainer) {
      QRCode.toCanvas(document.createElement('canvas'), realScanUrl, {
        width: 160,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      }, (err, canvas) => {
        if (!err && canvas) {
          qrContainer.innerHTML = '';
          qrContainer.appendChild(canvas);
        }
      });
    }

    refreshIcons();
  }

  updateStickerTheme(themeName) {
    const sticker = document.getElementById('physical-sticker-canvas');
    if (!sticker) return;
    sticker.className = `physical-sticker ${themeName}`;
  }

  downloadStickerPNG() {
    const canvas = document.querySelector('#live-qrcode-container canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `AutoGuard-QR-${this.getActiveVehicle().plate}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showToast('High-Res QR Sticker downloaded', 'success');
  }

  // =========================================================================
  // EMERGENCY FAMILY VIEW
  // =========================================================================
  renderFamilyView() {
    this.family = storage.getFamily();
    const grid = document.getElementById('family-contacts-grid');
    if (!grid) return;

    grid.innerHTML = this.family.map(f => `
      <div class="family-card-item">
        <div class="family-card-header">
          <div class="family-avatar-box">${f.name.charAt(0)}</div>
          <button class="icon-btn btn-delete btn-delete-fam" data-id="${f.id}" title="Remove Contact">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="family-name">${f.name}</div>
        <span class="family-relation-badge">${f.relation}</span>
        <div class="family-phone">
          <i data-lucide="phone"></i>
          <span>${f.phone}</span>
        </div>
        <div class="family-toggles">
          <span class="family-rule-chip">
            <i data-lucide="check"></i> SOS Emergency SMS/Broadcast Active
          </span>
          ${f.parkingAlert ? `
            <span class="family-rule-chip">
              <i data-lucide="check"></i> Towing & Wrong Parking Alerts Active
            </span>
          ` : ''}
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-delete-fam').forEach(b => {
      b.addEventListener('click', () => this.deleteFamily(b.dataset.id));
    });

    refreshIcons();
  }

  // =========================================================================
  // VEHICLE CRUD & MODALS
  // =========================================================================
  openVehicleModal(vehId = null) {
    const modal = document.getElementById('modal-vehicle');
    if (!modal) return;
    modal.classList.remove('hidden');

    const titleEl = document.getElementById('modal-vehicle-title');
    const idInput = document.getElementById('vehicle-id-input');
    const nameInput = document.getElementById('vehicle-name-input');
    const plateInput = document.getElementById('vehicle-plate-input');
    const typeInput = document.getElementById('vehicle-type-input');
    const colorInput = document.getElementById('vehicle-color-input');
    const noteInput = document.getElementById('vehicle-note-input');
    const ownerNameInput = document.getElementById('vehicle-owner-name-input');
    const ownerPhoneInput = document.getElementById('vehicle-owner-phone-input');
    const parkingAddressInput = document.getElementById('vehicle-parking-address-input');
    const fam1NameInput = document.getElementById('vehicle-fam1-name-input');
    const fam1PhoneInput = document.getElementById('vehicle-fam1-phone-input');
    const fam2NameInput = document.getElementById('vehicle-fam2-name-input');
    const fam2PhoneInput = document.getElementById('vehicle-fam2-phone-input');

    this.family = storage.getFamily();

    if (vehId) {
      const veh = this.vehicles.find(v => v.id === vehId);
      if (veh) {
        if (titleEl) titleEl.innerHTML = `<i data-lucide="edit-2"></i> Edit Vehicle & Protection Details`;
        if (idInput) idInput.value = veh.id;
        if (nameInput) nameInput.value = veh.name;
        if (plateInput) plateInput.value = veh.plate;
        if (typeInput) typeInput.value = veh.category || veh.type || '4-Wheeler (Car/Sedan)';
        if (colorInput) colorInput.value = veh.color || '';
        if (noteInput) noteInput.value = veh.note || '';
        if (ownerNameInput) ownerNameInput.value = veh.ownerName || 'Vehicle Owner';
        if (ownerPhoneInput) ownerPhoneInput.value = veh.realPhone || veh.ownerPhone || '+91 98765 12345';
        if (parkingAddressInput) parkingAddressInput.value = veh.homeAddress || '';
        if (fam1NameInput) fam1NameInput.value = this.family[0]?.name ? `${this.family[0].name} (${this.family[0].relation || 'Family'})` : '';
        if (fam1PhoneInput) fam1PhoneInput.value = this.family[0]?.phone || '';
        if (fam2NameInput) fam2NameInput.value = this.family[1]?.name ? `${this.family[1].name} (${this.family[1].relation || 'Family'})` : '';
        if (fam2PhoneInput) fam2PhoneInput.value = this.family[1]?.phone || '';
      }
    } else {
      if (titleEl) titleEl.innerHTML = `<i data-lucide="car"></i> Register New Vehicle`;
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (plateInput) plateInput.value = '';
      if (typeInput) typeInput.value = '4-Wheeler (Car/Sedan)';
      if (colorInput) colorInput.value = '';
      if (noteInput) noteInput.value = '';
      if (ownerNameInput) ownerNameInput.value = '';
      if (ownerPhoneInput) ownerPhoneInput.value = '';
      if (parkingAddressInput) parkingAddressInput.value = '';
      if (fam1NameInput) fam1NameInput.value = '';
      if (fam1PhoneInput) fam1PhoneInput.value = '';
      if (fam2NameInput) fam2NameInput.value = '';
      if (fam2PhoneInput) fam2PhoneInput.value = '';
    }
    refreshIcons();
  }

  closeVehicleModal() {
    const modal = document.getElementById('modal-vehicle');
    if (modal) modal.classList.add('hidden');
  }

  handleSaveVehicle(e) {
    e.preventDefault();
    const id = document.getElementById('vehicle-id-input')?.value;
    const name = document.getElementById('vehicle-name-input')?.value;
    const plate = document.getElementById('vehicle-plate-input')?.value;
    const type = document.getElementById('vehicle-type-input')?.value;
    const color = document.getElementById('vehicle-color-input')?.value;
    const note = document.getElementById('vehicle-note-input')?.value;
    const ownerName = document.getElementById('vehicle-owner-name-input')?.value || 'Vehicle Owner';
    const ownerPhone = document.getElementById('vehicle-owner-phone-input')?.value || '+91 98765 12345';
    const homeAddress = document.getElementById('vehicle-parking-address-input')?.value || 'Designated Parking Bay';
    const fam1Name = document.getElementById('vehicle-fam1-name-input')?.value;
    const fam1Phone = document.getElementById('vehicle-fam1-phone-input')?.value;
    const fam2Name = document.getElementById('vehicle-fam2-name-input')?.value;
    const fam2Phone = document.getElementById('vehicle-fam2-phone-input')?.value;

    if (!name || !plate) return;

    const getCatIcon = (t) => {
      if (!t) return '🚗';
      if (t.includes('2-Wheeler') || t.includes('Bike') || t.includes('Scooter')) return '🏍️';
      if (t.includes('SUV') || t.includes('4x4')) return '🚙';
      if (t.includes('EV') || t.includes('Electric')) return '⚡';
      if (t.includes('3-Wheeler') || t.includes('Auto')) return '🛺';
      if (t.includes('Commercial') || t.includes('Truck')) return '🚚';
      if (t.includes('Bus') || t.includes('Fleet')) return '🚌';
      return '🚗';
    };

    const categoryIcon = getCatIcon(type);

    if (id) {
      // Edit existing
      const idx = this.vehicles.findIndex(v => v.id === id);
      if (idx !== -1) {
        this.vehicles[idx] = { 
          ...this.vehicles[idx], 
          name, 
          plate, 
          type, 
          category: type,
          categoryIcon,
          color, 
          ownerName,
          ownerPhone,
          realPhone: ownerPhone,
          phoneMasked: '***-***-' + ownerPhone.slice(-4),
          homeAddress,
          note 
        };
      }
    } else {
      // Add new
      const newVeh = {
        id: 'veh-' + Date.now(),
        serialCode: 'AG-2026-PRO-' + Math.floor(1000 + Math.random() * 9000),
        planName: 'Shield Pro Plan',
        name,
        plate,
        type,
        category: type,
        categoryIcon,
        color,
        ownerName,
        ownerPhone,
        realPhone: ownerPhone,
        phoneMasked: '***-***-' + ownerPhone.slice(-4),
        homeAddress,
        homeGps: { lat: 28.6280, lng: 77.3750 },
        note,
        status: 'available'
      };
      this.vehicles.push(newVeh);
      this.activeVehicleId = newVeh.id;
    }

    // Save Family contacts if entered
    if (fam1Name && fam1Phone) {
      const existing = this.family.find(f => f.phone === fam1Phone);
      if (!existing) {
        this.family.push({
          id: 'fam-' + Date.now() + '-1',
          name: fam1Name,
          relation: 'Family Member 1',
          phone: fam1Phone,
          sosAlert: true,
          parkingAlert: true
        });
      }
    }
    if (fam2Name && fam2Phone) {
      const existing = this.family.find(f => f.phone === fam2Phone);
      if (!existing) {
        this.family.push({
          id: 'fam-' + Date.now() + '-2',
          name: fam2Name,
          relation: 'Family Member 2',
          phone: fam2Phone,
          sosAlert: true,
          parkingAlert: true
        });
      }
    }
    storage.saveFamily(this.family);

    storage.saveVehicles(this.vehicles);
    this.closeVehicleModal();
    this.renderDashboard();
    this.renderScannerView();
    this.renderStickerStudio();
    this.renderFamilyView();
    this.showToast('Vehicle & 2-Family SOS Contacts Saved Successfully!', 'success');
  }

  deleteVehicle(id) {
    if (this.vehicles.length <= 1) {
      this.showToast('Must keep at least 1 registered vehicle', 'error');
      return;
    }
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    if (this.activeVehicleId === id) {
      this.activeVehicleId = this.vehicles[0].id;
    }
    storage.saveVehicles(this.vehicles);
    this.renderDashboard();
    this.renderScannerView();
    this.renderStickerStudio();
    this.showToast('Vehicle removed', 'info');
  }

  updateActiveVehicleStatus(status) {
    const activeVeh = this.getActiveVehicle();
    activeVeh.status = status;
    storage.saveVehicles(this.vehicles);
    this.renderScannerVehicleInfo();
    this.showToast(`Vehicle status updated: ${status.toUpperCase()}`, 'info');
  }

  // =========================================================================
  // FAMILY CRUD & MODALS
  // =========================================================================
  openFamilyModal() {
    const modal = document.getElementById('modal-family');
    if (modal) modal.classList.remove('hidden');
    refreshIcons();
  }

  closeFamilyModal() {
    const modal = document.getElementById('modal-family');
    if (modal) modal.classList.add('hidden');
  }

  handleSaveFamily(e) {
    e.preventDefault();
    const name = document.getElementById('family-name-input')?.value;
    const relation = document.getElementById('family-relation-input')?.value;
    const phone = document.getElementById('family-phone-input')?.value;
    const sosAlert = document.getElementById('family-sos-toggle')?.checked;
    const parkingAlert = document.getElementById('family-parking-toggle')?.checked;

    if (!name || !phone) return;

    const newContact = {
      id: 'fam-' + Date.now(),
      name,
      relation,
      phone,
      sosAlert,
      parkingAlert
    };

    this.family.push(newContact);
    storage.saveFamily(this.family);
    this.closeFamilyModal();
    this.renderFamilyView();
    this.renderDashboard();
    this.showToast('Emergency family contact added!', 'success');
  }

  deleteFamily(id) {
    this.family = this.family.filter(f => f.id !== id);
    storage.saveFamily(this.family);
    this.renderFamilyView();
    this.renderDashboard();
    this.showToast('Emergency contact removed', 'info');
  }

  // =========================================================================
  // ACTIVATION WIZARD METHODS
  // =========================================================================
  initActivationWizard() {
    this.setWizardStep(1);
  }

  setWizardStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;
    this.currentWizardStep = stepNum;

    // Update Step Nodes UI
    document.querySelectorAll('.wizard-step-node').forEach(node => {
      const step = parseInt(node.dataset.step, 10);
      node.classList.toggle('active', step === stepNum);
      node.classList.toggle('completed', step < stepNum);
    });

    // Update Panels
    document.querySelectorAll('.wizard-step-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const activePanel = document.getElementById(`wizard-step-${stepNum}`);
    if (activePanel) activePanel.classList.add('active');

    refreshIcons();
  }

  handleCompleteActivation() {
    const serialCode = document.getElementById('act-qr-serial')?.value || 'AG-2026-PRO-NEW';
    const planName = document.getElementById('act-plan-select')?.value || 'Shield Pro Plan';
    const vehName = document.getElementById('act-veh-name')?.value || 'My Vehicle';
    const vehPlate = document.getElementById('act-veh-plate')?.value || 'DL 01 AB 0001';
    const vehType = document.getElementById('act-veh-type')?.value || '4-Wheeler (Car/Sedan)';
    const vehColor = document.getElementById('act-veh-color')?.value || 'White';

    const getCatIcon = (t) => {
      if (!t) return '🚗';
      if (t.includes('2-Wheeler') || t.includes('Bike') || t.includes('Scooter')) return '🏍️';
      if (t.includes('SUV') || t.includes('4x4')) return '🚙';
      if (t.includes('EV') || t.includes('Electric')) return '⚡';
      if (t.includes('3-Wheeler') || t.includes('Auto')) return '🛺';
      if (t.includes('Commercial') || t.includes('Truck')) return '🚚';
      if (t.includes('Bus') || t.includes('Fleet')) return '🚌';
      return '🚗';
    };

    const categoryIcon = getCatIcon(vehType);

    const ownerName = document.getElementById('act-owner-name')?.value || 'Vehicle Owner';
    const ownerPhone = document.getElementById('act-owner-phone')?.value || '+91 98765 00000';
    const homeAddress = document.getElementById('act-owner-address')?.value || 'Home Parking';
    const note = document.getElementById('act-custom-sticker-note')?.value || 'If blocking or emergency, please alert me!';

    const fam1Name = document.getElementById('act-fam1-name')?.value;
    const fam1Rel = document.getElementById('act-fam1-rel')?.value || 'Spouse';
    const fam1Phone = document.getElementById('act-fam1-phone')?.value;

    const fam2Name = document.getElementById('act-fam2-name')?.value;
    const fam2Rel = document.getElementById('act-fam2-rel')?.value || 'Parent';
    const fam2Phone = document.getElementById('act-fam2-phone')?.value;

    const bloodGroup = document.getElementById('act-blood-group')?.value || 'O+';
    const medicalNote = document.getElementById('act-medical-note')?.value || 'None';

    const insuranceNo = document.getElementById('act-insurance-no')?.value || 'POL-99281-V';
    const insuranceExpiry = document.getElementById('act-insurance-expiry')?.value || '2027-12-31';
    const pucExpiry = document.getElementById('act-puc-expiry')?.value || '2027-06-30';
    const rsaPhone = document.getElementById('act-rsa-phone')?.value || '1800-209-8899';

    // Create New Vehicle Object
    const newVehicle = {
      id: 'veh-' + Date.now(),
      serialCode,
      planName,
      name: vehName,
      plate: vehPlate,
      type: vehType,
      category: vehType,
      categoryIcon,
      color: vehColor,
      ownerName,
      ownerPhone,
      homeAddress,
      homeGps: this.homeGpsLocation,
      bloodGroup,
      medicalNote,
      insuranceNo,
      insuranceExpiry,
      pucExpiry,
      rsaPhone,
      note,
      status: 'available',
      phoneMasked: '***-***-' + ownerPhone.slice(-4),
      realPhone: ownerPhone
    };

    this.vehicles.unshift(newVehicle);
    this.activeVehicleId = newVehicle.id;
    storage.saveVehicles(this.vehicles);

    // Save Family contacts if provided
    if (fam1Name && fam1Phone) {
      this.family.push({
        id: 'fam-' + Date.now() + '-1',
        name: fam1Name,
        relation: fam1Rel,
        phone: fam1Phone,
        sosAlert: true,
        parkingAlert: true
      });
    }
    if (fam2Name && fam2Phone) {
      this.family.push({
        id: 'fam-' + Date.now() + '-2',
        name: fam2Name,
        relation: fam2Rel,
        phone: fam2Phone,
        sosAlert: true,
        parkingAlert: false
      });
    }
    storage.saveFamily(this.family);

    // Play chime & confetti
    soundEngine.playScanChime();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 }
    });

    this.showToast(`🎉 Congratulations! QR Plan Activated for ${vehName}`, 'success');

    // Switch to Sticker Studio to show their active QR sticker
    setTimeout(() => {
      this.switchView('studio');
      this.renderDashboard();
      this.renderAdminView();
    }, 1200);
  }

  // =========================================================================
  // ADMIN CONSOLE METHODS
  // =========================================================================
  renderAdminView() {
    this.vehicles = storage.getVehicles();
    this.alerts = storage.getAlerts();

    const activePlansEl = document.getElementById('adm-active-plans');
    if (activePlansEl) activePlansEl.textContent = this.vehicles.length.toString();

    this.renderAdminCustomers('');
    this.renderAdminAuditLogs();
    refreshIcons();
  }

  renderAdminCustomers(query = '') {
    const tbody = document.getElementById('adm-customers-tbody');
    if (!tbody) return;

    let list = this.vehicles;
    if (query) {
      list = list.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.plate.toLowerCase().includes(query) ||
        (v.ownerName && v.ownerName.toLowerCase().includes(query)) ||
        (v.serialCode && v.serialCode.toLowerCase().includes(query))
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No records found matching "${query}"</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(v => `
      <tr>
        <td><strong class="font-mono text-cyan">${v.serialCode || 'AG-2026-PRO-9982'}</strong></td>
        <td>
          <div style="font-weight:700;">${v.name}</div>
          <small class="font-mono" style="color:var(--text-muted);">${v.plate}</small>
        </td>
        <td>
          <div>${v.ownerName || 'Verified Owner'}</div>
          <small style="color:var(--text-muted);">${v.ownerPhone || v.phoneMasked}</small>
        </td>
        <td><span class="badge badge-accent">${v.planName || 'Shield Pro Plan'}</span></td>
        <td><span class="status-badge-active">● Active & Guarded</span></td>
        <td>
          <button class="btn btn-sm btn-outline adm-view-sticker" data-id="${v.id}" title="View QR Sticker">
            <i data-lucide="qr-code"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.adm-view-sticker').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeVehicleId = btn.dataset.id;
        this.switchView('studio');
      });
    });

    refreshIcons();
  }

  renderAdminAuditLogs() {
    const listEl = document.getElementById('adm-audit-logs-list');
    if (!listEl) return;

    const list = this.alerts.slice(0, 10);
    listEl.innerHTML = list.map(a => {
      const isSOS = a.category === 'emergency';
      return `
        <div class="admin-audit-item">
          <div class="audit-meta-row">
            <span class="audit-tag ${isSOS ? 'tag-sos' : 'tag-parking'}">
              ${a.category === 'emergency' ? '🚨 EMERGENCY SOS' : (a.category === 'wrong_parking' ? '🚗 WRONG PARKING' : '⚠️ HAZARD')}
            </span>
            <span style="color:var(--text-muted); font-size:0.7rem;">${this.formatTimeAgo(a.timestamp)}</span>
          </div>
          <div style="font-weight:600; margin-bottom: 2px;">${a.vehicleName}</div>
          <div style="color:var(--text-secondary); font-size:0.75rem;">${a.message}</div>
        </div>
      `;
    }).join('');
  }

  exportAdminCSV() {
    let csv = 'Serial Code,Vehicle Name,Plate Number,Owner Name,Phone,Plan,Status\n';
    this.vehicles.forEach(v => {
      csv += `"${v.serialCode || 'AG-2026-PRO'}","${v.name}","${v.plate}","${v.ownerName || 'Owner'}","${v.ownerPhone || ''}","${v.planName || 'Pro'}","Active"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AutoGuard_Admin_Report_${Date.now()}.csv`;
    a.click();
    this.showToast('Customer data exported to CSV', 'success');
  }

  // =========================================================================
  // GPS & GEOLOCATION PROXIMITY ENGINE (VEHICLE / USER GPS BASED)
  // =========================================================================
  
  // Great-Circle Haversine Distance (in meters)
  calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Active Origin: Uses Live User Device GPS if available, else Vehicle Parked Location
  getEffectiveGpsOrigin() {
    if (this.userGpsLocation) {
      return {
        lat: this.userGpsLocation.lat,
        lng: this.userGpsLocation.lng,
        isLive: true,
        label: 'Live Device GPS Active',
        subText: `${this.userGpsLocation.lat.toFixed(4)}° N, ${this.userGpsLocation.lng.toFixed(4)}° E • Nearest First`
      };
    }

    const veh = this.getActiveVehicle();
    if (veh && veh.homeGps) {
      return {
        lat: veh.homeGps.lat,
        lng: veh.homeGps.lng,
        isLive: false,
        label: `Vehicle Parked Spot (${veh.name})`,
        subText: `${veh.homeGps.lat.toFixed(4)}° N, ${veh.homeGps.lng.toFixed(4)}° E • Nearest First`
      };
    }

    return {
      lat: 28.6139,
      lng: 77.2090,
      isLive: false,
      label: 'Vehicle Parked Spot (Active Pin)',
      subText: '28.6139° N, 77.2090° E • Nearest First'
    };
  }

  // Background or user-triggered GPS sync
  detectDeviceGps(silent = false) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.userGpsLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.renderNearbyRadar('nearby-places-list', 'all');
        this.renderNearbyRadar('owner-nearby-places-list', 'all');
        if (this.radarMaps) {
          if (this.radarMaps['scanner-radar-live-map']) this.updateRadarMapPins('scanner-radar-live-map', 'all');
          if (this.radarMaps['owner-radar-live-map']) this.updateRadarMapPins('owner-radar-live-map', 'all');
        }
        if (!silent) {
          this.showToast(`📍 Live GPS Locked (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`, 'success');
        }
      },
      () => {
        if (!silent) {
          this.showToast('Using Vehicle Geotag location.', 'info');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }

  syncDeviceGps() {
    this.showToast('Acquiring live satellite GPS lock...', 'info');
    this.detectDeviceGps(false);
  }

  // Calculate dynamic proximity, relative GPS positions & sort ascending (nearest first)
  getComputedNearbyServices(filterType = 'all') {
    const origin = this.getEffectiveGpsOrigin();

    let computed = NEARBY_SERVICES_DATA.map(item => {
      // Dynamic location anchored relative to current vehicle/user GPS origin
      const itemLat = origin.lat + (item.offset ? item.offset.dLat : 0);
      const itemLng = origin.lng + (item.offset ? item.offset.dLng : 0);
      const meters = this.calculateHaversine(origin.lat, origin.lng, itemLat, itemLng);

      let distanceStr = '';
      if (meters < 1000) {
        distanceStr = `${Math.round(meters)}m`;
      } else {
        distanceStr = `${(meters / 1000).toFixed(1)} km`;
      }

      // Direct turn-by-turn routing link from current user/vehicle GPS to service
      const mapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${itemLat},${itemLng}`;

      return {
        ...item,
        lat: itemLat,
        lng: itemLng,
        distanceMeters: meters,
        distanceStr,
        mapsDirUrl
      };
    });

    // Sort strictly closest distance first
    computed.sort((a, b) => a.distanceMeters - b.distanceMeters);

    if (filterType !== 'all') {
      computed = computed.filter(item => item.type === filterType);
    }

    return { origin, services: computed };
  }

  // =========================================================================
  // NEARBY RADAR & ESSENTIAL SERVICES WITH IMAGES & LEAFLET LIVE MAP
  // =========================================================================
  renderNearbyRadar(containerId, filterType = 'all') {
    const listEl = document.getElementById(containerId);
    if (!listEl) return;

    const { origin, services } = this.getComputedNearbyServices(filterType);

    // Update GPS status ribbon texts
    const ownerLabel = document.getElementById('owner-gps-origin-label');
    const ownerCoords = document.getElementById('owner-gps-origin-coords');
    if (ownerLabel) ownerLabel.textContent = origin.label;
    if (ownerCoords) ownerCoords.textContent = origin.subText;

    const scannerLabel = document.getElementById('scanner-gps-origin-label');
    const scannerCoords = document.getElementById('scanner-gps-origin-coords');
    if (scannerLabel) scannerLabel.textContent = origin.label;
    if (scannerCoords) scannerCoords.textContent = origin.subText;

    listEl.innerHTML = services.map(item => {
      return `
        <div class="nearby-place-card">
          <div class="place-left-group">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="place-img-thumb">` : `<div class="place-icon-box ${item.bgClass}">${item.icon}</div>`}
            <div class="place-info">
              <div class="place-title">${item.name}</div>
              <div class="place-sub">${item.sub}</div>
            </div>
          </div>
          <div class="place-right-actions">
            <span class="place-dist-badge" title="Live GPS Calculated Distance">📍 ${item.distanceStr}</span>
            <a href="${item.mapsDirUrl}" target="_blank" rel="noopener" class="btn-map-dir" title="1-Tap Route Directions">
              <i data-lucide="navigation"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    refreshIcons();
  }

  initRadarLeafletMap(containerId) {
    if (!window.L) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!this.radarMaps) this.radarMaps = {};

    const origin = this.getEffectiveGpsOrigin();

    if (!this.radarMaps[containerId]) {
      const center = [origin.lat, origin.lng];
      const map = window.L.map(containerId).setView(center, 15);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      this.radarMaps[containerId] = map;
      this.radarMapLayerGroups = this.radarMapLayerGroups || {};
      this.radarMapLayerGroups[containerId] = window.L.layerGroup().addTo(map);
    } else {
      this.radarMaps[containerId].setView([origin.lat, origin.lng], 15);
    }

    setTimeout(() => {
      this.radarMaps[containerId]?.invalidateSize();
      this.updateRadarMapPins(containerId, 'all');
    }, 150);
  }

  updateRadarMapPins(containerId, filterType = 'all') {
    if (!this.radarMaps || !this.radarMaps[containerId] || !this.radarMapLayerGroups[containerId]) return;

    const layerGroup = this.radarMapLayerGroups[containerId];
    layerGroup.clearLayers();

    const { origin, services } = this.getComputedNearbyServices(filterType);
    const map = this.radarMaps[containerId];

    // Origin Pin (Vehicle or Live User GPS)
    const originIcon = window.L.divIcon({
      className: 'custom-car-pin',
      html: `<div style="background:#0284c7; color:#fff; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:700; border:2px solid #fff; box-shadow:0 0 12px rgba(2,132,199,0.8); display:flex; align-items:center; gap:4px;"><span>📍</span> <span>${origin.isLive ? 'Your Location' : 'Vehicle Pin'}</span></div>`,
      iconSize: [95, 26]
    });
    window.L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(layerGroup)
      .bindPopup(`<strong>${origin.label}</strong><br>${origin.subText}`);

    // Radar scanning pulse circle
    window.L.circle([origin.lat, origin.lng], {
      radius: 450,
      color: '#06b6d4',
      weight: 1.5,
      fillColor: '#06b6d4',
      fillOpacity: 0.08
    }).addTo(layerGroup);

    // Plot all sorted service markers
    services.forEach(item => {
      const pinIcon = window.L.divIcon({
        className: 'custom-service-pin',
        html: `<div style="background:#0f172a; color:#fff; padding:3px 6px; border-radius:6px; font-size:10px; font-weight:700; border:1px solid #38bdf8; display:flex; align-items:center; gap:3px; box-shadow:0 2px 6px rgba(0,0,0,0.5);"><span>${item.icon}</span> <span>${item.name.slice(0, 11)}..</span> <span style="background:#0284c7; color:#fff; padding:1px 3px; border-radius:3px; font-size:9px;">${item.distanceStr}</span></div>`,
        iconSize: [120, 24]
      });

      const popupContent = `
        <div style="font-family:sans-serif; min-width:170px; color:#111;">
          ${item.image ? `<img src="${item.image}" style="width:100%; height:80px; object-fit:cover; border-radius:6px; margin-bottom:5px;">` : ''}
          <strong style="font-size:12px;">${item.name}</strong><br>
          <small style="color:#555; font-size:11px;">${item.sub}</small><br>
          <div style="display:inline-block; font-weight:700; color:#0284c7; font-size:11px; margin:5px 0;">📍 Distance: ${item.distanceStr} (Closest First)</div><br>
          <a href="${item.mapsDirUrl}" target="_blank" rel="noopener" style="display:block; text-align:center; background:#0284c7; color:#fff; padding:5px 8px; border-radius:4px; font-size:11px; text-decoration:none; font-weight:600; margin-top:3px;">🧭 Start Navigation</a>
        </div>
      `;

      window.L.marker([item.lat, item.lng], { icon: pinIcon })
        .addTo(layerGroup)
        .bindPopup(popupContent);
    });
  }

  // =========================================================================
  // HELPERS & TOASTS
  // =========================================================================
  getActiveVehicle() {
    return this.vehicles.find(v => v.id === this.activeVehicleId) || this.vehicles[0];
  }

  formatTimeAgo(isoString) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'sos' ? 'toast-sos' : (type === 'success' ? 'toast-success' : '')}`;

    const iconName = type === 'sos' ? 'siren' : (type === 'success' ? 'shield-check' : 'info');
    toast.innerHTML = `
      <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
      <div class="toast-content">
        <h5>${type === 'sos' ? 'EMERGENCY BROADCAST' : (type === 'success' ? 'AutoGuard Protected' : 'Notice')}</h5>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.autoGuardApp = new AutoGuardApp();
});


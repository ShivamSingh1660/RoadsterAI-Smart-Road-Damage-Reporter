import { Report } from './types';

const DEMO_REPORTS: Report[] = [
  {
    id: 'RPT-2026-0012',
    title: 'Large pothole on Hazratganj Road',
    description: 'Deep pothole approximately 2 feet wide near the main crossing. Causing traffic slowdowns and risk to two-wheelers.',
    category: 'Pothole',
    severity: 'Critical',
    status: 'Under Review',
    location: 'Hazratganj Road, Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    imageUrl: '/road_pothole.jpg',
    confidence: 87.4,
    recommendedAction: 'Schedule repair within 7 days due to safety risk.',
    createdAt: '2026-10-22T10:24:00Z',
    updatedAt: '2026-10-22T14:00:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0011',
    title: 'Longitudinal crack on Gomti Nagar main road',
    description: 'A 15-meter longitudinal crack running along the left lane. Crack width is approximately 3cm.',
    category: 'Road Crack',
    severity: 'High',
    status: 'In Progress',
    location: 'Gomti Nagar, Lucknow',
    latitude: 26.8563,
    longitude: 80.9779,
    imageUrl: '/road_crack.jpg',
    confidence: 88.7,
    recommendedAction: 'Seal crack with bitumen compound. Monitor for expansion.',
    createdAt: '2026-10-20T11:15:00Z',
    updatedAt: '2026-10-22T09:30:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0010',
    title: 'Surface erosion near Charbagh Station',
    description: 'Road surface has eroded on a 20-meter stretch. Exposed aggregate visible.',
    category: 'Surface Damage',
    severity: 'Medium',
    status: 'Submitted',
    location: 'Charbagh, Lucknow',
    latitude: 26.8393,
    longitude: 80.9231,
    imageUrl: '/road_erosion.jpg',
    confidence: 91.5,
    recommendedAction: 'Schedule resurfacing. Mark area with warning signs.',
    createdAt: '2026-10-19T14:45:00Z',
    updatedAt: '2026-10-19T14:45:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0009',
    title: 'Waterlogging at Indira Nagar underpass',
    description: 'Persistent waterlogging after light rain. Drain appears blocked. Water depth approximately 30cm.',
    category: 'Waterlogging',
    severity: 'Medium',
    status: 'Under Review',
    location: 'Indira Nagar, Lucknow',
    latitude: 26.8729,
    longitude: 80.9908,
    imageUrl: '/road_water.jpg',
    confidence: 96.1,
    recommendedAction: 'Clear blocked drainage. Install additional pump if needed.',
    createdAt: '2026-10-18T07:00:00Z',
    updatedAt: '2026-10-22T11:00:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0008',
    title: 'Multiple potholes on Aliganj road',
    description: 'Cluster of 5-6 potholes spanning both lanes. Most are 1-2 feet in diameter.',
    category: 'Pothole',
    severity: 'High',
    status: 'In Progress',
    location: 'Aliganj, Lucknow',
    latitude: 26.8895,
    longitude: 80.9420,
    imageUrl: '/road_pothole.jpg',
    confidence: 89.3,
    recommendedAction: 'Full lane repair needed. Temporary filling recommended immediately.',
    createdAt: '2026-10-17T16:20:00Z',
    updatedAt: '2026-10-22T16:20:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0007',
    title: 'Cracked pavement near Aminabad market',
    description: 'Network of alligator cracks on the pavement in the busy market area.',
    category: 'Road Crack',
    severity: 'Medium',
    status: 'Resolved',
    location: 'Aminabad, Lucknow',
    latitude: 26.8440,
    longitude: 80.9370,
    imageUrl: '/road_crack.jpg',
    confidence: 85.6,
    recommendedAction: 'Apply crack sealant. Monitor area post-monsoon.',
    createdAt: '2026-10-12T11:30:00Z',
    updatedAt: '2026-10-23T10:00:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0006',
    title: 'Severely damaged service road near IT City',
    description: 'Service road has multiple deep potholes and surface breakage. Nearly unusable for smaller vehicles.',
    category: 'Surface Damage',
    severity: 'Critical',
    status: 'In Progress',
    location: 'IT City, Lucknow',
    latitude: 26.8100,
    longitude: 80.9900,
    imageUrl: '/road_erosion.jpg',
    confidence: 92.8,
    recommendedAction: 'Complete road reconstruction needed. Divert traffic until repaired.',
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-23T08:00:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-0005',
    title: 'Minor surface wear on Mahanagar road',
    description: 'Light surface wear visible. No immediate safety hazard but should be monitored.',
    category: 'Surface Damage',
    severity: 'Low',
    status: 'Resolved',
    location: 'Mahanagar, Lucknow',
    latitude: 26.8700,
    longitude: 80.9500,
    imageUrl: '/road_erosion.jpg',
    confidence: 78.4,
    recommendedAction: 'Schedule preventive maintenance in next quarter.',
    createdAt: '2026-10-05T13:00:00Z',
    updatedAt: '2026-10-20T15:00:00Z',
    isDemo: true,
  },
];

const STORAGE_KEY = 'roadsterai_reports_v5';

export function loadReports(): Report[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load reports:', e);
  }
  // Initialize with demo data
  saveReports(DEMO_REPORTS);
  return DEMO_REPORTS;
}

export function saveReports(reports: Report[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports:', e);
  }
}

export function addReport(report: Report): Report[] {
  const reports = loadReports();
  reports.unshift(report);
  saveReports(reports);
  return reports;
}

export function updateReport(id: string, updates: Partial<Report>): Report[] {
  const reports = loadReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reports[idx] = { ...reports[idx], ...updates, updatedAt: new Date().toISOString() };
  }
  saveReports(reports);
  return reports;
}

export function deleteReport(id: string): Report[] {
  const reports = loadReports().filter((r) => r.id !== id);
  saveReports(reports);
  return reports;
}

export function generateId(): string {
  return 'RPT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

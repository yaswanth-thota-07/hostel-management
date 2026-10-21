export const complaintSummary = {
  total: 128,
  pending: 18,
  inProgress: 27,
  resolved: 83,
};

export const complaintQueue = [
  {
    id: "CMP-1042",
    title: "Ceiling fan not working",
    room: "B-312",
    category: "Fan",
    priority: "P1",
    time: "12 min",
    status: "Assigned",
  },
  {
    id: "CMP-1041",
    title: "Water leakage",
    room: "A-205",
    category: "Plumbing",
    priority: "P2",
    time: "2 hr",
    status: "In Progress",
  },
  {
    id: "CMP-1039",
    title: "Light issue",
    room: "C-110",
    category: "Light",
    priority: "P3",
    time: "4 hr",
    status: "Pending",
  },
  {
    id: "CMP-1031",
    title: "Bathroom tap leakage",
    room: "B-118",
    category: "Tap",
    priority: "P3",
    time: "1 d",
    status: "Resolved",
  },
];

export const hostelHealth = {
  mostReported: "Electrical",
  worstHotspot: "Hostel B • 3rd floor",
  avgResolution: "3h 18m",
  slaCompliance: "94.2%",
};

export const recentActivity = [
  { time: "10:36 AM", text: "CMP-1042 assigned to maintenance staff" },
  { time: "10:21 AM", text: "CMP-1031 marked resolved" },
  { time: "09:48 AM", text: "CMP-1041 moved to In Progress" },
];

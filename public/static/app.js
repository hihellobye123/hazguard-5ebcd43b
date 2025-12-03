// HazGuard - Static JavaScript Application

// ==================== DATA ====================
const workers = [
  { name: "Amit Das", phone: "9876543210" },
  { name: "Raju Mondal", phone: "9876543211" },
  { name: "Sunil Ghosh", phone: "9876543212" },
  { name: "Bikash Roy", phone: "9876543213" },
  { name: "Tapan Sarkar", phone: "9876543214" },
  { name: "Manoj Dey", phone: "9876543215" },
  { name: "Pranab Saha", phone: "9876543216" },
  { name: "Kamal Biswas", phone: "9876543217" },
  { name: "Dilip Chakraborty", phone: "9876543218" },
  { name: "Subrata Mukherjee", phone: "9876543219" },
  { name: "Partha Banerjee", phone: "9876543220" },
  { name: "Arup Sen", phone: "9876543221" },
  { name: "Debashis Paul", phone: "9876543222" },
  { name: "Sanjay Bose", phone: "9876543223" },
  { name: "Rajesh Mitra", phone: "9876543224" },
  { name: "Asim Kar", phone: "9876543225" },
  { name: "Biswajit Pal", phone: "9876543226" },
  { name: "Gopal Naskar", phone: "9876543227" },
  { name: "Haripada Halder", phone: "9876543228" },
  { name: "Jatin Mandal", phone: "9876543229" },
  { name: "Kartik Pramanik", phone: "9876543230" },
  { name: "Lakshman Dolui", phone: "9876543231" },
  { name: "Mohan Jana", phone: "9876543232" },
  { name: "Naren Maity", phone: "9876543233" },
  { name: "Paban Khatua", phone: "9876543234" },
  { name: "Rabin Giri", phone: "9876543235" },
  { name: "Samir Bag", phone: "9876543236" },
  { name: "Tushar Bera", phone: "9876543237" },
  { name: "Utpal Samanta", phone: "9876543238" },
  { name: "Vivekananda Shit", phone: "9876543239" },
  { name: "Ajay Malik", phone: "9876543240" },
  { name: "Bablu Adhikari", phone: "9876543241" },
  { name: "Chanchal Koley", phone: "9876543242" },
  { name: "Dipak Mahato", phone: "9876543243" },
  { name: "Ganesh Patra", phone: "9876543244" },
  { name: "Hari Santra", phone: "9876543245" },
  { name: "Indrajit Kundu", phone: "9876543246" },
  { name: "Jagannath Gayen", phone: "9876543247" },
  { name: "Khokan Manna", phone: "9876543248" },
  { name: "Liton Midya", phone: "9876543249" },
  { name: "Mantu Sahoo", phone: "9876543250" },
  { name: "Nimai Barman", phone: "9876543251" },
  { name: "Om Prakash Tiwari", phone: "9876543252" },
  { name: "Pintu Senapati", phone: "9876543253" },
  { name: "Ratan Bhowmick", phone: "9876543254" },
  { name: "Shyamal Karan", phone: "9876543255" },
  { name: "Tanmoy Hazra", phone: "9876543256" },
  { name: "Uday Lohar", phone: "9876543257" },
  { name: "Varun Ghoshal", phone: "9876543258" },
  { name: "Yashwant Oraon", phone: "9876543259" }
];

const locationCoordinates = {
  "Kolkata Central": { lat: 22.5726, lng: 88.3639 },
  "Howrah Station": { lat: 22.5839, lng: 88.3422 },
  "Howrah": { lat: 22.5839, lng: 88.3422 },
  "Salt Lake": { lat: 22.5800, lng: 88.4200 },
  "Andul": { lat: 22.5600, lng: 88.1200 },
  "Andul Station": { lat: 22.5600, lng: 88.1200 },
  "Sealdah Station": { lat: 22.5645, lng: 88.3700 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Bandel Junction": { lat: 22.9300, lng: 88.3900 },
  "Hooghly": { lat: 22.9000, lng: 88.4000 },
  "Hooghly District": { lat: 22.9000, lng: 88.4000 },
  "Chinsurah Depot": { lat: 22.8700, lng: 88.3900 },
  "Chinsurah": { lat: 22.8700, lng: 88.3900 },
  "Diamond Harbour": { lat: 22.1900, lng: 88.1900 },
  "South 24 Parganas": { lat: 22.1600, lng: 88.4300 },
  "Durgapur": { lat: 23.5200, lng: 87.3100 },
  "Siliguri": { lat: 26.7271, lng: 88.3953 },
  "Darjeeling District": { lat: 27.0, lng: 88.3 },
  "default": { lat: 22.5726, lng: 88.3639 }
};

const locationOptions = [
  { name: 'Andul Station', area: 'Andul' },
  { name: 'Howrah Station', area: 'Howrah' },
  { name: 'Sealdah Station', area: 'Kolkata' },
  { name: 'Bandel Junction', area: 'Hooghly' },
  { name: 'Chinsurah Depot', area: 'Chinsurah' },
  { name: 'Diamond Harbour', area: 'South 24 Parganas' },
];

const typeIcons = {
  'Flood': '🌊',
  'Cyclone': '🌀',
  'Landslide': '⛰️',
  'Thunderstorm': '⛈️',
  'Heatwave': '🌡️',
  'Earthquake': '🌍'
};

// ==================== STATE ====================
let state = {
  user: null,
  allotments: [],
  citizenNotifications: [],
  chatMessages: {}
};

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('hazguard-state');
  if (saved) {
    state = JSON.parse(saved);
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('hazguard-state', JSON.stringify(state));
}

// ==================== AUTH ====================
function login(username, password, type) {
  // Citizen login
  if (type === 'citizen') {
    if (username.trim() && password.trim()) {
      state.user = { name: username, phone: password, role: 'citizen' };
      saveState();
      showToast(`Welcome, ${username}!`, 'success');
      window.location.href = 'citizen.html';
      return true;
    }
    showToast('Please enter your name and phone number.', 'error');
    return false;
  }

  // Admin login
  if (username === 'admin' && password === 'admin') {
    state.user = { name: 'Main Admin', phone: '', role: 'admin' };
    saveState();
    showToast('Welcome, Main Admin!', 'success');
    window.location.href = 'admin.html';
    return true;
  }

  // Local Admin login
  if (username === 'localadmin' && password === 'localadmin') {
    state.user = { name: 'Local Admin', phone: '', role: 'local_admin' };
    saveState();
    showToast('Welcome, Local Admin!', 'success');
    window.location.href = 'local-admin.html';
    return true;
  }

  // Worker login
  const worker = workers.find(
    w => w.name.toLowerCase() === username.toLowerCase() && w.phone === password
  );

  if (worker) {
    state.user = { name: worker.name, phone: worker.phone, role: 'worker' };
    saveState();
    showToast(`Welcome, ${worker.name}!`, 'success');
    window.location.href = 'worker.html';
    return true;
  }

  showToast('Invalid credentials. Please try again.', 'error');
  return false;
}

function logout() {
  state.user = null;
  saveState();
  window.location.href = 'index.html';
}

function checkAuth(allowedRoles) {
  loadState();
  if (!state.user || !allowedRoles.includes(state.user.role)) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ==================== DISASTERS ====================
function generateDisasters() {
  const disasters = [
    {
      id: '1',
      title: 'Flood Alert - Hooghly River',
      type: 'Flood',
      location: 'Hooghly District',
      severity: 'high',
      date: new Date().toISOString(),
      description: 'Rising water levels in Hooghly River affecting nearby villages. Evacuation recommended.',
      affectedArea: 'Chinsurah, Bandel, Serampore',
      coordinates: { lat: 22.9, lng: 88.4 }
    },
    {
      id: '2',
      title: 'Cyclone Warning - Bay of Bengal',
      type: 'Cyclone',
      location: 'South 24 Parganas',
      severity: 'critical',
      date: new Date().toISOString(),
      description: 'Cyclonic storm approaching coastal areas. Wind speeds expected to reach 120 km/h.',
      affectedArea: 'Sundarbans, Diamond Harbour, Kakdwip',
      coordinates: { lat: 21.8, lng: 88.2 }
    },
    {
      id: '3',
      title: 'Landslide Risk - Darjeeling',
      type: 'Landslide',
      location: 'Darjeeling District',
      severity: 'medium',
      date: new Date().toISOString(),
      description: 'Heavy rainfall causing soil erosion in hilly areas. Multiple roads blocked.',
      affectedArea: 'Kurseong, Kalimpong, Mirik',
      coordinates: { lat: 27.0, lng: 88.3 }
    }
  ];
  
  const count = Math.floor(Math.random() * 3) + 1;
  return disasters.slice(0, count);
}

// ==================== ALLOTMENTS ====================
function addAllotment(allotment) {
  const newAllotment = {
    ...allotment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  state.allotments.push(newAllotment);
  saveState();
  return newAllotment;
}

function updateAllotmentStatus(id, status) {
  const index = state.allotments.findIndex(a => a.id === id);
  if (index !== -1) {
    state.allotments[index].status = status;
    saveState();
  }
}

function startJourney(allotmentId) {
  const index = state.allotments.findIndex(a => a.id === allotmentId);
  if (index !== -1) {
    const coords = locationCoordinates[state.allotments[index].destinationLocation] || locationCoordinates.default;
    state.allotments[index].journeyStarted = true;
    state.allotments[index].workerLat = coords.lat + (Math.random() - 0.5) * 0.1;
    state.allotments[index].workerLng = coords.lng + (Math.random() - 0.5) * 0.1;
    saveState();
  }
}

// ==================== NOTIFICATIONS ====================
function addCitizenNotification(notification) {
  const newNotification = {
    ...notification,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    dismissed: false
  };
  state.citizenNotifications.push(newNotification);
  saveState();
}

function dismissNotification(id) {
  const index = state.citizenNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    state.citizenNotifications[index].dismissed = true;
    saveState();
  }
}

// ==================== CHAT ====================
function addMessage(chatKey, message) {
  if (!state.chatMessages[chatKey]) {
    state.chatMessages[chatKey] = [];
  }
  state.chatMessages[chatKey].push({
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  });
  saveState();
}

function getMessages(chatKey) {
  return state.chatMessages[chatKey] || [];
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

// ==================== RENDER HELPERS ====================
function renderNavbar(title) {
  loadState();
  return `
    <nav class="navbar">
      <div class="navbar-brand">HazGuard</div>
      <div class="navbar-user">
        <span>${state.user?.name || ''} (${state.user?.role || ''})</span>
        <button class="btn-logout" onclick="logout()">Logout</button>
      </div>
    </nav>
  `;
}

function renderDisasterCard(disaster, showButton = true) {
  const icon = typeIcons[disaster.type] || '⚠️';
  return `
    <div class="disaster-card animate-fade-in">
      <div class="disaster-header">
        <div style="display: flex; align-items: flex-start;">
          <span class="disaster-icon">${icon}</span>
          <div>
            <h3 class="disaster-title">${disaster.title}</h3>
            <span class="severity-badge severity-${disaster.severity}">
              ⚠️ ${disaster.severity.toUpperCase()}
            </span>
          </div>
        </div>
        <div class="status-live" title="Live"></div>
      </div>
      <p class="disaster-description">${disaster.description}</p>
      <div class="disaster-info">
        <span>📍 ${disaster.location}</span>
        <span>🎯 Affected: ${disaster.affectedArea}</span>
        <span>🕐 ${formatDate(disaster.date)}</span>
      </div>
      ${showButton ? `<button class="btn-allot" onclick="openAllotmentModal('${disaster.id}')">Allot Help</button>` : ''}
    </div>
  `;
}

// Export for global use
window.HazGuard = {
  workers,
  locationCoordinates,
  locationOptions,
  typeIcons,
  state,
  loadState,
  saveState,
  login,
  logout,
  checkAuth,
  generateDisasters,
  addAllotment,
  updateAllotmentStatus,
  startJourney,
  addCitizenNotification,
  dismissNotification,
  addMessage,
  getMessages,
  showToast,
  calculateDistance,
  formatDate,
  renderNavbar,
  renderDisasterCard
};

// Initialize
loadState();

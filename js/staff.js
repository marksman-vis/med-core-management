// ── Staff Portal Logic ──
var currentPage = 'dashboard';
(function () {
  const user = HMS.loadSession();
  if (!user || user.role !== 'staff') { window.location.href = 'index.html'; return; }
  const s = HMS.staff.find(x => x.id === user.staffId);
  if (s) { document.getElementById('userName').textContent = s.name; document.getElementById('userAvatar').textContent = s.avatar; document.getElementById('userRole').textContent = s.role; }

  // Load Persistence
  const storedPatients = localStorage.getItem('hms_patients');
  if (storedPatients) HMS.patients = JSON.parse(storedPatients);
  const storedBeds = localStorage.getItem('hms_beds');
  if (storedBeds) HMS.beds = JSON.parse(storedBeds);

  const lowStock = HMS.inventory.filter(i => i.stock <= i.minStock);
  document.getElementById('badge-inv').textContent = lowStock.length;
  showPage('dashboard');
})();

// Persistence is handled via HMS.saveData() in data.js

function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nb = document.getElementById('nav-' + page); if (nb) nb.classList.add('active');
  const titles = { dashboard: 'Dashboard', admissions: 'Admissions', beds: 'Bed Management', appointments: 'Appointments', billing: 'Billing', inventory: 'Inventory', pharmacy: 'Pharmacy & Labs', staff: 'Staff Directory', doctors: 'Doctor Directory', reports: 'Reports', history: 'Patient History' };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  const el = document.getElementById('pageContent');
  el.className = 'page-content animate-fadeIn';
  const r = { dashboard: renderDash, admissions: renderAdmissions, beds: renderBeds, appointments: renderAppointments, billing: renderBilling, inventory: renderInventory, pharmacy: renderPharmacy, staff: renderStaff, doctors: renderDoctors, reports: renderReports, history: renderHistory };
  if (r[page]) r[page](el);
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) searchInput.value = '';
}

// Global Search Logic
(function initSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (currentPage === 'admissions' || currentPage === 'appointments' || currentPage === 'billing' || currentPage === 'inventory') {
        document.querySelectorAll('#pageContent .table tbody tr').forEach(tr => {
          tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      } else if (currentPage === 'beds') {
        document.querySelectorAll('.bed-cell').forEach(cell => {
          cell.style.display = cell.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      } else if (currentPage === 'staff' || currentPage === 'doctors') {
        document.querySelectorAll('.staff-card').forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      } else if (currentPage === 'pharmacy') {
        document.querySelectorAll('.card-body > div').forEach(div => {
          if (!div.classList.contains('empty-state')) {
            div.style.display = div.textContent.toLowerCase().includes(q) ? '' : 'none';
          }
        });
      }
    });
  }
})();

function renderDash(el) {
  const totalPat = HMS.patients.length;
  const admitted = HMS.patients.filter(p => p.status === 'admitted' || p.status === 'ICU').length;
  const availBeds = HMS.beds.filter(b => b.status === 'available').length;
  const totalBeds = HMS.beds.length;
  const unpaidBills = HMS.bills.filter(b => b.status !== 'paid');
  const totalRevenue = HMS.bills.reduce((s, b) => s + b.total, 0);
  const lowStock = HMS.inventory.filter(i => i.stock <= i.minStock);
  const onDuty = HMS.staff.filter(s => s.status === 'on-duty').length;

  el.innerHTML = `
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--primary);--kpi-rgb:99,102,241"><div class="kpi-top"><div class="kpi-icon">👥</div></div><div class="kpi-value">${totalPat}</div><div class="kpi-label">Total Patients</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info);--kpi-rgb:59,130,246"><div class="kpi-top"><div class="kpi-icon">🛏️</div></div><div class="kpi-value">${availBeds}/${totalBeds}</div><div class="kpi-label">Beds Available</div></div>
    <div class="kpi-card" style="--kpi-color:var(--warning);--kpi-rgb:245,158,11"><div class="kpi-top"><div class="kpi-icon">👩‍💼</div></div><div class="kpi-value">${onDuty}/${HMS.staff.length}</div><div class="kpi-label">Staff On Duty</div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Recent Admissions</span></div><div class="card-body">
      ${HMS.patients.filter(p => p.admitDate && !p.archived).sort((a, b) => b.admitDate.localeCompare(a.admitDate)).slice(0, 5).map(p => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--card-border)">
          <div class="staff-avatar" style="width:36px;height:36px;font-size:13px">${p.avatar}</div>
          <div style="flex:1"><div style="font-weight:600;font-size:14px">${p.name}</div><div style="font-size:12px;color:var(--text-2)">${p.ward} · Bed ${p.bed} · ${HMS.fmt.date(p.admitDate)}</div></div>
          <span class="badge badge-${p.status === 'ICU' ? 'danger' : 'info'}">${p.status}</span>
        </div>`).join('') || '<div class="empty-state"><p>No recent admissions</p></div>'}
    </div></div>
    <div class="card"><div class="card-header"><span class="card-title">Low Stock Alerts</span></div><div class="card-body">
      ${lowStock.length ? lowStock.map(i => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--card-border)">
          <span style="font-size:20px">⚠️</span>
          <div style="flex:1"><div style="font-weight:600;font-size:14px">${i.name}</div><div style="font-size:12px;color:var(--text-2)">Stock: <span class="inv-low">${i.stock} ${i.unit}</span> / Min: ${i.minStock}</div></div>
        </div>`).join('') : '<div class="empty-state"><p>All items adequately stocked</p></div>'}
    </div></div>
  </div>
  <div class="card mt-24"><div class="card-header"><span class="card-title">Unpaid Bills</span></div><div class="card-body">
    ${unpaidBills.length ? `<div class="table-wrapper"><table class="table"><thead><tr><th>Bill ID</th><th>Patient</th><th>Total</th><th>Paid</th><th>Status</th><th></th></tr></thead><tbody>
    ${unpaidBills.map(b => {
    const p = HMS.getPatient(b.patientId); return `<tr>
      <td>${b.id}</td>
      <td><div class="table-avatar"><div class="avatar">${p ? p.avatar : '?'}</div><div class="info"><div class="name">${p ? p.name : 'Unknown'}</div></div></div></td>
      <td>${HMS.fmt.currency(b.total)}</td><td>${HMS.fmt.currency(b.paid)}</td>
      <td><span class="badge badge-${b.status === 'partial' ? 'warning' : 'danger'}">${b.status}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="viewBill('${b.id}')">View</button></td>
    </tr>`;
  }).join('')}</tbody></table></div>` : '<div class="empty-state"><p>All bills paid</p></div>'}
  </div></div>`;
}

function renderAdmissions(el) {
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;gap:12px;margin-bottom:16px;">
    <button class="btn btn-secondary" onclick="openAdmitPatient()">🛏️ Admit Existing</button>
    <button class="btn btn-primary" onclick="openAddPatient()">👤 Register New</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">All Patients</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>Patient</th><th>Age/Gender</th><th>Blood</th><th>Doctor</th><th>Ward</th><th>Status</th><th></th></tr></thead><tbody>
  ${HMS.patients.filter(p => !p.archived).map(p => {
    const d = HMS.getDoctor(p.doctor); return `<tr>
    <td><div class="table-avatar"><div class="avatar">${p.avatar}</div><div class="info"><div class="name">${p.name}</div><div class="sub">${p.phone}</div></div></div></td>
    <td>${p.age}y / ${p.gender}</td><td>${p.blood}</td>
    <td>${d ? d.name : '—'}</td><td>${p.ward || '—'} ${p.bed ? '(' + p.bed + ')' : ''}</td>
    <td><span class="badge badge-${p.status === 'ICU' ? 'danger' : p.status === 'admitted' ? 'info' : 'success'}">${p.status}</span></td>
    <td>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-secondary" onclick="viewPatient('${p.id}')">View</button>
        ${p.status === 'OPD' || !p.status ? `<button class="btn btn-sm btn-outline-danger" title="Archive" onclick="archivePatient('${p.id}')">🗑️</button>` : ''}
      </div>
    </td>
  </tr>`;
  }).join('')}</tbody></table></div></div></div>`;
}

function renderBeds(el) {
  const wards = {};
  HMS.beds.forEach(b => { if (!wards[b.ward]) wards[b.ward] = []; wards[b.ward].push(b); });
  el.innerHTML = Object.entries(wards).map(([ward, beds]) => `
    <div class="ward-section">
      <div class="ward-title">${ward} Ward (${beds.filter(b => b.status === 'available').length} available / ${beds.length})</div>
      <div class="bed-grid">${beds.map(b => {
    const p = b.patient ? HMS.getPatient(b.patient) : null;
    return `<div class="bed-cell ${b.status}" title="${p ? p.name : b.status}" onclick="handleBedClick('${b.id}')">
          <div class="bed-id">${b.id}</div>
          <div class="bed-status">${b.status}</div>
          ${p ? `<div style="font-size:11px;margin-top:4px;color:var(--text-2)">${p.name}</div>` : ''}
        </div>`;
  }).join('')}
      </div>
    </div>`).join('');
}
function renderAppointments(el) {
  const appts = HMS.appointments.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
    <button class="btn btn-primary" onclick="openBookAppointment()">📅 Book Appointment</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">All Appointments</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>ID</th><th>Date & Time</th><th>Patient</th><th>Doctor</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${appts.map(a => {
    const p = HMS.getPatient(a.patientId); const d = HMS.getDoctor(a.doctorId);
    return `<tr>
      <td style="font-size:13px;color:var(--text-3)">${a.id}</td>
      <td style="font-weight:600">${HMS.fmt.date(a.date)}<br><span style="font-size:12px;color:var(--text-2);font-weight:400">${HMS.fmt.time(a.time)}</span></td>
      <td><div class="table-avatar"><div class="avatar">${p ? p.avatar : '?'}</div><div class="info"><div class="name">${p ? p.name : 'Unknown'}</div></div></div></td>
      <td>${d ? d.name : 'Unassigned'}</td>
      <td>${a.type}</td>
      <td><span class="badge badge-${a.status === 'completed' ? 'success' : a.status === 'confirmed' ? 'primary' : a.status === 'cancelled' ? 'danger' : 'warning'}">${a.status}</span></td>
      <td>
        <select class="form-control" style="padding:4px 8px;font-size:12px;height:auto" onchange="updateApptStatus('${a.id}', this.value)">
          <option value="" disabled selected>Update...</option>
          <option value="confirmed">Confirm</option>
          <option value="completed">Complete</option>
          <option value="cancelled">Cancel</option>
        </select>
      </td>
    </tr>`;
  }).join('')}</tbody></table></div></div></div>`;
}

function renderBilling(el) {
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
    <button class="btn btn-primary" onclick="openGenerateBill()">🧾 Generate Bill</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">All Bills</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>ID</th><th>Patient</th><th>Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${HMS.bills.map(b => {
    const p = HMS.getPatient(b.patientId); const bal = b.total - b.paid; return `<tr>
    <td>${b.id}</td>
    <td><div class="table-avatar"><div class="avatar">${p ? p.avatar : '?'}</div><div class="info"><div class="name">${p ? p.name : 'Unknown'}</div></div></div></td>
    <td>${HMS.fmt.date(b.date)}</td><td>${HMS.fmt.currency(b.total)}</td><td>${HMS.fmt.currency(b.paid)}</td>
    <td style="font-weight:700;color:${bal > 0 ? 'var(--danger)' : 'var(--success)'}">${HMS.fmt.currency(bal)}</td>
    <td><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${b.status}</span></td>
    <td>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-secondary" onclick="viewBill('${b.id}')">View</button>
        ${bal > 0 ? `<button class="btn btn-sm btn-success" onclick="openPayBill('${b.id}')">Pay</button>` : ''}
      </div>
    </td>
  </tr>`;
  }).join('')}</tbody></table></div></div></div>`;
}

function renderInventory(el) {
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
    <button class="btn btn-primary" onclick="openAddInventory()">📦 Add Item</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">Pharmacy & Supplies Inventory</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Min Stock</th><th>Expiry</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${HMS.inventory.map(i => {
    const low = i.stock <= i.minStock; return `<tr>
    <td style="font-weight:600">${i.name}</td><td>${i.category}</td>
    <td class="${low ? 'inv-low' : 'inv-ok'}">${i.stock} ${i.unit}</td>
    <td>${i.minStock} ${i.unit}</td><td>${i.expiry || 'N/A'}</td><td>${HMS.fmt.currency(i.price)}</td>
    <td><span class="badge badge-${low ? 'danger' : 'success'}">${low ? 'LOW' : 'OK'}</span></td>
    <td><button class="btn btn-sm btn-secondary" onclick="openUpdateStock('${i.id}')">Update</button></td>
  </tr>`;
  }).join('')}</tbody></table></div></div></div>`;
}

function renderPharmacy(el) {
  const pendingLabs = HMS.labResults.filter(l => l.status !== 'completed');
  const activeRx = HMS.prescriptions.filter(r => r.status === 'active');
  el.innerHTML = `
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Pending Lab Orders</span></div><div class="card-body">
      ${pendingLabs.length ? pendingLabs.map(l => {
    const p = HMS.getPatient(l.patientId); return `<div style="padding:10px 0;border-bottom:1px solid var(--card-border);display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-weight:700">${l.test}</div><div style="font-size:12px;color:var(--text-2)">${p ? p.name : 'Unknown'} · ${HMS.fmt.date(l.date)}</div></div>
        <button class="btn btn-sm btn-success" onclick="openLabResultModal('${l.id}')">🔬 Enter Result</button>
      </div>`}).join('') : '<div class="empty-state"><p>No pending labs</p></div>'}
    </div></div>
    <div class="card"><div class="card-header"><span class="card-title">Active Prescriptions to Dispense</span></div><div class="card-body">
      ${activeRx.length ? activeRx.map(r => {
      const p = HMS.getPatient(r.patientId); return `<div style="padding:10px 0;border-bottom:1px solid var(--card-border);display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-weight:700">${p ? p.name : 'Unknown'}</div><div style="font-size:12px;color:var(--text-2)">${r.drugs.map(d => d.name).join(', ')}</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" onclick="HMS.printPrescription('${r.id}')">🖨️ Print</button>
          <button class="btn btn-sm btn-success" onclick="markRxCompleted('${r.id}')">Dispense</button>
        </div>
      </div>`}).join('') : '<div class="empty-state"><p>No active prescriptions</p></div>'}
    </div></div>
  </div>`;
}

function renderStaff(el) {
  el.innerHTML = `<div class="staff-grid">${HMS.staff.map(s => `
    <div class="staff-card">
      <div class="staff-avatar">${s.avatar}</div>
      <div>
        <div class="staff-name">${s.name}</div>
        <div class="staff-info">${s.role} · ${s.dept}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
          <span class="avail-dot ${s.status === 'on-duty' ? 'online' : 'offline'}"></span>
          <span style="font-size:12px;color:var(--text-3)">${s.status} · ${s.shift}</span>
        </div>
      </div>
    </div>`).join('')}</div>`;
}

function renderDoctors(el) {
  el.innerHTML = `<div class="staff-grid">${HMS.doctors.map(d => `
    <div class="staff-card">
      <div class="staff-avatar">${d.avatar}</div>
      <div>
        <div class="staff-name">${d.name}</div>
        <div class="staff-info">${d.specialty} · ${d.exp}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
          <span class="avail-dot ${d.available ? 'online' : 'offline'}"></span>
          <span style="font-size:12px;color:var(--text-3)">${d.available ? 'Available' : 'Unavailable'}</span>
          <span style="font-size:12px;color:var(--warning);margin-left:auto">⭐ ${d.rating}</span>
        </div>
      </div>
    </div>`).join('')}</div>`;
}

function renderReports(el) {
  const totalRev = HMS.bills.reduce((s, b) => s + b.total, 0);
  const collected = HMS.bills.reduce((s, b) => s + b.paid, 0);
  const pending = totalRev - collected;
  const occupancy = HMS.beds.filter(b => b.status === 'occupied').length;
  const totalBeds = HMS.beds.length;
  const occPct = totalBeds > 0 ? Math.round((occupancy / totalBeds) * 100) : 0;
  el.innerHTML = `
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--success)"><div class="kpi-value">${HMS.fmt.currency(totalRev)}</div><div class="kpi-label">Total Billed</div></div>
    <div class="kpi-card" style="--kpi-color:var(--primary)"><div class="kpi-value">${HMS.fmt.currency(collected)}</div><div class="kpi-label">Collected</div></div>
    <div class="kpi-card" style="--kpi-color:var(--danger)"><div class="kpi-value">${HMS.fmt.currency(pending)}</div><div class="kpi-label">Outstanding</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info)"><div class="kpi-value">${occPct}%</div><div class="kpi-label">Bed Occupancy</div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Revenue Breakdown</span></div><div class="card-body"><div class="chart-area"><div class="bar-chart">
      ${[{ l: 'Billed', v: totalRev, c: 'var(--info)' }, { l: 'Collected', v: collected, c: 'var(--success)' }, { l: 'Outstanding', v: pending, c: 'var(--danger)' }].map(b => `<div class="bar-wrap"><div class="bar-val">${HMS.fmt.currency(b.v)}</div><div class="bar" style="height:${totalRev ? Math.max(Math.round(b.v / totalRev * 120), 8) : 8}px;background:${b.c}"></div><div class="bar-label">${b.l}</div></div>`).join('')}
    </div></div></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Bed Occupancy by Ward</span></div><div class="card-body"><div class="chart-area"><div class="bar-chart">
      ${Object.entries(HMS.beds.reduce((a, b) => { if (!a[b.ward]) a[b.ward] = { occ: 0, tot: 0 }; a[b.ward].tot++; if (b.status === 'occupied') a[b.ward].occ++; return a; }, {})).map(([w, d]) => `<div class="bar-wrap"><div class="bar-val">${d.occ}/${d.tot}</div><div class="bar" style="height:${Math.max(Math.round(d.occ / d.tot * 100), 8)}px;background:var(--primary)"></div><div class="bar-label">${w}</div></div>`).join('')}
    </div></div></div></div>
  </div>`;
}

// ── CRUD and Modals ──

// Add Patient
function openAddPatient() {
  document.getElementById('apDoctor').innerHTML = '<option value="">None</option>' + HMS.doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
  document.getElementById('apType').addEventListener('change', (e) => {
    document.getElementById('admitFields').style.display = e.target.value === 'admitted' ? 'block' : 'none';
  });
  updateWardBedOptions('apWard', 'apBed');
  openModal('addPatientModal');
}

function saveNewPatient() {
  const name = document.getElementById('apName').value.trim();
  const phone = document.getElementById('apPhone').value.trim();
  const age = document.getElementById('apAge').value;
  const gender = document.getElementById('apGender').value;
  if (!name || !phone || !age || !gender) { toast('Please fill all required fields.', 'error'); return; }

  const status = document.getElementById('apType').value;
  const ward = status === 'admitted' ? document.getElementById('apWard').value : null;
  const bedId = status === 'admitted' ? document.getElementById('apBed').value : null;

  if (status === 'admitted' && (!ward || !bedId)) { toast('Please select Ward and Bed.', 'error'); return; }

  const newId = 'P' + String(HMS.patients.length + 1).padStart(3, '0');
  const patient = {
    id: newId,
    name, age, gender,
    blood: document.getElementById('apBlood').value,
    phone,
    email: document.getElementById('apEmail').value,
    address: document.getElementById('apAddress').value,
    emergency: document.getElementById('apEmergency').value,
    insuranceId: document.getElementById('apInsurance').value,
    doctor: document.getElementById('apDoctor').value,
    allergies: document.getElementById('apAllergies').value.split(',').map(s => s.trim()).filter(s => s),
    conditions: document.getElementById('apConditions').value.split(',').map(s => s.trim()).filter(s => s),
    status, ward, bed: bedId,
    avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    admitDate: status === 'admitted' ? new Date().toISOString().split('T')[0] : null
  };

  HMS.patients.push(patient);

  if (status === 'admitted') {
    const bed = HMS.beds.find(b => b.id === bedId);
    if (bed) { bed.status = 'occupied'; bed.patient = newId; }
  }

  HMS.saveData();
  closeModal('addPatientModal');
  toast('Patient registered successfully.', 'success');
  if (currentPage === 'admissions') renderAdmissions(document.getElementById('pageContent'));
  if (currentPage === 'beds') renderBeds(document.getElementById('pageContent'));
  if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
}

// Admit Existing
function openAdmitPatient() {
  const opdPatients = HMS.patients.filter(p => p.status === 'OPD' || !p.status);
  document.getElementById('admPatient').innerHTML = opdPatients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('');
  updateWardBedOptions('admWard', 'admBed');
  openModal('admitModal');
}

function admitPatient() {
  const patientId = document.getElementById('admPatient').value;
  const ward = document.getElementById('admWard').value;
  const bedId = document.getElementById('admBed').value;

  if (!patientId || !ward || !bedId) { toast('Please select Patient, Ward, and Bed.', 'error'); return; }

  const patient = HMS.patients.find(p => p.id === patientId);
  const bed = HMS.beds.find(b => b.id === bedId);

  if (patient && bed) {
    patient.status = 'admitted';
    patient.ward = ward;
    patient.bed = bedId;
    patient.admitDate = new Date().toISOString().split('T')[0];

    bed.status = 'occupied';
    bed.patient = patient.id;

    HMS.saveData();
    closeModal('admitModal');
    toast('Patient admitted successfully.', 'success');
    if (currentPage === 'admissions') renderAdmissions(document.getElementById('pageContent'));
    if (currentPage === 'beds') renderBeds(document.getElementById('pageContent'));
    if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
  }
}

// Bed Actions
function handleBedClick(bedId) {
  const bed = HMS.beds.find(b => b.id === bedId);
  if (!bed) return;
  document.getElementById('bedActionTitle').textContent = 'Bed ' + bed.id + ' Actions';
  let body = `<p>Current Status: <strong>${bed.status.toUpperCase()}</strong></p>`;

  if (bed.status === 'occupied') {
    const p = HMS.getPatient(bed.patient);
    body += `<p>Occupied by: ${p ? p.name : bed.patient}</p>
             <button class="btn btn-warning mt-16" style="width:100%" onclick="dischargePatient('${bed.id}')">Discharge Patient</button>`;
  } else if (bed.status === 'housekeeping') {
    body += `<button class="btn btn-success mt-16" style="width:100%" onclick="markBedAvailable('${bed.id}')">Mark as Available</button>`;
  } else if (bed.status === 'available') {
    body += `<p style="color:var(--text-3)">Bed is available.</p>
             <button class="btn btn-warning mt-16" style="width:100%" onclick="markBedCleaning('${bed.id}')">Needs Housekeeping</button>`;
  }

  document.getElementById('bedActionBody').innerHTML = body;
  openModal('bedActionModal');
}

function dischargePatient(bedId) {
  const bed = HMS.beds.find(b => b.id === bedId);
  if (bed && bed.patient) {
    const patient = HMS.patients.find(p => p.id === bed.patient);
    if (patient) {
      patient.status = 'OPD';
      patient.ward = null;
      patient.bed = null;
      patient.admitDate = null;
    }
    bed.status = 'housekeeping';
    bed.patient = null;
    HMS.saveData();
    closeModal('bedActionModal');
    toast('Patient discharged. Bed set to housekeeping.', 'success');
    if (currentPage === 'beds') renderBeds(document.getElementById('pageContent'));
    if (currentPage === 'admissions') renderAdmissions(document.getElementById('pageContent'));
  }
}

function markBedAvailable(bid) { const b = HMS.beds.find(x => x.id === bid); if (b) { b.status = 'available'; HMS.saveData(); if (currentPage === 'beds') renderBeds(document.getElementById('pageContent')); } }
function markBedCleaning(bid) { const b = HMS.beds.find(x => x.id === bid); if (b) { b.status = 'housekeeping'; HMS.saveData(); if (currentPage === 'beds') renderBeds(document.getElementById('pageContent')); } }

function archivePatient(id) {
  if (!confirm('Are you sure you want to remove this patient from the active list? Their medical history will remain saved in the system.')) return;
  const p = HMS.patients.find(x => x.id === id);
  if (p) {
    p.archived = true;
    HMS.saveData();
    toast('Patient moved to archives', 'success');
    if (currentPage === 'admissions') renderAdmissions(document.getElementById('pageContent'));
    if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
  }
}

function updateWardBedOptions(wardId, bedId) {
  const wardSelect = document.getElementById(wardId);
  const bedSelect = document.getElementById(bedId);
  const wards = [...new Set(HMS.beds.map(b => b.ward))];

  if (!wards.length) return;

  wardSelect.innerHTML = wards.map(w => `<option value="${w}">${w}</option>`).join('');

  const updateBeds = () => {
    const selectedWard = wardSelect.value;
    const availableBeds = HMS.beds.filter(b => b.ward === selectedWard && b.status === 'available');
    bedSelect.innerHTML = availableBeds.length ? availableBeds.map(b => `<option value="${b.id}">${b.id}</option>`).join('') : '<option value="">No beds available</option>';
  };

  wardSelect.addEventListener('change', updateBeds);
  updateBeds();
}

var _currentPrintPatientId = null;

function viewPatient(id) {
  const p = HMS.patients.find(x => x.id === id); if (!p) return;
  _currentPrintPatientId = id;
  document.getElementById('vpTitle').textContent = p.name + ' — Patient Record';
  document.getElementById('vpBody').innerHTML = `
    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div class="patient-card-avatar" style="width:64px;height:64px;font-size:24px">${p.avatar}</div>
      <div><div style="font-size:20px;font-weight:700">${p.name}</div><div style="color:var(--text-2)">${p.age}y · ${p.gender} · Blood: ${p.blood}</div></div>
    </div>
    <div class="grid-2">
      <div style="background:var(--bg-3);padding:12px;border-radius:var(--radius-sm)">
        <div style="font-size:12px;color:var(--text-2)">Contact</div><div style="font-weight:600">${p.phone}</div><div style="font-weight:600">${p.email || '—'}</div>
      </div>
      <div style="background:var(--bg-3);padding:12px;border-radius:var(--radius-sm)">
        <div style="font-size:12px;color:var(--text-2)">Status</div><div style="font-weight:600"><span class="badge badge-info">${p.status}</span></div>
        <div style="font-size:12px;margin-top:4px">${p.ward ? `Ward: ${p.ward} · Bed: ${p.bed}` : 'Not Admitted'}</div>
      </div>
    </div>
    <div style="margin-top:12px;background:var(--bg-3);padding:12px;border-radius:var(--radius-sm)">
      <div style="font-size:12px;color:var(--text-2);margin-bottom:6px">Medical Info</div>
      <div style="font-size:13px"><strong>Allergies:</strong> ${p.allergies && p.allergies.length ? p.allergies.join(', ') : 'None'}</div>
      <div style="font-size:13px;margin-top:4px"><strong>Conditions:</strong> ${p.conditions && p.conditions.length ? p.conditions.join(', ') : 'None'}</div>
    </div>
    <div style="margin-top:12px;background:var(--bg-3);padding:12px;border-radius:var(--radius-sm)">
      <div style="font-size:12px;color:var(--text-2);margin-bottom:6px">Prescriptions</div>
      ${HMS.getPatientRx(id).map(r => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.05)">
          <div style="font-size:13px">
            <div style="font-weight:600">${r.drugs.map(d => d.name).join(', ')}</div>
            <div style="font-size:11px;color:var(--text-3)">${HMS.fmt.date(r.date)} · ${r.status}</div>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="HMS.printPrescription('${r.id}')">🖨️ Print</button>
        </div>
      `).join('') || '<div style="font-size:12px;color:var(--text-3)">No prescriptions found</div>'}
    </div>`;
  openModal('viewPatientModal');
}

function printPatient() {
  const id = _currentPrintPatientId;
  const p = HMS.patients.find(x => x.id === id); if (!p) return;
  const d = HMS.getDoctor(p.doctor);
  const bills = HMS.getPatientBills(id);
  const labs = HMS.getPatientLabs(id);
  const rxs = HMS.getPatientRx(id);
  const appts = HMS.getPatientAppts(id);
  const now = new Date().toLocaleString('en-IN');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Record — ${p.name}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:24px}
    .page-header{display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:3px solid #4f46e5;margin-bottom:20px}
    .hosp-name{font-size:22px;font-weight:800;color:#4f46e5;letter-spacing:1px}
    .hosp-sub{font-size:12px;color:#555;margin-top:2px}
    .print-meta{text-align:right;font-size:11px;color:#777}
    .section{margin-bottom:20px;page-break-inside:avoid}
    .section-title{font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#4f46e5;border-bottom:1.5px solid #e0e0e0;padding-bottom:4px;margin-bottom:10px}
    .form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .form-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
    .field{border:1px solid #ddd;border-radius:6px;padding:8px 10px;background:#fafafa}
    .field label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:2px}
    .field span{font-weight:600;font-size:13px;display:block;min-height:16px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#4f46e5;color:#fff;padding:7px 10px;text-align:left;font-size:11px;letter-spacing:.3px}
    td{padding:6px 10px;border-bottom:1px solid #eee}
    tr:nth-child(even) td{background:#f7f7fb}
    .badge-status{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700}
    .status-admitted{background:#dbeafe;color:#1d4ed8}
    .status-OPD{background:#d1fae5;color:#065f46}
    .status-ICU{background:#fee2e2;color:#b91c1c}
    .signature-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:32px}
    .sig-box{border-top:1.5px solid #999;padding-top:6px;text-align:center;font-size:11px;color:#666}
    .page-footer{margin-top:20px;text-align:center;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:8px}
    .tag{display:inline-block;background:#ede9fe;color:#5b21b6;border-radius:4px;padding:1px 7px;font-size:11px;margin:2px 2px 0 0}
    .critical{color:#b91c1c;font-weight:700}
    @media print{body{padding:0 8px}}
  </style>
</head>
<body>
  <div class="page-header">
    <div>
      <div class="hosp-name">🏥 MedCore HMS</div>
      <div class="hosp-sub">MedCore Hospital · Patient Medical Record</div>
    </div>
    <div class="print-meta">
      <div><strong>Record ID:</strong> ${p.id}</div>
      <div><strong>Printed:</strong> ${now}</div>
      <div><strong>Printed By:</strong> Staff Portal</div>
    </div>
  </div>

  <!-- SECTION 1: Personal Info -->
  <div class="section">
    <div class="section-title">1. Patient Information</div>
    <div class="form-grid">
      <div class="field"><label>Full Name</label><span>${p.name}</span></div>
      <div class="field"><label>Patient ID</label><span>${p.id}</span></div>
      <div class="field"><label>Status</label><span class="badge-status status-${p.status}">${p.status}</span></div>
      <div class="field"><label>Age</label><span>${p.age} years</span></div>
      <div class="field"><label>Gender</label><span>${p.gender}</span></div>
      <div class="field"><label>Blood Group</label><span>${p.blood}</span></div>
      <div class="field"><label>Phone</label><span>${p.phone}</span></div>
      <div class="field"><label>Email</label><span>${p.email || '—'}</span></div>
      <div class="field"><label>Insurance ID</label><span>${p.insuranceId || '—'}</span></div>
    </div>
    <div class="form-grid-2" style="margin-top:10px">
      <div class="field"><label>Address</label><span>${p.address || '—'}</span></div>
      <div class="field"><label>Emergency Contact</label><span>${p.emergency || '—'}</span></div>
    </div>
  </div>

  <!-- SECTION 2: Admission Info -->
  <div class="section">
    <div class="section-title">2. Admission Details</div>
    <div class="form-grid">
      <div class="field"><label>Admit Date</label><span>${p.admitDate ? HMS.fmt.date(p.admitDate) : 'Not Admitted'}</span></div>
      <div class="field"><label>Ward</label><span>${p.ward || '—'}</span></div>
      <div class="field"><label>Bed</label><span>${p.bed || '—'}</span></div>
      <div class="field"><label>Attending Doctor</label><span>${d ? d.name : '—'}</span></div>
      <div class="field"><label>Specialty</label><span>${d ? d.specialty : '—'}</span></div>
      <div class="field"><label>Doctor Contact</label><span>${d ? d.phone : '—'}</span></div>
    </div>
  </div>

  <!-- SECTION 3: Medical History -->
  <div class="section">
    <div class="section-title">3. Medical History</div>
    <div class="form-grid-2">
      <div class="field">
        <label>Known Allergies</label>
        <span>${p.allergies && p.allergies.length ? p.allergies.map(a => '<span class="tag">' + a + '</span>').join(' ') : '<em style="color:#999">None reported</em>'}</span>
      </div>
      <div class="field">
        <label>Medical Conditions / Diagnoses</label>
        <span>${p.conditions && p.conditions.length ? p.conditions.map(c => '<span class="tag">' + c + '</span>').join(' ') : '<em style="color:#999">None on record</em>'}</span>
      </div>
    </div>
  </div>

  <!-- SECTION 4: Prescriptions -->
  <div class="section">
    <div class="section-title">4. Active Prescriptions</div>
    ${rxs.length ? `<table><thead><tr><th>Rx ID</th><th>Drug</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Action</th></tr></thead><tbody>
    ${rxs.map(r => r.drugs.map((dr, i) => `<tr><td>${i === 0 ? r.id : ''}</td><td>${dr.name}</td><td>${dr.dose}</td><td>${dr.frequency}</td><td>${dr.duration}</td><td>${i === 0 ? `<button class="btn btn-sm btn-secondary" onclick="HMS.printPrescription('${r.id}')">🖨️ Print</button>` : ''}</td></tr>`).join('')).join('')}
    </tbody></table>`: '<p style="color:#999;font-style:italic;font-size:12px">No prescriptions on record.</p>'}
  </div>

  <!-- SECTION 5: Lab Results -->
  <div class="section">
    <div class="section-title">5. Lab Results</div>
    ${labs.length ? `<table><thead><tr><th>Lab ID</th><th>Test</th><th>Date</th><th>Status</th><th>Results</th></tr></thead><tbody>
    ${labs.map(l => `<tr>
      <td>${l.id}</td>
      <td${l.critical ? ' class="critical"' : ''}>${l.test}${l.critical ? ' ⚠️' : ''}</td>
      <td>${HMS.fmt.date(l.date)}</td>
      <td>${l.status}</td>
      <td>${Object.entries(l.results || {}).map(([k, v]) => k + ': ' + v).join(' | ') || 'Pending'}</td>
    </tr>`).join('')}
    </tbody></table>`: '<p style="color:#999;font-style:italic;font-size:12px">No lab results on record.</p>'}
  </div>

  <!-- SECTION 6: Appointments -->
  <div class="section">
    <div class="section-title">6. Appointment History</div>
    ${appts.length ? `<table><thead><tr><th>Appt ID</th><th>Date</th><th>Time</th><th>Doctor</th><th>Type</th><th>Status</th><th>Notes</th></tr></thead><tbody>
    ${appts.map(a => {
    const doc = HMS.getDoctor(a.doctorId); return `<tr>
      <td>${a.id}</td>
      <td>${HMS.fmt.date(a.date)}</td>
      <td>${HMS.fmt.time(a.time)}</td>
      <td>${doc ? doc.name : '—'}</td>
      <td>${a.type}</td>
      <td>${a.status}</td>
      <td style="font-size:11px;color:#555">${a.notes || '—'}</td>
    </tr>`;
  }).join('')}
    </tbody></table>`: '<p style="color:#999;font-style:italic;font-size:12px">No appointments on record.</p>'}
  </div>

  <!-- SECTION 7: Billing -->
  <div class="section">
    <div class="section-title">7. Billing Summary</div>
    ${bills.length ? `<table><thead><tr><th>Bill ID</th><th>Date</th><th>Description</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead><tbody>
    ${bills.map(b => b.items.map((item, i) => `<tr>
      <td>${i === 0 ? b.id : ''}</td>
      <td>${i === 0 ? HMS.fmt.date(b.date) : ''}</td>
      <td>${item.desc}</td>
      <td>${i === 0 ? HMS.fmt.currency(b.total) : ''}</td>
      <td style="color:green">${i === 0 ? HMS.fmt.currency(b.paid) : ''}</td>
      <td style="color:${b.total - b.paid > 0 ? 'red' : 'green'}">${i === 0 ? HMS.fmt.currency(b.total - b.paid) : ''}</td>
      <td>${i === 0 ? b.status : ''}</td>
    </tr>`).join('')).join('')}
    </tbody></table>`: '<p style="color:#999;font-style:italic;font-size:12px">No billing records.</p>'}
  </div>

  <!-- Signatures -->
  <div class="signature-row">
    <div class="sig-box">Attending Doctor Signature</div>
    <div class="sig-box">Staff / Receptionist Signature</div>
    <div class="sig-box">Patient / Guardian Signature</div>
  </div>

  <div class="page-footer">MedCore Hospital Management System &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; ${now}</div>
</body></html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 600);
}

// Appointment Actions
function openBookAppointment() {
  document.getElementById('baPatient').innerHTML = HMS.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('');
  document.getElementById('baDoctor').innerHTML = HMS.doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
  document.getElementById('baDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('baTime').value = '10:00';
  document.getElementById('baNotes').value = '';
  openModal('bookApptModal');
}
function saveAppointment() {
  const patientId = document.getElementById('baPatient').value;
  const doctorId = document.getElementById('baDoctor').value;
  const date = document.getElementById('baDate').value;
  const time = document.getElementById('baTime').value;
  const type = document.getElementById('baType').value;
  const notes = document.getElementById('baNotes').value.trim();

  if (!patientId || !doctorId || !date || !time) { toast('Please fill all required fields', 'error'); return; }

  const id = 'APT' + String(HMS.appointments.length + 1).padStart(3, '0');
  HMS.appointments.push({
    id, patientId, doctorId, date, time, type, notes, status: 'confirmed'
  });
  HMS.saveData(); closeModal('bookApptModal'); toast('Appointment booked successfully', 'success');
  if (currentPage === 'appointments') renderAppointments(document.getElementById('pageContent'));
}
function updateApptStatus(id, status) {
  const a = HMS.appointments.find(x => x.id === id);
  if (!a || !status) return;
  a.status = status;
  HMS.saveData(); toast('Appointment status updated', 'success');
  if (currentPage === 'appointments') renderAppointments(document.getElementById('pageContent'));
}

// Billing Actions
function openGenerateBill() {
  document.getElementById('gbPatient').innerHTML = HMS.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('');
  document.getElementById('gbDesc').value = '';
  document.getElementById('gbAmount').value = '';
  openModal('generateBillModal');
}
function generateBill() {
  const patientId = document.getElementById('gbPatient').value;
  const desc = document.getElementById('gbDesc').value.trim();
  const amount = Number(document.getElementById('gbAmount').value);
  if (!patientId || !desc || !amount) { toast('Please fill all fields', 'error'); return; }

  const id = 'BILL' + String(HMS.bills.length + 1).padStart(3, '0');
  HMS.bills.unshift({
    id, patientId, date: new Date().toISOString().split('T')[0],
    items: [{ desc, amount }], total: amount, paid: 0, status: 'unpaid'
  });
  HMS.saveData(); closeModal('generateBillModal'); toast('Bill generated', 'success');
  if (currentPage === 'billing') renderBilling(document.getElementById('pageContent'));
  if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
}
function openPayBill(id) {
  const b = HMS.bills.find(x => x.id === id); if (!b) return;
  document.getElementById('pbId').value = id;
  document.getElementById('pbBalance').textContent = HMS.fmt.currency(b.total - b.paid);
  document.getElementById('pbAmount').value = b.total - b.paid;
  openModal('payBillModal');
}
function processPayment() {
  const id = document.getElementById('pbId').value;
  const amount = Number(document.getElementById('pbAmount').value);
  const b = HMS.bills.find(x => x.id === id);
  if (!b || !amount || amount <= 0) return;

  const method = document.getElementById('pbMethod').value;
  b.paid += amount;
  if (b.paid >= b.total) b.status = 'paid';
  else if (b.paid > 0) b.status = 'partial';

  HMS.saveData();
  closeModal('payBillModal');
  toast(`Payment of ₹${amount} via ${method} processed`, 'success');

  if (confirm('Payment successful! Would you like to print the receipt?')) {
    HMS.printReceipt(id, amount, method);
  }

  if (currentPage === 'billing') renderBilling(document.getElementById('pageContent'));
  if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
}

function toggleUPIInfo() {
  const method = document.getElementById('pbMethod').value;
  document.getElementById('upiInfo').style.display = method === 'UPI' ? 'block' : 'none';
}

// Inventory Actions
function openAddInventory() {
  ['aiName', 'aiCat', 'aiUnit', 'aiStock', 'aiMin', 'aiPrice', 'aiExpiry'].forEach(id => document.getElementById(id).value = '');
  openModal('addInvModal');
}
function addInventory() {
  const name = document.getElementById('aiName').value.trim();
  if (!name) { toast('Name required', 'error'); return; }
  const id = 'INV' + String(HMS.inventory.length + 1).padStart(3, '0');
  HMS.inventory.push({
    id, name, category: document.getElementById('aiCat').value || 'General',
    unit: document.getElementById('aiUnit').value || 'Pcs',
    stock: Number(document.getElementById('aiStock').value) || 0,
    minStock: Number(document.getElementById('aiMin').value) || 0,
    price: Number(document.getElementById('aiPrice').value) || 0,
    expiry: document.getElementById('aiExpiry').value || null
  });
  HMS.saveData(); closeModal('addInvModal'); toast('Item added', 'success');
  if (currentPage === 'inventory') renderInventory(document.getElementById('pageContent'));
}
function openUpdateStock(id) {
  const item = HMS.inventory.find(x => x.id === id); if (!item) return;
  document.getElementById('usId').value = id;
  document.getElementById('usName').textContent = item.name;
  document.getElementById('usCurrent').textContent = item.stock;
  document.getElementById('usQty').value = '';
  openModal('updateStockModal');
}
function updateStock() {
  const id = document.getElementById('usId').value;
  const qty = Number(document.getElementById('usQty').value);
  const item = HMS.inventory.find(x => x.id === id);
  if (!item || isNaN(qty) || qty === 0) return;
  item.stock += qty;
  HMS.saveData(); closeModal('updateStockModal'); toast('Stock updated', 'success');
  if (currentPage === 'inventory') renderInventory(document.getElementById('pageContent'));
  if (currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
}

// Pharmacy & Labs Actions
function openLabResultModal(id) {
  const l = HMS.labResults.find(x => x.id === id); if (!l) return;
  const p = HMS.getPatient(l.patientId);
  document.getElementById('lrId').value = id;
  document.getElementById('lrTestName').textContent = l.test;
  document.getElementById('lrPatientName').textContent = p ? `Patient: ${p.name} (${p.id})` : 'Patient: Unknown';

  // Define some common fields based on test name
  let fields = [];
  const tn = l.test.toLowerCase();
  if (tn.includes('blood') || tn.includes('cbc')) {
    fields = ['Hemoglobin (g/dL)', 'WBC Count (cells/mcL)', 'Platelets (lakh/mcL)', 'RBC Count'];
  } else if (tn.includes('sugar') || tn.includes('glucose') || tn.includes('diabetes')) {
    fields = ['Glucose Level (mg/dL)', 'A1C (%)'];
  } else if (tn.includes('liver') || tn.includes('lft')) {
    fields = ['Bilirubin', 'SGOT', 'SGPT', 'Albumin'];
  } else if (tn.includes('kidney') || tn.includes('kft')) {
    fields = ['Creatinine', 'Urea', 'Uric Acid'];
  } else {
    fields = ['Result Value', 'Reference Range', 'Remarks'];
  }

  const container = document.getElementById('lrFieldsContainer');
  container.innerHTML = fields.map(f => `
    <div class="form-group">
      <label class="form-label">${f}</label>
      <input class="form-control lab-input" data-field="${f}" placeholder="Enter ${f}..."/>
    </div>
  `).join('');

  openModal('labResultModal');
}

function saveLabResult() {
  const id = document.getElementById('lrId').value;
  const l = HMS.labResults.find(x => x.id === id); if (!l) return;

  const results = {};
  document.querySelectorAll('.lab-input').forEach(input => {
    results[input.dataset.field] = input.value.trim() || '—';
  });

  l.status = 'completed';
  l.results = results;
  l.completedDate = new Date().toISOString().split('T')[0];

  HMS.saveData();
  closeModal('labResultModal');
  toast('Lab results saved and sent to doctor', 'success');
  if (currentPage === 'pharmacy') renderPharmacy(document.getElementById('pageContent'));
}

function markLabCompleted(id) {
  const l = HMS.labResults.find(x => x.id === id); if (!l) return;
  l.status = 'completed'; l.results = { Result: 'Manual Completion' };
  HMS.saveData(); toast('Lab marked completed', 'success');
  if (currentPage === 'pharmacy') renderPharmacy(document.getElementById('pageContent'));
}
function markRxCompleted(id) {
  const r = HMS.prescriptions.find(x => x.id === id); if (!r) return;
  r.status = 'dispensed';
  HMS.saveData(); toast('Prescription dispensed', 'success');
  if (currentPage === 'pharmacy') renderPharmacy(document.getElementById('pageContent'));
}

// ── Utilities ──
function viewBill(billId) {
  const b = HMS.bills.find(x => x.id === billId); if (!b) return;
  const p = HMS.getPatient(b.patientId);
  document.getElementById('billModalBody').innerHTML = `
    <div style="margin-bottom:16px"><strong>${p ? p.name : 'Unknown'}</strong><span style="color:var(--text-3);margin-left:8px">${b.id} · ${HMS.fmt.date(b.date)}</span></div>
    ${b.items.map(i => `<div class="bill-line"><span>${i.desc}</span><span>${HMS.fmt.currency(i.amount)}</span></div>`).join('')}
    <div class="bill-total"><span>Total</span><span>${HMS.fmt.currency(b.total)}</span></div>
    <div class="bill-line"><span>Paid</span><span style="color:var(--success)">${HMS.fmt.currency(b.paid)}</span></div>
    <div class="bill-line"><span>Balance</span><span style="color:var(--danger);font-weight:700">${HMS.fmt.currency(b.total - b.paid)}</span></div>
    <div style="margin-top:12px"><span class="badge badge-${b.status === 'paid' ? 'success' : b.status === 'partial' ? 'warning' : 'danger'}">${b.status}</span></div>`;
  openModal('billModal');
}

function renderHistory(el) {
  el.innerHTML = `
  <div class="card"><div class="card-header"><span class="card-title">Patient Archives & Clinical History</span></div><div class="card-body">
  <p style="font-size:13px;color:var(--text-3);margin-bottom:16px;">View complete clinical history for all patients, including archived and discharged records.</p>
  <div class="table-wrapper"><table class="table"><thead><tr><th>Patient</th><th>Age/Gender</th><th>Blood</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${HMS.patients.map(p => {
    const d = HMS.getDoctor(p.doctor);
    return `<tr>
      <td><div class="table-avatar"><div class="avatar">${p.avatar}</div><div class="info"><div class="name">${p.name} ${p.archived ? '<span class="badge badge-secondary" style="font-size:10px">Archived</span>' : ''}</div><div class="sub">${p.phone}</div></div></div></td>
      <td>${p.age}y / ${p.gender}</td><td>${p.blood}</td>
      <td>${d ? d.name : '—'}</td>
      <td><span class="badge badge-${p.status === 'ICU' ? 'danger' : p.status === 'admitted' ? 'info' : 'success'}">${p.status}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-secondary" onclick="viewPatient('${p.id}')">View Details</button>
          <button class="btn btn-sm btn-primary" onclick="HMS.printPatientHistory('${p.id}')">🖨️ Full History</button>
        </div>
      </td>
    </tr>`;
  }).sort((a, b) => a.includes('Archived') ? 1 : -1).join('')}</tbody></table></div></div></div>`;
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div'); t.className = 'toast ' + type;
  t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t); setTimeout(() => t.remove(), 3500);
}
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  document.querySelectorAll('[title="Theme"]').forEach(b => b.textContent = isLight ? '☀️' : '🌙');
}
(function initThemeIcon() { if (localStorage.getItem('theme') === 'light') document.querySelectorAll('[title="Theme"]').forEach(b => b.textContent = '☀️'); })();
function logout() { HMS.logout(); window.location.href = 'index.html'; }

// ── Admin Portal Logic ──
var currentPage = 'dashboard';

(function() {
  const user = HMS.loadSession();
  if(!user || user.role !== 'admin') { window.location.href = 'index.html'; return; }
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.avatar || 'AD';
  
  showPage('dashboard');
})();

function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nb = document.getElementById('nav-' + page); if(nb) nb.classList.add('active');
  const titles = { dashboard: 'Dashboard', doctors: 'Manage Doctors', staff: 'Manage Staff' };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  
  const el = document.getElementById('pageContent');
  el.className = 'page-content animate-fadeIn';
  
  const r = { dashboard: renderDash, doctors: renderDoctors, staff: renderStaff };
  if(r[page]) r[page](el);
  
  const searchInput = document.getElementById('globalSearch');
  if(searchInput) searchInput.value = '';
}

// Global Search
(function initSearch() {
  const searchInput = document.getElementById('globalSearch');
  if(searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.table tbody tr').forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
})();

function renderDash(el) {
  const totalDocs = HMS.doctors.length;
  const totalStaff = HMS.staff.length;
  const totalPatients = HMS.patients.length;
  
  el.innerHTML = `
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--primary)"><div class="kpi-top"><div class="kpi-icon">👨‍⚕️</div></div><div class="kpi-value">${totalDocs}</div><div class="kpi-label">Total Doctors</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info)"><div class="kpi-top"><div class="kpi-icon">👩‍💼</div></div><div class="kpi-value">${totalStaff}</div><div class="kpi-label">Total Staff</div></div>
    <div class="kpi-card" style="--kpi-color:var(--success)"><div class="kpi-top"><div class="kpi-icon">🧑‍🤝‍🧑</div></div><div class="kpi-value">${totalPatients}</div><div class="kpi-label">Total Patients</div></div>
  </div>
  <div class="card mt-24">
    <div class="card-header"><span class="card-title">Recent System Users</span></div>
    <div class="card-body">
      <div class="table-wrapper">
        <table class="table">
          <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            ${HMS.users.slice(-5).reverse().map(u => `
              <tr>
                <td><div class="table-avatar"><div class="avatar">${u.avatar||'?'}</div><div class="info"><div class="name">${u.name}</div></div></div></td>
                <td><span class="badge badge-${u.role==='admin'?'danger':u.role==='doctor'?'primary':'info'}">${u.role}</span></td>
                <td>${u.email}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderDoctors(el) {
  const doctorUsers = HMS.users.filter(u => u.role === 'doctor');
  
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
    <button class="btn btn-primary" onclick="openUserModal('doctor')">👨‍⚕️ Add New Doctor</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">Doctor Directory</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>Name</th><th>Specialty</th><th>Email</th><th>Actions</th></tr></thead><tbody>
  ${doctorUsers.map(u => {
    const docInfo = HMS.getDoctor(u.doctorId) || {};
    return `<tr>
      <td><div class="table-avatar"><div class="avatar">${u.avatar}</div><div class="info"><div class="name">${u.name}</div><div class="sub">${u.doctorId}</div></div></div></td>
      <td>${docInfo.specialty || 'General'}</td>
      <td>${u.email}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openUserModal('doctor', '${u.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-secondary" style="color:var(--danger);border-color:var(--danger)" onclick="deleteUser('${u.id}', '${u.name}')">🗑️ Delete</button>
      </td>
    </tr>`;
  }).join('')}
  </tbody></table></div></div></div>`;
}

function renderStaff(el) {
  const staffUsers = HMS.users.filter(u => u.role === 'staff');
  
  el.innerHTML = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
    <button class="btn btn-primary" onclick="openUserModal('staff')">👩‍💼 Add New Staff</button>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">Staff Directory</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>Name</th><th>Role/Dept</th><th>Email</th><th>Actions</th></tr></thead><tbody>
  ${staffUsers.map(u => {
    const staffInfo = HMS.staff.find(s => s.id === u.staffId) || {};
    return `<tr>
      <td><div class="table-avatar"><div class="avatar">${u.avatar}</div><div class="info"><div class="name">${u.name}</div><div class="sub">${u.staffId}</div></div></div></td>
      <td>${staffInfo.role || 'Staff'} / ${staffInfo.dept || 'General'}</td>
      <td>${u.email}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openUserModal('staff', '${u.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-secondary" style="color:var(--danger);border-color:var(--danger)" onclick="deleteUser('${u.id}', '${u.name}')">🗑️ Delete</button>
      </td>
    </tr>`;
  }).join('')}
  </tbody></table></div></div></div>`;
}

// ── Modals & Actions ──

function openUserModal(role, id = null) {
  document.getElementById('auRole').value = role;
  document.getElementById('auId').value = id || '';
  
  const title = id ? (role === 'doctor' ? 'Edit Doctor' : 'Edit Staff') : (role === 'doctor' ? 'Add New Doctor' : 'Add New Staff');
  document.getElementById('userModalTitle').textContent = title;
  
  const auDoc = document.getElementById('auDocFields');
  const auStaff = document.getElementById('auStaffFields');
  if (auDoc) auDoc.style.display = role === 'doctor' ? 'block' : 'none';
  if (auStaff) auStaff.style.display = role === 'staff' ? 'block' : 'none';

  if (id) {
    const u = HMS.users.find(x => x.id === id);
    if (u) {
      document.getElementById('auName').value = u.name || '';
      document.getElementById('auEmail').value = u.email || '';
      document.getElementById('auPass').value = ''; // Don't pre-fill password
      
      if (role === 'doctor') {
        const d = HMS.getDoctor(u.doctorId) || {};
        const el = document.getElementById('auSpecialty');
        if (el) el.value = d.specialty || 'General';
      } else if (role === 'staff') {
        const s = HMS.staff.find(x => x.id === u.staffId) || {};
        const el = document.getElementById('auSubRole');
        if (el) el.value = s.role || 'General Staff';
      }
    }
  } else {
    document.getElementById('auName').value = '';
    document.getElementById('auEmail').value = '';
    document.getElementById('auPass').value = '';
    if (role === 'doctor') {
      const el = document.getElementById('auSpecialty');
      if (el) el.value = '';
    }
  }
  
  openModal('addUserModal');
}

function saveUser() {
  const role = document.getElementById('auRole').value;
  const id = document.getElementById('auId').value;
  const name = document.getElementById('auName').value.trim();
  const email = document.getElementById('auEmail').value.trim();
  const pass = document.getElementById('auPass').value;
  
  if(!name || !email) { toast('Please fill all required fields', 'error'); return; }
  if(!id && !pass) { toast('Password is required for new users', 'error'); return; }
  
  const options = {};
  if (role === 'doctor') {
    const el = document.getElementById('auSpecialty');
    options.specialty = el ? el.value.trim() || 'General' : 'General';
  } else if (role === 'staff') {
    const el = document.getElementById('auSubRole');
    options.subRole = el ? el.value : 'General Staff';
  }

  if (id) {
    // Edit existing user
    const data = { name, email };
    if (pass) data.password = pass;
    if (role === 'doctor') data.specialty = options.specialty;
    if (role === 'staff') data.subRole = options.subRole;
    
    const res = HMS.updateUser(id, data);
    if (res && res.error) {
      toast(res.error, 'error');
    } else {
      closeModal('addUserModal');
      toast(role.charAt(0).toUpperCase() + role.slice(1) + ' updated successfully', 'success');
      if(currentPage === 'doctors') renderDoctors(document.getElementById('pageContent'));
      if(currentPage === 'staff') renderStaff(document.getElementById('pageContent'));
      if(currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
    }
  } else {
    // Create new user
    const res = HMS.register(name, email, pass, role, true, options);
    if (res && res.error) {
      toast(res.error, 'error');
    } else {
      closeModal('addUserModal');
      toast(role.charAt(0).toUpperCase() + role.slice(1) + ' created successfully', 'success');
      if(currentPage === 'doctors') renderDoctors(document.getElementById('pageContent'));
      if(currentPage === 'staff') renderStaff(document.getElementById('pageContent'));
      if(currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
    }
  }
}

function deleteUser(id, name) {
  if(confirm('Are you sure you want to delete ' + name + '? This action cannot be undone.')) {
    HMS.deleteUser(id);
    toast(name + ' has been deleted.', 'success');
    if(currentPage === 'doctors') renderDoctors(document.getElementById('pageContent'));
    if(currentPage === 'staff') renderStaff(document.getElementById('pageContent'));
    if(currentPage === 'dashboard') renderDash(document.getElementById('pageContent'));
  }
}

// ── Utilities ──

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toast(msg, type='info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div'); t.className = 'toast ' + type;
  t.innerHTML = `<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t); setTimeout(() => t.remove(), 3500);
}
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  document.querySelectorAll('[title="Theme"]').forEach(b => b.textContent = isLight ? '☀️' : '🌙');
}
(function initThemeIcon() { if(localStorage.getItem('theme')==='light') document.querySelectorAll('[title="Theme"]').forEach(b=>b.textContent='☀️'); })();
function logout() { HMS.logout(); window.location.href = 'index.html'; }
function emergencyReset() {
  localStorage.clear();
  alert('Emergency Reset Successful. Cache Cleared.');
  window.location.href = 'index.html';
}

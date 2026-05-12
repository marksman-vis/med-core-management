// ── Patient Portal Logic ──
var currentPage='overview';
(function(){
  const user=HMS.loadSession();
  if(!user||user.role!=='patient'){window.location.href='index.html';return;}
  const p=HMS.getPatient(user.patientId);
  if(p){document.getElementById('userName').textContent=p.name;document.getElementById('userAvatar').textContent=p.avatar;}
  showPage('overview');
})();

function showPage(page){
  currentPage=page;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const nb=document.getElementById('nav-'+page);if(nb)nb.classList.add('active');
  const titles={overview:'Overview',appointments:'Appointments',prescriptions:'Prescriptions',labs:'Lab Results',bills:'My Bills',profile:'Profile'};
  document.getElementById('pageTitle').textContent=titles[page]||page;
  const el=document.getElementById('pageContent');
  el.className='page-content animate-fadeIn';
  const r={overview:renderOverview,appointments:renderAppts,prescriptions:renderRx,labs:renderLabs,bills:renderBills,profile:renderProfile};
  if(r[page])r[page](el);
}

function getPatient(){return HMS.getPatient((HMS.currentUser&&HMS.currentUser.patientId)||'P001');}

function renderOverview(el){
  const p=getPatient();if(!p)return;
  const doc=HMS.getDoctor(p.doctor);
  const appts=HMS.getPatientAppts(p.id).filter(a=>a.status!=='completed');
  const rxs=HMS.getPatientRx(p.id).filter(r=>r.status==='active');
  const labs=HMS.getPatientLabs(p.id);
  const bills=HMS.getPatientBills(p.id);
  const balance=bills.reduce((s,b)=>s+(b.total-b.paid),0);

  el.innerHTML=`
  <div class="health-card">
    <div class="health-avatar">${p.avatar}</div>
    <div>
      <div class="health-name">${p.name}</div>
      <div class="health-meta">${p.age}y · ${p.gender} · Blood: ${p.blood}</div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <span class="badge badge-${p.status==='ICU'?'danger':p.status==='admitted'?'info':'success'}">${p.status}</span>
        ${p.ward?`<span class="badge badge-secondary">${p.ward} · Bed ${p.bed}</span>`:''}
        ${doc?`<span class="badge badge-primary">Dr. ${doc.name.split(' ').pop()} · ${doc.specialty}</span>`:''}
      </div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--primary);--kpi-rgb:99,102,241"><div class="kpi-top"><div class="kpi-icon">📅</div></div><div class="kpi-value">${appts.length}</div><div class="kpi-label">Upcoming Appts</div></div>
    <div class="kpi-card" style="--kpi-color:var(--success);--kpi-rgb:16,185,129"><div class="kpi-top"><div class="kpi-icon">💊</div></div><div class="kpi-value">${rxs.length}</div><div class="kpi-label">Active Prescriptions</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info);--kpi-rgb:59,130,246"><div class="kpi-top"><div class="kpi-icon">🔬</div></div><div class="kpi-value">${labs.length}</div><div class="kpi-label">Lab Reports</div></div>
    <div class="kpi-card" style="--kpi-color:${balance>0?'var(--danger)':'var(--success)'};--kpi-rgb:${balance>0?'239,68,68':'16,185,129'}"><div class="kpi-top"><div class="kpi-icon">💰</div></div><div class="kpi-value">${HMS.fmt.currency(balance)}</div><div class="kpi-label">Outstanding</div></div>
  </div>

  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Allergies</span></div><div class="card-body">
      ${p.allergies.length?p.allergies.map(a=>`<span class="badge badge-danger" style="margin:3px">${a}</span>`).join(''):'<span style="color:var(--text-3)">No known allergies (NKDA)</span>'}
    </div></div>
    <div class="card"><div class="card-header"><span class="card-title">Conditions</span></div><div class="card-body">
      ${p.conditions.map(c=>`<span class="badge badge-info" style="margin:3px">${c}</span>`).join('')}
    </div></div>
  </div>

  ${appts.length?`<div class="card mt-24"><div class="card-header"><span class="card-title">Next Appointment</span></div><div class="card-body">
    ${(function(){const a=appts[0];const d=HMS.getDoctor(a.doctorId);const dt=new Date(a.date);return`
    <div class="appt-card">
      <div class="appt-date-box"><div class="appt-day">${dt.getDate()}</div><div class="appt-month">${dt.toLocaleString('en',{month:'short'})}</div></div>
      <div style="flex:1"><div style="font-weight:700">${a.type}</div><div style="font-size:13px;color:var(--text-2)">${HMS.fmt.time(a.time)} · ${d?d.name:'Doctor'}</div><div style="font-size:12px;color:var(--text-3);margin-top:4px">${a.notes||''}</div></div>
      <span class="badge badge-${a.status==='confirmed'?'success':'warning'}">${a.status}</span>
    </div>`;})()}
  </div></div>`:''}`;
}

function renderAppts(el){
  const p=getPatient();
  const appts=HMS.getPatientAppts(p.id).sort((a,b)=>b.date.localeCompare(a.date));
  el.innerHTML=appts.map(a=>{
    const d=HMS.getDoctor(a.doctorId);const dt=new Date(a.date);
    return`<div class="appt-card">
      <div class="appt-date-box"><div class="appt-day">${dt.getDate()}</div><div class="appt-month">${dt.toLocaleString('en',{month:'short'})}</div></div>
      <div style="flex:1"><div style="font-weight:700">${a.type}</div><div style="font-size:13px;color:var(--text-2)">${HMS.fmt.time(a.time)} · ${d?d.name:'Doctor'} · ${d?d.specialty:''}</div><div style="font-size:12px;color:var(--text-3);margin-top:4px">${a.notes||''}</div></div>
      <span class="badge badge-${a.status==='completed'?'success':a.status==='confirmed'?'primary':'warning'}">${a.status}</span>
    </div>`;
  }).join('')||'<div class="empty-state"><div class="icon">📅</div><h3>No appointments</h3></div>';
}

function renderRx(el){
  const p=getPatient();
  const rxs=HMS.getPatientRx(p.id);
  el.innerHTML=rxs.map(r=>{
    const d=HMS.getDoctor(r.doctorId);
    return`<div class="rx-card">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:var(--text-2)">${HMS.fmt.date(r.date)} · ${d?d.name:''}</span>
        <span class="badge badge-success">${r.status}</span>
      </div>
      ${r.drugs.map(dr=>`<div style="margin-bottom:8px"><div class="rx-drug">${dr.name} ${dr.dose}</div><div class="rx-detail">${dr.frequency} · ${dr.duration} · ${dr.route}</div></div>`).join('')}
      <div style="font-size:13px;color:var(--text-3);margin-top:8px;padding-top:8px;border-top:1px solid var(--card-border)">📝 ${r.notes}</div>
    </div>`;
  }).join('')||'<div class="empty-state"><div class="icon">💊</div><h3>No prescriptions</h3></div>';
}

function renderLabs(el){
  const p=getPatient();
  const labs=HMS.getPatientLabs(p.id);
  el.innerHTML=labs.map(l=>`
    <div class="lab-card ${l.critical?'critical':''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div class="lab-test-name">${l.test}</div>
        <div style="display:flex;gap:6px">
          <span class="badge badge-${l.status==='completed'?'success':l.status==='pending'?'warning':'info'}">${l.status}</span>
          ${l.critical?'<span class="badge badge-danger">CRITICAL</span>':''}
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-3);margin-bottom:8px">${HMS.fmt.date(l.date)}</div>
      ${Object.keys(l.results).length?Object.entries(l.results).map(([k,v])=>`<div class="lab-result-row"><span class="lab-result-key">${k}</span><span class="lab-result-val ${l.critical?'lab-critical':''}">${v}</span></div>`).join(''):'<div style="color:var(--text-3);font-size:13px">Results pending…</div>'}
    </div>`).join('')||'<div class="empty-state"><div class="icon">🔬</div><h3>No lab results</h3></div>';
}

function renderBills(el){
  const p=getPatient();
  const bills=HMS.getPatientBills(p.id);
  const total=bills.reduce((s,b)=>s+b.total,0);
  const paid=bills.reduce((s,b)=>s+b.paid,0);
  el.innerHTML=`
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi-card" style="--kpi-color:var(--info)"><div class="kpi-value">${HMS.fmt.currency(total)}</div><div class="kpi-label">Total Billed</div></div>
    <div class="kpi-card" style="--kpi-color:var(--success)"><div class="kpi-value">${HMS.fmt.currency(paid)}</div><div class="kpi-label">Paid</div></div>
    <div class="kpi-card" style="--kpi-color:var(--danger)"><div class="kpi-value">${HMS.fmt.currency(total-paid)}</div><div class="kpi-label">Outstanding</div></div>
  </div>
  ${bills.map(b=>`<div class="bill-summary-card">
    <div style="display:flex;justify-content:space-between;margin-bottom:12px">
      <span style="font-weight:700">${b.id}</span>
      <span class="badge badge-${b.status==='paid'?'success':b.status==='partial'?'warning':'danger'}">${b.status}</span>
    </div>
    ${b.items.map(i=>`<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px dashed rgba(255,255,255,0.05)"><span style="color:var(--text-2)">${i.desc}</span><span>${HMS.fmt.currency(i.amount)}</span></div>`).join('')}
    <div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:800;border-top:2px solid var(--card-border);margin-top:8px"><span>Total</span><span>${HMS.fmt.currency(b.total)}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:13px"><span>Paid: <span style="color:var(--success)">${HMS.fmt.currency(b.paid)}</span></span><span>Balance: <span style="color:var(--danger)">${HMS.fmt.currency(b.total-b.paid)}</span></span></div>
  </div>`).join('')||'<div class="empty-state"><div class="icon">💰</div><h3>No bills</h3></div>'}`;
}

function renderProfile(el){
  const p=getPatient();const doc=HMS.getDoctor(p.doctor);
  const fields=[
    ['Full Name',p.name],['Age',p.age+'y'],['Gender',p.gender],['Blood Group',p.blood],
    ['Phone',p.phone],['Email',p.email],['Address',p.address],
    ['Emergency Contact',p.emergency],['Insurance ID',p.insuranceId],
    ['Attending Doctor',doc?doc.name+' ('+doc.specialty+')':'—'],
    ['Status',p.status.toUpperCase()],
  ];
  if(p.ward){fields.push(['Ward',p.ward],['Bed',p.bed],['Admitted',HMS.fmt.date(p.admitDate)]);}
  el.innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Personal Information</span></div><div class="card-body">
    ${fields.map(([l,v])=>`<div class="profile-field"><span class="profile-label">${l}</span><span class="profile-value">${v}</span></div>`).join('')}
  </div></div>
  <div class="card mt-24"><div class="card-header"><span class="card-title">Allergies</span></div><div class="card-body">
    ${p.allergies.length?p.allergies.map(a=>`<span class="badge badge-danger" style="margin:3px">${a}</span>`).join(''):'<span style="color:var(--text-3)">NKDA</span>'}
  </div></div>
  <div class="card mt-24"><div class="card-header"><span class="card-title">Medical Conditions</span></div><div class="card-body">
    ${p.conditions.map(c=>`<span class="badge badge-info" style="margin:3px">${c}</span>`).join('')}
  </div></div>`;
}

// ── Utilities ──
function toast(msg,type='info'){
  const c=document.getElementById('toastContainer');
  const t=document.createElement('div');t.className='toast '+type;
  t.innerHTML=`<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);setTimeout(()=>t.remove(),3500);
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');}
function toggleTheme(){
  const isLight=document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight?'light':'dark');
  document.querySelectorAll('[title="Theme"]').forEach(b=>b.textContent=isLight?'☀️':'🌙');
}
(function initThemeIcon(){ if(localStorage.getItem('theme')==='light') document.querySelectorAll('[title="Theme"]').forEach(b=>b.textContent='☀️'); })();
function logout(){HMS.logout();window.location.href='index.html';}

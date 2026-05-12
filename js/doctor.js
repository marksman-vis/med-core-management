// ── Doctor Portal Logic ──
var currentPage='dashboard';
(function(){
  const user = HMS.loadSession();
  if(!user||user.role!=='doctor'){window.location.href='index.html';return;}
  const docId=user.doctorId||'D001';
  const doc=HMS.getDoctor(docId);
  document.getElementById('userName').textContent=doc.name;
  document.getElementById('userAvatar').textContent=doc.avatar;
  const myPatients=HMS.patients.filter(p=>p.doctor===docId);
  document.getElementById('badge-patients').textContent=myPatients.length;
  const pendingLabs=HMS.labResults.filter(l=>l.orderedBy===docId&&l.status!=='completed');
  document.getElementById('badge-labs').textContent=pendingLabs.length;
  showPage('dashboard');
})();

function showPage(page){
  currentPage=page;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const nb=document.getElementById('nav-'+page);if(nb)nb.classList.add('active');
  const titles={dashboard:'Dashboard',patients:'My Patients',prescriptions:'E-Prescriptions',labs:'Lab Orders',schedule:'Schedule & Rounds',notes:'Clinical Notes',imaging:'Imaging / PACS',telemedicine:'Telemedicine',analytics:'Analytics'};
  document.getElementById('pageTitle').textContent=titles[page]||page;
  const el=document.getElementById('pageContent');
  el.className='page-content animate-fadeIn';
  const renderers={dashboard:renderDashboard,patients:renderPatients,prescriptions:renderRx,labs:renderLabs,schedule:renderSchedule,notes:renderNotes,imaging:renderImaging,telemedicine:renderTele,analytics:renderAnalytics};
  if(renderers[page])renderers[page](el);
}

function renderDashboard(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const pts=HMS.patients.filter(p=>p.doctor===docId);
  const admitted=pts.filter(p=>p.status==='admitted'||p.status==='ICU').length;
  const todayAppts=HMS.getDoctorAppts(docId).filter(a=>a.status!=='completed');
  const critLabs=HMS.labResults.filter(l=>l.orderedBy===docId&&l.critical);
  el.innerHTML=`
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--primary);--kpi-rgb:99,102,241"><div class="kpi-top"><div class="kpi-icon">👥</div></div><div class="kpi-value">${pts.length}</div><div class="kpi-label">Total Patients</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info);--kpi-rgb:59,130,246"><div class="kpi-top"><div class="kpi-icon">🏥</div></div><div class="kpi-value">${admitted}</div><div class="kpi-label">Admitted</div></div>
    <div class="kpi-card" style="--kpi-color:var(--success);--kpi-rgb:16,185,129"><div class="kpi-top"><div class="kpi-icon">📅</div></div><div class="kpi-value">${todayAppts.length}</div><div class="kpi-label">Upcoming Appts</div></div>
    <div class="kpi-card" style="--kpi-color:var(--danger);--kpi-rgb:239,68,68"><div class="kpi-top"><div class="kpi-icon">⚠️</div></div><div class="kpi-value">${critLabs.length}</div><div class="kpi-label">Critical Labs</div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Upcoming Appointments</span></div><div class="card-body">${todayAppts.slice(0,5).map(a=>{const p=HMS.getPatient(a.patientId);return`<div class="appt-item"><div class="appt-time"><div class="hour">${HMS.fmt.time(a.time)}</div></div><div class="appt-info"><div class="appt-name">${p?p.name:'Unknown'}</div><div class="appt-type">${a.type} — ${a.notes||''}</div></div><span class="badge badge-${a.status==='confirmed'?'success':'warning'}">${a.status}</span></div>`;}).join('')||'<div class="empty-state"><p>No upcoming appointments</p></div>'}</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Admitted Patients</span></div><div class="card-body">${pts.filter(p=>p.status==='admitted'||p.status==='ICU').map(p=>`<div class="appt-item" onclick="openPatientModal('${p.id}')" style="cursor:pointer"><div class="patient-card-avatar">${p.avatar}</div><div class="appt-info"><div class="appt-name">${p.name}</div><div class="appt-type">${p.ward} — Bed ${p.bed}</div></div><span class="badge badge-${p.status==='ICU'?'danger':'info'}">${p.status}</span></div>`).join('')||'<div class="empty-state"><p>No admitted patients</p></div>'}</div></div>
  </div>
  <div class="card mt-24"><div class="card-header"><span class="card-title">Weekly Patient Volume</span></div><div class="card-body"><div class="chart-area"><div class="bar-chart">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>{const v=[6,8,5,9,7,3,2][i];return`<div class="bar-wrap"><div class="bar-val">${v}</div><div class="bar" style="height:${v*12}px"></div><div class="bar-label">${d}</div></div>`;}).join('')}</div></div></div></div>`;
}

function renderPatients(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const pts=HMS.patients.filter(p=>p.doctor===docId);
  el.innerHTML=`<div class="patient-grid">${pts.map(p=>`
    <div class="patient-card" onclick="openPatientModal('${p.id}')">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
        <div class="patient-card-avatar">${p.avatar}</div>
        <div><div class="patient-card-name">${p.name}</div><div class="patient-card-info">${p.age}y/${p.gender} · ${p.blood}</div></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <span class="badge badge-${p.status==='ICU'?'danger':p.status==='admitted'?'info':p.status==='OPD'?'success':'secondary'}">${p.status}</span>
        ${p.ward?`<span class="badge badge-secondary">${p.ward} ${p.bed||''}</span>`:''}
      </div>
      ${p.conditions.length?`<div style="margin-top:10px;font-size:12px;color:var(--text-3)">${p.conditions.join(', ')}</div>`:''}
    </div>`).join('')}</div>`;
}

function renderRx(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const rxs=HMS.prescriptions.filter(r=>r.doctorId===docId);
  el.innerHTML=`<div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="btn btn-primary" onclick="openModal('rxModal');populateRxModal()">💊 New Prescription</button></div>
  <div class="card"><div class="card-body"><div class="table-wrapper"><table class="table"><thead><tr><th>Date</th><th>Patient</th><th>Drugs</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rxs.map(r=>{const p=HMS.getPatient(r.patientId);return`<tr><td>${HMS.fmt.date(r.date)}</td><td><div class="table-avatar"><div class="avatar">${p?p.avatar:'?'}</div><div class="info"><div class="name">${p?p.name:'Unknown'}</div></div></div></td><td>${r.drugs.map(d=>`<div style="font-size:13px">${d.name} ${d.dose} — ${d.frequency}</div>`).join('')}</td><td style="font-size:13px;color:var(--text-2)">${r.notes}</td><td><span class="badge badge-success">${r.status}</span></td><td><button class="btn btn-sm btn-secondary" onclick="HMS.printPrescription('${r.id}')">🖨️ Print</button></td></tr>`;}).join('')}</tbody></table></div></div></div>`;
}

function renderLabs(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const labs=HMS.labResults.filter(l=>l.orderedBy===docId);
  el.innerHTML=`<div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="btn btn-primary" onclick="openModal('labModal');populateLabModal()">🔬 Order Lab Test</button></div>
  <div class="card"><div class="card-body"><div class="table-wrapper"><table class="table"><thead><tr><th>Date</th><th>Patient</th><th>Test</th><th>Status</th><th>Results</th></tr></thead><tbody>${labs.map(l=>{const p=HMS.getPatient(l.patientId);const res=l.results?Object.entries(l.results).map(([k,v])=>`<span style="font-size:12px" class="${l.critical?'lab-critical':''}">${k}: ${v}</span>`).join('<br>'):'—';return`<tr><td>${HMS.fmt.date(l.date)}</td><td><div class="table-avatar"><div class="avatar">${p?p.avatar:'?'}</div><div class="info"><div class="name">${p?p.name:'Unknown'}</div></div></div></td><td>${l.test}</td><td><span class="badge badge-${l.status==='completed'?'success':l.status==='pending'?'warning':'info'}">${l.status}</span>${l.critical?'<span class="badge badge-danger" style="margin-left:4px">CRITICAL</span>':''}</td><td>${res}</td></tr>`;}).join('')}</tbody></table></div></div></div>`;
}

function renderSchedule(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const appts=HMS.getDoctorAppts(docId).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  el.innerHTML=`
  <div class="card"><div class="card-header"><span class="card-title">Schedule & Rounds</span></div><div class="card-body">
  <div class="table-wrapper"><table class="table"><thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Type</th><th>Notes</th><th>Status</th><th>Action</th></tr></thead><tbody>
  ${appts.map(a=>{
    const p=HMS.getPatient(a.patientId);
    return`<tr>
      <td>${HMS.fmt.date(a.date)}</td>
      <td style="font-weight:600">${HMS.fmt.time(a.time)}</td>
      <td><div class="table-avatar"><div class="avatar">${p?p.avatar:'?'}</div><div class="info"><div class="name">${p?p.name:'Unknown'}</div></div></div></td>
      <td>${a.type}</td>
      <td style="font-size:13px;color:var(--text-2)">${a.notes||'—'}</td>
      <td><span class="badge badge-${a.status==='completed'?'success':a.status==='confirmed'?'primary':a.status==='cancelled'?'danger':'warning'}">${a.status}</span></td>
      <td>
        <select class="form-control" style="padding:4px 8px;font-size:12px;height:auto" onchange="updateDocApptStatus('${a.id}',this.value)">
          <option value="" disabled selected>Update…</option>
          <option value="confirmed">Confirm</option>
          <option value="completed">Complete</option>
          <option value="cancelled">Cancel</option>
        </select>
      </td>
    </tr>`;
  }).join('')}
  </tbody></table></div></div></div>`;
}

function updateDocApptStatus(id, status){
  const a = HMS.appointments.find(x=>x.id===id);
  if(a) { a.status = status; HMS.saveData(); toast('Appointment updated','success'); renderSchedule(document.getElementById('pageContent')); }
}

function renderNotes(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const myPatients = HMS.patients.filter(p=>p.doctor===docId);
  el.innerHTML=`
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">New SOAP Note</span></div><div class="card-body">
      <div class="form-group"><label class="form-label">Patient</label><select class="form-control" id="soapPatient" onchange="loadPatientNotes(this.value)"><option value="">Select Patient</option>${myPatients.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
      <div class="soap-section"><div class="soap-label">Subjective</div><textarea class="soap-input" id="soapS" placeholder="Patient complaints, history…"></textarea></div>
      <div class="soap-section"><div class="soap-label">Objective</div><textarea class="soap-input" id="soapO" placeholder="Vitals, examination findings…"></textarea></div>
      <div class="soap-section"><div class="soap-label">Assessment</div><textarea class="soap-input" id="soapA" placeholder="Diagnosis, differential…"></textarea></div>
      <div class="soap-section"><div class="soap-label">Plan</div><textarea class="soap-input" id="soapP" placeholder="Treatment plan, follow-up…"></textarea></div>
      <button class="btn btn-primary" onclick="saveNote()">📝 Save Note</button>
    </div></div>
    <div class="card"><div class="card-header"><span class="card-title">Past Notes</span></div><div class="card-body" id="pastNotesContainer" style="max-height:500px;overflow-y:auto">
      <div class="empty-state"><p>Select a patient to view past notes</p></div>
    </div></div>
  </div>`;
}
function loadPatientNotes(pid) {
  if(!pid) { document.getElementById('pastNotesContainer').innerHTML = '<div class="empty-state"><p>Select a patient to view past notes</p></div>'; return; }
  const notes = HMS.notes.filter(n=>n.patientId === pid).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('pastNotesContainer').innerHTML = notes.length ? notes.map(n=>`
    <div style="border-bottom:1px solid var(--card-border);padding:12px 0;">
      <div style="font-weight:700;margin-bottom:8px">${HMS.fmt.date(n.date)}</div>
      <div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--text-2)">S:</strong> ${n.s||'—'}</div>
      <div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--text-2)">O:</strong> ${n.o||'—'}</div>
      <div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--text-2)">A:</strong> ${n.a||'—'}</div>
      <div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--text-2)">P:</strong> ${n.p||'—'}</div>
    </div>
  `).join('') : '<div class="empty-state"><p>No previous notes found.</p></div>';
}

function renderImaging(el){
  const scans=[{type:'X-Ray',body:'Chest',patient:'P001',date:'2026-05-08',icon:'🫁'},{type:'CT',body:'Brain',patient:'P003',date:'2026-05-02',icon:'🧠'},{type:'MRI',body:'Spine',patient:'P004',date:'2026-04-30',icon:'🦴'},{type:'Echo',body:'Heart',patient:'P009',date:'2026-05-09',icon:'❤️'},{type:'X-Ray',body:'Knee',patient:'P002',date:'2026-04-22',icon:'🦵'},{type:'Ultrasound',body:'Abdomen',patient:'P007',date:'2026-05-06',icon:'🔊'}];
  el.innerHTML=`<div class="imaging-grid">${scans.map(s=>{const p=HMS.getPatient(s.patient);return`<div class="imaging-card"><div class="imaging-thumb">${s.icon}</div><div class="imaging-info"><div class="imaging-name">${s.type} — ${s.body}</div><div class="imaging-date">${p?p.name:''} · ${HMS.fmt.date(s.date)}</div></div></div>`;}).join('')}</div>`;
}

function renderTele(el){
  const sessions=[{patient:'P004',time:'14:00',date:'2026-05-12',status:'scheduled'},{patient:'P008',time:'15:30',date:'2026-05-12',status:'scheduled'},{patient:'P006',time:'16:00',date:'2026-05-10',status:'completed'}];
  el.innerHTML=`<h3 style="margin-bottom:16px">Telemedicine Sessions</h3>
  <div style="display:grid;gap:12px">${sessions.map(s=>{const p=HMS.getPatient(s.patient);return`
    <div class="tele-card">
      <div class="tele-avatar">${p?p.avatar:'?'}</div>
      <div>
        <div style="font-weight:700">${p?p.name:'Unknown'}</div>
        <div style="font-size:13px;color:var(--text-2)">${HMS.fmt.date(s.date)} · ${HMS.fmt.time(s.time)}</div>
        <div style="font-size:12px;color:var(--text-3)">${p?p.phone:''}</div>
      </div>
      ${s.status!=='completed'?`
        <div style="margin-left:auto;display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" onclick="openTeleNotes('${s.patient}')">📝 Notes</button>
          <button class="tele-join-btn" onclick="showTeleModal('${s.patient}','${s.time}')">📹 Join Call</button>
        </div>`:` <span class="badge badge-success" style="margin-left:auto">Completed</span>`}
    </div>`;}).join('')}</div>`;
}
function showTeleModal(pid,time){
  const p=HMS.getPatient(pid);
  document.getElementById('teleModalBody').innerHTML=`
    <div style="text-align:center;padding:24px 0">
      <div style="font-size:64px;margin-bottom:12px">📹</div>
      <div style="font-size:20px;font-weight:700;margin-bottom:4px">${p?p.name:'Patient'}</div>
      <div style="color:var(--text-2);margin-bottom:24px">Scheduled · ${HMS.fmt.time(time)}</div>
      <div style="background:var(--bg-3);border-radius:var(--radius);padding:16px;margin-bottom:20px;font-size:13px;color:var(--text-2)">
        Video calls require a live backend integration.<br>This is a UI demo — call controls are ready.
      </div>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-danger" onclick="closeModal('teleModal')">📵 End Call</button>
        <button class="btn btn-success" onclick="toast('Connecting…','info')">🎙️ Start Call</button>
      </div>
    </div>`;
  openModal('teleModal');
}
function openTeleNotes(pid){ document.getElementById('soapPatient') && (document.getElementById('soapPatient').value=pid); showPage('notes'); toast('Switched to Clinical Notes for this patient','info'); }

function renderAnalytics(el){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const pts=HMS.patients.filter(p=>p.doctor===docId);
  const admCount=pts.filter(p=>p.status==='admitted'||p.status==='ICU').length;
  const opdCount=pts.filter(p=>p.status==='OPD').length;
  el.innerHTML=`
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:var(--primary)"><div class="kpi-value">${pts.length}</div><div class="kpi-label">Total Patients</div></div>
    <div class="kpi-card" style="--kpi-color:var(--info)"><div class="kpi-value">${admCount}</div><div class="kpi-label">Inpatient</div></div>
    <div class="kpi-card" style="--kpi-color:var(--success)"><div class="kpi-value">${opdCount}</div><div class="kpi-label">OPD</div></div>
    <div class="kpi-card" style="--kpi-color:var(--warning)"><div class="kpi-value">${HMS.prescriptions.filter(r=>r.doctorId===docId).length}</div><div class="kpi-label">Prescriptions</div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Patients by Status</span></div><div class="card-body"><div class="chart-area"><div class="bar-chart">${[{l:'Admitted',v:admCount,c:'var(--info)'},{l:'OPD',v:opdCount,c:'var(--success)'},{l:'ICU',v:pts.filter(p=>p.status==='ICU').length,c:'var(--danger)'}].map(b=>`<div class="bar-wrap"><div class="bar-val">${b.v}</div><div class="bar" style="height:${Math.max(b.v*30,8)}px;background:${b.c}"></div><div class="bar-label">${b.l}</div></div>`).join('')}</div></div></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Lab Orders by Status</span></div><div class="card-body"><div class="chart-area"><div class="bar-chart">${[{l:'Completed',v:HMS.labResults.filter(l=>l.orderedBy===docId&&l.status==='completed').length,c:'var(--success)'},{l:'Pending',v:HMS.labResults.filter(l=>l.orderedBy===docId&&l.status==='pending').length,c:'var(--warning)'},{l:'Processing',v:HMS.labResults.filter(l=>l.orderedBy===docId&&l.status==='processing').length,c:'var(--info)'}].map(b=>`<div class="bar-wrap"><div class="bar-val">${b.v}</div><div class="bar" style="height:${Math.max(b.v*30,8)}px;background:${b.c}"></div><div class="bar-label">${b.l}</div></div>`).join('')}</div></div></div></div>
  </div>`;
}

// ── Modal & Utility functions ──
function openModal(id){document.getElementById(id).classList.add('active');}
function closeModal(id){document.getElementById(id).classList.remove('active');}

function openPatientModal(pid){
  const p=HMS.getPatient(pid);if(!p)return;
  document.getElementById('modalPatientName').textContent=p.name+' — EHR';
  const labs=HMS.getPatientLabs(pid);const rxs=HMS.getPatientRx(pid);
  document.getElementById('modalPatientBody').innerHTML=`
    <div class="ehr-section"><div style="display:flex;gap:16px;align-items:center;margin-bottom:16px"><div class="patient-card-avatar" style="width:56px;height:56px;font-size:22px">${p.avatar}</div><div><div style="font-size:18px;font-weight:700">${p.name}</div><div style="color:var(--text-2)">${p.age}y · ${p.gender} · Blood: ${p.blood}</div><div style="color:var(--text-3);font-size:13px">${p.phone} · ${p.email}</div></div></div></div>
    
    <div class="ehr-section"><h4>Allergies</h4>
      <div id="ehrAllergies">${p.allergies.length?p.allergies.map(a=>`<span class="allergy-tag">${a} <span style="cursor:pointer;margin-left:4px" onclick="removeAllergy('${pid}', '${a}')">×</span></span>`).join(''):'<span style="color:var(--text-3)">NKDA</span>'}</div>
      <div style="margin-top:8px;display:flex;gap:8px"><input type="text" id="newAllergy" class="form-control" style="padding:4px 8px" placeholder="Add Allergy"><button class="btn btn-secondary btn-sm" onclick="addAllergy('${pid}')">Add</button></div>
    </div>
    
    <div class="ehr-section"><h4>Conditions</h4>
      <div id="ehrConditions">${p.conditions.map(c=>`<span class="condition-tag">${c} <span style="cursor:pointer;margin-left:4px" onclick="removeCondition('${pid}', '${c}')">×</span></span>`).join('')}</div>
      <div style="margin-top:8px;display:flex;gap:8px"><input type="text" id="newCondition" class="form-control" style="padding:4px 8px" placeholder="Add Diagnosis"><button class="btn btn-secondary btn-sm" onclick="addCondition('${pid}')">Add</button></div>
    </div>
    
    ${p.ward?`<div class="ehr-section"><h4>Admission</h4><p style="font-size:13px;color:var(--text-2)">Ward: ${p.ward} · Bed: ${p.bed} · Since: ${HMS.fmt.date(p.admitDate)}</p></div>`:''}
    <div class="ehr-section"><h4>Recent Labs</h4>${labs.length?labs.slice(0,3).map(l=>`<div style="padding:8px 0;border-bottom:1px solid var(--card-border)"><div style="font-size:13px;font-weight:600">${l.test} <span class="badge badge-${l.status==='completed'?'success':'warning'}" style="margin-left:4px">${l.status}</span>${l.critical?'<span class="badge badge-danger" style="margin-left:4px">CRIT</span>':''}</div>${Object.entries(l.results||{}).map(([k,v])=>`<div style="font-size:12px;color:var(--text-2)">${k}: ${v}</div>`).join('')}</div>`).join(''):'<p style="color:var(--text-3);font-size:13px">No lab results</p>'}</div>
    <div class="ehr-section"><h4>Active Prescriptions</h4>${rxs.filter(r=>r.status==='active').map(r=>`<div style="padding:8px 0;border-bottom:1px solid var(--card-border)">${r.drugs.map(d=>`<div style="font-size:13px">${d.name} ${d.dose} — ${d.frequency} (${d.duration})</div>`).join('')}<div style="font-size:12px;color:var(--text-3);margin-top:4px">${r.notes}</div></div>`).join('')||'<p style="color:var(--text-3);font-size:13px">No active prescriptions</p>'}</div>`;
  openModal('patientModal');
}
function addAllergy(pid) {
  const p = HMS.getPatient(pid); const v = document.getElementById('newAllergy').value.trim();
  if(!p || !v) return; p.allergies.push(v); HMS.saveData(); openPatientModal(pid); if(currentPage==='patients') renderPatients(document.getElementById('pageContent'));
}
function removeAllergy(pid, a) {
  const p = HMS.getPatient(pid); if(!p) return; p.allergies = p.allergies.filter(x=>x!==a); HMS.saveData(); openPatientModal(pid); if(currentPage==='patients') renderPatients(document.getElementById('pageContent'));
}
function addCondition(pid) {
  const p = HMS.getPatient(pid); const v = document.getElementById('newCondition').value.trim();
  if(!p || !v) return; p.conditions.push(v); HMS.saveData(); openPatientModal(pid); if(currentPage==='patients') renderPatients(document.getElementById('pageContent'));
}
function removeCondition(pid, c) {
  const p = HMS.getPatient(pid); if(!p) return; p.conditions = p.conditions.filter(x=>x!==c); HMS.saveData(); openPatientModal(pid); if(currentPage==='patients') renderPatients(document.getElementById('pageContent'));
}

function populateRxModal(){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const sel=document.getElementById('rxPatient');
  sel.innerHTML=HMS.patients.filter(p=>p.doctor===docId).map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  document.getElementById('rxDrugsContainer').innerHTML = `
    <div class="rx-drug-row" style="background:var(--bg-2);padding:12px;border-radius:6px;margin-bottom:12px;position:relative">
      <button class="icon-btn" style="position:absolute;top:4px;right:4px;color:var(--danger)" onclick="this.parentElement.remove()">✕</button>
      <div class="form-group"><label class="form-label">Drug Name</label><input class="form-control rx-drug-name" placeholder="e.g. Amlodipine"/></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Dose</label><input class="form-control rx-drug-dose" placeholder="e.g. 5mg"/></div>
        <div class="form-group"><label class="form-label">Frequency</label><select class="form-control rx-drug-freq"><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>PRN</option><option>Once at night</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">Duration</label><input class="form-control rx-drug-dur" placeholder="e.g. 30 days"/></div>
    </div>`;
}
function addRxDrugRow() {
  const div = document.createElement('div');
  div.className = 'rx-drug-row';
  div.style.cssText = 'background:var(--bg-2);padding:12px;border-radius:6px;margin-bottom:12px;position:relative';
  div.innerHTML = `
    <button class="icon-btn" style="position:absolute;top:4px;right:4px;color:var(--danger)" onclick="this.parentElement.remove()">✕</button>
    <div class="form-group"><label class="form-label">Drug Name</label><input class="form-control rx-drug-name" placeholder="e.g. Amlodipine"/></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Dose</label><input class="form-control rx-drug-dose" placeholder="e.g. 5mg"/></div>
      <div class="form-group"><label class="form-label">Frequency</label><select class="form-control rx-drug-freq"><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>PRN</option><option>Once at night</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Duration</label><input class="form-control rx-drug-dur" placeholder="e.g. 30 days"/></div>
  `;
  document.getElementById('rxDrugsContainer').appendChild(div);
}
function populateLabModal(){
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const sel=document.getElementById('labPatient');
  sel.innerHTML=HMS.patients.filter(p=>p.doctor===docId).map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
}
function savePrescription(){
  const patientId=document.getElementById('rxPatient').value;
  const notes=document.getElementById('rxNotes').value;
  
  const drugs = [];
  document.querySelectorAll('.rx-drug-row').forEach(row => {
    const name = row.querySelector('.rx-drug-name').value.trim();
    if(name) {
      drugs.push({
        name,
        dose: row.querySelector('.rx-drug-dose').value.trim(),
        frequency: row.querySelector('.rx-drug-freq').value,
        duration: row.querySelector('.rx-drug-dur').value.trim()
      });
    }
  });

  if(!patientId || drugs.length === 0){toast('Please select patient and add at least one drug','error');return;}
  
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  const newRx = {
    id: 'RX'+String(HMS.prescriptions.length+1).padStart(4,'0'),
    patientId, doctorId: docId, date: new Date().toISOString().split('T')[0],
    drugs: drugs,
    notes, status: 'active'
  };
  HMS.prescriptions.unshift(newRx);
  HMS.saveData(); toast('Prescription saved successfully','success'); closeModal('rxModal');
  if(currentPage==='prescriptions') renderRx(document.getElementById('pageContent'));
  if(currentPage==='analytics') renderAnalytics(document.getElementById('pageContent'));
  
  // Prompt to print immediately
  if(confirm('Prescription saved! Would you like to print it now?')) {
    HMS.printPrescription(newRx.id);
  }
}
function saveLabOrder(){
  const patientId=document.getElementById('labPatient').value;
  const test=document.getElementById('labTest').value;
  const priority=document.getElementById('labPriority').value;
  if(!patientId || !test){toast('Please select patient and test','error');return;}
  
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  HMS.labResults.unshift({
    id: 'LAB'+String(HMS.labResults.length+1).padStart(4,'0'),
    patientId, orderedBy: docId, test, date: new Date().toISOString().split('T')[0],
    status: 'pending', critical: priority==='STAT'
  });
  HMS.saveData(); toast('Lab order placed successfully','success'); closeModal('labModal');
  if(currentPage==='labs') renderLabs(document.getElementById('pageContent'));
  if(currentPage==='dashboard') renderDashboard(document.getElementById('pageContent'));
  if(currentPage==='analytics') renderAnalytics(document.getElementById('pageContent'));
}
function saveNote(){
  const patientId=document.getElementById('soapPatient').value;
  const s=document.getElementById('soapS').value.trim();
  const o=document.getElementById('soapO').value.trim();
  const a=document.getElementById('soapA').value.trim();
  const p=document.getElementById('soapP').value.trim();
  if(!patientId) { toast('Please select a patient', 'error'); return; }
  if(!s && !o && !a && !p){toast('Please fill at least one SOAP field','error');return;}
  
  const docId=(HMS.currentUser&&HMS.currentUser.doctorId)||'D001';
  HMS.notes.push({
    id: 'N'+Date.now(), patientId, doctorId: docId, date: new Date().toISOString(),
    s, o, a, p
  });
  HMS.saveData(); toast('Clinical note saved','success');
  
  ['soapS','soapO','soapA','soapP'].forEach(id=>document.getElementById(id).value='');
  loadPatientNotes(patientId);
}

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
function handleSearch(v){
  const q=v.toLowerCase();
  if(currentPage==='patients'){
    document.querySelectorAll('.patient-card').forEach(c=>{ c.style.display=c.textContent.toLowerCase().includes(q)?'':'none'; });
  } else if(currentPage==='prescriptions'||currentPage==='labs'||currentPage==='schedule'){
    document.querySelectorAll('#pageContent .table tbody tr').forEach(tr=>{ tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none'; });
  }
}

// ============================================================
// HMS Mock Data Store
// ============================================================

const HMS = {
  currentUser: null,

  doctors: [
    { id:'D001', name:'Dr. Priya Sharma', specialty:'Cardiology', dept:'Cardiology', email:'priya.sharma@medcore.in', phone:'+91-98001-11001', exp:'12 yrs', avatar:'PS', rating:4.9, available:true },
    { id:'D002', name:'Dr. Arjun Mehta',  specialty:'Neurology',  dept:'Neurology',  email:'arjun.mehta@medcore.in',  phone:'+91-98001-11002', exp:'9 yrs',  avatar:'AM', rating:4.7, available:true },
    { id:'D003', name:'Dr. Sneha Iyer',   specialty:'Pediatrics', dept:'Pediatrics', email:'sneha.iyer@medcore.in',   phone:'+91-98001-11003', exp:'7 yrs',  avatar:'SI', rating:4.8, available:false },
    { id:'D004', name:'Dr. Rahul Gupta',  specialty:'Orthopedics',dept:'Orthopedics',email:'rahul.gupta@medcore.in',  phone:'+91-98001-11004', exp:'15 yrs', avatar:'RG', rating:4.6, available:true },
    { id:'D005', name:'Dr. Meera Nair',   specialty:'Dermatology',dept:'Dermatology',email:'meera.nair@medcore.in',   phone:'+91-98001-11005', exp:'6 yrs',  avatar:'MN', rating:4.5, available:true },
    { id:'D006', name:'Dr. Vikram Singh', specialty:'General Surgery', dept:'Surgery', email:'vikram.singh@medcore.in', phone:'+91-98001-11006', exp:'18 yrs', avatar:'VS', rating:4.9, available:true },
    { id:'D007', name:'Dr. Anita Roy',    specialty:'Oncology',   dept:'Oncology',   email:'anita.roy@medcore.in',    phone:'+91-98001-11007', exp:'11 yrs', avatar:'AR', rating:4.8, available:true },
    { id:'D008', name:'Dr. Suresh Patel', specialty:'Nephrology', dept:'Nephrology', email:'suresh.patel@medcore.in', phone:'+91-98001-11008', exp:'14 yrs', avatar:'SP', rating:4.7, available:false },
  ],

  patients: [
    { id:'P001', name:'Rohan Kapoor',    age:34, gender:'Male',   blood:'O+',  phone:'+91-99001-21001', email:'rohan.k@gmail.com',   address:'12, MG Road, Bengaluru', emergency:'Kavya Kapoor (+91-99001-31001)', allergies:['Penicillin','Sulfa'], conditions:['Hypertension','Type 2 Diabetes'], avatar:'RK', admitDate:'2026-04-10', ward:'Cardiology', bed:'C-04', status:'admitted', insuranceId:'INS-KAR-4421', doctor:'D001' },
    { id:'P002', name:'Sunita Verma',    age:58, gender:'Female', blood:'B+',  phone:'+91-99001-21002', email:'sunita.v@yahoo.com',   address:'45, Juhu, Mumbai',       emergency:'Ravi Verma (+91-99001-31002)',  allergies:['Aspirin'], conditions:['Arthritis','Osteoporosis'], avatar:'SV', admitDate:null, ward:null, bed:null, status:'OPD', insuranceId:'INS-MAH-7723', doctor:'D004' },
    { id:'P003', name:'Aditya Joshi',    age:22, gender:'Male',   blood:'A-',  phone:'+91-99001-21003', email:'aditya.j@gmail.com',   address:'8, Civil Lines, Delhi',  emergency:'Priya Joshi (+91-99001-31003)',  allergies:[], conditions:['Asthma'], avatar:'AJ', admitDate:'2026-05-01', ward:'General', bed:'G-11', status:'admitted', insuranceId:'INS-DEL-1190', doctor:'D002' },
    { id:'P004', name:'Lakshmi Nair',    age:45, gender:'Female', blood:'AB+', phone:'+91-99001-21004', email:'lakshmi.n@outlook.com', address:'3, Anna Nagar, Chennai', emergency:'Mohan Nair (+91-99001-31004)',  allergies:['Codeine'], conditions:['Migraine','Hypothyroidism'], avatar:'LN', admitDate:null, ward:null, bed:null, status:'OPD', insuranceId:'INS-TN-3312', doctor:'D002' },
    { id:'P005', name:'Deepak Malhotra', age:67, gender:'Male',   blood:'O-',  phone:'+91-99001-21005', email:'deepak.m@gmail.com',   address:'22, Sector 18, Noida',   emergency:'Sonia Malhotra (+91-99001-31005)', allergies:['Latex','NSAIDs'], conditions:['CAD','COPD','CKD Stage 3'], avatar:'DM', admitDate:'2026-05-08', ward:'ICU', bed:'ICU-02', status:'ICU', insuranceId:'INS-UP-6671', doctor:'D001' },
    { id:'P006', name:'Kavitha Reddy',   age:31, gender:'Female', blood:'A+',  phone:'+91-99001-21006', email:'kavitha.r@gmail.com',  address:'5, Banjara Hills, Hyderabad', emergency:'Srikanth Reddy (+91-99001-31006)', allergies:[], conditions:['PCOS','Anaemia'], avatar:'KR', admitDate:null, ward:null, bed:null, status:'OPD', insuranceId:'INS-TS-9982', doctor:'D005' },
    { id:'P007', name:'Manish Tiwari',   age:50, gender:'Male',   blood:'B-',  phone:'+91-99001-21007', email:'manish.t@hotmail.com', address:'10, Hazratganj, Lucknow', emergency:'Rekha Tiwari (+91-99001-31007)', allergies:['Ibuprofen'], conditions:['Hypertension','Diabetes','Fatty Liver'], avatar:'MT', admitDate:'2026-05-05', ward:'General', bed:'G-22', status:'admitted', insuranceId:'INS-UP-4456', doctor:'D001' },
    { id:'P008', name:'Ananya Das',      age:27, gender:'Female', blood:'O+',  phone:'+91-99001-21008', email:'ananya.d@gmail.com',   address:'9, Park Street, Kolkata', emergency:'Bidyut Das (+91-99001-31008)',  allergies:[], conditions:['Anxiety Disorder'], avatar:'AD', admitDate:null, ward:null, bed:null, status:'OPD', insuranceId:'INS-WB-2234', doctor:'D002' },
    { id:'P009', name:'Ramesh Pillai',   age:72, gender:'Male',   blood:'AB-', phone:'+91-99001-21009', email:'ramesh.p@gmail.com',   address:'7, MG Road, Kochi',       emergency:'Leela Pillai (+91-99001-31009)',  allergies:['Morphine'], conditions:['Heart Failure','Atrial Fibrillation','CKD Stage 4'], avatar:'RP', admitDate:'2026-05-09', ward:'Cardiology', bed:'C-08', status:'admitted', insuranceId:'INS-KER-8873', doctor:'D001' },
    { id:'P010', name:'Preethi Subramaniam', age:39, gender:'Female', blood:'B+', phone:'+91-99001-21010', email:'preethi.s@gmail.com', address:'14, T Nagar, Chennai', emergency:'Suresh Subramaniam (+91-99001-31010)', allergies:['Sulfa'], conditions:['Lupus','Raynaud Syndrome'], avatar:'PS', admitDate:null, ward:null, bed:null, status:'OPD', insuranceId:'INS-TN-5510', doctor:'D007' },
  ],

  appointments: [
    { id:'APT001', patientId:'P001', doctorId:'D001', date:'2026-05-12', time:'09:00', type:'Follow-up', status:'confirmed', notes:'BP monitoring & medication review' },
    { id:'APT002', patientId:'P002', doctorId:'D004', date:'2026-05-12', time:'10:30', type:'Consultation', status:'confirmed', notes:'Knee pain assessment' },
    { id:'APT003', patientId:'P003', doctorId:'D002', date:'2026-05-12', time:'11:00', type:'Review',       status:'confirmed', notes:'EEG report review' },
    { id:'APT004', patientId:'P006', doctorId:'D005', date:'2026-05-12', time:'14:00', type:'Consultation', status:'confirmed', notes:'Hormonal panel review' },
    { id:'APT005', patientId:'P008', doctorId:'D002', date:'2026-05-13', time:'09:30', type:'New Patient',  status:'pending',   notes:'Anxiety evaluation' },
    { id:'APT006', patientId:'P004', doctorId:'D002', date:'2026-05-13', time:'11:00', type:'Follow-up',   status:'confirmed', notes:'Migraine management' },
    { id:'APT007', patientId:'P010', doctorId:'D007', date:'2026-05-14', time:'10:00', type:'Review',      status:'confirmed', notes:'Rheumatology labs' },
    { id:'APT008', patientId:'P007', doctorId:'D001', date:'2026-05-09', time:'09:00', type:'Emergency',   status:'completed', notes:'BP spike — admitted to general ward' },
    { id:'APT009', patientId:'P001', doctorId:'D001', date:'2026-04-28', time:'09:00', type:'Follow-up',   status:'completed', notes:'Stable. Echo done.' },
    { id:'APT010', patientId:'P002', doctorId:'D004', date:'2026-04-22', time:'11:00', type:'Consultation', status:'completed', notes:'X-Ray reviewed. Physiotherapy recommended.' },
  ],

  labResults: [
    { id:'LAB001', patientId:'P001', test:'Complete Blood Count', orderedBy:'D001', date:'2026-05-10', status:'completed', critical:false, results:{ HGB:'13.2 g/dL', WBC:'7.4 K/μL', PLT:'210 K/μL', HCT:'39%' } },
    { id:'LAB002', patientId:'P001', test:'HbA1c',                orderedBy:'D001', date:'2026-05-10', status:'completed', critical:false, results:{ HbA1c:'7.2%', eAG:'160 mg/dL' } },
    { id:'LAB003', patientId:'P005', test:'Creatinine & BUN',     orderedBy:'D001', date:'2026-05-09', status:'completed', critical:true,  results:{ Creatinine:'3.8 mg/dL', BUN:'54 mg/dL', eGFR:'18 mL/min' } },
    { id:'LAB004', patientId:'P007', test:'Lipid Panel',          orderedBy:'D001', date:'2026-05-08', status:'completed', critical:false, results:{ LDL:'142 mg/dL', HDL:'38 mg/dL', TG:'210 mg/dL', TC:'224 mg/dL' } },
    { id:'LAB005', patientId:'P009', test:'BNP & Troponin',       orderedBy:'D001', date:'2026-05-09', status:'completed', critical:true,  results:{ BNP:'1240 pg/mL', TroponinI:'0.08 ng/mL' } },
    { id:'LAB006', patientId:'P003', test:'EEG Report',           orderedBy:'D002', date:'2026-05-03', status:'completed', critical:false, results:{ Impression:'Mild diffuse slowing. No epileptiform activity.' } },
    { id:'LAB007', patientId:'P010', test:'ANA Panel',            orderedBy:'D007', date:'2026-05-11', status:'pending',   critical:false, results:{} },
    { id:'LAB008', patientId:'P006', test:'Hormonal Panel (FSH/LH/Estradiol)', orderedBy:'D005', date:'2026-05-11', status:'processing', critical:false, results:{} },
  ],

  prescriptions: [
    { id:'RX001', patientId:'P001', doctorId:'D001', date:'2026-05-10', drugs:[
      { name:'Amlodipine', dose:'5mg', frequency:'Once daily', duration:'30 days', route:'Oral' },
      { name:'Metformin',  dose:'500mg', frequency:'Twice daily', duration:'30 days', route:'Oral' },
      { name:'Aspirin',    dose:'75mg', frequency:'Once daily', duration:'30 days', route:'Oral' }
    ], notes:'Monitor BP weekly. Avoid high-sodium diet.', status:'active' },
    { id:'RX002', patientId:'P003', doctorId:'D002', date:'2026-05-02', drugs:[
      { name:'Salbutamol Inhaler', dose:'100mcg', frequency:'PRN', duration:'Ongoing', route:'Inhaled' },
      { name:'Montelukast', dose:'10mg', frequency:'Once at night', duration:'30 days', route:'Oral' }
    ], notes:'Use spacer. Avoid triggers.', status:'active' },
    { id:'RX003', patientId:'P005', doctorId:'D001', date:'2026-05-08', drugs:[
      { name:'Furosemide', dose:'40mg', frequency:'Twice daily', duration:'14 days', route:'IV' },
      { name:'Carvedilol', dose:'6.25mg', frequency:'Twice daily', duration:'30 days', route:'Oral' },
      { name:'Spironolactone', dose:'25mg', frequency:'Once daily', duration:'30 days', route:'Oral' }
    ], notes:'Daily weight monitoring. Fluid restriction 1.5L/day.', status:'active' },
    { id:'RX004', patientId:'P007', doctorId:'D001', date:'2026-05-05', drugs:[
      { name:'Losartan', dose:'50mg', frequency:'Once daily', duration:'30 days', route:'Oral' },
      { name:'Atorvastatin', dose:'40mg', frequency:'Once at night', duration:'30 days', route:'Oral' }
    ], notes:'Recheck LFT after 6 weeks.', status:'active' },
    { id:'RX005', patientId:'P009', doctorId:'D001', date:'2026-05-09', drugs:[
      { name:'Digoxin',    dose:'0.25mg', frequency:'Once daily', duration:'30 days', route:'Oral' },
      { name:'Warfarin',   dose:'2mg',    frequency:'Once daily', duration:'30 days', route:'Oral' },
      { name:'Furosemide', dose:'80mg',   frequency:'Twice daily', duration:'14 days', route:'Oral' }
    ], notes:'INR target 2-3. Dietary K restriction.', status:'active' },
  ],

  bills: [
    { id:'BILL001', patientId:'P001', date:'2026-05-10', items:[
      { desc:'Room Charges (Cardiology Ward, 30d)', amount:45000 },
      { desc:'Consultation — Dr. Priya Sharma',    amount:1500  },
      { desc:'CBC + HbA1c Lab Tests',              amount:2200  },
      { desc:'Medicines',                          amount:3800  }
    ], total:52500, paid:25000, status:'partial', insurance:'INS-KAR-4421' },
    { id:'BILL002', patientId:'P005', date:'2026-05-09', items:[
      { desc:'ICU Charges (2 days)',  amount:24000 },
      { desc:'Emergency Consultation', amount:2000 },
      { desc:'Lab Investigations',     amount:5500 },
      { desc:'IV Medications',         amount:4200 }
    ], total:35700, paid:0, status:'unpaid', insurance:'INS-UP-6671' },
    { id:'BILL003', patientId:'P003', date:'2026-05-05', items:[
      { desc:'Room Charges (General Ward, 4d)', amount:8000  },
      { desc:'EEG & Neurology Consultation',    amount:3500  },
      { desc:'Medicines',                       amount:1200  }
    ], total:12700, paid:12700, status:'paid', insurance:'INS-DEL-1190' },
    { id:'BILL004', patientId:'P002', date:'2026-04-22', items:[
      { desc:'OPD Consultation — Dr. Rahul Gupta', amount:800  },
      { desc:'X-Ray Knee',                          amount:1200 },
      { desc:'Medicines',                           amount:600  }
    ], total:2600, paid:2600, status:'paid', insurance:'INS-MAH-7723' },
  ],

  beds: [
    { id:'C-01', ward:'Cardiology', status:'occupied', patient:'P009' },
    { id:'C-02', ward:'Cardiology', status:'occupied', patient:'P001' },
    { id:'C-03', ward:'Cardiology', status:'available', patient:null },
    { id:'C-04', ward:'Cardiology', status:'housekeeping', patient:null },
    { id:'C-05', ward:'Cardiology', status:'available', patient:null },
    { id:'G-01', ward:'General', status:'occupied', patient:'P003' },
    { id:'G-02', ward:'General', status:'available', patient:null },
    { id:'G-03', ward:'General', status:'occupied', patient:'P007' },
    { id:'G-04', ward:'General', status:'available', patient:null },
    { id:'G-05', ward:'General', status:'housekeeping', patient:null },
    { id:'ICU-01', ward:'ICU', status:'occupied', patient:'P005' },
    { id:'ICU-02', ward:'ICU', status:'available', patient:null },
    { id:'ICU-03', ward:'ICU', status:'available', patient:null },
    { id:'P-01', ward:'Pediatrics', status:'available', patient:null },
    { id:'P-02', ward:'Pediatrics', status:'available', patient:null },
  ],

  inventory: [
    { id:'INV001', name:'Paracetamol 500mg',  category:'Tablets',    stock:2400, unit:'Tab',  minStock:500,  expiry:'2027-06', price:2  },
    { id:'INV002', name:'Amoxicillin 250mg',  category:'Capsules',   stock:180,  unit:'Cap',  minStock:200,  expiry:'2026-12', price:8  },
    { id:'INV003', name:'IV Normal Saline 1L',category:'IV Fluids',  stock:95,   unit:'Bag',  minStock:100,  expiry:'2027-03', price:55 },
    { id:'INV004', name:'Surgical Gloves (L)',category:'Consumables', stock:1200, unit:'Pair', minStock:300,  expiry:null,      price:12 },
    { id:'INV005', name:'Insulin (Glargine)',  category:'Injectables',stock:42,   unit:'Vial', minStock:50,   expiry:'2026-09', price:320},
    { id:'INV006', name:'Furosemide 40mg IV', category:'Injectables',stock:310,  unit:'Amp',  minStock:100,  expiry:'2027-01', price:18 },
    { id:'INV007', name:'N95 Masks',          category:'PPE',        stock:600,  unit:'Pcs',  minStock:200,  expiry:null,      price:25 },
    { id:'INV008', name:'Atorvastatin 40mg',  category:'Tablets',    stock:890,  unit:'Tab',  minStock:300,  expiry:'2027-06', price:6  },
  ],

  commonDrugs: [
    'Amlodipine', 'Amoxicillin', 'Aspirin', 'Atorvastatin', 'Azithromycin', 
    'Carvedilol', 'Cetirizine', 'Ciprofloxacin', 'Clopidogrel', 'Digoxin', 
    'Enalapril', 'Furosemide', 'Glimepiride', 'Hydrochlorothiazide', 'Ibuprofen', 
    'Insulin Glargine', 'Losartan', 'Metformin', 'Metoprolol', 'Montelukast', 
    'Omeprazole', 'Pantoprazole', 'Paracetamol', 'Ramipril', 'Rosuvastatin', 
    'Salbutamol Inhaler', 'Spironolactone', 'Telmisartan', 'Warfarin'
  ],

  staff: [
    { id:'S001', name:'Rajni Patil',    role:'Receptionist', dept:'Front Desk',   shift:'Morning', status:'on-duty', phone:'+91-98002-01001', avatar:'RP' },
    { id:'S002', name:'Geeta Sharma',   role:'Nurse',        dept:'Cardiology',   shift:'Morning', status:'on-duty', phone:'+91-98002-01002', avatar:'GS' },
    { id:'S003', name:'Sunil Kumar',    role:'Lab Tech',     dept:'Pathology',    shift:'Morning', status:'on-duty', phone:'+91-98002-01003', avatar:'SK' },
    { id:'S004', name:'Pooja Mehta',    role:'Billing Clerk',dept:'Billing',      shift:'Morning', status:'on-duty', phone:'+91-98002-01004', avatar:'PM' },
    { id:'S005', name:'Ravi Shankar',   role:'Nurse',        dept:'ICU',          shift:'Morning', status:'on-duty', phone:'+91-98002-01005', avatar:'RS' },
    { id:'S006', name:'Ankit Verma',    role:'Pharmacist',   dept:'Pharmacy',     shift:'Morning', status:'on-leave', phone:'+91-98002-01006', avatar:'AV' },
    { id:'S007', name:'Shalini Dixit',  role:'Admin',        dept:'Administration',shift:'Morning',status:'on-duty', phone:'+91-98002-01007', avatar:'SD' },
    { id:'S008', name:'Manoj Tiwari',   role:'Radiologist',  dept:'Radiology',    shift:'Evening', status:'off-duty', phone:'+91-98002-01008', avatar:'MT' },
  ],

  notes: [],

  // Demo login credentials
  users: [
    { id:'U_ADM', name:'Vishal', role:'admin', email:'vishalingle3265@gmail.com', password:'vishal123', avatar:'V' },
    { id:'U_DOC', name:'Dr. Priya Sharma', role:'doctor',  email:'doctor@medcore.in',  password:'doctor123', doctorId:'D001', avatar:'PS' },
    { id:'U_STF', name:'Rajni Patil',      role:'staff',   email:'staff@medcore.in',   password:'staff123',  staffId:'S001',  avatar:'RP', subRole:'Receptionist' },
    { id:'U_PAT', name:'Rohan Kapoor',     role:'patient', email:'patient@medcore.in', password:'patient123',patientId:'P001',avatar:'RK' },
  ],

  // Helper methods
  getPatient(id)     { return this.patients.find(p => p.id === id); },
  getDoctor(id)      { return this.doctors.find(d => d.id === id); },
  getPatientAppts(patientId) { return this.appointments.filter(a => a.patientId === patientId); },
  getDoctorAppts(doctorId)   { return this.appointments.filter(a => a.doctorId === doctorId); },
  getPatientLabs(patientId)  { return this.labResults.filter(l => l.patientId === patientId); },
  getPatientRx(patientId)    { return this.prescriptions.filter(r => r.patientId === patientId); },
  getPatientBills(patientId) { return this.bills.filter(b => b.patientId === patientId); },
  todayAppts(doctorId) {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(a => a.doctorId === doctorId && a.date === today);
  },
  login(email, password) {
    const u = this.users.find(u => u.email === email && u.password === password);
    if (u) { this.currentUser = u; localStorage.setItem('hms_user', JSON.stringify(u)); }
    return u || null;
  },
  register(name, email, password, role, preventLogin = false, options = {}) {
    // Basic validation
    if(this.users.some(u=>u.email===email)) return {error: "Email already registered"};
    
    let uId = 'U_' + Date.now();
    let newUser = { id: uId, name, role, email, password };
    let avatar = name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

    if(role === 'doctor') {
      let docId = 'D' + String(this.doctors.length + 1).padStart(3, '0');
      newUser.doctorId = docId;
      newUser.avatar = avatar;
      this.doctors.push({ id: docId, name, specialty: options.specialty || 'General', dept: options.specialty || 'General', email, phone: '', exp: '1 yr', avatar, rating: 5.0, available: true });
    } else if (role === 'staff') {
      let staffId = 'S' + String(this.staff.length + 1).padStart(3, '0');
      newUser.staffId = staffId;
      newUser.avatar = avatar;
      newUser.subRole = options.subRole || 'General Staff';
      this.staff.push({ id: staffId, name, role: options.subRole || 'General Staff', dept: 'General', shift: 'Morning', status: 'on-duty', phone: '', avatar });
    }
    
    this.users.push(newUser);
    this.saveData();
    if(!preventLogin) {
      this.currentUser = newUser;
      localStorage.setItem('hms_user', JSON.stringify(newUser));
    }
    return newUser;
  },
  updateUser(id, data) {
    const u = this.users.find(x => x.id === id);
    if (!u) return { error: 'User not found' };
    
    if (data.name) u.name = data.name;
    if (data.email) u.email = data.email;
    if (data.password) u.password = data.password;

    if (u.role === 'doctor') {
      const d = this.doctors.find(x => x.id === u.doctorId);
      if (d) {
        if (data.name) d.name = data.name;
        if (data.specialty) { d.specialty = data.specialty; d.dept = data.specialty; }
      }
    } else if (u.role === 'staff') {
      const s = this.staff.find(x => x.id === u.staffId);
      if (s) {
        if (data.name) s.name = data.name;
        if (data.subRole) { s.role = data.subRole; }
      }
    }
    this.saveData();
    return { success: true };
  },

  printPrescription(rxId){
    const rx = this.prescriptions.find(r=>r.id===rxId); if(!rx) return;
    const p = this.getPatient(rx.patientId);
    const d = this.getDoctor(rx.doctorId);
    const now = new Date().toLocaleString('en-IN');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Prescription - ${p?p.name:''}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:30px;line-height:1.5}.header{display:flex;justify-content:space-between;border-bottom:3px solid #3b82f6;padding-bottom:15px;margin-bottom:25px}.logo-area{display:flex;align-items:center;gap:12px}.logo-icon{width:45px;height:45px;background:#3b82f6;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px}.hosp-name{font-size:22px;font-weight:800;color:#1e3a8a}.hosp-sub{font-size:12px;color:#64748b}.doc-info{text-align:right}.doc-name{font-size:18px;font-weight:700;color:#1e3a8a}.doc-sub{font-size:12px;color:#64748b}.rx-body{position:relative;min-height:500px;padding-top:20px}.patient-bar{background:#f1f5f9;padding:12px;border-radius:88px;display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:30px;font-size:13px}.rx-symbol{font-size:42px;font-weight:700;color:#3b82f6;margin-bottom:15px;font-family:serif}.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:180px;color:rgba(59,130,246,0.05);z-index:-1;user-select:none}.drug-table{width:100%;border-collapse:collapse;margin-bottom:40px}.drug-table th{text-align:left;padding:12px;background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:12px;text-transform:uppercase;color:#64748b}.drug-table td{padding:12px;border-bottom:1px solid #f1f5f9;font-size:14px}.footer{margin-top:auto;padding-top:30px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-end}.sig-line{width:200px;border-top:1.5px solid #1e293b;text-align:center;padding-top:5px;font-size:12px;font-weight:600}@media print{body{padding:0}.no-print{display:none}}</style></head><body><div class="header"><div class="logo-area"><div class="logo-icon">🏥</div><div><div class="hosp-name">MedCore HMS</div><div class="hosp-sub">Multi-Specialty Care</div></div></div><div class="doc-info"><div class="doc-name">${d?d.name:'Dr. Medical Professional'}</div><div class="doc-sub">${d?d.specialty:'General Medicine'} · ${d?d.phone:''}</div></div></div><div class="rx-body"><div class="watermark">⚕️</div><div class="patient-bar"><div><strong>Patient:</strong><br>${p?p.name:'N/A'}</div><div><strong>Age/Sex:</strong><br>${p?p.age:'—'} / ${p?p.gender:'—'}</div><div><strong>Date:</strong><br>${HMS.fmt.date(rx.date)}</div><div><strong>Rx ID:</strong><br>${rx.id}</div></div><div class="rx-symbol">℞</div><table class="drug-table"><thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead><tbody>${rx.drugs.map(dr=>`<tr><td style="font-weight:700">${dr.name}</td><td>${dr.dose}</td><td>${dr.frequency}</td><td>${dr.duration}</td></tr>`).join('')}</tbody></table><div style="margin-bottom:30px"><strong>Notes / Instructions:</strong><br><p style="font-size:14px;color:#475569;margin-top:5px">${rx.notes || 'No special instructions.'}</p></div></div><div class="footer"><div><div style="font-size:11px;color:#94a3b8">This is a digitally generated prescription.</div><div style="font-size:11px;color:#94a3b8">Valid for 30 days from date of issue.</div></div><div class="sig-line">Doctor's Signature</div></div><script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},500)}</script></body></html>`;
    const win = window.open('','_blank','width=800,height=900');
    win.document.write(html); win.document.close();
  },

  printReceipt(billId, paidAmount, method) {
    const b = this.bills.find(x=>x.id===billId); if(!b) return;
    const p = this.getPatient(b.patientId);
    const now = new Date().toLocaleString('en-IN');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Receipt - ${b.id}</title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px;display:flex;justify-content:center}
      .receipt{width:100%;max-width:500px;border:1px solid #e2e8f0;padding:30px;border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);position:relative}
      .header{text-align:center;border-bottom:2px dashed #e2e8f0;padding-bottom:20px;margin-bottom:20px}
      .hosp-name{font-size:24px;font-weight:800;color:#3b82f6}
      .hosp-sub{font-size:12px;color:#64748b;margin-top:4px}
      .receipt-title{font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:15px;color:#1e3a8a}
      .details{margin-bottom:20px;font-size:13px}
      .detail-row{display:flex;justify-content:space-between;padding:4px 0}
      .items-table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px}
      .items-table th{text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px}
      .items-table td{padding:8px;border-bottom:1px solid #f1f5f9}
      .summary{border-top:2px solid #1e293b;padding-top:10px;margin-top:10px}
      .summary-row{display:flex;justify-content:space-between;padding:5px 0;font-size:14px}
      .total-row{font-size:18px;font-weight:800;color:#1e3a8a;border-top:1px solid #e2e8f0;margin-top:10px;padding-top:10px}
      .paid-badge{position:absolute;top:100px;right:20px;transform:rotate(15deg);border:3px solid #10b981;color:#10b981;font-weight:900;font-size:24px;padding:5px 15px;border-radius:8px;opacity:0.3;user-select:none}
      .footer{text-align:center;margin-top:30px;font-size:11px;color:#94a3b8}
    </style></head><body><div class="receipt"><div class="paid-badge">PAID</div><div class="header"><div class="hosp-name">🏥 MedCore HMS</div><div class="hosp-sub">Quality Healthcare · Compassionate Care</div><div class="receipt-title">Payment Receipt</div></div><div class="details"><div class="detail-row"><span>Receipt No:</span><strong>#REC-${Math.floor(Math.random()*90000)+10000}</strong></div><div class="detail-row"><span>Bill Reference:</span><strong>${b.id}</strong></div><div class="detail-row"><span>Date:</span><strong>${now}</strong></div><div class="detail-row"><span>Patient:</span><strong>${p?p.name:'N/A'}</strong></div></div><table class="items-table"><thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead><tbody>${b.items.map(item=>`<tr><td>${item.desc}</td><td style="text-align:right">₹${item.amount}</td></tr>`).join('')}</tbody></table><div class="summary"><div class="summary-row"><span>Total Bill Amount:</span><span>₹${b.total}</span></div><div class="summary-row"><span>Previously Paid:</span><span>₹${b.paid-paidAmount}</span></div><div class="summary-row" style="font-weight:700"><span>Current Payment (${method}):</span><span>₹${paidAmount}</span></div><div class="total-row"><span>Remaining Balance:</span><span>₹${b.total-b.paid}</span></div></div><div class="footer"><p>Thank you for choosing MedCore Hospital.</p><p>This is a computer-generated receipt.</p></div></div><script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},500)}</script></body></html>`;
    const win = window.open('','_blank','width=600,height=800');
    win.document.write(html); win.document.close();
  },

  printPatientHistory(patientId) {
    const p = this.getPatient(patientId); if(!p) return;
    const appts = this.getPatientAppts(patientId);
    const rx = this.getPatientRx(patientId);
    const labs = this.getPatientLabs(patientId);
    const bills = this.getPatientBills(patientId);
    const now = new Date().toLocaleString('en-IN');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Patient Medical History - ${p.name}</title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px;background:#f8fafc}
      .report{background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);max-width:900px;margin:0 auto}
      .header{display:flex;justify-content:space-between;border-bottom:3px solid #3b82f6;padding-bottom:20px;margin-bottom:30px}
      .hosp-name{font-size:24px;font-weight:800;color:#1e3a8a}
      .section{margin-bottom:30px}
      .section-title{font-size:16px;font-weight:700;color:#3b82f6;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin-bottom:15px}
      .info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:20px}
      .info-item label{display:block;font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px}
      .info-item div{font-size:14px;font-weight:600}
      .history-table{width:100%;border-collapse:collapse;font-size:13px}
      .history-table th{text-align:left;padding:10px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;color:#475569}
      .history-table td{padding:10px;border-bottom:1px solid #f8fafc}
      .footer{margin-top:50px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px}
      @media print{body{padding:0;background:#fff}.report{box-shadow:none;border:none;max-width:100%}}
    </style></head><body><div class="report"><div class="header"><div><div class="hosp-name">🏥 MedCore HMS</div><div style="font-size:12px;color:#64748b">Comprehensive Medical Report</div></div><div style="text-align:right"><div style="font-size:14px;font-weight:700">Patient History Record</div><div style="font-size:11px;color:#94a3b8">Generated: ${now}</div></div></div><div class="section"><div class="section-title">Patient Information</div><div class="info-grid"><div class="info-item"><label>Full Name</label><div>${p.name}</div></div><div class="info-item"><label>Patient ID</label><div>${p.id}</div></div><div class="info-item"><label>Age / Gender</label><div>${p.age}y / ${p.gender}</div></div><div class="info-item"><label>Blood Group</label><div>${p.blood}</div></div><div class="info-item"><label>Phone</label><div>${p.phone}</div></div><div class="info-item"><label>Insurance ID</label><div>${p.insuranceId||'N/A'}</div></div></div></div><div class="section"><div class="section-title">Clinical History</div><table class="history-table"><thead><tr><th>Date</th><th>Consultation/Event</th><th>Summary/Notes</th></tr></thead><tbody>${appts.map(a=>`<tr><td style="white-space:nowrap">${this.fmt.date(a.date)}</td><td><strong>${a.type}</strong><br><small>Dr. ${this.getDoctor(a.doctorId)?.name||'—'}</small></td><td>${a.notes||'—'}</td></tr>`).join('')}</tbody></table></div><div class="section"><div class="section-title">Medications (Rx)</div><table class="history-table"><thead><tr><th>Date</th><th>Medications Provided</th></tr></thead><tbody>${rx.map(r=>`<tr><td style="white-space:nowrap">${this.fmt.date(r.date)}</td><td>${r.drugs.map(d=>`<div>• ${d.name} (${d.dose}) — ${d.frequency}</div>`).join('')}</td></tr>`).join('')}</tbody></table></div><div class="section"><div class="section-title">Lab Results</div><table class="history-table"><thead><tr><th>Date</th><th>Test</th><th>Result Summary</th></tr></thead><tbody>${labs.map(l=>`<tr><td style="white-space:nowrap">${this.fmt.date(l.date)}</td><td>${l.test}</td><td>${Object.entries(l.results).map(([k,v])=>`${k}: ${v}`).join(', ')}</td></tr>`).join('')}</tbody></table></div><div class="footer"><p>© MedCore Hospital Management System · Confidential Medical Record</p></div></div><script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},500)}</script></body></html>`;
    const win = window.open('','_blank','width=900,height=1000');
    win.document.write(html); win.document.close();
  },

  deleteUser(id) {
    const u = this.users.find(x => x.id === id);
    if(!u) return;
    this.users = this.users.filter(x => x.id !== id);
    if(u.role === 'doctor') {
      this.doctors = this.doctors.filter(d => d.id !== u.doctorId);
    } else if (u.role === 'staff') {
      this.staff = this.staff.filter(s => s.id !== u.staffId);
    }
    this.saveData();
  },
  logout() { this.currentUser = null; localStorage.removeItem('hms_user'); },
  loadSession() {
    const s = localStorage.getItem('hms_user');
    if (s) {
      this.currentUser = JSON.parse(s);
      if (this.currentUser.role === 'admin' && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        // If the user navigates back to index.html via the browser back button, 
        // forcibly log them out so they are not trapped in a redirect loop.
        this.currentUser = null;
        localStorage.removeItem('hms_user');
        return null;
      }
    }
    return this.currentUser;
  },
  fmt: {
    date(d) { return d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'; },
    currency(n) { return '₹' + Number(n).toLocaleString('en-IN'); },
    time(t) { if(!t) return '—'; const [h,m]=t.split(':'); const hr=+h; return `${hr>12?hr-12:hr}:${m} ${hr>=12?'PM':'AM'}`; }
  },
  saveData() {
    localStorage.setItem('hms_users', JSON.stringify(this.users));
    localStorage.setItem('hms_doctors', JSON.stringify(this.doctors));
    localStorage.setItem('hms_staff', JSON.stringify(this.staff));
    localStorage.setItem('hms_patients', JSON.stringify(this.patients));
    localStorage.setItem('hms_beds', JSON.stringify(this.beds));
    localStorage.setItem('hms_bills', JSON.stringify(this.bills));
    localStorage.setItem('hms_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('hms_prescriptions', JSON.stringify(this.prescriptions));
    localStorage.setItem('hms_labResults', JSON.stringify(this.labResults));
    localStorage.setItem('hms_notes', JSON.stringify(this.notes));
    localStorage.setItem('hms_appointments', JSON.stringify(this.appointments));
  }
};

// Initialize persistence across all portals
(function(){
  const load = (key, prop) => { const s = localStorage.getItem(key); if(s) HMS[prop] = JSON.parse(s); };
  load('hms_users', 'users');
  
  // Ensure Admin user is injected if localStorage has an old cache
  let admin = HMS.users.find(u => u.role === 'admin');
  if (!admin) {
    HMS.users.unshift({ id:'U_ADM', name:'Vishal', role:'admin', email:'vishalingle3265@gmail.com', password:'vishal123', avatar:'V' });
  } else {
    // ALWAYS force override if admin exists to prevent credential desync
    admin.email = 'vishalingle3265@gmail.com';
    admin.password = 'vishal123';
    admin.name = 'Vishal';
    admin.avatar = 'V';
  }
  localStorage.setItem('hms_users', JSON.stringify(HMS.users));

  load('hms_doctors', 'doctors');
  load('hms_staff', 'staff');
  load('hms_patients', 'patients');
  load('hms_beds', 'beds');
  load('hms_bills', 'bills');
  load('hms_inventory', 'inventory');
  load('hms_prescriptions', 'prescriptions');
  load('hms_labResults', 'labResults');
  load('hms_notes', 'notes');
  load('hms_appointments', 'appointments');
})();

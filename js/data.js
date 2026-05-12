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
  printPrescription(rxId) {
    const rx = this.prescriptions.find(r => r.id === rxId);
    if (!rx) return;
    const patient = this.getPatient(rx.patientId) || {};
    const doctor = this.getDoctor(rx.doctorId) || {};
    
    // SVG for Caduceus symbol (simplified version)
    const caduceusSvg = `<svg viewBox="0 0 100 100" class="caduceus"><path d="M50 10 C50 10, 45 30, 30 30 C15 30, 20 50, 40 50 C30 60, 25 80, 50 90 C75 80, 70 60, 60 50 C80 50, 85 30, 70 30 C55 30, 50 10, 50 10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="8" r="4" fill="currentColor"/><path d="M48 10 L48 90 L52 90 L52 10 Z" fill="currentColor"/><path d="M30 30 Q20 20 40 25 M70 30 Q80 20 60 25" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 40 Q5 30 30 20 M80 40 Q95 30 70 20" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Prescription - ${patient.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .rx-pad { max-width: 800px; margin: 20px auto; padding: 40px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); position: relative; overflow: hidden; min-height: 1000px; display: flex; flex-direction: column; }
        .bg-shape { position: absolute; top: -50px; left: -50px; width: 400px; height: 150px; background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-radius: 50%; z-index: 0; }
        .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.03; width: 400px; z-index: 0; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; margin-bottom: 40px; }
        .doc-name { font-size: 28px; font-weight: 700; color: #2563eb; margin: 0 0 4px 0; }
        .doc-qual { font-size: 14px; letter-spacing: 2px; color: #4b5563; text-transform: uppercase; margin: 0; }
        .doc-cert { font-size: 11px; color: #9ca3af; margin-top: 16px; }
        .caduceus { width: 80px; height: 80px; color: #2563eb; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; position: relative; z-index: 1; font-size: 13px; }
        .info-row { display: flex; align-items: baseline; }
        .info-label { width: 90px; color: #6b7280; font-weight: 600; }
        .info-val { flex: 1; border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; padding-left: 8px; color: #111827; }
        .rx-symbol { font-size: 48px; color: #2563eb; font-weight: bold; font-family: serif; margin-bottom: 24px; position: relative; z-index: 1; }
        .drugs-list { flex: 1; position: relative; z-index: 1; padding-left: 16px; }
        .drug-item { margin-bottom: 20px; }
        .drug-name { font-weight: 700; font-size: 16px; color: #111827; }
        .drug-sig { font-size: 14px; color: #4b5563; margin-top: 4px; line-height: 1.5; }
        .notes { font-size: 13px; color: #4b5563; margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e5e7eb; }
        .signature-area { display: flex; justify-content: flex-end; margin-top: 60px; position: relative; z-index: 1; }
        .signature-line { width: 200px; border-top: 1px solid #9ca3af; text-align: center; padding-top: 8px; font-size: 12px; color: #6b7280; }
        .footer { display: flex; justify-content: space-between; align-items: center; background: #eff6ff; padding: 20px 30px; margin: 40px -40px -40px -40px; font-size: 12px; color: #4b5563; border-left: 6px solid #2563eb; position: relative; z-index: 1; }
        .footer-cols { display: flex; gap: 40px; }
        .footer-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .h-logo { font-size: 20px; font-weight: 700; color: #2563eb; margin-bottom: 2px; }
        .h-slogan { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .rx-pad { box-shadow: none; margin: 0; min-height: auto; padding: 20px; }
          .bg-shape, .footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="rx-pad">
        <div class="bg-shape"></div>
        <div class="watermark">${caduceusSvg}</div>
        
        <div class="header">
          <div>
            <h1 class="doc-name">${doctor.name || 'Doctor Name'}</h1>
            <p class="doc-qual">${doctor.specialty || 'General Practitioner'}</p>
            <p class="doc-cert">Reg No: ${doctor.id || '12548-20'}</p>
          </div>
          <div>${caduceusSvg}</div>
        </div>
        
        <div class="patient-info">
          <div class="info-row" style="grid-column: 1 / -1"><div class="info-label">Patient Name:</div><div class="info-val">${patient.name || '—'}</div></div>
          <div class="info-row" style="grid-column: 1 / -1"><div class="info-label">Address:</div><div class="info-val">${patient.address || '—'}</div></div>
          <div class="info-row"><div class="info-label">Age/Sex:</div><div class="info-val">${patient.age || '—'}y / ${patient.gender || '—'}</div></div>
          <div class="info-row"><div class="info-label">Date:</div><div class="info-val">${this.fmt.date(rx.date)}</div></div>
          <div class="info-row" style="grid-column: 1 / -1"><div class="info-label">Diagnosis:</div><div class="info-val">${patient.conditions ? patient.conditions.join(', ') : '—'}</div></div>
        </div>
        
        <div class="rx-symbol">Rx</div>
        
        <div class="drugs-list">
          ${rx.drugs.map(d => `
            <div class="drug-item">
              <div class="drug-name">${d.name} ${d.dose}</div>
              <div class="drug-sig">Sig: ${d.frequency} for ${d.duration}</div>
            </div>
          `).join('')}
          ${rx.notes ? `<div class="notes"><strong>Advise:</strong> ${rx.notes}</div>` : ''}
        </div>
        
        <div class="signature-area">
          <div class="signature-line">SIGNATURE</div>
        </div>
        
        <div class="footer">
          <div>
            <div class="h-logo">MEDCORE</div>
            <div class="h-slogan">Advanced Healthcare</div>
          </div>
          <div class="footer-cols">
            <div>
              <div class="footer-row"><span style="color:#2563eb">📞</span> +91-98002-00000</div>
              <div class="footer-row"><span style="color:#2563eb">📍</span> 123 Healthcare Ave, City</div>
            </div>
            <div>
              <div class="footer-row"><span style="color:#2563eb">✉️</span> info@medcore.in</div>
              <div class="footer-row"><span style="color:#2563eb">🌐</span> www.medcore.in</div>
            </div>
          </div>
        </div>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
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

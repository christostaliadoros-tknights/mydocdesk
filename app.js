// ============================================================================
// MyDocDesk / MyDocDeskAI — Interactive AI Medical Receptionist & Triage Engine
// ============================================================================

const SCHEDULE_SLOTS_BY_SPECIALTY = {
  pediatrics: [
    {
      id: "slot-0930",
      time: "09:30 AM",
      patient: "Eleni Stavrou (Age 6)",
      phone: "+357 99 310 422",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "Persistent dry cough (5 days), afebrile, eating well",
      notes: "GeSY & Private (#812044) • Lungs auscultation requested; no shortness of breath.",
      channel: "WhatsApp Text"
    },
    {
      id: "slot-1030",
      time: "10:30 AM",
      patient: "Nikolas Georgiou (Age 2)",
      phone: "+357 97 820 119",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "18-month scheduled vaccination & growth check",
      notes: "GeSY & Private (#604118) • Child health booklet brought by parents.",
      channel: "Phone Call"
    },
    {
      id: "slot-1230",
      time: "12:30 PM (EMERGENCY BUFFER)",
      patient: "Leo K. (Age 4) — Maria K.",
      phone: "+357 99 614 280",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • URGENT BUFFER UNLOCKED",
      complaint: "39.6°C fever since 22:00 last night + acute right ear pain & lethargy",
      notes: "GeSY & Private (#948201) • Red-flag screen: No neck stiffness, no breathing distress. Given Nurofen at 07:30. Photo of tympanic thermometer attached on WhatsApp.",
      channel: "Call → WhatsApp Handoff"
    },
    {
      id: "slot-1530",
      time: "03:30 PM",
      patient: "Sophia Christodoulou (Age 9)",
      phone: "+357 99 501 774",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • PHOTO TRIAGED",
      complaint: "Mild viral exanthem / forearm rash (48h) — High-res photo attached",
      notes: "GeSY & Private • AI attached forearm photo to calendar event so Dr. Andreas Nicolaou can review before arrival.",
      channel: "WhatsApp Photo Triage"
    },
    {
      id: "slot-1330-busy",
      time: "01:30 PM – 02:30 PM (MULTI-CALENDAR BUSY HOLD)",
      patient: "🔒 Personal & Hospital Rounds Hold (Read-Only Sync)",
      phone: "Google Calendar + Outlook Busy-Read",
      priority: -1,
      calLayer: "busy_hold",
      calBadge: "🔒 Personal / Surgery Busy Hold",
      prioLabel: "🔒 BUSY HOLD • ZERO DOUBLE-BOOKING",
      complaint: "Synced from Dr. Andreas Nicolaou's Personal & Limassol Hospital Rounds Calendar (Private event title hidden)",
      notes: "Anastasia reads busy blocks across all connected calendars so she never books over hospital rounds or family pickup.",
      channel: "Multi-Calendar Read"
    },
    {
      id: "slot-1700",
      time: "05:00 PM (EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Urgent Cases Only",
      phone: "Hidden from routine public booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED BUFFER SLOT",
      complaint: "Automatically unlocked by Anastasia only if an acute Priority 1 patient calls",
      notes: "Prevents routine checkups from consuming same-day emergency capacity.",
      channel: "AI Triage Guard"
    }
  ],

  dental: [
    {
      id: "slot-0930-dent",
      time: "09:30 AM (45m TREATMENT BLOCK)",
      patient: "Kyriakos Andreou (Age 44)",
      phone: "+357 99 412 880",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • 45m ROOT CANAL / CROWN PREP",
      complaint: "Endodontic retreatment & zirconia crown preparation — Lower Left Molar (#36)",
      notes: "GeSY & Private • Pre-visit periapical X-ray attached to chart; local anesthesia tray prepped in Exam Room 1.",
      channel: "Phone Call → WhatsApp"
    },
    {
      id: "slot-1100-dent",
      time: "11:00 AM (60m IMPLANT CONSULT)",
      patient: "Christina Panayiotou (Age 52)",
      phone: "+357 97 605 319",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • 60m IMPLANT & CBCT",
      complaint: "Single-tooth titanium implant consultation & 3D CBCT scan review (#25)",
      notes: "GeSY & Private • CBCT DICOM link received via WhatsApp intake prior to arrival.",
      channel: "WhatsApp Intake"
    },
    {
      id: "slot-1230-dent",
      time: "12:30 PM (30m CHAIRSIDE EMERGENCY BUFFER)",
      patient: "Dimitris A. (Age 38)",
      phone: "+357 99 845 120",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • DENTAL EMERGENCY + PHOTO",
      complaint: "Fractured upper-right premolar porcelain crown (#14) + 8/10 acute thermal toothache",
      notes: "GeSY & Private • Smartphone photo (tooth_fracture_UR4.jpg) attached. No facial swelling or fever. Nurse alerted to prep temporary crown cement & composite bonding tray.",
      channel: "Call → WhatsApp Photo Handoff"
    },
    {
      id: "slot-1500-dent",
      time: "03:00 PM (30m HYGIENE & SCALING)",
      patient: "Natalia Georgiadou (Age 29)",
      phone: "+357 99 118 402",
      priority: 2,
      prioLabel: "🟢 PRIORITY 3 • 30m SCALING",
      complaint: "6-month routine ultrasonic scaling, airflow polishing & annual GeSY preventive checkup",
      notes: "GeSY & Private • Routed to non-peak afternoon hygiene slot to preserve morning surgery hours.",
      channel: "WhatsApp Booking"
    },
    {
      id: "slot-1330-dent-busy",
      time: "01:30 PM – 02:30 PM (MULTI-CALENDAR BUSY HOLD)",
      patient: "🔒 Dental Lab & Personal Calendar Busy Hold (Read-Only Sync)",
      phone: "Google Calendar + Clinic PMS Busy-Read",
      priority: -1,
      calLayer: "busy_hold",
      calBadge: "🔒 Personal / Surgery Busy Hold",
      prioLabel: "🔒 BUSY HOLD • ZERO DOUBLE-BOOKING",
      complaint: "Synced from Dr. Nikos Constantinou's Personal & Prosthodontic Lab Calendar (Private details hidden)",
      notes: "Anastasia reads busy blocks across all connected calendars so chairside slots never conflict with personal or surgical blocks.",
      channel: "Multi-Calendar Read"
    },
    {
      id: "slot-1700-dent",
      time: "05:00 PM (30m CHAIRSIDE EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Acute Dental Trauma / Swelling",
      phone: "Hidden from routine hygiene booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED DENTAL BUFFER",
      complaint: "Unlocked by Anastasia only for acute pulpitis, avulsed/fractured teeth, or facial swelling",
      notes: "Protects high-margin same-day emergency chair time from routine cleanings.",
      channel: "AI Triage Guard"
    }
  ],

  dermatology: [
    {
      id: "slot-0930-derm",
      time: "09:30 AM (30m DERMOSCOPY)",
      patient: "Marilena Christou (Age 37)",
      phone: "+357 99 245 810",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • MOLE MAPPING & PHOTO",
      complaint: "Annual full-body digital dermoscopy & pigmented lesion check (2 macro photos attached)",
      notes: "GeSY & Private (#714902) • Baseline dermoscopy images synced to Dr. Elena Georgiou's chart.",
      channel: "WhatsApp Photo Triage"
    },
    {
      id: "slot-1015-derm",
      time: "10:15 AM (PHOTO TRIAGED)",
      patient: "Andreas M. (Age 34)",
      phone: "+357 99 208 511",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • RASH + WHATSAPP PHOTO",
      complaint: "Spreading erythematous pruritic rash on right forearm (48h) — High-res photo attached",
      notes: "GeSY & Private (#839104) • Afebrile, no mucosal involvement. Photo (forearm_rash_day2.jpg) pre-attached for Dr. Elena Georgiou.",
      channel: "WhatsApp Voice + Photo"
    },
    {
      id: "slot-1230-derm",
      time: "12:30 PM (EMERGENCY BUFFER)",
      patient: "Katerina V. (Age 26)",
      phone: "+357 97 512 908",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • ACUTE URTICARIA / FLARE",
      complaint: "Acute widespread urticaria / angioedema flare around eyelids (started 3h ago)",
      notes: "GeSY & Private (#650219) • Red-flag screen: No airway/tongue swelling or dyspnea. Facial photo attached on WhatsApp.",
      channel: "Call → WhatsApp Handoff"
    },
    {
      id: "slot-1530-derm",
      time: "03:30 PM (CRYOTHERAPY / BIOPSY)",
      patient: "Yiannis Lazarou (Age 61)",
      phone: "+357 99 883 104",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • PROCEDURE BLOCK",
      complaint: "Actinic keratosis cryotherapy follow-up & temple lesion evaluation",
      notes: "GeSY & Private (#402918) • Cryotherapy tray flagged for Exam Room 1.",
      channel: "Phone Call"
    },
    {
      id: "slot-1330-derm-busy",
      time: "01:30 PM – 02:30 PM (MULTI-CALENDAR BUSY HOLD)",
      patient: "🔒 Personal & Hospital Ward Consults Hold (Read-Only Sync)",
      phone: "Google Calendar + Outlook Busy-Read",
      priority: -1,
      calLayer: "busy_hold",
      calBadge: "🔒 Personal / Surgery Busy Hold",
      prioLabel: "🔒 BUSY HOLD • ZERO DOUBLE-BOOKING",
      complaint: "Synced from Dr. Elena Georgiou's Personal & Inpatient Consult Calendar (Private event title hidden)",
      notes: "Anastasia reads busy blocks across all connected calendars while writing AI bookings only to the Anastasia AI sub-calendar.",
      channel: "Multi-Calendar Read"
    },
    {
      id: "slot-1700-derm",
      time: "05:00 PM (EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Acute Drug Rash / Infection",
      phone: "Hidden from routine cosmetic booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED BUFFER SLOT",
      complaint: "Unlocked by Anastasia only for acute dermatological flares, herpes zoster, or severe allergic rashes",
      notes: "Keeps same-day urgent capacity open for Dr. Elena Georgiou.",
      channel: "AI Triage Guard"
    }
  ],

  cardiology: [
    {
      id: "slot-0930-card",
      time: "09:30 AM (45m ECHO + ECG)",
      patient: "Savvas Antoniou (Age 63)",
      phone: "+357 99 309 441",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • TRANSTHORACIC ECHO",
      complaint: "Exertional dyspnea on stairs (2 weeks) + baseline ECG & Echocardiogram",
      notes: "GeSY & Private (#338190) • Recent lipid panel & troponin PDF uploaded via WhatsApp prior to visit.",
      channel: "Phone Call → WhatsApp"
    },
    {
      id: "slot-1100-card",
      time: "11:00 AM (HOLTER REVIEW)",
      patient: "Androulla Kyriakou (Age 57)",
      phone: "+357 97 741 205",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • 24H HOLTER & BP LOG",
      complaint: "Intermittent palpitations — 24h Holter monitor readout & medication titration",
      notes: "GeSY & Private (#519082) • 7-day home blood pressure log sent via WhatsApp.",
      channel: "WhatsApp Intake"
    },
    {
      id: "slot-1230-card",
      time: "12:30 PM (EMERGENCY BUFFER)",
      patient: "Petros Charalambous (Age 68)",
      phone: "+357 99 618 700",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • ACUTE ARRHYTHMIA / BP SPIKE",
      complaint: "New-onset irregular rapid pulse (132 bpm on Apple Watch ECG) + BP 184/106 mmHg",
      notes: "GeSY & Private (#294011) • Red-flag screen: No crushing chest pain or syncope. Apple Watch ECG PDF attached for Dr. Marios Petrou.",
      channel: "Call → WhatsApp Handoff"
    },
    {
      id: "slot-1530-card",
      time: "03:30 PM (PRE-OP CLEARANCE)",
      patient: "Giorgos Michaelides (Age 71)",
      phone: "+357 99 490 112",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • CARDIAC CLEARANCE",
      complaint: "Pre-operative cardiology clearance & ECG prior to orthopedic knee surgery",
      notes: "GeSY & Private (#118490) • Blood work & anesthesiology checklist attached.",
      channel: "WhatsApp Booking"
    },
    {
      id: "slot-1330-card-busy",
      time: "01:30 PM – 02:30 PM (MULTI-CALENDAR BUSY HOLD)",
      patient: "🔒 Cath Lab & Personal Calendar Busy Hold (Read-Only Sync)",
      phone: "Google Calendar + Hospital Rounds Busy-Read",
      priority: -1,
      calLayer: "busy_hold",
      calBadge: "🔒 Personal / Surgery Busy Hold",
      prioLabel: "🔒 BUSY HOLD • ZERO DOUBLE-BOOKING",
      complaint: "Synced from Dr. Marios Petrou's Hospital Cath Lab & Personal Google Calendar (Private details hidden)",
      notes: "Anastasia checks all connected calendars for real availability and writes AI bookings onto a dedicated color-coded sub-calendar.",
      channel: "Multi-Calendar Read"
    },
    {
      id: "slot-1700-card",
      time: "05:00 PM (EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Urgent Cardiac Cases",
      phone: "Hidden from routine checkup booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED BUFFER SLOT",
      complaint: "Note: Costas Papadopoulos (GeSY #449102) BP refill was routed to the Async GeSY Queue — saving a 20m slot!",
      notes: "Protects Dr. Marios Petrou's same-day urgent ECG/Echo capacity.",
      channel: "AI Triage Guard"
    }
  ]
};

// Additional routine bookings so each demo day shows a realistic, fully counted schedule
// (headline KPIs and calendar-layer counts are computed from these slots at render time).
function mkSlot(id, time, patient, phone, layer, complaint, notes, channel, prioLabel) {
  return {
    id, time, patient, phone, priority: 2, calLayer: layer,
    prioLabel: prioLabel || (layer === "clinic_main" ? "⚪ ROUTINE • BOOKED AT CLINIC DESK" : "🟡 PRIORITY 2 • STANDARD"),
    complaint, notes, channel
  };
}
const EXTRA_SCHEDULE_SLOTS = {
  pediatrics: [
    mkSlot("slot-0830", "08:30 AM", "Andreas Michael (Age 7)", "+357 99 228 341", "clinic_main", "School sports medical certificate", "GeSY & Private (#530917) • Booked by clinic desk last week; no symptoms reported.", "Clinic Desk"),
    mkSlot("slot-1100", "11:00 AM", "Maria Charalambous (Age 3)", "+357 96 410 572", "ai_subcal", "Low-grade fever 37.8°C (2 days) + tugging left ear, drinking well", "GeSY & Private (#771230) • Red-flag screen negative; parent sending temperature log on WhatsApp.", "WhatsApp Voice Note"),
    mkSlot("slot-1145", "11:45 AM", "Christina Pavlou (Age 1)", "+357 99 873 015", "clinic_main", "12-month vaccination (MMR) & growth check", "GeSY & Private (#118462) • Vaccination booklet requested at check-in.", "Clinic Desk"),
    mkSlot("slot-1600", "04:00 PM", "Giorgos Antoniou (Age 11)", "+357 97 662 108", "ai_subcal", "Ankle sprain follow-up (football, 6 days ago) — swelling reducing", "GeSY & Private (#402985) • Anastasia attached the parent's photo of the ankle to the event.", "WhatsApp Photo Triage")
  ],
  dental: [
    mkSlot("slot-0830", "08:30 AM", "Eleni Kyriakou (Age 45)", "+357 99 340 218", "clinic_main", "6-month hygiene recall: scale & polish", "Private • Booked by clinic desk; no pain reported.", "Clinic Desk", "🟢 PRIORITY 3 • 30m HYGIENE"),
    mkSlot("slot-1000", "10:00 AM", "Panayiotis Ioannou (Age 52)", "+357 96 118 704", "ai_subcal", "Lost old amalgam filling (LL6), mild cold sensitivity, no swelling", "GeSY & Private (#660413) • 45m restorative slot; patient avoids chewing on left side.", "Phone Call"),
    mkSlot("slot-1145", "11:45 AM", "Stella Neophytou (Age 16)", "+357 97 250 991", "clinic_main", "Orthodontic wire adjustment (monthly)", "Private • Parent consent on file.", "Clinic Desk"),
    mkSlot("slot-1600", "04:00 PM", "Michalis Theodorou (Age 61)", "+357 99 805 336", "ai_subcal", "Implant consultation — missing UL5, CBCT scan uploaded", "Private • Anastasia attached the CBCT report from WhatsApp to the event.", "WhatsApp Document")
  ],
  dermatology: [
    mkSlot("slot-0830", "08:30 AM", "Katerina Hadjiantoni (Age 39)", "+357 99 471 203", "clinic_main", "Annual full-body mole mapping", "GeSY & Private (#245718) • Booked by clinic desk; family history of melanoma noted.", "Clinic Desk"),
    mkSlot("slot-1100", "11:00 AM", "Nikos Evangelou (Age 19)", "+357 96 337 860", "ai_subcal", "Acne follow-up — isotretinoin month 3, blood results attached", "GeSY & Private (#902611) • Lab PDF attached to the calendar event via WhatsApp.", "WhatsApp Document"),
    mkSlot("slot-1200", "12:00 PM", "Androulla Savva (Age 57)", "+357 99 560 144", "clinic_main", "Cryotherapy for hand warts (2nd session)", "Private • 15m procedure slot.", "Clinic Desk"),
    mkSlot("slot-1600", "04:00 PM", "Petros Georgiades (Age 48)", "+357 97 218 433", "ai_subcal", "New pigmented lesion on upper back — photo attached", "GeSY & Private (#318820) • Anastasia flagged change in size reported by spouse; photo on event.", "WhatsApp Photo Triage")
  ],
  cardiology: [
    mkSlot("slot-0830", "08:30 AM", "Yiannis Kallis (Age 66)", "+357 99 612 078", "clinic_main", "Hypertension follow-up: ECG + BP review", "GeSY & Private (#507342) • Home BP diary to bring.", "Clinic Desk"),
    mkSlot("slot-1000", "10:00 AM", "Anna Demetriou (Age 44)", "+357 96 903 251", "ai_subcal", "Intermittent palpitations — 24h Holter results uploaded", "GeSY & Private (#681204) • No chest pain or syncope on red-flag screen.", "WhatsApp Document"),
    mkSlot("slot-1145", "11:45 AM", "Loizos Constantinou (Age 70)", "+357 99 144 690", "clinic_main", "Pre-operative cardiac clearance (knee replacement)", "GeSY & Private (#209877) • Surgeon's referral letter on file.", "Clinic Desk"),
    mkSlot("slot-1600", "04:00 PM", "Rena Christou (Age 58)", "+357 97 488 512", "ai_subcal", "Echo follow-up — mild mitral regurgitation", "GeSY & Private (#734016) • Previous echo report attached.", "Phone Call")
  ]
};
Object.keys(EXTRA_SCHEDULE_SLOTS).forEach((k) => {
  if (SCHEDULE_SLOTS_BY_SPECIALTY[k]) SCHEDULE_SLOTS_BY_SPECIALTY[k].push(...EXTRA_SCHEDULE_SLOTS[k]);
});

Object.keys(SCHEDULE_SLOTS_BY_SPECIALTY).forEach((k) => {
  SCHEDULE_SLOTS_BY_SPECIALTY[k].forEach((s) => { s.spec = k; });
});

// ---------------------------------------------------------------------------
// Display-time localisation helpers (data stays in English for logic/sorting)
// ---------------------------------------------------------------------------
function fmtTime(t) {
  if (!isGreekUI() || !t) return t;
  const to24 = (str) =>
    str.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_, h, m, ap) => {
      let hh = Number(h) % 12;
      if (ap.toUpperCase() === "PM") hh += 12;
      return `${String(hh).padStart(2, "0")}:${m}`;
    });
  const m = /^(.*?)(\s*\((.+)\))?$/.exec(t);
  const base = to24(m[1]);
  const suffix = m[3] ? ` (${tr(m[3])})` : "";
  return base + suffix;
}

function slotView(s) {
  const el = isGreekUI() && window.SCHEDULE_EL ? window.SCHEDULE_EL[`${s.spec}/${s.id}`] : null;
  if (!isGreekUI()) return s;
  return {
    ...s,
    time: fmtTime(s.time),
    patient: el ? el[0] : tr(s.patient),
    complaint: el ? el[1] : tr(s.complaint),
    notes: el ? el[2] : tr(s.notes),
    phone: tr(s.phone),
    prioLabel: tr(s.prioLabel),
    channel: tr(s.channel)
  };
}

function clinicView(c) {
  if (!isGreekUI() || !c) return c;
  const preset = window.CLINIC_EL && window.CLINIC_EL[c.id];
  if (preset) return { ...c, ...preset };
  return {
    ...c,
    clinicTitle: c.clinicTitle.replace("Specialist Clinic", "Ιατρείο Ειδικότητας"),
    specialty: tr(c.specialty),
    city: tr(c.city),
    coverage: tr(c.coverage),
    roomLabel: tr(c.roomLabel || "Exam Room 1")
  };
}

function docName() {
  return clinicView(state.activeClinic).doctorName;
}

function slotStartMinutes(timeStr) {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(timeStr || "");
  if (!m) return 9999;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
}

const state = {
  brandKey: "mydocdesk", // 'mydocdesk' | 'mydocdeskai'
  iconKey: "schedule_gold", // 'schedule_navy' | 'schedule_gold' | 'bell' | 'cross'
  voiceAudioEnabled: false,
  guidedTimer: null,
  activeClinic: {
    id: "pediatrics",
    doctorName: "Dr. Andreas Nicolaou",
    clinicTitle: "Dr. Andreas Nicolaou — Pediatrics",
    specialty: "Pediatrics",
    city: "Limassol",
    coverage: "GeSY & Private",
    phone: "+357 25 340 110",
    roomLabel: "Exam Room 1"
  },
  activeScenarioKey: "urgent_fever",
  activeScheduleLayer: "all",
  micLang: "en-US",
  scheduleSlots: SCHEDULE_SLOTS_BY_SPECIALTY.pediatrics.map((s) => ({ ...s })),
  gesyQueue: [
    {
      id: "gesy-1",
      patient: "Costas Papadopoulos (Age 58)",
      gesyId: "GeSY #449102",
      request: "Monthly refill: Amlodipine 5mg + Atorvastatin 20mg (6-month chronic renewal)",
      timeSaved: "Saved 15m slot",
      approved: false
    },
    {
      id: "gesy-2",
      patient: "Despina Ioannou (Age 41)",
      gesyId: "GeSY #772819",
      request: "Repeat referral to Ophthalmology (Annual diabetic retinal check)",
      timeSaved: "Saved 15m slot",
      approved: false
    },
    {
      id: "gesy-3",
      patient: "Michalis Kyprianou (Age 64)",
      gesyId: "GeSY #319004",
      request: "Routine CBC + Lipid Panel + HbA1c lab requisition before next month's visit",
      timeSaved: "Saved 15m slot",
      approved: false
    }
  ],
  marketplaceDoctors: [
    {
      id: "mp-doc-1",
      name: "Dr. Sample A",
      specialty: "Pediatrics",
      specialtyLabel: "👶 Pediatrics",
      city: "Limassol",
      area: "Sample clinic, Limassol",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 12:30 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 10:15 AM (Standard)", urgent: false },
        { label: "Tomorrow 04:00 PM (Standard)", urgent: false }
      ]
    },
    {
      id: "mp-doc-dental-1",
      name: "Dr. Sample B",
      specialty: "Dental",
      specialtyLabel: "🦷 Dentistry",
      city: "Limassol",
      area: "Sample clinic, Limassol",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 12:30 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 11:00 AM (45m Treatment)", urgent: false },
        { label: "Thu 03:00 PM (30m Scaling)", urgent: false }
      ]
    },
    {
      id: "mp-doc-2",
      name: "Dr. Sample C",
      specialty: "Dermatology",
      specialtyLabel: "🔬 Dermatology",
      city: "Nicosia",
      area: "Sample clinic, Nicosia",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 04:30 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 10:15 AM (Standard)", urgent: false },
        { label: "Thu 09:30 AM (Standard)", urgent: false }
      ]
    },
    {
      id: "mp-doc-3",
      name: "Dr. Sample D",
      specialty: "Cardiology",
      specialtyLabel: "❤️ Cardiology",
      city: "Larnaca",
      area: "Sample clinic, Larnaca",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 05:15 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 09:30 AM (Echo/ECG)", urgent: false },
        { label: "Tomorrow 11:00 AM (Standard)", urgent: false }
      ]
    },
    {
      id: "mp-doc-dental-2",
      name: "Dr. Sample E",
      specialty: "Dental",
      specialtyLabel: "🦷 Dentistry",
      city: "Nicosia",
      area: "Sample clinic, Nicosia",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 04:00 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 09:30 AM (45m Treatment)", urgent: false },
        { label: "Tomorrow 03:30 PM (30m Scaling)", urgent: false }
      ]
    },
    {
      id: "mp-doc-4",
      name: "Dr. Sample F",
      specialty: "Pediatrics",
      specialtyLabel: "👶 Pediatrics",
      city: "Nicosia",
      area: "Sample clinic, Nicosia",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 01:00 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 03:30 PM (Standard)", urgent: false }
      ]
    },
    {
      id: "mp-doc-5",
      name: "Dr. Sample G",
      specialty: "ENT",
      specialtyLabel: "👂 ENT / Otolaryngology",
      city: "Limassol",
      area: "Sample clinic, Limassol",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 02:15 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 11:30 AM (Standard)", urgent: false }
      ]
    },
    {
      id: "mp-doc-6",
      name: "Dr. Sample H",
      specialty: "Dermatology",
      specialtyLabel: "🔬 Dermatology",
      city: "Paphos",
      area: "Sample clinic, Paphos",
      coverage: "GeSY & Private",
      aiStatus: "Slots would sync from the doctor's MyDocDesk schedule",
      urgentBufferAvailable: false,
      slots: [
        { label: "Tomorrow 10:00 AM (Standard)", urgent: false },
        { label: "Tomorrow 02:30 PM (Standard)", urgent: false }
      ]
    }
  ]
};

// Predefined Rich Triage Scenarios
const SCENARIOS = {
  urgent_fever: {
    callerDisplay: "Patient Caller: Maria K. (+357 99 614 280)",
    statusLabel: "LIVE CALL • 🔴 PRIORITY 1 TRIAGE",
    caseId: "Case #MD-409",
    prioClass: "prio-1",
    prioPill: "🔴 PRIORITY 1 • URGENT SAME-DAY",
    prioHeadline: "Unlocks Hidden 12:30 PM Emergency Buffer Slot",
    coverage: "GeSY & Private (#948201)",
    callTurns: [
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Good morning, Dr. Andreas Nicolaou — Pediatrics. Dr. Nicolaou is currently examining a patient in Exam Room 1, so I am his AI Medical Receptionist Anastasia. How can I help your child today?"
      },
      {
        speaker: "Maria K. (Mother)",
        role: "caller",
        text: "Hi, my 4-year-old son Leo has had a 39.6°C fever since last night, he's pulling his right ear crying, and he's very lethargic this morning. Can Dr. Nicolaou see him today?"
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "I'm sorry Leo isn't feeling well. Let me quickly check 2 red-flag questions for Dr. Andreas Nicolaou: Is Leo breathing comfortably and able to drink fluids without neck stiffness?"
      },
      {
        speaker: "Maria K. (Mother)",
        role: "caller",
        text: "Yes, his breathing is normal and he drank water after Nurofen at 7:30 AM, just acute ear pain and high fever."
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Got it. Because of the 39.6°C fever and acute ear pain in a 4-year-old, I have flagged Leo as Priority 1 Urgent and unlocked Dr. Andreas Nicolaou's protected 12:30 PM Emergency Buffer Slot. I just sent the confirmation and pre-visit card to your WhatsApp!"
      }
    ],
    waMessages: [
      {
        dir: "incoming",
        html: `<strong>🩺 Priority 1 Urgent Slot Unlocked</strong><br/>Hello Maria! While we were on the phone, I prepared Leo's Pre-Visit Case Note for <strong>Dr. Andreas Nicolaou</strong> and unlocked today's protected emergency slot:<div class="wa-slot-card urgent"><div class="wa-slot-title">🔴 Today at 12:30 PM (Emergency Buffer Slot)</div><div style="font-size:0.72rem; color:#475569;">Patient: Leo K. (4y) • Chief Complaint: 39.6°C fever + acute right otalgia</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn urgent" onclick="confirmSuggestedSlot()">✓ Confirm 12:30 PM Urgent Slot</button><button type="button" class="wa-slot-btn secondary" onclick="simulatePatientPhotoUpload()">📷 Attach Thermometer / Ear Photo</button></div></div>`
      },
      {
        dir: "outgoing",
        html: `Thank you! Confirming 12:30 PM. GeSY ID is #948201.`
      },
      {
        dir: "incoming",
        html: `✅ <strong>Confirmed for Today at 12:30 PM!</strong><br/><strong>Dr. Andreas Nicolaou</strong> already has your 3-bullet Case Note on his screen:<br/>• <strong>Sx:</strong> 39.6°C fever (12h) + acute R ear pain<br/>• <strong>Meds:</strong> Nurofen given 07:30 AM<br/>• <strong>Red Flags:</strong> Negative (breathing normal, taking fluids)`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Leo K. (Age 4) • GeSY & Private (#948201)", full: false },
      { label: "Triage Score & Action", val: "🔴 P1 Urgent → Unlocked 12:30 PM Buffer", full: false },
      { label: "Chief Complaint & Duration", val: "39.6°C fever since 22:00 last night + acute right ear pain (otalgia) & lethargy", full: true },
      { label: "Red-Flag Screen & Meds", val: "✓ Breathing normal, drinking fluids, no neck stiffness. Last dose: Ibuprofen (Nurofen) at 07:30 AM.", full: true }
    ],
    logs: [
      "[10:14:02] SIP_INBOUND +35799614280 → Dr. Andreas Nicolaou in Exam Room 1 → AI Anastasia answered in 180ms",
      "[10:14:19] CLINICAL_INTAKE extracted: age=4y, temp=39.6C, sx=['acute_otalgia','lethargy'], red_flags=false",
      "[10:14:20] PRIORITY_ENGINE score=P1_URGENT (Rule: Pediatric Fever >39.0C + Acute Pain)",
      "[10:14:21] CALENDAR_GUARD unlocked hidden 12:30 PM Emergency Buffer Slot & pinned SOAP Note #MD-409"
    ]
  },

  dental_emergency: {
    callerDisplay: "Patient Caller: Dimitris A. (+357 99 845 120)",
    statusLabel: "LIVE CALL + PHOTO • 🔴 DENTAL P1 URGENT",
    caseId: "Case #MD-415",
    prioClass: "prio-1",
    prioPill: "🔴 PRIORITY 1 • 30-MIN EMERGENCY CHAIR SLOT",
    prioHeadline: "Unlocks 12:30 PM Emergency Relief Slot + Attaches Tooth Photo",
    coverage: "GeSY & Private (€120 Emergency / Crown Repair)",
    callTurns: [
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Good morning, Dr. Nikos Constantinou — Dentistry. Dr. Constantinou is currently in Exam Room 1 with gloves on mid-procedure, so I am his AI Medical Receptionist Anastasia. How can I help with your teeth today?"
      },
      {
        speaker: "Dimitris A. (Patient)",
        role: "caller",
        text: "Hi, I fractured my upper-right premolar crown biting something hard at breakfast and I have sharp throbbing pain—8 out of 10—whenever air or cold water touches it. I have client meetings all day tomorrow, can Dr. Constantinou see me today?"
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "I'm sorry you're in pain, Dimitris—let's get you into the chair today. Quick dental red-flag screen for Dr. Nikos Constantinou: Do you have any facial swelling spreading toward your eye or neck, fever, or uncontrolled bleeding? Also, can you snap a quick smartphone photo on WhatsApp so the dentist knows whether to prepare composite bonding or temporary crown cement?"
      },
      {
        speaker: "Dimitris A. (Patient)",
        role: "caller",
        text: "No facial swelling, no fever, and no bleeding—just the fractured crown piece and sharp sensitivity. I'll send a smartphone photo on WhatsApp right now."
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Perfect. I have triaged this as a Priority 1 Dental Emergency, unlocked Dr. Nikos Constantinou's protected 12:30 PM 30-Minute Emergency Chair Slot, and sent your WhatsApp confirmation and photo upload prompt so Exam Room 1 is prepped before you walk in!"
      }
    ],
    waMessages: [
      {
        dir: "outgoing",
        html: `📷 <strong>[Attached Photo: tooth_fracture_UR4.jpg]</strong><br/>Here is the fractured upper-right premolar (#14) and the porcelain crown piece.`
      },
      {
        dir: "incoming",
        html: `<strong>🦷 Priority 1 Dental Emergency Slot Unlocked (#MD-415)</strong><br/>Thank you Dimitris! I attached <code>tooth_fracture_UR4.jpg</code> to <strong>Dr. Nikos Constantinou</strong>'s calendar and locked your emergency relief slot:<div class="wa-slot-card urgent"><div class="wa-slot-title">🔴 Today at 12:30 PM (30-Min Emergency Chair Slot)</div><div style="font-size:0.72rem; color:#475569;">Patient: Dimitris A. • Tooth #14 Crown Fracture &amp; Acute Thermal Pain (8/10)</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn urgent" onclick="confirmSuggestedSlot()">✓ Confirm 12:30 PM Chair Slot</button><button type="button" class="wa-slot-btn secondary" onclick="simulatePatientPhotoUpload()">📷 Upload Extra X-Ray / Photo</button></div></div>`
      },
      {
        dir: "incoming",
        html: `✅ <strong>3-Bullet Dental SOAP Note Pinned for Dr. Nikos Constantinou:</strong><br/>• <strong>Tooth/Site:</strong> Upper Right Premolar (#14) — fractured porcelain crown<br/>• <strong>Pain/Pulp Status:</strong> 8/10 sharp thermal sensitivity, no facial swelling, no fever<br/>• <strong>Tray Prep:</strong> Temporary crown cement / composite bonding tray pre-flagged for nurse`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Dimitris A. (Age 38) • GeSY & Private (#MD-415)", full: false },
      { label: "Triage Score & Action", val: "🔴 P1 Urgent → Today 12:30 PM (30m Chair Slot)", full: false },
      { label: "Chief Complaint & Photo Intake", val: "Upper Right Premolar (#14) — fractured porcelain crown + 8/10 sharp thermal sensitivity. Smartphone photo attached (tooth_fracture_UR4.jpg).", full: true },
      { label: "Red-Flag Screen & Tray Prep", val: "✓ No facial swelling, no fever, no bleeding. Temporary crown cement / composite bonding tray pre-flagged for nurse in Exam Room 1.", full: true }
    ],
    logs: [
      "[10:29:04] SIP_INBOUND +35799845120 → Dr. Nikos Constantinou in Exam Room 1 (Gloves On) → AI Anastasia answered in 160ms",
      "[10:29:18] DENTAL_TRIAGE extracted: site=UR4_tooth_14, sx=['crown_fracture','thermal_pain_8_10'], swelling=false",
      "[10:29:22] WA_MEDIA_INGEST attached intraoral photo 'tooth_fracture_UR4.jpg' to Case #MD-415",
      "[10:29:23] CHAIR_SCHEDULER unlocked 12:30 PM (30m Emergency Chair Slot) & flagged nurse for Crown/Composite Tray"
    ]
  },

  soon_rash: {
    callerDisplay: "WhatsApp Intake: Andreas M. (+357 99 208 511)",
    statusLabel: "WHATSAPP PHOTO TRIAGE • 🟡 PRIORITY 2",
    caseId: "Case #MD-410",
    prioClass: "prio-2",
    prioPill: "🟡 PRIORITY 2 • SEE WITHIN 24–48H",
    prioHeadline: "Photo Pre-Attached • Booked Next Standard Slot (Tomorrow 10:15 AM)",
    coverage: "GeSY & Private (#839104)",
    callTurns: [
      {
        speaker: "Andreas M. (Patient Voice Note)",
        role: "caller",
        text: "🎙️ [WhatsApp Voice Note 0:14]: 'Hello Dr. Elena Georgiou's Dermatology clinic, I noticed a red circular rash on my forearm 2 days ago that is itchy and spreading slightly. No fever. Can I send a photo and book a check?'"
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Hello Andreas! You've reached Dr. Elena Georgiou — Dermatology. Because you have no fever, breathing issue, or facial swelling, I have triaged this as Priority 2 (Within 24–48h). Please send a clear photo of your forearm on WhatsApp so Dr. Georgiou can inspect it alongside your booking."
      }
    ],
    waMessages: [
      {
        dir: "outgoing",
        html: `📷 <strong>[Attached Image: forearm_rash_day2.jpg]</strong><br/>Here is the photo from this morning. It itches mildly, no fever.`
      },
      {
        dir: "incoming",
        html: `<strong>🩺 Photo Attached to Case Note #MD-410</strong><br/>Thank you Andreas! I attached your high-resolution photo directly to <strong>Dr. Elena Georgiou</strong>'s schedule card and reserved our next Priority 2 consultation slot:<div class="wa-slot-card"><div class="wa-slot-title">🟡 Tomorrow at 10:15 AM (Standard Priority 2 Slot)</div><div style="font-size:0.72rem; color:#475569;">Note: Today's 12:30 PM emergency slot stays protected for acute flares, while your photo is queued for Dr. Elena Georgiou's review today.</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn" onclick="confirmSuggestedSlot()">✓ Confirm Tomorrow 10:15 AM</button></div></div>`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Andreas M. (Age 34) • GeSY & Private (#839104)", full: false },
      { label: "Triage Score & Action", val: "🟡 P2 Soon → Tomorrow 10:15 AM + Photo", full: false },
      { label: "Chief Complaint & Media", val: "Erythematous pruritic rash on right forearm (48h duration). High-res photo attached (forearm_rash_day2.jpg).", full: true },
      { label: "Red-Flag Screen", val: "✓ Afebrile, no mucosal involvement, no anaphylaxis signs. Safe for 24h Dermatology slot with Dr. Elena Georgiou.", full: true }
    ],
    logs: [
      "[10:18:05] WA_VOICENOTE +35799208511 → Dr. Elena Georgiou in Exam Room 1 → Whisper ASR (320ms)",
      "[10:18:09] WA_MEDIA_INGEST saved 'forearm_rash_day2.jpg' to patient encounter #MD-410",
      "[10:18:10] PRIORITY_ENGINE score=P2_SOON (Protected 12:30 PM emergency slot; offered Tomorrow 10:15 AM)"
    ]
  },

  routine_gesy: {
    callerDisplay: "Patient Caller: Costas P. (+357 99 449 102)",
    statusLabel: "ASYNC GeSY FILTER • 🟢 PRIORITY 3",
    caseId: "Case #MD-411",
    prioClass: "prio-3",
    prioPill: "🟢 PRIORITY 3 • ASYNC GeSY QUEUE",
    prioHeadline: "Zero Calendar Slot Wasted • Added to 5-Min End-of-Day GeSY Batch",
    coverage: "GeSY & Private (#449102)",
    callTurns: [
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Good morning, Dr. Marios Petrou — Cardiology. Dr. Petrou is currently performing an echocardiogram in Exam Room 1, so I am his AI Medical Receptionist Anastasia. How can I assist you?"
      },
      {
        speaker: "Costas P. (Patient)",
        role: "caller",
        text: "Hello, I don't need an exam, I just need Dr. Petrou to renew my monthly GeSY blood pressure pills (Amlodipine 5mg) before I go to the pharmacy."
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "I can take care of that for Dr. Marios Petrou without making you come in or wait on hold! Confirming Costas Papadopoulos, GeSY ID #449102, Amlodipine 5mg + Atorvastatin 20mg. Any new dizziness, chest tightness, or blood pressure readings above 140/90?"
      },
      {
        speaker: "Costas P. (Patient)",
        role: "caller",
        text: "No, my pressure is 122/78 every morning."
      },
      {
        speaker: "Anastasia (AI Medical Receptionist)",
        role: "ai",
        text: "Perfect. I logged your BP reading (122/78) and added your renewal to Dr. Marios Petrou's 1-Click End-of-Day GeSY Approval Queue. You'll receive a WhatsApp message as soon as it's signed!"
      }
    ],
    waMessages: [
      {
        dir: "incoming",
        html: `<strong>🟢 GeSY Prescription Logged (#MD-411)</strong><br/>Hello Mr. Papadopoulos! Your renewal request is in <strong>Dr. Marios Petrou</strong>'s <strong>End-of-Day GeSY Queue</strong>:<br/>• <strong>Medication:</strong> Amlodipine 5mg + Atorvastatin 20mg (GeSY #449102)<br/>• <strong>Home BP Logged:</strong> 122/78 mmHg (Stable)<br/>• <strong>Status:</strong> Dr. Marios Petrou approves batch at 1:30 PM — we will message you here as soon as the pharmacy code is active!`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Costas Papadopoulos • GeSY & Private (#449102)", full: false },
      { label: "Triage Score & Action", val: "🟢 P3 Routine → EOD GeSY Batch Queue", full: false },
      { label: "Admin Request Summary", val: "Repeat chronic GeSY prescription: Amlodipine 5mg + Atorvastatin 20mg. Saves a 20-minute in-person Cardiology slot.", full: true },
      { label: "Safety Check", val: "✓ Home BP 122/78 mmHg, zero chest pain or side effects reported. Ready for 1-click sign-off by Dr. Marios Petrou.", full: true }
    ],
    logs: [
      "[10:21:11] SIP_INBOUND +35799449102 → Dr. Marios Petrou in Exam Room 1 → Intent: GESY_PRESCRIPTION_RENEWAL",
      "[10:21:24] PRIORITY_ENGINE score=P3_ASYNC_GESY (0 calendar slots consumed — saved 20 min)",
      "[10:21:25] GESY_BATCH_QUEUE appended item #gesy-1 for Dr. Marios Petrou 1-click sign-off"
    ]
  }
};

// ============================================================================
// Brand & Logo Switcher (MyDocDesk vs MyDocDeskAI + Bell vs Cross Shield)
// ============================================================================
function setBrandVariant(newBrandKey, newIconKey, silent) {
  state.brandKey = "mydocdesk";
  if (newIconKey) state.iconKey = newIconKey;

  const brandPlain = "MyDocDesk";
  const domainText = "mydocdesk.com";
  const ICON_META = {
    schedule_navy: {
      path: "./assets/icon-schedule-gold-navy.png",
      label: "Schedule Shield + Gold/Navy/Teal (v1)",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    schedule_gold: {
      path: "./assets/icon-schedule-gold-cross.png",
      label: "Gold Cross + Schedule Shield (v2)",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    bell: {
      path: "./assets/icon-bell.png",
      label: "Reception Bell + Stethoscope",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    cross: {
      path: "./assets/icon-cross.png",
      label: "Cool Navy/Teal Schedule Shield",
      tagline: "SMART TRIAGE AND SCHEDULING • AI Voice & WhatsApp Triage"
    }
  };

  const meta = ICON_META[state.iconKey] || ICON_META.schedule_navy;

  const topbarImg = document.getElementById("topbar-logo-img");
  if (topbarImg) topbarImg.src = meta.path;

  const waImg = document.getElementById("wa-logo-img");
  if (waImg) waImg.src = meta.path;

  const domainPill = document.getElementById("topbar-domain-pill");
  if (domainPill) domainPill.textContent = domainText;

  const taglineEl = document.getElementById("topbar-tagline");
  const tagline = isGreekUI() ? tr(meta.tagline) : meta.tagline;
  if (taglineEl) taglineEl.textContent = tagline;

  if (!document.querySelector("title[data-el]")) document.title = `${brandPlain} (${domainText}) — ${tagline}`;

  document.querySelectorAll(".js-brand-name").forEach((el) => {
    el.textContent = brandPlain;
  });

  ["schedule_navy", "schedule_gold", "bell", "cross"].forEach((k) => {
    document.getElementById(`btn-icon-${k}`)?.classList.toggle("active", k === state.iconKey);
    document.getElementById(`studio-card-${k}`)?.classList.toggle("active", k === state.iconKey);
  });

  const activePill = document.getElementById("active-brand-pill");
  if (activePill) {
    activePill.textContent = `Active: ${brandPlain} • ${meta.label} (${domainText})`;
  }

  if (!silent) showToast(`✨ Active MyDocDesk logo set to: ${meta.label}!`);
}

// ============================================================================
// Tab Navigation
// ============================================================================
function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  const mjMap = { marketplace: "marketplace", onepager: "onepager" };
  const mjBtns = document.querySelectorAll(".mjump-btn");
  if (tabId !== "simulator") {
    mjBtns.forEach((b) => b.classList.toggle("active", !!mjMap[tabId] && (b.getAttribute("onclick") || "").includes(`'${mjMap[tabId]}'`)));
  } else if (![...mjBtns].some((b) => b.classList.contains("active") && (b.getAttribute("onclick") || "").includes("jumpToMobileSection"))) {
    mjBtns.forEach((b, i) => b.classList.toggle("active", i === 0));
  }
  const activeTabBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  if (activeTabBtn && window.matchMedia("(max-width: 820px)").matches) {
    activeTabBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function jumpToMobileTab(tabId, btnEl) {
  switchTab(tabId);
  document.querySelectorAll(".mjump-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

function jumpToMobileSection(elementId, btnEl) {
  if (!document.getElementById("tab-simulator")?.classList.contains("active")) switchTab("simulator");
  document.querySelectorAll(".mjump-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  const target = document.getElementById(elementId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ============================================================================
// Clinic / Doctor Customizer
// ============================================================================
const CLINIC_PRESETS = {
  pediatrics: {
    id: "pediatrics",
    doctorName: "Dr. Andreas Nicolaou",
    clinicTitle: "Dr. Andreas Nicolaou — Pediatrics",
    specialty: "Pediatrics",
    city: "Limassol",
    coverage: "GeSY & Private",
    phone: "+357 25 340 110",
    roomLabel: "Exam Room 1"
  },
  dental: {
    id: "dental",
    doctorName: "Dr. Nikos Constantinou",
    clinicTitle: "Dr. Nikos Constantinou — Dentistry",
    specialty: "Dentistry",
    city: "Limassol",
    coverage: "GeSY & Private",
    phone: "+357 25 410 220",
    roomLabel: "Exam Room 1"
  },
  dermatology: {
    id: "dermatology",
    doctorName: "Dr. Elena Georgiou",
    clinicTitle: "Dr. Elena Georgiou — Dermatology",
    specialty: "Dermatology",
    city: "Nicosia",
    coverage: "GeSY & Private",
    phone: "+357 22 670 330",
    roomLabel: "Exam Room 1"
  },
  cardiology: {
    id: "cardiology",
    doctorName: "Dr. Marios Petrou",
    clinicTitle: "Dr. Marios Petrou — Cardiology",
    specialty: "Cardiology",
    city: "Larnaca",
    coverage: "GeSY & Private",
    phone: "+357 24 520 440",
    roomLabel: "Exam Room 1"
  }
};

function selectClinicPreset(presetKey, btnEl) {
  const preset = CLINIC_PRESETS[presetKey];
  if (!preset) return;
  state.activeClinic = { ...preset };
  document.querySelectorAll(".preset-pill").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  applyClinicBranding();

  const slotsForPreset = SCHEDULE_SLOTS_BY_SPECIALTY[presetKey] || SCHEDULE_SLOTS_BY_SPECIALTY.pediatrics;
  state.scheduleSlots = slotsForPreset.map((s) => ({ ...s }));
  renderDoctorSchedule();

  const SCEN_FOR_PRESET = {
    dental: ["dental_emergency", "btn-scen-dental", "🦷"],
    dermatology: ["soon_rash", "btn-scen-soon", "🔬"],
    cardiology: ["routine_gesy", "btn-scen-gesy", "❤️"],
    pediatrics: ["urgent_fever", "btn-scen-urgent", "👶"]
  };
  const [scenKey, btnId, icon] = SCEN_FOR_PRESET[presetKey] || SCEN_FOR_PRESET.pediatrics;
  triggerScenario(scenKey, document.getElementById(btnId));
  const v = clinicView(state.activeClinic);
  showToast(L(
    `${icon} Switched to ${v.clinicTitle} (${v.city} • ${v.coverage})!`,
    `${icon} Ενεργό ιατρείο: ${v.clinicTitle} (${v.city} • ${v.coverage})`
  ));
}

function applyCustomClinicForm(e) {
  e.preventDefault();
  const input = document.getElementById("custom-clinic-name-input");
  const rawName = (input?.value || "").trim();
  if (!rawName) return;
  const normalizedDoc = rawName.startsWith("Dr.") ? rawName.split("—")[0].trim() : `Dr. ${rawName.split("—")[0].trim()}`;
  const normalizedTitle = rawName.includes("—") ? rawName : `${normalizedDoc} — Specialist Clinic`;
  state.activeClinic = {
    id: "custom",
    doctorName: normalizedDoc,
    clinicTitle: normalizedTitle,
    specialty: "Specialist Clinic",
    city: "Cyprus",
    coverage: "GeSY & Private",
    phone: "+357 22 400 100",
    roomLabel: "Exam Room 1"
  };
  document.querySelectorAll(".preset-pill").forEach((b) => b.classList.remove("active"));
  applyClinicBranding();
  showToast(L(
    `🩺 AI Medical Receptionist Anastasia is now answering for ${normalizedTitle}!`,
    `🩺 Η Αναστασία, η AI ιατρική γραμματέας, απαντά τώρα για: ${clinicView(state.activeClinic).clinicTitle}`
  ));
}

function applyClinicBranding() {
  const c = clinicView(state.activeClinic);
  const step1Label = document.getElementById("step1-clinic-label");
  if (step1Label) step1Label.textContent = L(`${c.doctorName}'s Clinic`, `ιατρείο: ${c.doctorName}`);
  const busyDoc = document.getElementById("busy-doc-name");
  if (busyDoc) busyDoc.textContent = c.doctorName;
  const busyRoom = document.getElementById("busy-room-label");
  if (busyRoom) busyRoom.textContent = c.roomLabel || L("Exam Room 1", "Εξεταστήριο 1");
  const callTitle = document.getElementById("call-clinic-title");
  if (callTitle) callTitle.textContent = c.clinicTitle;
  const waTitle = document.getElementById("wa-clinic-title");
  if (waTitle) waTitle.textContent = c.clinicTitle;
  const waPhone = document.getElementById("wa-clinic-phone");
  if (waPhone && c.phone) waPhone.textContent = c.phone;

  const schedTitle = document.getElementById("schedule-clinic-title");
  if (schedTitle) {
    schedTitle.textContent = L(
      `🗓️ ${c.clinicTitle}: Prioritized Daily Schedule & Case Notes`,
      `🗓️ ${c.clinicTitle}: Ημερήσιο Πρόγραμμα κατά Προτεραιότητα & Σημειώματα Περιστατικών`
    );
  }
  const schedSub = document.getElementById("schedule-clinic-sub");
  if (schedSub) {
    schedSub.textContent = L(
      `${c.specialty} • ${c.city} (${c.coverage}) — Every appointment includes a structured 3-bullet intake note set by Anastasia`,
      `${c.specialty} • ${c.city} (${c.coverage}) — Κάθε ραντεβού συνοδεύεται από δομημένο σημείωμα 3 σημείων που συντάσσει η Αναστασία`
    );
  }
}

// ============================================================================
// Scenario Rendering & Interactive Triage Flow
// ============================================================================
function getScenario(scenKey) {
  const el = isGreekUI() && window.SCENARIOS_EL && window.SCENARIOS_EL[scenKey];
  return el ? { ...SCENARIOS[scenKey], ...el } : SCENARIOS[scenKey];
}

function triggerScenario(scenKey, btnEl) {
  const scen = getScenario(scenKey);
  if (!scen) return;
  state.activeScenarioKey = scenKey;

  const SCENARIO_TO_PRESET = {
    urgent_fever: "pediatrics",
    dental_emergency: "dental",
    soon_rash: "dermatology",
    routine_gesy: "cardiology"
  };
  const mappedPresetKey = SCENARIO_TO_PRESET[scenKey];
  if (mappedPresetKey && CLINIC_PRESETS[mappedPresetKey] && state.activeClinic.id !== mappedPresetKey) {
    state.activeClinic = { ...CLINIC_PRESETS[mappedPresetKey] };
    document.querySelectorAll(".preset-pill").forEach((b) => b.classList.remove("active"));
    document.getElementById(`preset-pill-${mappedPresetKey}`)?.classList.add("active");
    applyClinicBranding();
    state.scheduleSlots = (SCHEDULE_SLOTS_BY_SPECIALTY[mappedPresetKey] || SCHEDULE_SLOTS_BY_SPECIALTY.pediatrics).map((s) => ({ ...s }));
    renderDoctorSchedule();
  }

  if (btnEl) {
    document.querySelectorAll(".scenario-btn").forEach((b) => b.classList.remove("active"));
    btnEl.classList.add("active");
  }

  document.getElementById("caller-phone-display").textContent = scen.callerDisplay;
  document.getElementById("call-status-label").textContent = scen.statusLabel;
  document.getElementById("case-id-badge").textContent = scen.caseId;
  document.getElementById("case-note-coverage").textContent = scen.coverage;

  // Render Call Transcript
  const callList = document.getElementById("call-transcript-list");
  callList.innerHTML = scen.callTurns
    .map(
      (t) => `
      <div class="turn-bubble ${t.role}">
        <span class="turn-speaker">${t.speaker}</span>
        <div>${t.text}</div>
      </div>`
    )
    .join("");

  // Render WhatsApp Thread
  const waList = document.getElementById("wa-messages-list");
  waList.innerHTML = scen.waMessages
    .map((m) => `<div class="wa-msg ${m.dir}">${m.html}</div>`)
    .join("");

  // Render Priority Banner
  const prioBanner = document.getElementById("triage-prio-banner");
  prioBanner.className = `prio-banner ${scen.prioClass}`;
  document.getElementById("triage-prio-pill").textContent = scen.prioPill;
  document.getElementById("triage-prio-headline").textContent = scen.prioHeadline;

  // Render Case Note Fields
  const caseGrid = document.getElementById("case-note-grid");
  caseGrid.innerHTML = scen.caseFields
    .map(
      (f) => `
      <div class="case-field ${f.full ? "full" : ""}">
        <div class="case-field-label">${f.label}</div>
        <div class="case-field-val">${f.val}</div>
      </div>`
    )
    .join("");

  // Render Execution Logs
  const logsList = document.getElementById("execution-logs-list");
  logsList.innerHTML = scen.logs.map((l) => `<div class="log-item">${l}</div>`).join("");

  // Update Doctor Lock-Screen Quick-Approval Digest & Sub-Calendar Layer Strip
  updateSimulatorAbcdCard(scenKey, scen);

  if (state.voiceAudioEnabled && scen.callTurns.length > 0) {
    const lastAi = [...scen.callTurns].reverse().find((t) => t.role === "ai");
    if (lastAi) speakAnastasiaText(lastAi.text, isGreekUI() ? "el-GR" : "en-GB");
  }
}

// ============================================================================
// 4-Step Interactive Guided Tour
// ============================================================================
function playClinicRingtone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now + offset);
      gain.gain.setValueAtTime(0.08, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.17);
    });
  } catch (_) {}
}

const TOUR_STEP_PANELS = {
  1: { id: "card-phone-call", label: L("Step 1 • Live call", "Βήμα 1 • Ζωντανή κλήση") },
  2: { id: "card-brain-panel", label: L("Step 2 • Triage case note", "Βήμα 2 • Σημείωμα διαλογής") },
  3: { id: "card-whatsapp-chat", label: L("Step 3 • WhatsApp slot offer", "Βήμα 3 • Πρόταση ραντεβού στο WhatsApp") },
  4: { id: "simulator-abcd-card", label: L("Step 4 • A/B/C/D doctor reply", "Βήμα 4 • Απάντηση γιατρού A/B/C/D") }
};

function focusTourPanel(stepNum) {
  document.querySelectorAll(".tour-focus").forEach((el) => {
    el.classList.remove("tour-focus");
    el.removeAttribute("data-tour-label");
  });
  const cfg = TOUR_STEP_PANELS[stepNum];
  const panel = cfg && document.getElementById(cfg.id);
  if (!panel) return;
  panel.classList.add("tour-focus");
  panel.setAttribute("data-tour-label", cfg.label);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tall = panel.getBoundingClientRect().height > window.innerHeight * 0.8;
  panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: tall ? "start" : "center" });
}

function clearTourFocus() {
  document.querySelectorAll(".tour-focus").forEach((el) => {
    el.classList.remove("tour-focus");
    el.removeAttribute("data-tour-label");
  });
}

function runInteractiveStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step-card-${i}`)?.classList.toggle("active", i === stepNum);
  }

  if (stepNum === 1) {
    playClinicRingtone();
    triggerScenario("urgent_fever", document.getElementById("btn-scen-urgent"));
    showToast(L(
      "📞 Step 1: Patient calls while Dr. Nicolaou is in Exam Room 1 — AI Anastasia answers immediately!",
      "📞 Βήμα 1: Ο ασθενής καλεί ενώ ο γιατρός εξετάζει στο Εξεταστήριο 1 — η Αναστασία απαντά αμέσως!"
    ));
  } else if (stepNum === 2) {
    showToast(L(
      "🩺 Step 2: Anastasia screens red flags & scores Leo (39.6°C fever + acute ear pain) as 🔴 PRIORITY 1!",
      "🩺 Βήμα 2: Η Αναστασία ελέγχει τα σημεία κινδύνου και κατατάσσει τον Λέοντα (πυρετός 39,6°C + οξύς πόνος στο αυτί) ως 🔴 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 1!"
    ));
  } else if (stepNum === 3) {
    showToast(L(
      "🔓 Step 3: Anastasia unlocks Dr. Nicolaou's hidden 12:30 PM Emergency Buffer Slot!",
      "🔓 Βήμα 3: Η Αναστασία ξεκλειδώνει το προστατευμένο ραντεβού επειγόντων των 12:30!"
    ));
  } else if (stepNum === 4) {
    confirmSuggestedSlot();
  }
  // Steps 1–3 run their simulator updates synchronously; focus after layout settles.
  setTimeout(() => focusTourPanel(stepNum), 120);
}

function startGuidedTour() {
  if (state.guidedTimer) {
    clearInterval(state.guidedTimer);
    state.guidedTimer = null;
  }
  const btn = document.getElementById("btn-guided-demo");
  if (btn) {
    btn.classList.add("playing");
    btn.textContent = L("⏳ Running 4-Step Triage Demo...", "⏳ Εκτελείται η επίδειξη 4 βημάτων...");
  }
  let step = 1;
  runInteractiveStep(step);
  state.guidedTimer = setInterval(() => {
    step += 1;
    if (step <= 4) {
      runInteractiveStep(step);
    } else {
      clearInterval(state.guidedTimer);
      state.guidedTimer = null;
      clearTourFocus();
      if (btn) {
        btn.classList.remove("playing");
        btn.textContent = L("▶ Replay Guided Triage Demo", "▶ Επανάληψη Καθοδηγούμενης Επίδειξης");
      }
    }
  }, 4200);
}

function confirmSuggestedSlot() {
  const waList = document.getElementById("wa-messages-list");
  if (!waList) return;
  const passDiv = document.createElement("div");
  passDiv.className = "wa-msg incoming";
  passDiv.innerHTML = L(
    `✅ <strong>Appointment Locked &amp; Case Note Pinned!</strong><br/>${docName()} now sees your structured 3-bullet Pre-Visit Case Note on the clinic schedule. Reply here anytime to attach photos or lab results.`,
    `✅ <strong>Το ραντεβού κλείδωσε και το σημείωμα επισυνάφθηκε!</strong><br/>Ο/Η ${docName()} βλέπει πλέον το δομημένο σημείωμα 3 σημείων στο πρόγραμμα του ιατρείου. Μπορείτε να απαντήσετε εδώ οποτεδήποτε για να στείλετε φωτογραφίες ή εξετάσεις.`
  );
  waList.appendChild(passDiv);
  waList.scrollTop = waList.scrollHeight;
  showToast(L(
    `✅ Confirmed slot & attached Pre-Visit Case Note to ${docName()}'s live schedule!`,
    `✅ Το ραντεβού επιβεβαιώθηκε και το σημείωμα επισυνάφθηκε στο πρόγραμμα: ${docName()}`
  ));
}

function simulatePatientPhotoUpload() {
  const waList = document.getElementById("wa-messages-list");
  if (!waList) return;
  const outMsg = document.createElement("div");
  outMsg.className = "wa-msg outgoing";
  outMsg.innerHTML = L(
    `📷 <strong>[Uploaded Photo: patient_symptom_photo.jpg]</strong><br/>Attached photo for the doctor to review before our appointment.`,
    `📷 <strong>[Φωτογραφία: patient_symptom_photo.jpg]</strong><br/>Επισυνάπτω φωτογραφία για να τη δει ο γιατρός πριν από το ραντεβού μας.`
  );
  waList.appendChild(outMsg);

  const inMsg = document.createElement("div");
  inMsg.className = "wa-msg incoming";
  inMsg.innerHTML = L(
    `🩺 <strong>Photo Added to Doctor's Case Card!</strong><br/>I attached <code>patient_symptom_photo.jpg</code> directly onto your calendar slot so ${docName()} can inspect it before you walk in.`,
    `🩺 <strong>Η φωτογραφία προστέθηκε στην καρτέλα του περιστατικού!</strong><br/>Επισύναψα το <code>patient_symptom_photo.jpg</code> στο ραντεβού σας, ώστε ο/η ${docName()} να τη δει πριν από την επίσκεψη.`
  );
  waList.appendChild(inMsg);
  waList.scrollTop = waList.scrollHeight;

  showToast(L("📷 Symptom photo attached to the Doctor's Pre-Visit Case Note!", "📷 Η φωτογραφία συμπτωμάτων επισυνάφθηκε στο σημείωμα του γιατρού!"));
}

// ============================================================================
// Custom Patient Prompts & Live Triage Classifier
// ============================================================================
function sendQuickPrompt(channel, text) {
  const greekSample = isGreekUI() && window.CHIP_PROMPTS_EL ? window.CHIP_PROMPTS_EL[text] : null;
  handlePatientTurn(channel, greekSample || text);
}

function sendCustomTurn(e, channel) {
  e.preventDefault();
  const inputId = channel === "voice" ? "voice-custom-input" : "wa-custom-input";
  const input = document.getElementById(inputId);
  const text = (input?.value || "").trim();
  if (!text) return;
  input.value = "";
  handlePatientTurn(channel, text);
}

function handlePatientTurn(channel, text) {
  const lower = text.toLowerCase();
  const isGreek = /[α-ωάέήίόύώ]/i.test(text);
  const isDental = /tooth|teeth|dentist|dental|toothache|crown|filling|root canal|implant|cleaning|scaling|gum|molar|δόντ|δοντ|οδοντ|σφράγισμ|σφραγισμ|καθαρισμ|απονεύρωσ|ούλ/.test(lower);
  const isDentalHygiene = /cleaning|scaling|whitening|polish|hygiene|checkup|καθαρισμ|λεύκανσ|έλεγχ/.test(lower);
  const isUrgent = /39|40|fever|ear|pain|urgent|blood|breath|broke|broken|fractur|swell|throbb|πυρετ|πον|επείγ|σήμερα|έσπασ|πρήξ/.test(lower);
  const isGesy = /gesy|prescription|refill|renew|pills|γεσυ|συνταγ|φάρμακ/.test(lower);

  let category = "default";
  if (isDental) {
    if (isDentalHygiene && !isUrgent) category = "dentalHygiene";
    else if (isUrgent) category = "dentalUrgent";
    else category = "dentalTreatment";
  } else if (isUrgent) category = "urgent";
  else if (isGesy) category = "gesy";

  const replyLang = isGreek ? "el" : "en";
  const aiReply = triageReplyText(category, replyLang, state.activeClinic.doctorName);
  const meta = triageMeta(category);
  const prioClass = meta.prioClass;
  const prioPill = meta.prioPill;
  const prioHeadline = meta.prioHeadline;

  if (channel === "voice") {
    const callList = document.getElementById("call-transcript-list");
    callList.insertAdjacentHTML(
      "beforeend",
      `<div class="turn-bubble caller"><span class="turn-speaker">${L("Patient Caller", "Ασθενής (καλών)")}</span><div>${escapeHtml(text)}</div></div>
       <div class="turn-bubble ai"><span class="turn-speaker">${L("Anastasia (AI Medical Receptionist)", "Αναστασία (AI Ιατρική Γραμματέας)")}</span><div>${aiReply}</div></div>`
    );
    callList.scrollTop = callList.scrollHeight;
  } else {
    const waList = document.getElementById("wa-messages-list");
    waList.insertAdjacentHTML(
      "beforeend",
      `<div class="wa-msg outgoing">${escapeHtml(text)}</div>
       <div class="wa-msg incoming"><strong>${L("🩺 Anastasia (AI Triage):", "🩺 Αναστασία (AI Διαλογή):")}</strong> ${aiReply}</div>`
    );
    waList.scrollTop = waList.scrollHeight;
  }

  // Update Priority Banner & Case Note Card live
  const prioBanner = document.getElementById("triage-prio-banner");
  prioBanner.className = `prio-banner ${prioClass}`;
  document.getElementById("triage-prio-pill").textContent = prioPill;
  document.getElementById("triage-prio-headline").textContent = prioHeadline;

  const caseGrid = document.getElementById("case-note-grid");
  caseGrid.innerHTML = `
    <div class="case-field"><div class="case-field-label">${L("Patient Channel", "Κανάλι Ασθενούς")}</div><div class="case-field-val">${channel === "voice" ? L("📞 Live Phone Call", "📞 Ζωντανή Τηλεφωνική Κλήση") : L("💬 WhatsApp Chat", "💬 Συνομιλία WhatsApp")}</div></div>
    <div class="case-field"><div class="case-field-label">${L("Assigned Triage Priority", "Προτεραιότητα Διαλογής")}</div><div class="case-field-val">${prioPill}</div></div>
    <div class="case-field full"><div class="case-field-label">${L("Patient Statement & Chief Complaint", "Δήλωση Ασθενούς & Κύριο Ενόχλημα")}</div><div class="case-field-val">"${escapeHtml(text)}"</div></div>
    <div class="case-field full"><div class="case-field-label">${L("AI Action Taken", "Ενέργεια της Αναστασίας")}</div><div class="case-field-val">${prioHeadline}</div></div>
  `;

  if (state.voiceAudioEnabled) {
    speakAnastasiaText(aiReply, isGreek ? "el-GR" : "en-GB");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const TRIAGE_META = {
  dentalHygiene: {
    prioClass: "prio-3",
    prioPill: ["🟢 PRIORITY 3 • 30-MIN HYGIENE / SCALING SLOT", "🟢 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 3 • 30ΛΕΠΤΟ ΡΑΝΤΕΒΟΥ ΚΑΘΑΡΙΣΜΟΥ"],
    prioHeadline: ["Routed to Non-Peak 30m Ultrasonic Scaling Slot", "Προγραμματίστηκε σε 30λεπτο ραντεβού καθαρισμού εκτός ωρών αιχμής"]
  },
  dentalUrgent: {
    prioClass: "prio-1",
    prioPill: ["🔴 PRIORITY 1 • 30-MIN EMERGENCY CHAIR SLOT", "🔴 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 1 • 30ΛΕΠΤΟ ΕΠΕΙΓΟΝ ΡΑΝΤΕΒΟΥ"],
    prioHeadline: ["Unlocks 12:30 PM Emergency Chair Buffer + Requests Tooth Photo", "Ξεκλειδώνει το επείγον ραντεβού των 12:30 + ζητά φωτογραφία του δοντιού"]
  },
  dentalTreatment: {
    prioClass: "prio-2",
    prioPill: ["🟡 PRIORITY 2 • 45–60 MIN DENTAL TREATMENT SLOT", "🟡 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 2 • ΡΑΝΤΕΒΟΥ ΘΕΡΑΠΕΙΑΣ 45–60 ΛΕΠΤΩΝ"],
    prioHeadline: ["Booked 45m Dental Treatment Block (Tomorrow 11:00 AM) + Photo/X-Ray Intake", "Κλείστηκε 45λεπτο ραντεβού θεραπείας (αύριο 11:00) + λήψη φωτογραφίας/ακτινογραφίας"]
  },
  urgent: {
    prioClass: "prio-1",
    prioPill: ["🔴 PRIORITY 1 • URGENT SAME-DAY", "🔴 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 1 • ΕΠΕΙΓΟΝ ΑΥΘΗΜΕΡΟΝ"],
    prioHeadline: ["Unlocks Hidden 12:30 PM Emergency Buffer Slot", "Ξεκλειδώνει το προστατευμένο ραντεβού επειγόντων των 12:30"]
  },
  gesy: {
    prioClass: "prio-3",
    prioPill: ["🟢 PRIORITY 3 • ASYNC GeSY QUEUE", "🟢 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 3 • ΛΙΣΤΑ ΓεΣΥ ΤΕΛΟΥΣ ΗΜΕΡΑΣ"],
    prioHeadline: ["Zero Clinic Slot Wasted • Added to End-of-Day GeSY Batch", "Κανένα ραντεβού δεν χάνεται • Προστέθηκε στη λίστα ΓεΣΥ τέλους ημέρας"]
  },
  default: {
    prioClass: "prio-2",
    prioPill: ["🟡 PRIORITY 2 • STANDARD SLOT", "🟡 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 2 • ΚΑΝΟΝΙΚΟ ΡΑΝΤΕΒΟΥ"],
    prioHeadline: ["Booked Next Available Standard Slot (Tomorrow 10:15 AM)", "Κλείστηκε το επόμενο διαθέσιμο ραντεβού (αύριο 10:15)"]
  }
};

function triageMeta(category) {
  const m = TRIAGE_META[category] || TRIAGE_META.default;
  return { prioClass: m.prioClass, prioPill: L(m.prioPill[0], m.prioPill[1]), prioHeadline: L(m.prioHeadline[0], m.prioHeadline[1]) };
}

/** Anastasia's reply text. English replies use the English doctor name so clips stay stable across UI languages. */
function triageReplyText(category, lang, doctorNameEn) {
  if (lang === "el") {
    return {
      dentalHygiene: "Καταχώρισα το αίτημά σας για οδοντιατρικό καθαρισμό και προληπτικό έλεγχο σε 30λεπτο απογευματινό ραντεβού, ώστε τα πρωινά ραντεβού να μένουν διαθέσιμα για επείγοντα περιστατικά.",
      dentalUrgent: "Λόγω του οξέος πόνου και του σπασμένου δοντιού, το περιστατικό σας καταχωρίστηκε ως επείγον. Κράτησα το 30λεπτο επείγον ραντεβού στις 12:30. Παρακαλώ στείλτε μας μια φωτογραφία του δοντιού στο WhatsApp, ώστε να προετοιμαστούν τα απαραίτητα.",
      dentalTreatment: "Κατέγραψα το αίτημά σας για οδοντιατρική θεραπεία και σας κράτησα 45λεπτο ραντεβού αύριο στις 11:00. Αν έχετε φωτογραφία ή ακτινογραφία, μπορείτε να τη στείλετε στο WhatsApp.",
      urgent: "Λόγω των οξέων συμπτωμάτων, το περιστατικό καταχωρίστηκε ως επείγον. Κράτησα το ραντεβού επειγόντων στις 12:30 και ενημέρωσα τον φάκελο για τον γιατρό.",
      gesy: "Καταχώρισα το αίτημα επανάληψης συνταγής ΓεΣΥ στη λίστα έγκρισης του γιατρού. Δεν χρειάζεται να έρθετε στο ιατρείο· θα σας ενημερώσουμε στο WhatsApp μόλις εγκριθεί.",
      default: "Κατέγραψα το σημείωμά σας για τον γιατρό. Το επόμενο διαθέσιμο ραντεβού είναι αύριο στις 10:15. Μπορείτε να στείλετε φωτογραφίες ή εξετάσεις εδώ στο WhatsApp."
    }[category];
  }
  return {
    dentalHygiene: "I have triaged your routine dental scaling & polishing into a 30-minute non-peak hygiene slot so the dentist's morning surgical blocks stay open for emergencies!",
    dentalUrgent: `Because you have an acute dental emergency (broken tooth/crown or severe toothache), I unlocked ${doctorNameEn}'s 12:30 PM 30-Minute Emergency Chair Slot and flagged the nurse to prep the bonding/crown tray. Please snap a quick tooth photo on WhatsApp!`,
    dentalTreatment: "I have logged your dental treatment case (Priority 2 — 45-to-60 minute clinical chair slot for filling, root canal, or implant consult) for Tomorrow at 11:00 AM. Feel free to attach a smartphone photo or X-ray on WhatsApp!",
    urgent: `Because you described acute symptoms, I have triaged this as Priority 1 Urgent, unlocked ${doctorNameEn}'s 12:30 PM Emergency Buffer Slot, and attached your Case Note!`,
    gesy: "I have logged your GeSY prescription renewal into the doctor's 5-Minute End-of-Day Approval Queue so you don't need to wait or book an exam slot!",
    default: "I have created your Pre-Visit Case Note (Priority 2). Our next available consultation slot is Tomorrow at 10:15 AM—feel free to send any photo or lab PDF here on WhatsApp!"
  }[category];
}

function voiceIntroText(lang, clinic) {
  const v = lang === "el" ? (window.CLINIC_EL && window.CLINIC_EL[clinic.id]) || clinic : clinic;
  return lang === "el"
    ? `Γεια σας, είμαι η Αναστασία, η ψηφιακή ιατρική γραμματέας του ιατρείου: ${v.doctorName}. Απαντώ στις κλήσεις των ασθενών, κρατώ σημειώσεις για τον γιατρό και διαχειρίζομαι τα επείγοντα ραντεβού.`
    : `Hello, I am Anastasia, the AI Medical Receptionist for ${clinic.doctorName}. I triage patient calls, take clinical case notes, and manage urgent buffer slots.`;
}

/** Every text Anastasia can speak with the built-in presets (used to pre-generate neural voice clips). */
window.__collectSpeakables = function () {
  const out = [];
  const add = (text, lang) => {
    const plain = String(text || "").replace(/<[^>]+>/g, "");
    out.push({ text: plain, lang, key: voiceClipKey(plain, lang) });
  };
  Object.values(CLINIC_PRESETS).forEach((c) => {
    add(voiceIntroText("en", c), "en-GB");
    add(voiceIntroText("el", c), "el-GR");
    ["dentalUrgent", "urgent"].forEach((cat) => add(triageReplyText(cat, "en", c.doctorName), "en-GB"));
  });
  ["dentalHygiene", "dentalTreatment", "gesy", "default"].forEach((cat) => add(triageReplyText(cat, "en", ""), "en-GB"));
  Object.keys(TRIAGE_META).forEach((cat) => add(triageReplyText(cat, "el", ""), "el-GR"));
  Object.keys(SCENARIOS).forEach((k) => {
    const lastEn = [...SCENARIOS[k].callTurns].reverse().find((t) => t.role === "ai");
    if (lastEn) add(lastEn.text, "en-GB");
    const elScen = window.SCENARIOS_EL && window.SCENARIOS_EL[k];
    const lastEl = elScen && [...elScen.callTurns].reverse().find((t) => t.role === "ai");
    if (lastEl) add(lastEl.text, "el-GR");
  });
  const seen = new Set();
  return out.filter((o) => (seen.has(o.key) ? false : seen.add(o.key)));
};

// ============================================================================
// Web Speech API (Voice Output & Live Microphone Input)
// ============================================================================
function toggleVoiceAudio() {
  state.voiceAudioEnabled = !state.voiceAudioEnabled;
  const btn = document.getElementById("tts-toggle-btn");
  if (btn) {
    btn.classList.toggle("active", state.voiceAudioEnabled);
    btn.textContent = state.voiceAudioEnabled
      ? L("🔊 Voice Audio: ON (Anastasia Speaking)", "🔊 Φωνή: ΕΝΕΡΓΗ (μιλά η Αναστασία)")
      : L("🔊 Voice Audio: Off (Tap to Hear Anastasia)", "🔊 Φωνή: Ανενεργή (πατήστε για να ακούσετε την Αναστασία)");
  }
  if (state.voiceAudioEnabled) {
    const lang = isGreekUI() ? "el" : "en";
    speakAnastasiaText(voiceIntroText(lang, state.activeClinic), lang === "el" ? "el-GR" : "en-GB");
  } else {
    stopAnastasiaVoice();
  }
}

function setMicLanguage(lang, silent) {
  state.micLang = lang === "el-GR" ? "el-GR" : "en-US";
  document.querySelectorAll(".mic-lang-btn").forEach((b) => {
    const on = b.dataset.lang === state.micLang;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (silent) return;
  showToast(state.micLang === "el-GR"
    ? L("🎙️ Mic language set to Greek (el-GR)", "🎙️ Γλώσσα μικροφώνου: Ελληνικά (el-GR)")
    : L("🎙️ Mic language set to English (en-US)", "🎙️ Γλώσσα μικροφώνου: Αγγλικά (en-US)"));
}

function showVoiceInputUnavailable(message) {
  showToast(message);
  const chips = document.querySelector(".call-quick-prompts");
  if (chips) {
    chips.classList.remove("sample-hint");
    void chips.offsetWidth;
    chips.classList.add("sample-hint");
    chips.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => chips.classList.remove("sample-hint"), 3200);
  }
}

function startLiveMicSpeech() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showVoiceInputUnavailable("🎙️ Voice input not supported in this browser — try a sample below.");
    return;
  }
  const heroBtn = document.getElementById("btn-live-mic-hero");
  const callMicBtn = document.getElementById("btn-call-mic");
  const setListening = (on) => {
    heroBtn?.classList.toggle("listening", on);
    callMicBtn?.classList.toggle("listening", on);
  };
  let rec;
  try {
    rec = new SpeechRec();
  } catch (_) {
    showVoiceInputUnavailable("🎙️ Voice input not supported in this browser — try a sample below.");
    return;
  }
  rec.lang = state.micLang || "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  setListening(true);
  showToast(rec.lang === "el-GR"
    ? L("🎙️ Listening (Greek)… speak as the patient.", "🎙️ Σας ακούω (Ελληνικά)… μιλήστε ως ασθενής.")
    : L("🎙️ Listening (English)… speak as the patient.", "🎙️ Σας ακούω (Αγγλικά)… μιλήστε ως ασθενής."));
  rec.onresult = (event) => {
    const transcript = (event.results?.[0]?.[0]?.transcript || "").trim();
    if (!transcript) {
      showVoiceInputUnavailable("🎙️ Didn't catch that — try again or try a sample below.");
      return;
    }
    state.voiceAudioEnabled = true;
    handlePatientTurn("voice", transcript);
  };
  rec.onend = () => setListening(false);
  rec.onerror = (event) => {
    setListening(false);
    const err = event && event.error;
    if (err === "not-allowed" || err === "service-not-allowed") {
      showVoiceInputUnavailable("🎙️ Microphone access is blocked — allow it in your browser, or try a sample below.");
    } else if (err === "no-speech" || err === "aborted") {
      showVoiceInputUnavailable("🎙️ Didn't catch that — try again or try a sample below.");
    } else {
      showVoiceInputUnavailable("🎙️ Voice input not supported in this browser — try a sample below.");
    }
  };
  try {
    rec.start();
  } catch (_) {
    setListening(false);
    showVoiceInputUnavailable("🎙️ Voice input not supported in this browser — try a sample below.");
  }
}

// ============================================================================
// Clinic ROI Calculator
// ============================================================================
function updateClinicRoi() {
  const callsPerDay = Number(document.getElementById("roi-calls-slider")?.value || 65);
  const visitFee = Number(document.getElementById("roi-fee-slider")?.value || 60);
  const gesyPerDay = Number(document.getElementById("roi-gesy-slider")?.value || 18);

  document.getElementById("roi-calls-val").textContent = L(`${callsPerDay} calls/day`, `${callsPerDay} κλήσεις/ημέρα`);
  document.getElementById("roi-fee-val").textContent = L(`€${visitFee} / visit`, `€${visitFee} / επίσκεψη`);
  document.getElementById("roi-gesy-val").textContent = L(`${gesyPerDay} admin calls/day`, `${gesyPerDay} διοικητικές κλήσεις/ημέρα`);

  // 22 working days/month
  const hoursSavedMo = Math.round((callsPerDay * 1.8 * 22) / 60);
  const recoveredVisitsPerWeek = Math.max(3, Math.round(callsPerDay * 0.14));
  const recoveredRevYr = recoveredVisitsPerWeek * visitFee * 48;
  const slotsSavedMo = gesyPerDay * 22;

  document.getElementById("roi-hours-saved").textContent = L(`${hoursSavedMo} hrs / mo`, `${hoursSavedMo} ώρες / μήνα`);
  document.getElementById("roi-missed-rev").textContent = L(`€${recoveredRevYr.toLocaleString("en-GB")} / yr`, `€${recoveredRevYr.toLocaleString("el-GR")} / έτος`);
  document.getElementById("roi-slots-saved").textContent = L(`${slotsSavedMo} calls / mo`, `${slotsSavedMo} κλήσεις / μήνα`);
}

// ============================================================================
// Tab 2: Doctor's Live Schedule & GeSY Queue Rendering
// ============================================================================
function getSlotCalendarLayerMeta(s, idx) {
  if (s.calLayer === "busy_hold" || s.priority === -1) {
    return {
      layer: "busy_hold",
      badgeText: "🔒 Personal / Surgery Busy Hold",
      badgeClass: "cal-pill-busy"
    };
  }
  if (s.calLayer === "clinic_main") {
    return { layer: "clinic_main", badgeText: "⚪ 📅 Clinic Main Desk", badgeClass: "cal-pill-clinic" };
  }
  if (s.calLayer === "ai_subcal") {
    return { layer: "ai_subcal", badgeText: "🟣 📅 Anastasia AI Layer", badgeClass: "cal-pill-ai" };
  }
  if (s.priority === 1 || s.priority === 0) {
    return {
      layer: "ai_buffer",
      badgeText: s.priority === 1 ? "🔴 📅 AI Priority 1 Unlock" : "🔴 📅 AI Protected Buffer",
      badgeClass: "cal-pill-buffer"
    };
  }
  if (idx === 1) {
    return {
      layer: "clinic_main",
      badgeText: "⚪ 📅 Clinic Main Desk",
      badgeClass: "cal-pill-clinic"
    };
  }
  return {
    layer: "ai_subcal",
    badgeText: "🟣 📅 Anastasia AI Layer",
    badgeClass: "cal-pill-ai"
  };
}

function filterScheduleLayer(layerKey, btnEl) {
  state.activeScheduleLayer = layerKey || "all";
  if (btnEl) {
    document.querySelectorAll(".cal-filter-btn").forEach((b) => b.classList.remove("active"));
    btnEl.classList.add("active");
  }
  renderDoctorSchedule();
  const layerNames = {
    all: "All Connected Calendar Layers (Anastasia AI Sub-Calendar + Emergency Buffers + Busy Holds + Clinic Main)",
    ai_subcal: "Dedicated Color-Coded 'Anastasia AI Reception' Google Calendar Layer",
    ai_buffer: "Protected AI Priority 1 Emergency Buffer Layer",
    busy_hold: "Multi-Calendar Busy-Read Holds (Personal + Hospital/Surgery Rounds)",
    clinic_main: "Main Clinic Desk Calendar Layer"
  };
  const shown = layerNames[state.activeScheduleLayer] || layerNames.all;
  showToast(L(`📅 Showing: ${shown}`, `📅 Εμφάνιση: ${tr(shown)}`));
}

function updateScheduleKpis(annotated) {
  const patients = annotated.filter((s) => s.priority >= 1).length;
  const buffers = annotated.filter((s) => s.priority === 1 || s.priority === 0);
  const usedBuffers = buffers.filter((s) => s.priority === 1);
  const heldBuffers = buffers.filter((s) => s.priority === 0);
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  const shortTime = (t) => {
    const raw = (/(\d{1,2}:\d{2}\s*(AM|PM))/i.exec(t) || [t])[0];
    return isGreekUI() ? fmtTime(raw) : raw.replace(/^0/, "");
  };
  setTxt("kpi-total-bookings", L(`${patients} Patients`, `${patients} Ασθενείς`));
  setTxt("kpi-total-sub", L(`All ${patients} pre-screened with AI Case Notes`, `Και οι ${patients} με προκαταρκτικό σημείωμα AI`));
  setTxt("kpi-urgent-slots", L(`${usedBuffers.length} / ${buffers.length} Used`, `${usedBuffers.length} / ${buffers.length} σε χρήση`));
  const subParts = [];
  if (usedBuffers.length) subParts.push(L(`${usedBuffers.map((s) => shortTime(s.time)).join(" & ")} unlocked`, `${usedBuffers.map((s) => shortTime(s.time)).join(" & ")} ξεκλειδώθηκε`));
  if (heldBuffers.length) subParts.push(L(`${heldBuffers.map((s) => shortTime(s.time)).join(" & ")} held for acute cases`, `${heldBuffers.map((s) => shortTime(s.time)).join(" & ")} κρατείται για οξέα περιστατικά`));
  setTxt("kpi-urgent-sub", subParts.join(" • "));
  updateGesyKpi();
}

function updateGesyKpi() {
  const pending = state.gesyQueue.filter((g) => !g.approved).length;
  const kpi = document.getElementById("kpi-gesy-count");
  if (kpi) kpi.textContent = pending === 0 ? L("0 Pending (All Done!)", "0 σε αναμονή (ολοκληρώθηκαν!)") : L(`${pending} Pending`, `${pending} σε αναμονή`);
  const sub = document.getElementById("kpi-gesy-sub");
  if (sub) sub.textContent = pending === 0
    ? L("Batch approved from the lock screen", "Εγκρίθηκαν μαζικά από την οθόνη κλειδώματος")
    : L(`Est. 2 minutes to batch-approve all ${pending}`, `Περίπου 2 λεπτά για μαζική έγκριση και των ${pending}`);
}

function renderDoctorSchedule() {
  const container = document.getElementById("doctor-schedule-list");
  if (!container) return;

  const annotated = state.scheduleSlots
    .map((s, idx) => ({
      ...s,
      _meta: getSlotCalendarLayerMeta(s, idx)
    }))
    .sort((a, b) => slotStartMinutes(a.time) - slotStartMinutes(b.time));

  updateScheduleKpis(annotated);

  const countAll = annotated.length;
  const countAi = annotated.filter((s) => s._meta.layer === "ai_subcal").length;
  const countBuf = annotated.filter((s) => s._meta.layer === "ai_buffer").length;
  const countBusy = annotated.filter((s) => s._meta.layer === "busy_hold").length;
  const countClinic = annotated.filter((s) => s._meta.layer === "clinic_main").length;

  const setCnt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setCnt("count-layer-all", countAll);
  setCnt("count-layer-ai", countAi);
  setCnt("count-layer-buffer", countBuf);
  setCnt("count-layer-busy", countBusy);
  setCnt("count-layer-clinic", countClinic);

  const activeLayer = state.activeScheduleLayer || "all";
  const visibleSlots =
    activeLayer === "all"
      ? annotated
      : annotated.filter((s) => s._meta.layer === activeLayer);

  container.innerHTML = visibleSlots
    .map((raw) => {
      const s = { ...slotView(raw), _meta: { ...raw._meta, badgeText: tr(raw._meta.badgeText) } };
      const cls =
        s.priority === 1
          ? "prio-1"
          : s.priority === -1
          ? "busy-hold-slot"
          : s.priority === 2
          ? "prio-2"
          : "buffer-locked";
      return `
      <div class="schedule-slot-item ${cls}" data-cal-layer="${s._meta.layer}">
        <div class="slot-top-row">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="slot-time-badge">${s.time}</span>
            <strong style="font-size:0.86rem; color:#0f172a;">${s.patient}</strong>
            <span style="font-size:0.74rem; color:#64748b;">(${s.phone})</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="cal-layer-pill ${s._meta.badgeClass}">${s._meta.badgeText}</span>
            <span class="code-badge" style="${s.priority === 1 ? "background:#dc2626;color:#fff;border-color:#dc2626;" : ""}">${s.prioLabel}</span>
          </div>
        </div>
        <div class="slot-notes-box">
          <div><strong>🩺 ${s.priority === -1 ? L("Calendar Sync Source:", "Πηγή συγχρονισμού ημερολογίου:") : L("Chief Complaint:", "Κύριο ενόχλημα:")}</strong> ${s.complaint}</div>
          <div style="margin-top:3px; color:#475569;"><strong>📋 ${s.priority === -1 ? L("Privacy & Availability Rule:", "Κανόνας απορρήτου & διαθεσιμότητας:") : L("AI Pre-Visit Note:", "Σημείωμα AI πριν από την επίσκεψη:")}</strong> ${s.notes}</div>
        </div>
      </div>`;
    })
    .join("");
}

function updateSimulatorAbcdCard(scenKey, scen) {
  const digestEl = document.getElementById("abcd-digest-preview-text");
  const badgeEl = document.getElementById("abcd-sim-badge");
  const statusEl = document.getElementById("abcd-sim-status");
  const stripEl = document.getElementById("triage-subcal-strip");

  const DIGEST_BY_SCEN = {
    urgent_fever: `🩺 <strong>[Anastasia Digest #MD-409]</strong> Leo K. (4y, GeSY #948201): 39.6°C fever + R ear pain. Unlocked 12:30 PM Emergency Buffer. Reply <strong>A / B / C / D</strong>:`,
    dental_emergency: `🦷 <strong>[Anastasia Digest #MD-415]</strong> Dimitris A. (38y, GeSY #704118): Fractured UR4 crown + 8/10 thermal pain (photo attached). Held 12:30 PM Chair Buffer. Reply <strong>A / B / C / D</strong>:`,
    soon_rash: `🩺 <strong>[Anastasia Digest #MD-410]</strong> Andreas M. (34y, GeSY #839104): Forearm rash 48h, afebrile + photo attached. Offered Tomorrow 10:15 AM (P2). Reply <strong>A / B / C / D</strong>:`,
    routine_gesy: `💊 <strong>[Anastasia Digest #MD-411]</strong> Costas P. (GeSY #449102): Chronic refill Amlodipine 5mg + Atorvastatin 20mg (Home BP 122/78). Queued in EOD Batch. Reply <strong>A / B / C / D</strong>:`
  };

  const digests = isGreekUI() && window.DIGEST_EL ? window.DIGEST_EL : DIGEST_BY_SCEN;
  if (digestEl) {
    digestEl.innerHTML = digests[scenKey] || digests.urgent_fever;
  }
  if (badgeEl) {
    badgeEl.textContent = L("📲 Lock-Screen Ready", "📲 Έτοιμο στην οθόνη κλειδώματος");
    badgeEl.style.background = "";
    badgeEl.style.color = "";
  }
  if (statusEl) {
    statusEl.innerHTML = L(
      `💡 Tap <strong>[A]</strong>, <strong>[B]</strong>, <strong>[C]</strong>, or <strong>[D]</strong> above to simulate replying from ${docName()}'s phone lock screen—Anastasia executes it on WhatsApp immediately.`,
      `💡 Πατήστε <strong>[A]</strong>, <strong>[B]</strong>, <strong>[C]</strong> ή <strong>[D]</strong> παραπάνω για να δείτε την απάντηση του γιατρού από την οθόνη κλειδώματος — η Αναστασία την εκτελεί αμέσως στο WhatsApp.`
    );
  }
  if (stripEl) {
    const layerText =
      scenKey === "routine_gesy"
        ? L(`📅 Routed to: <strong>5-Min End-of-Day GeSY Batch Queue</strong> (0 Calendar Slots Consumed)`,
            `📅 Δρομολογήθηκε: <strong>Λίστα ΓεΣΥ τέλους ημέρας (5 λεπτά)</strong> (0 ραντεβού δεσμεύτηκαν)`)
        : L(`📅 Written to: <strong>Anastasia AI Sub-Calendar</strong> (Color-Coded Cyan-Teal Layer)`,
            `📅 Καταχωρίστηκε: <strong>Υπο-ημερολόγιο Αναστασίας AI</strong> (χρωματικό επίπεδο κυανό-τιρκουάζ)`);
    stripEl.innerHTML = `
      <span class="subcal-tag ai-layer">${layerText}</span>
      <span class="subcal-busy-pill">${L("🔒 Checked 3 Calendars (Clinic + Personal + Hospital Rounds)", "🔒 Έλεγχος 3 ημερολογίων (Ιατρείο + Προσωπικό + Εφημερίες νοσοκομείου)")}</span>
    `;
  }
  document.querySelectorAll("#simulator-abcd-card .abcd-btn").forEach((b) => b.classList.remove("selected"));
}

function triggerDoctorQuickReply(optionKey, context, btnEl, itemId) {
  const doc = docName();
  const ACTIONS_EN = {
    A: {
      short: "Approved & Sent",
      simStatus: `✅ <strong>Doctor Replied "A" from Lock Screen:</strong> Anastasia confirmed the recommended slot/prescription on WhatsApp & locked the event on the <strong>Anastasia AI Sub-Calendar</strong>.`,
      waHtml: `✅ <strong>[Doctor Quick-Reply "A" Executed by Anastasia]</strong><br/>${doc} approved your case directly via 1-tap lock-screen reply. Your appointment/prescription is confirmed and synced to the clinic calendar!`,
      gesyNote: "✓ Replied [A]: Approved & Sent Pharmacy Code on WhatsApp"
    },
    B: {
      short: "Next Morning Slot Offered",
      simStatus: `🗓️ <strong>Doctor Replied "B" from Lock Screen:</strong> Anastasia moved the booking to <strong>Tomorrow 09:15 AM Morning Slot</strong> on the AI Sub-Calendar & messaged the patient on WhatsApp.`,
      waHtml: `🗓️ <strong>[Doctor Quick-Reply "B" Executed by Anastasia]</strong><br/>${doc} reviewed your case note and offered our priority morning slot tomorrow at <strong>09:15 AM</strong>. Tap below to confirm!`,
      gesyNote: "🗓️ Replied [B]: Booked Next Morning 09:15 AM Brief Check Slot"
    },
    C: {
      short: "Requested Lab / Photo on WhatsApp",
      simStatus: `📷 <strong>Doctor Replied "C" from Lock Screen:</strong> Anastasia automatically messaged the patient on WhatsApp requesting a recent lab PDF / close-up symptom photo before final sign-off.`,
      waHtml: `📷 <strong>[Doctor Quick-Reply "C" Executed by Anastasia]</strong><br/>${doc} reviewed your request and asked if you can reply here on WhatsApp with a quick photo / latest lab result so we can attach it to your chart right away.`,
      gesyNote: "📷 Replied [C]: Anastasia Requested Latest BP/Lab Photo on WhatsApp"
    },
    D: {
      short: "Escalated — Doctor Calls Back",
      simStatus: `📞 <strong>Doctor Replied "D" from Lock Screen:</strong> Anastasia notified the patient that ${doc} will call them personally right after the current exam.`,
      waHtml: `📞 <strong>[Doctor Quick-Reply "D" Executed by Anastasia]</strong><br/>${doc} saw your triage summary and asked me to let you know they will call you directly on your mobile in ~10 minutes as soon as the current examination finishes.`,
      gesyNote: "📞 Replied [D]: Flagged for Direct 2-Min Doctor Callback"
    }
  };
  const ACTIONS_EL = {
    A: {
      short: "Εγκρίθηκε & στάλθηκε",
      simStatus: `✅ <strong>Ο γιατρός απάντησε «A» από την οθόνη κλειδώματος:</strong> η Αναστασία επιβεβαίωσε το προτεινόμενο ραντεβού/τη συνταγή στο WhatsApp και κλείδωσε την καταχώριση στο <strong>Υπο-ημερολόγιο Αναστασίας AI</strong>.`,
      waHtml: `✅ <strong>[Γρήγορη απάντηση γιατρού «A» — εκτελέστηκε από την Αναστασία]</strong><br/>Ο/Η ${doc} ενέκρινε το αίτημά σας με ένα άγγιγμα. Το ραντεβού/η συνταγή σας επιβεβαιώθηκε και συγχρονίστηκε με το ημερολόγιο του ιατρείου.`,
      gesyNote: "✓ Απάντηση [A]: Εγκρίθηκε — ο κωδικός φαρμακείου στάλθηκε στο WhatsApp"
    },
    B: {
      short: "Προτάθηκε πρωινό ραντεβού",
      simStatus: `🗓️ <strong>Ο γιατρός απάντησε «B» από την οθόνη κλειδώματος:</strong> η Αναστασία μετέφερε το ραντεβού <strong>αύριο στις 09:15</strong> στο υπο-ημερολόγιο AI και ενημέρωσε τον ασθενή στο WhatsApp.`,
      waHtml: `🗓️ <strong>[Γρήγορη απάντηση γιατρού «B» — εκτελέστηκε από την Αναστασία]</strong><br/>Ο/Η ${doc} είδε το σημείωμά σας και σας προτείνει πρωινό ραντεβού προτεραιότητας αύριο στις <strong>09:15</strong>. Πατήστε παρακάτω για επιβεβαίωση.`,
      gesyNote: "🗓️ Απάντηση [B]: Κλείστηκε σύντομο ραντεβού αύριο στις 09:15"
    },
    C: {
      short: "Ζητήθηκαν εξετάσεις / φωτογραφία",
      simStatus: `📷 <strong>Ο γιατρός απάντησε «C» από την οθόνη κλειδώματος:</strong> η Αναστασία ζήτησε αυτόματα από τον ασθενή στο WhatsApp πρόσφατες εξετάσεις (PDF) ή κοντινή φωτογραφία πριν από την τελική έγκριση.`,
      waHtml: `📷 <strong>[Γρήγορη απάντηση γιατρού «C» — εκτελέστηκε από την Αναστασία]</strong><br/>Ο/Η ${doc} είδε το αίτημά σας και παρακαλεί να στείλετε εδώ στο WhatsApp μια φωτογραφία ή τις πιο πρόσφατες εξετάσεις σας, ώστε να επισυναφθούν στον φάκελό σας.`,
      gesyNote: "📷 Απάντηση [C]: Η Αναστασία ζήτησε πρόσφατες μετρήσεις πίεσης/εξετάσεις στο WhatsApp"
    },
    D: {
      short: "Κλιμάκωση — ο γιατρός θα καλέσει",
      simStatus: `📞 <strong>Ο γιατρός απάντησε «D» από την οθόνη κλειδώματος:</strong> η Αναστασία ενημέρωσε τον ασθενή ότι ο γιατρός θα τον καλέσει προσωπικά μόλις ολοκληρωθεί η τρέχουσα εξέταση.`,
      waHtml: `📞 <strong>[Γρήγορη απάντηση γιατρού «D» — εκτελέστηκε από την Αναστασία]</strong><br/>Ο/Η ${doc} είδε τη σύνοψη του περιστατικού σας και θα σας καλέσει στο κινητό σε περίπου 10 λεπτά, μόλις ολοκληρωθεί η τρέχουσα εξέταση.`,
      gesyNote: "📞 Απάντηση [D]: Σημειώθηκε για άμεση τηλεφωνική επικοινωνία με τον γιατρό"
    }
  };
  const ACTIONS = isGreekUI() ? ACTIONS_EL : ACTIONS_EN;

  const act = ACTIONS[optionKey] || ACTIONS.A;

  if (context === "simulator") {
    document.querySelectorAll("#simulator-abcd-card .abcd-btn").forEach((b) => b.classList.remove("selected"));
    if (btnEl) btnEl.classList.add("selected");
    const badgeEl = document.getElementById("abcd-sim-badge");
    if (badgeEl) {
      badgeEl.textContent = L(`✓ Replied "${optionKey}" (${act.short})`, `✓ Απάντηση «${optionKey}» (${act.short})`);
      badgeEl.style.background = "#0d9488";
      badgeEl.style.color = "#ffffff";
    }
    const statusEl = document.getElementById("abcd-sim-status");
    if (statusEl) statusEl.innerHTML = act.simStatus;

    const waList = document.getElementById("wa-messages-list");
    if (waList) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "wa-msg incoming";
      msgDiv.innerHTML = act.waHtml;
      waList.appendChild(msgDiv);
      waList.scrollTop = waList.scrollHeight;
    }
    showToast(L(
      `📲 Doctor replied "${optionKey}" — Anastasia executed "${act.short}" & updated the patient on WhatsApp!`,
      `📲 Ο γιατρός απάντησε «${optionKey}» — η Αναστασία εκτέλεσε «${act.short}» και ενημέρωσε τον ασθενή στο WhatsApp!`
    ));
    return;
  }

  if (context === "gesy" && itemId) {
    const item = state.gesyQueue.find((x) => x.id === itemId);
    if (!item) return;
    item.approved = true;
    item.quickReplyChoice = optionKey;
    item.quickReplyStatus = act.gesyNote;
    renderGesyQueue();
    updateGesyKpi();
    showToast(L(`📲 Replied [${optionKey}] for ${item.patient} — ${act.gesyNote}!`, `📲 Απάντηση [${optionKey}] για ${tr(item.patient)} — ${act.gesyNote}`));
  }
}

function renderGesyQueue() {
  const box = document.getElementById("gesy-queue-box");
  if (!box) return;
  box.innerHTML = state.gesyQueue
    .map(
      (g) => `
      <div class="gesy-item ${g.approved ? "gesy-item-resolved" : ""}">
        <div style="flex:1; min-width:220px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
            <div style="font-size:0.83rem; font-weight:800; color:#0f172a;">
              ${tr(g.patient)} <span style="color:#0d9488; font-size:0.73rem;">(${isGreekUI() ? g.gesyId.replace("GeSY", "ΓεΣΥ") : g.gesyId})</span>
            </div>
            <span class="code-badge" style="font-size:0.68rem;">${tr(g.timeSaved || "Saved 15m slot")}</span>
          </div>
          <div style="font-size:0.75rem; color:#475569; margin-top:3px;">${tr(g.request)}</div>
          <div class="gesy-abcd-row">
            <span class="gesy-abcd-label">${L("📲 Quick Reply:", "📲 Γρήγορη απάντηση:")}</span>
            <button type="button" class="gesy-abcd-chip ${g.quickReplyChoice === "A" ? "active" : ""}" onclick="triggerDoctorQuickReply('A', 'gesy', this, '${g.id}')" title="${L("Approve & Send on WhatsApp", "Έγκριση & αποστολή στο WhatsApp")}">${L("[A] Approve &amp; Send", "[A] Έγκριση")}</button>
            <button type="button" class="gesy-abcd-chip ${g.quickReplyChoice === "B" ? "active" : ""}" onclick="triggerDoctorQuickReply('B', 'gesy', this, '${g.id}')" title="${L("Book Next Morning Slot", "Ραντεβού επόμενο πρωί")}">${L("[B] Morning Slot", "[B] Πρωινό ραντεβού")}</button>
            <button type="button" class="gesy-abcd-chip ${g.quickReplyChoice === "C" ? "active" : ""}" onclick="triggerDoctorQuickReply('C', 'gesy', this, '${g.id}')" title="${L("Request Lab / Photo on WhatsApp", "Αίτημα εξετάσεων / φωτογραφίας στο WhatsApp")}">${L("[C] Ask Lab/Photo", "[C] Εξετάσεις/Φωτογραφία")}</button>
            <button type="button" class="gesy-abcd-chip ${g.quickReplyChoice === "D" ? "active" : ""}" onclick="triggerDoctorQuickReply('D', 'gesy', this, '${g.id}')" title="${L("Escalate — Doctor Will Call Back", "Κλιμάκωση — ο γιατρός θα καλέσει")}">${L("[D] Call Back", "[D] Επανάκληση")}</button>
          </div>
          ${
            g.quickReplyStatus
              ? `<div class="gesy-reply-outcome">${g.quickReplyStatus}</div>`
              : ""
          }
        </div>
        <button
          type="button"
          class="gesy-approve-btn ${g.approved ? "approved" : ""}"
          onclick="approveGesyItem('${g.id}')"
        >
          ${g.approved ? L("✓ Action Sent on WhatsApp", "✓ Στάλθηκε στο WhatsApp") : L("✓ 1-Click Approve [A]", "✓ Έγκριση με 1 κλικ [A]")}
        </button>
      </div>`
    )
    .join("");
}

function approveGesyItem(id) {
  triggerDoctorQuickReply("A", "gesy", null, id);
}

function approveAllGesy() {
  state.gesyQueue.forEach((g) => {
    g.approved = true;
    g.quickReplyChoice = g.quickReplyChoice || "A";
    g.quickReplyStatus = g.quickReplyStatus || L("✓ Replied [A]: Approved & Sent Pharmacy Code on WhatsApp", "✓ Απάντηση [A]: Εγκρίθηκε — ο κωδικός φαρμακείου στάλθηκε στο WhatsApp");
  });
  renderGesyQueue();
  updateGesyKpi();
  showToast(L("✅ All End-of-Day GeSY prescriptions & referrals approved in 1 click!", "✅ Όλες οι συνταγές και τα παραπεμπτικά ΓεΣΥ της ημέρας εγκρίθηκαν με 1 κλικ!"));
}

// ============================================================================
// Tab 3: Phase 2 Preview — Patient Discovery & Live Slot Marketplace
// ============================================================================
function renderMarketplaceDoctors() {
  const grid = document.getElementById("marketplace-doctors-grid");
  if (!grid) return;

  const specFilter = document.getElementById("mp-specialty-filter")?.value || "all";
  const cityFilter = document.getElementById("mp-city-filter")?.value || "all";
  const query = (document.getElementById("mp-symptom-input")?.value || "").trim().toLowerCase();

  const filtered = state.marketplaceDoctors.filter((d) => {
    if (specFilter !== "all" && d.specialty !== specFilter) return false;
    if (cityFilter !== "all" && d.city !== cityFilter) return false;
    if (query) {
      const hay = `${d.name} ${d.specialtyLabel} ${d.city} ${d.area} ${tr(d.name)} ${tr(d.specialtyLabel)} ${tr(d.city)} ${tr(d.area)}`.toLowerCase();
      const matchFever = /fever|child|kid|ear|πυρετ|παιδ|αυτ|ωτ/.test(query) && (d.specialty === "Pediatrics" || d.specialty === "ENT");
      const matchRash = /rash|skin|mole|δέρμ|δερμ|εξάνθ|εξανθ|σπίλ|σπιλ|ελιά|κνησμ/.test(query) && d.specialty === "Dermatology";
      const matchHeart = /heart|bp|chest|καρδ|πίεσ|πιεσ|στήθ|στηθ|ταχυκαρδ|αρρυθμ/.test(query) && d.specialty === "Cardiology";
      const matchDental = /tooth|teeth|dental|dentist|crown|filling|implant|cleaning|δόντ|δοντ|οδοντ|σφράγισμ|καθαρισμ/.test(query) && d.specialty === "Dental";
      if (!hay.includes(query) && !matchFever && !matchRash && !matchHeart && !matchDental) return false;
    }
    return true;
  });

  grid.innerHTML = filtered
    .map(
      (d) => `
      <div class="doctor-mp-card ${d.urgentBufferAvailable ? "urgent-ready" : ""}">
        <div class="doc-mp-header">
          <div>
            <div class="doc-mp-name">${tr(d.name)}</div>
            <div class="doc-mp-spec">${tr(d.specialtyLabel)}</div>
            <div style="font-size:0.74rem; color:#64748b; margin-top:2px;">📍 ${tr(d.area)} • ${tr(d.coverage)}</div>
          </div>
          <span class="code-badge sample-badge">${L("Sample", "Δείγμα")}</span>
        </div>
        <div style="font-size:0.73rem; background:#f8fafc; padding:6px 9px; border-radius:7px; border:1px solid #e2e8f0; color:#334155;">
          🤖 <strong>${L("Concept:", "Ιδέα:")}</strong> ${tr(d.aiStatus)}
        </div>
        <div style="font-size:0.72rem; font-weight:800; color:#0f172a; text-transform:uppercase;">
          ${L("Example slots (illustrative only):", "Ενδεικτικά ραντεβού (μόνο για επίδειξη):")}
        </div>
        <div class="doc-mp-slots">
          ${d.slots
            .map(
              (s) => `
              <button
                type="button"
                class="doc-slot-pill ${s.urgent ? "urgent" : ""}"
                onclick="bookMarketplaceSlot('${d.id}', ${d.slots.indexOf(s)})"
              >
                ${mpSlotLabel(s.label)}
              </button>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

function mpSlotLabel(label) {
  if (!isGreekUI()) return label;
  const days = { "Today": "Σήμερα", "Tomorrow": "Αύριο", "Thu": "Πέμ." };
  return fmtTime(label.replace(/\b(Today|Tomorrow|Thu)\b/, (d) => days[d]));
}

function bookMarketplaceSlot(docId, slotIdx) {
  const d = state.marketplaceDoctors.find((x) => x.id === docId);
  if (!d) return;
  const slotLabel = mpSlotLabel((d.slots[slotIdx] || d.slots[0]).label);
  showToast(L(
    `🧪 Concept mock-up: in the future app, ${slotLabel} with ${d.name} would be booked here. No real booking was made.`,
    `🧪 Πρόταση σχεδιασμού: στη μελλοντική εφαρμογή, εδώ θα κλεινόταν το ραντεβού «${slotLabel}» με ${tr(d.name)}. Δεν έγινε πραγματική κράτηση.`
  ));
}

// ============================================================================
// Live Notification Toast Helper
// ============================================================================
function showToast(msg) {
  const banner = document.getElementById("live-toast-banner");
  const textEl = document.getElementById("live-toast-text");
  if (!banner || !textEl) return;
  textEl.textContent = tr(msg);
  banner.hidden = false;
}

// ============================================================================
// Initialize on DOMContentLoaded
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  if (isGreekUI()) setMicLanguage("el-GR", true);
  setBrandVariant("mydocdesk", "schedule_gold", true);
  applyClinicBranding();
  triggerScenario("urgent_fever", document.getElementById("btn-scen-urgent"));
  updateClinicRoi();
  renderDoctorSchedule();
  renderGesyQueue();
  renderMarketplaceDoctors();

  const hashTab = (window.location.hash || "").replace("#", "").trim();
  const urlTab = new URLSearchParams(window.location.search).get("tab");
  const initialTab = urlTab || hashTab;
  if (["simulator", "schedule", "marketplace", "logos", "onepager"].includes(initialTab)) {
    switchTab(initialTab);
  }
});


// ============================================================================
// Tab 5: Doctor 1-Pager Language View Switcher (Side-by-Side / EN / EL)
// ============================================================================
function setOnePagerLang(mode) {
  const sheetEn = document.getElementById("onepager-sheet-en");
  const sheetEl = document.getElementById("onepager-sheet-el");
  const grid = document.getElementById("onepager-dual-grid");
  if (!sheetEn || !sheetEl || !grid) return;

  sheetEn.hidden = mode === "el";
  sheetEl.hidden = mode === "en";
  grid.classList.toggle("single-col", mode !== "both");

  ["both", "en", "el"].forEach((k) => {
    document.getElementById(`op-btn-${k}`)?.classList.toggle("active", k === mode);
  });
}

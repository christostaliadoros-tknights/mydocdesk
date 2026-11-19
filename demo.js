/* MyDocDesk — Live demo page (decluttered, 2026-11-19).
   Four illustrative cases: the call on the left, the doctor's WhatsApp 1/2/3/4 reply on the right.
   EN/ΕΛ via i18n.js (isGreekUI / L). Anastasia's voice uses the pre-generated clips in
   assets/voice/ (clips.js); a "Hear Anastasia" button is shown only when a clip exists for the
   exact turn text in the current language. */
(function () {
  "use strict";
  var EL = typeof isGreekUI === "function" && isGreekUI();
  function t(en, el) { return EL ? el : en; }

  var CASES_EN = {
    fever: {
      clinic: "Pediatric clinic", caller: "Maria K. (mother)", callerWho: "Maria K.", level: "1",
      prio: ["Priority 1", "Urgent same-day", "12:30 buffer held"],
      turns: [
        ["ai", "You’ve reached the pediatric clinic. The doctor is with a patient — I can help. How can I help your child today?"],
        ["caller", "My 4-year-old son Leo has had a 39.6°C fever since last night, and he’s pulling at his right ear. Can the doctor see him today?"],
        ["ai", "I’m sorry Leo isn’t feeling well. Is he breathing comfortably, and can he drink fluids?"],
        ["caller", "Yes, his breathing is normal and he drank water after Nurofen at 7:30 AM."],
        ["ai", "Because you described acute symptoms, I have marked this as Priority 1 Urgent, unlocked the doctor's 12:30 PM Emergency Buffer Slot, and attached your Case Note!"]
      ],
      digest: { tag: "Approval needed · #MD-409", urgent: true, time: "12:05",
        html: "Leo K. (4y, GeSY): 39.6°C fever since last night + right ear pain. No urgent symptoms reported. Reply: <strong>1</strong> book today 12:30 buffer · <strong>2</strong> tomorrow 09:00 · <strong>3</strong> I’ll call the parent · <strong>4</strong> decline" },
      replies: ["Book today 12:30", "Tomorrow 09:00", "I’ll call the parent", "Decline"],
      confirm: [
        "Done. Leo is booked at 12:30. I’ve texted the mother to confirm and pinned the case note to the calendar event.",
        "Done. Leo is booked tomorrow at 09:00. I’ve texted the mother to confirm and pinned the case note to the calendar event.",
        "Noted. I’ll hold the 12:30 buffer. The parent is expecting your call.",
        "Noted. I have not booked a slot. I’ll let the parent know and keep the case flagged."
      ]
    },
    dental: {
      clinic: "Dental clinic", caller: "Dimitris A.", callerWho: "Dimitris A.", level: "1",
      prio: ["Priority 1", "Urgent same-day", "12:30 chair slot held"],
      turns: [
        ["ai", "You’ve reached the dental clinic. The doctor is mid-procedure — I can help. How can I help today?"],
        ["caller", "I fractured my upper-right premolar crown and have sharp throbbing pain whenever air or cold water touches it."],
        ["ai", "I’m sorry you’re in pain. Any facial swelling, fever, or bleeding?"],
        ["caller", "No swelling, no fever, and no bleeding — just the fractured crown and sharp sensitivity."],
        ["ai", "Because you have an acute dental emergency (broken tooth/crown or severe toothache), I unlocked the doctor's 12:30 PM 30-Minute Emergency Chair Slot and flagged the nurse to prep the bonding/crown tray. Please snap a quick tooth photo on WhatsApp!"]
      ],
      digest: { tag: "Approval needed · #MD-415", urgent: true, time: "12:08",
        html: "Dimitris A. (38y, GeSY): Fractured upper-right premolar crown + sharp pain. No swelling or fever. Reply: <strong>1</strong> book today 12:30 chair slot · <strong>2</strong> tomorrow morning · <strong>3</strong> I’ll call the patient · <strong>4</strong> decline" },
      replies: ["Book today 12:30", "Tomorrow morning", "I’ll call the patient", "Decline"],
      confirm: [
        "Done. Dimitris is booked at 12:30. I’ve texted him to confirm and pinned the tooth photo and case note to the calendar event.",
        "Done. Dimitris is booked tomorrow morning. I’ve texted him to confirm and pinned the case note to the calendar event.",
        "Noted. I’ll hold the 12:30 chair slot. The patient is expecting your call.",
        "Noted. I have not booked a slot. I’ll let the patient know and keep the case flagged."
      ]
    },
    rash: {
      clinic: "Dermatology clinic", caller: "Andreas M. (WhatsApp)", callerWho: "Andreas M.", level: "2",
      prio: ["Priority 2", "Within 24–48h", "Tomorrow 10:15 offered"],
      turns: [
        ["caller", "Hello, I noticed a red circular rash on my forearm 2 days ago that is itchy and spreading slightly. No fever. Can I send a photo and book a check?"],
        ["ai", "Hello Andreas! You've reached the dermatology clinic. Because you have no fever, breathing issue, or facial swelling, I have marked this as Priority 2 (Within 24–48h). Please send a clear photo of your forearm on WhatsApp so the doctor can inspect it alongside your booking."],
        ["caller", "Here is the photo from this morning. It itches mildly, no fever."]
      ],
      digest: { tag: "Approval needed · #MD-410", urgent: false, time: "10:20",
        html: "Andreas M. (34y, GeSY): Forearm rash for 48 hours, no fever, photo attached. Offered tomorrow 10:15. Reply: <strong>1</strong> book tomorrow 10:15 · <strong>2</strong> later this week · <strong>3</strong> I’ll call the patient · <strong>4</strong> decline" },
      replies: ["Tomorrow 10:15", "Later this week", "I’ll call the patient", "Decline"],
      confirm: [
        "Done. Andreas is booked tomorrow at 10:15. I’ve texted him to confirm and pinned the photo and case note to the calendar event.",
        "Done. I’ll offer Andreas a slot later this week and confirm it by text message.",
        "Noted. I’ll hold the 10:15 slot. The patient is expecting your call.",
        "Noted. I have not booked a slot. I’ll let the patient know and keep the case flagged."
      ]
    },
    gesy: {
      clinic: "Cardiology clinic", caller: "Costas P.", callerWho: "Costas P.", level: "3",
      prio: ["Priority 3", "GeSY admin queue", "no clinic slot used"],
      turns: [
        ["ai", "You’ve reached the cardiology clinic. The doctor is with a patient — I can help."],
        ["caller", "I don’t need an exam. I just need the doctor to renew my monthly GeSY blood pressure pills (Amlodipine 5mg)."],
        ["ai", "I can take care of that without an appointment. Any new dizziness or chest pain?"],
        ["caller", "No, my pressure is 122/78 every morning."],
        ["ai", "I have logged your GeSY prescription renewal into the doctor's 5-Minute End-of-Day Approval Queue so you don't need to wait or book an exam slot!"]
      ],
      digest: { tag: "End-of-day GeSY batch · #MD-411", urgent: false, time: "10:22",
        html: "Costas P. (GeSY): Amlodipine 5mg + Atorvastatin 20mg renewal. Home BP 122/78, no new symptoms. Reply: <strong>1</strong> approve for the end-of-day batch · <strong>2</strong> review first · <strong>3</strong> I’ll call the patient · <strong>4</strong> decline" },
      replies: ["Approve in batch", "Review first", "I’ll call the patient", "Decline"],
      confirm: [
        "Done. The renewal is in today’s end-of-day GeSY batch. I’ll text Costas as soon as it’s signed.",
        "Noted. I’ve held the renewal for your review and will not send it to the pharmacy yet.",
        "Noted. I’ll hold the renewal. The patient is expecting your call.",
        "Noted. I have not added this to the batch. I’ll let the patient know."
      ]
    }
  };

  var CASES_EL = {
    fever: {
      clinic: "Παιδιατρικό ιατρείο", caller: "Μαρία Κ. (μητέρα)", callerWho: "Μαρία Κ.", level: "1",
      prio: ["Προτεραιότητα 1", "Επείγον, την ίδια μέρα", "κρατήθηκε το ραντεβού επειγόντων 12:30"],
      turns: [
        ["ai", "Επικοινωνήσατε με το παιδιατρικό ιατρείο. Ο γιατρός είναι με ασθενή, μπορώ όμως να σας βοηθήσω εγώ. Τι συμβαίνει με το παιδί σας;"],
        ["caller", "Ο γιος μου ο Λέων, 4 χρονών, έχει πυρετό 39,6 από χθες το βράδυ και τραβά συνέχεια το δεξί του αυτί. Μπορεί να τον δει ο γιατρός σήμερα;"],
        ["ai", "Λυπάμαι που ο Λέων δεν είναι καλά. Αναπνέει άνετα και μπορεί να πίνει υγρά;"],
        ["caller", "Ναι, αναπνέει κανονικά και ήπιε νερό μετά το Nurofen στις 7:30 το πρωί."],
        ["ai", "Λόγω των οξέων συμπτωμάτων, το περιστατικό καταχωρίστηκε ως επείγον. Κράτησα το ραντεβού επειγόντων στις 12:30 και ενημέρωσα τον φάκελο για τον γιατρό."]
      ],
      digest: { tag: "Χρειάζεται έγκριση · #MD-409", urgent: true, time: "12:05",
        html: "Λέων Κ. (4 ετών, ΓεΣΥ): πυρετός 39,6°C από χθες το βράδυ + πόνος στο δεξί αυτί. Δεν αναφέρθηκαν επείγοντα συμπτώματα. Απαντήστε: <strong>1</strong> ραντεβού σήμερα 12:30 · <strong>2</strong> αύριο 09:00 · <strong>3</strong> θα πάρω εγώ τον γονιό · <strong>4</strong> απόρριψη" },
      replies: ["Σήμερα 12:30", "Αύριο 09:00", "Θα πάρω τον γονιό", "Απόρριψη"],
      confirm: [
        "Έγινε. Ο Λέων έκλεισε ραντεβού για τις 12:30. Έστειλα SMS επιβεβαίωσης στη μητέρα και επισύναψα το σημείωμα στο ραντεβού στο ημερολόγιο.",
        "Έγινε. Ο Λέων έκλεισε ραντεβού για αύριο στις 09:00. Έστειλα SMS επιβεβαίωσης στη μητέρα και επισύναψα το σημείωμα στο ραντεβού στο ημερολόγιο.",
        "Εντάξει. Κρατώ το ραντεβού επειγόντων των 12:30. Ο γονιός περιμένει το τηλεφώνημά σας.",
        "Εντάξει. Δεν έκλεισα ραντεβού. Θα ενημερώσω τον γονιό και το περιστατικό μένει σημαδεμένο."
      ]
    },
    dental: {
      clinic: "Οδοντιατρείο", caller: "Δημήτρης Α.", callerWho: "Δημήτρης Α.", level: "1",
      prio: ["Προτεραιότητα 1", "Επείγον, την ίδια μέρα", "κρατήθηκε η θέση των 12:30"],
      turns: [
        ["ai", "Επικοινωνήσατε με το οδοντιατρείο. Ο γιατρός είναι στη μέση μιας θεραπείας, μπορώ όμως να σας βοηθήσω εγώ. Πώς μπορώ να βοηθήσω;"],
        ["caller", "Έσπασε η στεφάνη στον πάνω δεξιό προγόμφιο και έχω έντονο, σφυγμικό πόνο όταν τον αγγίζει αέρας ή κρύο νερό."],
        ["ai", "Λυπάμαι που πονάτε. Έχετε πρήξιμο στο πρόσωπο, πυρετό ή αιμορραγία;"],
        ["caller", "Ούτε πρήξιμο, ούτε πυρετό, ούτε αιμορραγία. Μόνο η σπασμένη στεφάνη και έντονη ευαισθησία."],
        ["ai", "Λόγω του οξέος πόνου και του σπασμένου δοντιού, το περιστατικό σας καταχωρίστηκε ως επείγον. Κράτησα το 30λεπτο επείγον ραντεβού στις 12:30. Παρακαλώ στείλτε μας μια φωτογραφία του δοντιού στο WhatsApp, ώστε να προετοιμαστούν τα απαραίτητα."]
      ],
      digest: { tag: "Χρειάζεται έγκριση · #MD-415", urgent: true, time: "12:08",
        html: "Δημήτρης Α. (38 ετών, ΓεΣΥ): σπασμένη στεφάνη στον πάνω δεξιό προγόμφιο + έντονος πόνος. Χωρίς πρήξιμο ή πυρετό. Απαντήστε: <strong>1</strong> ραντεβού σήμερα 12:30 · <strong>2</strong> αύριο το πρωί · <strong>3</strong> θα πάρω εγώ τον ασθενή · <strong>4</strong> απόρριψη" },
      replies: ["Σήμερα 12:30", "Αύριο το πρωί", "Θα πάρω τον ασθενή", "Απόρριψη"],
      confirm: [
        "Έγινε. Ο Δημήτρης έκλεισε ραντεβού για τις 12:30. Του έστειλα SMS επιβεβαίωσης και επισύναψα τη φωτογραφία και το σημείωμα στο ραντεβού στο ημερολόγιο.",
        "Έγινε. Ο Δημήτρης έκλεισε ραντεβού για αύριο το πρωί. Του έστειλα SMS επιβεβαίωσης και επισύναψα το σημείωμα στο ραντεβού στο ημερολόγιο.",
        "Εντάξει. Κρατώ τη θέση των 12:30. Ο ασθενής περιμένει το τηλεφώνημά σας.",
        "Εντάξει. Δεν έκλεισα ραντεβού. Θα ενημερώσω τον ασθενή και το περιστατικό μένει σημαδεμένο."
      ]
    },
    rash: {
      clinic: "Δερματολογικό ιατρείο", caller: "Ανδρέας Μ. (WhatsApp)", callerWho: "Ανδρέας Μ.", level: "2",
      prio: ["Προτεραιότητα 2", "Εντός 24–48 ωρών", "προτάθηκε αύριο 10:15"],
      turns: [
        ["caller", "Γεια σας, πριν από 2 μέρες πρόσεξα ένα κόκκινο κυκλικό εξάνθημα στον πήχη μου, που με τρώει και απλώνεται λίγο. Δεν έχω πυρετό. Μπορώ να στείλω φωτογραφία και να κλείσω ραντεβού;"],
        ["ai", "Γεια σας, κύριε Ανδρέα! Επικοινωνήσατε με το δερματολογικό ιατρείο. Επειδή δεν έχετε πυρετό, δυσκολία στην αναπνοή ή πρήξιμο στο πρόσωπο, κατέταξα το περιστατικό ως Προτεραιότητα 2, για εξέταση εντός 24 έως 48 ωρών. Παρακαλώ στείλτε μια καθαρή φωτογραφία του πήχη στο WhatsApp, ώστε η γιατρός να τη δει μαζί με το ραντεβού σας."],
        ["caller", "Ορίστε η φωτογραφία από σήμερα το πρωί. Με τρώει λίγο, πυρετό δεν έχω."]
      ],
      digest: { tag: "Χρειάζεται έγκριση · #MD-410", urgent: false, time: "10:20",
        html: "Ανδρέας Μ. (34 ετών, ΓεΣΥ): εξάνθημα στον πήχη εδώ και 48 ώρες, χωρίς πυρετό, με φωτογραφία. Προτάθηκε αύριο 10:15. Απαντήστε: <strong>1</strong> ραντεβού αύριο 10:15 · <strong>2</strong> αργότερα μέσα στην εβδομάδα · <strong>3</strong> θα πάρω εγώ τον ασθενή · <strong>4</strong> απόρριψη" },
      replies: ["Αύριο 10:15", "Μέσα στην εβδομάδα", "Θα πάρω τον ασθενή", "Απόρριψη"],
      confirm: [
        "Έγινε. Ο Ανδρέας έκλεισε ραντεβού για αύριο στις 10:15. Του έστειλα SMS επιβεβαίωσης και επισύναψα τη φωτογραφία και το σημείωμα στο ραντεβού στο ημερολόγιο.",
        "Έγινε. Θα προτείνω στον Ανδρέα ραντεβού αργότερα μέσα στην εβδομάδα και θα του το επιβεβαιώσω με SMS.",
        "Εντάξει. Κρατώ τη θέση των 10:15. Ο ασθενής περιμένει το τηλεφώνημά σας.",
        "Εντάξει. Δεν έκλεισα ραντεβού. Θα ενημερώσω τον ασθενή και το περιστατικό μένει σημαδεμένο."
      ]
    },
    gesy: {
      clinic: "Καρδιολογικό ιατρείο", caller: "Κώστας Π.", callerWho: "Κώστας Π.", level: "3",
      prio: ["Προτεραιότητα 3", "Διοικητικά ΓεΣΥ", "δεν δεσμεύεται ραντεβού"],
      turns: [
        ["ai", "Επικοινωνήσατε με το καρδιολογικό ιατρείο. Ο γιατρός είναι με ασθενή, μπορώ όμως να σας βοηθήσω εγώ."],
        ["caller", "Δεν χρειάζομαι εξέταση. Θέλω μόνο να μου ανανεώσει ο γιατρός τα μηνιαία χάπια για την πίεση από το ΓεΣΥ (Amlodipine 5mg)."],
        ["ai", "Μπορώ να το κανονίσω χωρίς ραντεβού. Έχετε νέα ζάλη ή πόνο στο στήθος;"],
        ["caller", "Όχι, η πίεσή μου είναι 122/78 κάθε πρωί."],
        ["ai", "Καταχώρισα την ανανέωση της συνταγής ΓεΣΥ στη λίστα έγκρισης του γιατρού για το τέλος της ημέρας. Δεν χρειάζεται να έρθετε στο ιατρείο· θα σας στείλουμε γραπτό μήνυμα μόλις υπογραφεί."]
      ],
      digest: { tag: "Λίστα ΓεΣΥ τέλους ημέρας · #MD-411", urgent: false, time: "10:22",
        html: "Κώστας Π. (ΓεΣΥ): ανανέωση Amlodipine 5mg + Atorvastatin 20mg. Πίεση στο σπίτι 122/78, χωρίς νέα συμπτώματα. Απαντήστε: <strong>1</strong> έγκριση στη λίστα τέλους ημέρας · <strong>2</strong> θα το δω πρώτα · <strong>3</strong> θα πάρω εγώ τον ασθενή · <strong>4</strong> απόρριψη" },
      replies: ["Έγκριση στη λίστα", "Θα το δω πρώτα", "Θα πάρω τον ασθενή", "Απόρριψη"],
      confirm: [
        "Έγινε. Η ανανέωση μπήκε στη σημερινή λίστα ΓεΣΥ τέλους ημέρας. Θα στείλω SMS στον Κώστα μόλις υπογραφεί.",
        "Εντάξει. Κράτησα την ανανέωση για να τη δείτε πρώτα και δεν θα σταλεί ακόμη στο φαρμακείο.",
        "Εντάξει. Κρατώ την ανανέωση. Ο ασθενής περιμένει το τηλεφώνημά σας.",
        "Εντάξει. Δεν την πρόσθεσα στη λίστα. Θα ενημερώσω τον ασθενή."
      ]
    }
  };

  var CASES = EL ? CASES_EL : CASES_EN;
  var VOICE_LANG = EL ? "el-GR" : "en-GB";
  var TXT = {
    who: t("Anastasia", "Αναστασία"),
    hear: t("Hear Anastasia", "Ακούστε την Αναστασία"),
    stop: t("Stop", "Διακοπή"),
    hint: t("Tap 1, 2, 3 or 4 to reply as the doctor.", "Πατήστε 1, 2, 3 ή 4 για να απαντήσετε ως γιατρός."),
    sent: t("Reply sent. Choose another case, or tap a different number.", "Η απάντηση στάλθηκε. Διαλέξτε άλλο περιστατικό ή πατήστε άλλον αριθμό."),
    call: t("Call Anastasia", "Καλέστε την Αναστασία")
  };

  function $(id) { return document.getElementById(id); }
  var els = {};
  var current = null;
  var player = { audio: null, btn: null };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /** Clip key for a turn, or null when no pre-recorded clip matches its exact text. */
  function clipFor(text) {
    if (typeof voiceClipKey !== "function") return null;
    var key = voiceClipKey(text, VOICE_LANG);
    return window.VOICE_CLIPS && window.VOICE_CLIPS[key] ? key : null;
  }

  var ICO_PLAY = '<svg class="ico-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
  var ICO_STOP = '<svg class="ico-stop" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/></svg>';

  function stopVoice() {
    if (player.audio) { try { player.audio.pause(); } catch (_) {} }
    if (player.btn) setBtn(player.btn, false);
    player.audio = null; player.btn = null;
  }

  function setBtn(btn, playing) {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    btn.querySelector(".dm-hear-lbl").textContent = playing ? TXT.stop : TXT.hear;
  }

  function playClip(btn) {
    var key = btn.getAttribute("data-clip");
    if (player.btn === btn) { stopVoice(); return; }
    stopVoice();
    var audio = new Audio("./assets/voice/" + key + ".mp3");
    player.audio = audio; player.btn = btn;
    setBtn(btn, true);
    var done = function () { if (player.audio === audio) stopVoice(); };
    audio.addEventListener("ended", done);
    audio.addEventListener("error", done);
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(done);
  }

  function renderTurns(scen) {
    els.transcript.innerHTML = scen.turns.map(function (turn) {
      var role = turn[0], text = turn[1];
      var who = role === "ai" ? TXT.who : scen.callerWho;
      var clip = role === "ai" ? clipFor(text) : null;
      var btn = clip
        ? '<button type="button" class="dm-hear-btn" data-clip="' + clip + '" aria-pressed="false"><span class="dm-hear-ico">' + ICO_PLAY + ICO_STOP + '</span><span class="dm-hear-lbl">' + esc(TXT.hear) + "</span></button>"
        : "";
      return '<div class="dm-turn ' + role + '"><div class="dm-turn-who">' + esc(who) + '</div><div class="dm-turn-body"><p>' + esc(text) + "</p>" + btn + "</div></div>";
    }).join("");
  }

  function renderDigest(d) {
    els.digest.innerHTML = '<div class="dm-bubble-tag' + (d.urgent ? " urgent-tag" : "") + '">' + esc(d.tag) + "</div><p>" + d.html + '</p><span class="dm-bubble-meta">' + d.time + "</span>";
    els.reply.hidden = true; els.confirm.hidden = true;
    els.reply.innerHTML = ""; els.confirm.innerHTML = "";
  }

  function renderReplies(scen) {
    els.replies.classList.remove("is-done");
    els.replyRow.innerHTML = scen.replies.map(function (label, i) {
      var k = String(i + 1);
      return '<button type="button" class="dm-reply-btn" data-key="' + k + '" aria-pressed="false"><span class="dm-reply-key">' + k + "</span><span>" + esc(label) + "</span></button>";
    }).join("");
    els.hint.textContent = TXT.hint;
  }

  function loadCase(key) {
    var scen = CASES[key];
    if (!scen) return;
    stopVoice();
    current = key;
    document.querySelectorAll(".dm-case-chip").forEach(function (btn) {
      var on = btn.getAttribute("data-case") === key;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    els.clinic.textContent = scen.clinic;
    els.caller.textContent = scen.caller;
    els.prio.innerHTML = "<strong>" + esc(scen.prio[0]) + "</strong> · " + esc(scen.prio.slice(1).join(" · "));
    els.prio.setAttribute("data-level", scen.level);
    renderTurns(scen);
    renderDigest(scen.digest);
    renderReplies(scen);
  }

  function applyReply(k) {
    var scen = CASES[current];
    var i = parseInt(k, 10) - 1;
    if (!scen || !scen.confirm[i]) return;
    var time = scen.digest.time.replace(/(\d\d)$/, function (m) { var n = parseInt(m, 10) + 1; return (n < 10 ? "0" : "") + n; });
    els.reply.hidden = false;
    els.reply.innerHTML = "<p>" + k + '</p><span class="dm-bubble-meta">' + time + " ✓✓</span>";
    els.confirm.hidden = false;
    els.confirm.innerHTML = "<p>" + esc(scen.confirm[i]) + '</p><span class="dm-bubble-meta">' + time + "</span>";
    els.replies.classList.add("is-done");
    els.replyRow.querySelectorAll(".dm-reply-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-key") === k ? "true" : "false");
    });
    els.hint.textContent = TXT.sent;
  }

  function init() {
    els = {
      clinic: $("dm-clinic-name"), caller: $("dm-caller-line"), transcript: $("dm-transcript"),
      digest: $("dm-wa-digest"), reply: $("dm-wa-reply"), confirm: $("dm-wa-confirm"),
      replyRow: $("dm-reply-row"), replies: $("dm-replies"), hint: $("dm-replies-hint"), prio: $("dm-prio-line")
    };
    if (!els.transcript || !els.replyRow) return; // not the demo page
    document.querySelectorAll(".js-call-label").forEach(function (n) { n.textContent = TXT.call; });
    document.querySelectorAll(".dm-case-chip").forEach(function (btn) {
      btn.addEventListener("click", function () { loadCase(btn.getAttribute("data-case")); });
    });
    els.replyRow.addEventListener("click", function (e) {
      var btn = e.target.closest(".dm-reply-btn");
      if (btn) applyReply(btn.getAttribute("data-key"));
    });
    els.transcript.addEventListener("click", function (e) {
      var btn = e.target.closest(".dm-hear-btn");
      if (btn) playClip(btn);
    });
    document.addEventListener("keydown", function (e) {
      if (["1", "2", "3", "4"].indexOf(e.key) === -1 || e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      applyReply(e.key);
    });
    loadCase("fever");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

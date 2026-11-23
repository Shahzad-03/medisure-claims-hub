(function(){
  const patientRecords = [
    {
      name: "Aisha Khan",
      insurance: "INS-204991",
      dob: "12 Mar 1988",
      doctor: "Dr Patel",
      policy: "Active",
      address: "44 Rosemount Street, Aberdeen",
      phone: "07700 123456",
      email: "aisha.khan@email.com",
      company: "North Care Health Insurance",
      visits: [
        "02 Apr 2026 - Consultation with Dr Patel",
        "27 Mar 2026 - Follow-up visit",
        "10 Mar 2026 - Initial assessment"
      ],
      drugs: [
        "Atorvastatin - Active",
        "Ibuprofen - Completed",
        "Omeprazole - Active"
      ],
      alerts: "Incomplete allergy field and one pending prescription review."
    },
    {
      name: "John Fraser",
      insurance: "INS-300115",
      dob: "05 Nov 1975",
      doctor: "Dr Campbell",
      policy: "Active",
      address: "18 Riverside Drive, Dundee",
      phone: "07880 555122",
      email: "john.fraser@email.com",
      company: "Northern Health Cover",
      visits: [
        "13 Apr 2026 - Diabetes review with Dr Campbell",
        "30 Mar 2026 - Blood test follow-up",
        "12 Mar 2026 - Medication check"
      ],
      drugs: [
        "Metformin - Active",
        "Lisinopril - Active"
      ],
      alerts: "Recent claim on hold pending final administrative confirmation."
    },
    {
      name: "Emma Brown",
      insurance: "INS-440021",
      dob: "21 Feb 1993",
      doctor: "Dr Singh",
      policy: "Archived",
      address: "7 Clyde Avenue, Glasgow",
      phone: "07400 120450",
      email: "emma.brown@email.com",
      company: "North Care Health Insurance",
      visits: [
        "09 Apr 2026 - Cardiology follow-up",
        "18 Mar 2026 - Initial referral consultation"
      ],
      drugs: [
        "Amoxicillin - Completed",
        "Aspirin - Active"
      ],
      alerts: "Archived policy. Review claim eligibility before approval."
    }
  ];

  const reportViews = {
    claims: {
      titles: ["Claims by month", "Average review time", "Approved claims"],
      texts: [
        "Track claims processed across the selected reporting period.",
        "Monitor how quickly claims are reviewed and completed.",
        "Review the number of approved claims in the current range."
      ],
      values: ["268", "2.4 days", "211"],
      chart: {
        title: "Claims by month",
        series: "Claims processed",
        ranges: {
          "30": {
            title: "Claims by week",
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            values: [52, 64, 48, 72],
            caption: "Claim volume grouped by week for operational review."
          },
          "90": {
            title: "Claims by month",
            labels: ["Month 1", "Month 2", "Month 3"],
            values: [168, 192, 211],
            caption: "Claim volume grouped by month across the quarter."
          },
          "365": {
            title: "Claims by month",
            labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
            values: [188, 174, 201, 195, 220, 214, 236, 208, 226, 241, 258, 268],
            caption: "Claim volume grouped by month across the last year."
          }
        }
      }
    },
    alerts: {
      titles: ["Drug alerts", "High-risk cases", "Resolved alerts"],
      texts: [
        "Monitor high-risk medication combinations.",
        "Review cases escalated for clinical attention.",
        "Track alert resolutions over the reporting period."
      ],
      values: ["34", "9", "25"],
      chart: {
        title: "Medication alerts by week",
        series: "Alerts raised",
        ranges: {
          "30": {
            title: "Medication alerts by week",
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            values: [7, 9, 5, 11],
            caption: "Alert activity grouped by week for clinical follow-up."
          },
          "90": {
            title: "Medication alerts by month",
            labels: ["Month 1", "Month 2", "Month 3"],
            values: [21, 26, 34],
            caption: "Alert activity grouped by month across the quarter."
          },
          "365": {
            title: "Medication alerts by month",
            labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
            values: [18, 22, 19, 24, 28, 31, 27, 30, 25, 29, 32, 34],
            caption: "Alert activity grouped by month across the last year."
          }
        }
      }
    },
    providers: {
      titles: ["Provider activity", "Visits recorded", "Prescriptions issued"],
      texts: [
        "Review provider-linked visits and prescriptions.",
        "Count consultations entered by providers.",
        "Compare prescribing activity by provider group."
      ],
      values: ["91", "203", "118"],
      chart: {
        title: "Provider activity comparison",
        series: "Recorded visits",
        ranges: {
          "30": {
            title: "Provider activity comparison",
            labels: ["Dr Patel", "Dr Campbell", "Dr Singh", "Dr Reid", "Dr Morgan", "Dr Ali"],
            values: [38, 31, 27, 22, 18, 15],
            caption: "Provider-linked visits compared across the last 30 days."
          },
          "90": {
            title: "Provider activity comparison",
            labels: ["Dr Patel", "Dr Campbell", "Dr Singh", "Dr Reid", "Dr Morgan", "Dr Ali"],
            values: [92, 84, 73, 66, 52, 44],
            caption: "Provider-linked visits compared across the last 90 days."
          },
          "365": {
            title: "Provider activity comparison",
            labels: ["Dr Patel", "Dr Campbell", "Dr Singh", "Dr Reid", "Dr Morgan", "Dr Ali"],
            values: [344, 318, 286, 249, 216, 188],
            caption: "Provider-linked visits compared across the last 12 months."
          }
        }
      }
    }
  };

  function downloadText(filename, text){
    const blob = new Blob([text], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  function closestFormOrPanel(el){
    return el.closest("form") || el.closest(".panel") || document;
  }

  function resetInputs(scope){
    const inputs = scope.querySelectorAll("input, textarea");
    inputs.forEach(i=>{ i.value = ""; });
    const selects = scope.querySelectorAll("select");
    selects.forEach(s=>{ s.selectedIndex = 0; });
  }

  function setupPatientTabs(){
    const tabs = Array.from(document.querySelectorAll(".tab[data-ptab]"));
    if(!tabs.length) return;
    const panels = {
      details: document.getElementById("p-details"),
      visits: document.getElementById("p-visits"),
      drugs: document.getElementById("p-drugs")
    };
    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.toggle("active", x === t));
      Object.values(panels).forEach(p => p.classList.add("hidden"));
      const key = t.getAttribute("data-ptab");
      if(panels[key]) panels[key].classList.remove("hidden");
    }));
  }

  function setupButtons(){
    const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const label = (btn.textContent || "").trim().toLowerCase();
        const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        if(label === "reset"){
          resetInputs(closestFormOrPanel(btn));
          if(page === "providers.html") filterProviderRows();
          if(page === "index.html") filterDashboardRows();
          if(page === "patients.html") resetPatientRecord();
          return;
        }
        if(label === "apply"){
          if(page === "providers.html"){
            filterProviderRows();
            return;
          }
          if(page === "patients.html"){
            applyPatientSearch();
            return;
          }
          if(page === "index.html"){
            filterDashboardRows();
            return;
          }
          return;
        }
        if(label.includes("save visit")){
          saveVisitRecord();
          return;
        }
        if(label.includes("flag for review")){
          flagPrescriptionReview();
          return;
        }
        if(label.includes("approve claim")){
          updateClaimStatus("Approved");
          return;
        }
        if(label.includes("hold for review")){
          updateClaimStatus("Held for review");
          return;
        }
        if(label.includes("reject claim")){
          updateClaimStatus("Rejected");
          return;
        }
        if(label.includes("export")){
          downloadText("medisure-summary.txt", "Medisure export summary");
          return;
        }
      });
    });
  }

  function filterProviderRows(){
    const name = (document.getElementById("prName")?.value || "").trim().toLowerCase();
    const specialty = (document.getElementById("prSpecialty")?.value || "Any").trim().toLowerCase();
    const area = (document.getElementById("prArea")?.value || "").trim().toLowerCase();
    document.querySelectorAll("tbody tr").forEach((row)=>{
      if(!row.closest("table")) return;
      const cells = Array.from(row.cells).map(c => c.textContent.toLowerCase());
      const matchName = !name || cells[0]?.includes(name);
      const matchSpecialty = specialty === "any" || cells[1]?.includes(specialty);
      const matchArea = !area || cells[3]?.includes(area);
      row.style.display = matchName && matchSpecialty && matchArea ? "" : "none";
    });
  }

  function filterDashboardRows(){
    const status = (document.getElementById("qStatus")?.value || "Any").trim().toLowerCase();
    const query = (document.getElementById("qPatient")?.value || "").trim().toLowerCase();
    document.querySelectorAll("tbody tr").forEach((row)=>{
      if(row.parentElement?.id !== "dashboard-rows") return;
      const statusCell = row.cells[4]?.textContent.toLowerCase() || "";
      const patient = row.getAttribute("data-patient") || "";
      const insurance = row.getAttribute("data-insurance") || "";
      const matchesStatus = status === "any" || statusCell.includes(status);
      const matchesQuery = !query || patient.includes(query) || insurance.includes(query);
      row.style.display = matchesStatus && matchesQuery ? "" : "none";
    });
  }

  function openDashboardResult(){
    const query = (document.getElementById("qPatient")?.value || "").trim().toLowerCase();
    if(!query){
      window.location.href = "claims.html";
      return;
    }
    const match = patientRecords.find(p =>
      p.name.toLowerCase().includes(query) || p.insurance.toLowerCase().includes(query)
    );
    if(match){
      window.location.href = `patients.html?patient=${encodeURIComponent(match.insurance)}`;
      return;
    }
    window.location.href = "claims.html";
  }

  function getPatientFromQuery(){
    const params = new URLSearchParams(window.location.search);
    const wanted = (params.get("patient") || "").trim().toLowerCase();
    if(!wanted) return patientRecords[0];
    return patientRecords.find(p => p.insurance.toLowerCase() === wanted) || patientRecords[0];
  }

  function renderPatientRecord(record){
    if(!record) return;
    const map = {
      "patient-insurance": record.insurance,
      "patient-name": record.name,
      "patient-dob": record.dob,
      "patient-doctor": record.doctor,
      "patient-policy": record.policy,
      "patient-address": record.address,
      "patient-phone": record.phone,
      "patient-email": record.email,
      "patient-company": record.company,
      "patient-alerts": record.alerts
    };
    Object.entries(map).forEach(([id, value])=>{
      const node = document.getElementById(id);
      if(node) node.textContent = value;
    });
    const visits = document.getElementById("patient-visits-list");
    const drugs = document.getElementById("patient-drugs-list");
    if(visits) visits.innerHTML = record.visits.map(item => `<li>${item}</li>`).join("");
    if(drugs) drugs.innerHTML = record.drugs.map(item => `<li>${item}</li>`).join("");
  }

  function applyPatientSearch(){
    const query = (document.getElementById("pSearch")?.value || "").trim().toLowerCase();
    const doctor = (document.getElementById("pDoctor")?.value || "Any").trim().toLowerCase();
    const status = (document.getElementById("pStatus")?.value || "").trim().toLowerCase();
    const record = patientRecords.find(p => {
      const matchQuery = !query || p.name.toLowerCase().includes(query) || p.insurance.toLowerCase().includes(query);
      const matchDoctor = doctor === "any" || p.doctor.toLowerCase().includes(doctor);
      const matchStatus = !status || p.policy.toLowerCase() === status;
      return matchQuery && matchDoctor && matchStatus;
    });
    if(record){
      renderPatientRecord(record);
    } else {
      alert("No patient matched the current filters.");
    }
  }

  function resetPatientRecord(){
    renderPatientRecord(getPatientFromQuery());
  }

  function setupVisitSummaryPreview(){
    const summary = document.getElementById("visit-summary");
    if(!summary) return;
    [
      "vPatient",
      "vProvider",
      "vDate",
      "vType",
      "symptoms",
      "diagnosis",
      "treatment",
      "followup",
      "prescribedDrug"
    ].forEach(id => {
      document.getElementById(id)?.addEventListener("input", fillVisitSummary);
      document.getElementById(id)?.addEventListener("change", fillVisitSummary);
    });
    fillVisitSummary();
  }

  function fillVisitSummary(){
    const summary = document.getElementById("visit-summary");
    if(!summary) return;
    const patient = document.getElementById("vPatient")?.value || "Not entered";
    const provider = document.getElementById("vProvider")?.value || "Not entered";
    const date = document.getElementById("vDate")?.value || "Not entered";
    const visitType = document.getElementById("vType")?.value || "Not entered";
    const symptoms = document.getElementById("symptoms")?.value || "Not entered";
    const diagnosis = document.getElementById("diagnosis")?.value || "Not entered";
    const treatment = document.getElementById("treatment")?.value || "Not entered";
    const followup = document.getElementById("followup")?.value || "Not entered";
    const drug = document.getElementById("prescribedDrug")?.value || "None";
    summary.innerHTML =
      `<strong>Patient:</strong> ${patient}<br>` +
      `<strong>Provider:</strong> ${provider}<br>` +
      `<strong>Date:</strong> ${date}<br>` +
      `<strong>Visit type:</strong> ${visitType}<br>` +
      `<strong>Symptoms:</strong> ${symptoms}<br>` +
      `<strong>Diagnosis:</strong> ${diagnosis}<br>` +
      `<strong>Treatment:</strong> ${treatment}<br>` +
      `<strong>Follow-up:</strong> ${followup}<br>` +
      `<strong>Prescription:</strong> ${drug}`;
  }

  function saveVisitRecord(){
    const required = ["vPatient", "vDate", "symptoms", "diagnosis", "treatment"];
    const missing = required.some(id => !(document.getElementById(id)?.value || "").trim());
    if(missing){
      alert("Complete the main visit fields before saving.");
      return;
    }
    fillVisitSummary();
    const saved = document.getElementById("visit-save-message");
    if(saved) saved.classList.remove("hidden");
  }

  function updateVisitPatientSummary(){
    const patient = (document.getElementById("vPatient")?.value || "").trim();
    const provider = (document.getElementById("vProvider")?.value || "").trim();
    const summary = document.querySelector("#visit-step-0 .alertBox .muted");
    if(!summary) return;
    if(!patient){
      summary.textContent = "Patient summary will appear here after details are entered.";
      return;
    }
    summary.textContent = `${patient} selected. Provider: ${provider || "Not chosen yet"}. Continue to add visit details.`;
  }

  function flagPrescriptionReview(){
    const panel = document.getElementById("warning-panel");
    const text = document.getElementById("warning-text");
    const escalation = document.getElementById("escalation-box");
    const escalationText = document.getElementById("escalation-text");
    if(panel) panel.style.borderColor = "#b91c1c";
    if(text) text.textContent = "This prescription has been flagged and should be reviewed before the claim is approved.";
    if(escalation) escalation.classList.remove("hidden");
    if(escalationText) escalationText.textContent = "Escalated to claims review. Linked claim should remain on hold until reviewed.";
  }

  function updateClaimStatus(status){
    const statusNode = document.getElementById("claim-status");
    const auditNode = document.getElementById("audit-trail");
    const banner = document.getElementById("claim-banner");
    const bannerText = document.getElementById("claim-banner-text");
    const note = document.getElementById("decisionNote")?.value?.trim();
    if(statusNode) statusNode.textContent = status;
    if(auditNode){
      auditNode.textContent = note
        ? `Latest action: ${status}. Note saved: ${note}`
        : `Latest action: ${status}. No extra note added.`;
    }
    if(banner) banner.classList.remove("hidden");
    if(bannerText) bannerText.textContent = `The claim has been marked as ${status.toLowerCase()}.`;
    const buttons = Array.from(document.querySelectorAll('button[type="button"]')).filter(btn =>
      ["approve claim", "hold for review", "reject claim"].includes((btn.textContent || "").trim().toLowerCase())
    );
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("selected-action");
    });
    const selected = buttons.find(btn => (btn.textContent || "").trim().toLowerCase().includes(status.toLowerCase().split(" ")[0]));
    if(selected){
      selected.disabled = true;
      selected.classList.add("selected-action");
    }
  }

  function getReportRangeLabel(){
    const range = document.getElementById("report-range");
    return range?.selectedOptions?.[0]?.textContent || "Last 30 days";
  }

  function getReportRangeKey(){
    return document.getElementById("report-range")?.value || "30";
  }

  function renderReportChart(view, rangeKey, rangeLabel){
    const chart = view.chart;
    const range = chart.ranges[rangeKey] || chart.ranges["30"];
    const max = Math.max(...range.values, 1);
    const axisTop = Math.ceil(max / 10) * 10;
    const axisLabels = [axisTop, Math.round(axisTop * 0.75), Math.round(axisTop * 0.5), Math.round(axisTop * 0.25), 0];
    const bars = range.labels.map((label, idx)=>{
      const value = range.values[idx] || 0;
      const height = Math.max(8, Math.round((value / axisTop) * 100));
      return `
        <div class="chartBar">
          <span class="chartBarValue">${value}</span>
          <span class="chartBarFill" style="height:${height}%"></span>
          <span class="chartBarLabel">${label}</span>
        </div>
      `;
    }).join("");
    return `
      <div class="chartHeader">
        <div>
          <h3>${range.title || chart.title}</h3>
          <p>${rangeLabel}</p>
        </div>
        <div class="chartLegend"><span class="legendDot"></span>${chart.series}</div>
      </div>
      <div class="chartPlot" aria-hidden="true">
        <div class="chartYAxis">${axisLabels.map(label => `<span>${label}</span>`).join("")}</div>
        <div class="chartBars" style="--chart-count:${range.labels.length}">${bars}</div>
      </div>
      <p class="chartCaption">${range.caption}</p>
    `;
  }

  function updateReportsView(viewKey){
    const view = reportViews[viewKey];
    if(!view) return;
    const rangeKey = getReportRangeKey();
    const rangeLabel = getReportRangeLabel();
    ["1","2","3"].forEach((n, idx)=>{
      const title = document.getElementById(`report-card-${n}-title`);
      const text = document.getElementById(`report-card-${n}-text`);
      const value = document.getElementById(`report-card-${n}-value`);
      if(title) title.textContent = view.titles[idx];
      if(text) text.textContent = view.texts[idx];
      if(value) value.textContent = view.values[idx];
    });
    const chart = document.getElementById("report-chart");
    if(chart){
      const selectedRange = view.chart.ranges[rangeKey] || view.chart.ranges["30"];
      chart.setAttribute("aria-label", `${selectedRange.title || view.chart.title} chart`);
      chart.innerHTML = renderReportChart(view, rangeKey, rangeLabel);
    }
    document.querySelectorAll("[data-report]").forEach(btn => {
      btn.classList.toggle("primary", btn.getAttribute("data-report") === viewKey);
    });
  }

  function setupReports(){
    const buttons = Array.from(document.querySelectorAll("[data-report]"));
    if(!buttons.length) return;
    updateReportsView("claims");
    buttons.forEach(btn => btn.addEventListener("click", ()=> {
      updateReportsView(btn.getAttribute("data-report"));
    }));
    document.getElementById("report-range")?.addEventListener("change", ()=>{
      const active = document.querySelector("[data-report].primary")?.getAttribute("data-report") || "claims";
      updateReportsView(active);
    });
  }

  function setupHelpSearch(){
    const input = document.getElementById("help-search");
    if(!input) return;
    const items = Array.from(document.querySelectorAll(".faq-item"));
    input.addEventListener("input", ()=>{
      const query = input.value.trim().toLowerCase();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = !query || text.includes(query) ? "" : "none";
        if(query && text.includes(query)) item.open = true;
      });
    });
  }

  function setupVisitLiveSummary(){
    ["vPatient", "vProvider"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", updateVisitPatientSummary);
      document.getElementById(id)?.addEventListener("change", updateVisitPatientSummary);
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    setupPatientTabs();
    setupButtons();
    if(document.getElementById("dashboard-open")) document.getElementById("dashboard-open").addEventListener("click", openDashboardResult);
    if(document.getElementById("patient-name")) renderPatientRecord(getPatientFromQuery());
    setupReports();
    setupHelpSearch();
    setupVisitLiveSummary();
    setupVisitSummaryPreview();
    updateVisitPatientSummary();
  });
})();

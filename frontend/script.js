// ChatCV Enhanced Frontend
const chat = document.getElementById('chat');
const input = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const btnJSON = document.getElementById('btnDownloadJSON');
const btnDocx = document.getElementById('btnDocx');
const btnPrint = document.getElementById('btnPrint');
const btnClear = document.getElementById('btnClear');
const previewFrame = document.getElementById('previewFrame');

let idx = 0;
const state = {};
const yesNo = {};

// Questions with logic
const questions = [
  { text: "your full name?", key: "full_name" },
  { text: "email?", key: "email" },
  { text: "phone number?", key: "phone" },
  { text: "linkedin url? (optional)", key: "linkedin" },
  { text: "github url? (optional)", key: "github" },
  { text: "professional summary (1–3 sentences)", key: "summary" },
  { text: "top skills (comma separated)", key: "skills" },
  { text: "add work experience? (yes/no)", key: "we_flag", type: "decision" },
  { text: "work experience → one per line as: Company | Role | Dates | 2–4 bullets (semicolon separated)", key: "work", dependsOn: "we_flag" },
  { text: "add education? (yes/no)", key: "edu_flag", type: "decision" },
  { text: "education → one per line as: School | Degree | Dates | Note", key: "education", dependsOn: "edu_flag" },
  { text: "add projects? (yes/no)", key: "proj_flag", type: "decision" },
  { text: "projects → one per line as: Title | Stack | 1–2 bullets (semicolon separated)", key: "projects", dependsOn: "proj_flag" },
  { text: "any certifications? (yes/no)", key: "cert_flag", type: "decision" },
  { text: "certifications (comma separated)", key: "certs", dependsOn: "cert_flag" }
];

function addBubble(text, role = "bot") {
  const wrap = document.createElement('div');
  wrap.className = 'flex items-start gap-3';
  const badge = document.createElement('div');
  badge.className = `shrink-0 h-8 w-8 rounded-xl ${role === 'bot' ? 'bg-indigo-500/30 ring-1 ring-indigo-400/30' : 'bg-emerald-500/20 ring-1 ring-emerald-400/30'} grid place-items-center`;
  badge.textContent = role === 'bot' ? '🤖' : '🧑';
  const bubble = document.createElement('div');
  bubble.className = `max-w-[80%] ${role === 'bot' ? 'bg-slate-700/60 rounded-2xl rounded-tl-none' : 'bg-slate-600/60 rounded-2xl rounded-tr-none'} px-4 py-2`;
  bubble.innerHTML = `<p class="text-sm leading-relaxed whitespace-pre-wrap">${text}</p>`;
  wrap.appendChild(badge);
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

function shouldAsk(i) {
  const q = questions[i];
  if (!q.dependsOn) return true;
  return (yesNo[q.dependsOn] || "").toLowerCase() === "yes";
}

function askNext() {
  // advance until valid question
  while (idx < questions.length && !shouldAsk(idx)) idx++;
  if (idx < questions.length) {
    addBubble(questions[idx].text, "bot");
  } else {
    addBubble("nice — we’ve got enough to render your resume. tweak anything by typing “edit <field> = <new value>”. examples: edit summary = data analyst with fintech focus. also use the buttons above to save / export.", "bot");
  }
  renderPreview();
}

function handleUser(text) {
  addBubble(text, "user");
  // support edit commands
  const editMatch = text.match(/^edit\s+([\w_]+)\s*=\s*(.+)$/i);
  if (editMatch) {
    const k = editMatch[1].trim();
    const v = editMatch[2].trim();
    state[k] = v;
    addBubble(`updated **${k}**.`, "bot");
    renderPreview();
    return;
  }

  // normal flow
  if (idx < questions.length) {
    const q = questions[idx];
    state[q.key] = text.trim();
    if (q.type === "decision") yesNo[q.key] = text.trim().toLowerCase();
    idx++;
    askNext();
  } else {
    addBubble("all set. use the top-right buttons to export.", "bot");
  }
}

function parseList(text) {
  if (!text) return [];
  return text.split('\n').map(x => x.trim()).filter(Boolean);
}

function safe(v, d = "") { return (v || d).trim(); }

function bulletsFrom(s) {
  if (!s) return [];
  return s.split(';').map(x => x.trim()).filter(Boolean);
}

function buildPreviewHTML(data) {
  // Build an A4-styled resume HTML
  const skillsArr = safe(data.skills).split(',').map(s => s.trim()).filter(Boolean);
  const workArr = parseList(data.work).map(line => {
    const [company, role, dates, bullets] = line.split('|').map(x => (x||'').trim());
    return { company, role, dates, bullets: bulletsFrom(bullets) };
  });
  const eduArr = parseList(data.education).map(line => {
    const [school, degree, dates, note] = line.split('|').map(x => (x||'').trim());
    return { school, degree, dates, note };
  });
  const projArr = parseList(data.projects).map(line => {
    const [title, stack, bullets] = line.split('|').map(x => (x||'').trim());
    return { title, stack, bullets: bulletsFrom(bullets) };
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${safe(data.full_name,'Your Name')} — Resume</title>
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0f172a; }
      h1,h2 { margin: 0; }
      .muted{color:#475569}
      .chip{display:inline-block;padding:6px 10px;border-radius:10px;background:#eef2ff;margin:4px 6px 0 0;font-size:12px}
      .section{margin-top:18px}
      .row{display:flex;justify-content:space-between;align-items:baseline}
      .bullets{margin:6px 0 0 18px}
      .bullets li{margin:4px 0}
      .hr{height:1px;background:#e2e8f0;margin:12px 0}
      .title{font-weight:600;font-size:24px}
      .sub{font-weight:600}
    </style>
  </head>
  <body>
    <div class="row">
      <h1 class="title">${safe(data.full_name,'Your Name')}</h1>
      <div class="muted" style="text-align:right;font-size:12px">
        ${safe(data.email)} · ${safe(data.phone)}<br/>
        ${safe(data.linkedin)} ${data.linkedin && data.github ? '·' : ''} ${safe(data.github)}
      </div>
    </div>
    <div class="hr"></div>
    ${data.summary ? `<p class="muted" style="margin-top:8px">${safe(data.summary)}</p>`:''}
    ${skillsArr.length ? `<div class="section"><h2 class="sub">Skills</h2><div>${skillsArr.map(s=>`<span class="chip">${s}</span>`).join('')}</div></div>`:''}
    ${workArr.length ? `<div class="section"><h2 class="sub">Experience</h2>
      ${workArr.map(w=>`
      <div style="margin-top:8px">
        <div class="row"><div><b>${w.role||''}</b> — ${w.company||''}</div><div class="muted">${w.dates||''}</div></div>
        ${w.bullets.length?`<ul class="bullets">${w.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
      </div>`).join('')}
    </div>`:''}
    ${projArr.length ? `<div class="section"><h2 class="sub">Projects</h2>
      ${projArr.map(p=>`
      <div style="margin-top:8px">
        <div class="row"><div><b>${p.title||''}</b> — ${p.stack||''}</div></div>
        ${p.bullets.length?`<ul class="bullets">${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
      </div>`).join('')}
    </div>`:''}
    ${eduArr.length ? `<div class="section"><h2 class="sub">Education</h2>
      ${eduArr.map(e=>`
      <div style="margin-top:8px">
        <div class="row"><div><b>${e.school||''}</b> — ${e.degree||''}</div><div class="muted">${e.dates||''}</div></div>
        ${e.note?`<div class="muted" style="margin-top:4px">${e.note}</div>`:''}
      </div>`).join('')}
    </div>`:''}
    ${data.certs ? `<div class="section"><h2 class="sub">Certifications</h2><p class="muted">${safe(data.certs)}</p></div>`:''}
  </body>
  </html>
  `;
}

function renderPreview() {
  const html = buildPreviewHTML(state);
  const doc = previewFrame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume_data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function printPDF() {
  // print the preview iframe
  previewFrame.contentWindow.focus();
  previewFrame.contentWindow.print();
}

function generateDocx() {
  fetch('/api/generate_docx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  }).then(async (res) => {
    if (!res.ok) throw new Error('docx generation failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ChatCV_Resume.docx';
    a.click();
    URL.revokeObjectURL(url);
  }).catch(err => {
    addBubble('error generating docx. make sure backend is running.', 'bot');
    console.error(err);
  });
}

function sendCurrent() {
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  handleUser(text);
}

sendBtn.addEventListener('click', sendCurrent);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendCurrent();
});
btnJSON.addEventListener('click', downloadJSON);
btnPrint.addEventListener('click', printPDF);
btnDocx.addEventListener('click', generateDocx);
btnClear.addEventListener('click', () => { Object.keys(state).forEach(k => delete state[k]); idx = 0; yesNo = {}; chat.innerHTML=''; location.reload(); });

// start
setTimeout(()=> addBubble(questions[idx].text, 'bot'), 300);
renderPreview();

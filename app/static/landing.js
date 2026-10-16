// RuleLab Interactive Landing Page Scripts
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. INTERACTIVE EDITOR MOCKUP
  // ==========================================
  const editorMockup = document.getElementById('editor-mockup');
  if (editorMockup) {
    const tabButtons = editorMockup.querySelectorAll('[data-editor-tab]');
    const panes = {
      clean: editorMockup.querySelector('#pane-clean'),
      review: editorMockup.querySelector('#pane-review'),
      diff: editorMockup.querySelector('#pane-diff'),
      visual: editorMockup.querySelector('#pane-visual')
    };

    function setEditorTab(tabKey) {
      tabButtons.forEach(btn => {
        const isActive = btn.dataset.editorTab === tabKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      Object.entries(panes).forEach(([key, pane]) => {
        if (!pane) return;
        if (key === tabKey) {
          pane.classList.add('active');
          pane.removeAttribute('hidden');
        } else {
          pane.classList.remove('active');
          pane.setAttribute('hidden', '');
        }
      });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setEditorTab(btn.dataset.editorTab);
      });
    });

    // "Apply clause fix" Button
    const btnApply = document.getElementById('btn-apply-suggestion');
    if (btnApply) {
      btnApply.addEventListener('click', (e) => {
        e.preventDefault();
        setEditorTab('diff');
        // Visual flash effect on diff insertion
        const insElem = editorMockup.querySelector('#pane-diff ins');
        if (insElem) {
          insElem.style.transition = 'none';
          insElem.style.backgroundColor = '#86efac';
          setTimeout(() => {
            insElem.style.transition = 'background-color 0.8s ease';
            insElem.style.backgroundColor = '#dcfce7';
          }, 50);
        }
      });
    }

    // "Run the test again" Button
    const btnReset = document.getElementById('btn-reset-diff');
    if (btnReset) {
      btnReset.addEventListener('click', (e) => {
        e.preventDefault();
        setEditorTab('review');
      });
    }

    // Interactive highlight click focuses finding card
    const markElem = editorMockup.querySelector('.hl-warning-interactive');
    const findingCard = editorMockup.querySelector('.ai-finding-card');
    if (markElem && findingCard) {
      markElem.addEventListener('click', () => {
        findingCard.style.transform = 'scale(1.02)';
        findingCard.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.4)';
        setTimeout(() => {
          findingCard.style.transform = 'none';
          findingCard.style.boxShadow = 'none';
        }, 400);
      });
    }
  }

  // ==========================================
  // 2. INTERACTIVE LEGAL SOURCE REVIEW
  // ==========================================
  const sourceWidget = document.getElementById('source-review-widget');
  if (sourceWidget) {
    const sourceData = {
      hierarchy: {
        doc: 'UU No. 12 Tahun 2011 · Pembentukan PUU',
        article: 'Pasal 7 ayat (2)',
        verdict: 'Hierarchy Aligned',
        verdictType: 'valid',
        quote: '“Kekuatan hukum Peraturan Perundang-undangan adalah sesuai dengan hierarki sebagaimana dimaksud pada ayat (1)... materi muatan Peraturan Pemerintah tidak boleh melampaui delegasi UU.”',
        provenance: 'Official State Gazette Corpus · Verified'
      },
      harmony: {
        doc: 'UU No. 25 Tahun 2009 · Pelayanan Publik',
        article: 'Pasal 5 ayat (3) & (4)',
        verdict: '1 Norm Concern',
        verdictType: 'warning',
        quote: '“Pelayanan publik yang diselenggarakan secara elektronik wajib tetap mengedepankan asas kemudahan aksesibilitas serta akomodasi bagi masyarakat rentan.”',
        provenance: 'Cross-regulation consistency test · Recommendation available'
      },
      disability: {
        doc: 'UU No. 8 Tahun 2016 · Penyandang Disabilitas',
        article: 'Pasal 19 huruf a & b',
        verdict: 'Accommodation required',
        verdictType: 'info',
        quote: '“Hak pelayanan publik bagi Penyandang Disabilitas meliputi hak: a. memperoleh akomodasi yang layak... dan format dokumen yang aksesibel secara mandiri.”',
        provenance: 'WCAG 2.1 AA International Standard · Registered'
      }
    };

    const pills = sourceWidget.querySelectorAll('.source-check-pill');
    const docTitle = sourceWidget.querySelector('.source-doc-title');
    const verdictBadge = sourceWidget.querySelector('.source-verdict-badge');
    const quoteBox = sourceWidget.querySelector('.source-quote-box');
    const provenanceText = sourceWidget.querySelector('.source-provenance-text');
    const btnCopy = sourceWidget.querySelector('.btn-copy-quote');

    function updateSource(key) {
      const data = sourceData[key];
      if (!data) return;

      pills.forEach(p => p.classList.toggle('active', p.dataset.sourceKey === key));

      if (docTitle) docTitle.innerHTML = `<span aria-hidden="true">📜</span> ${data.doc} (${data.article})`;
      if (verdictBadge) {
        verdictBadge.textContent = data.verdict;
        verdictBadge.className = `source-verdict-badge ${data.verdictType}`;
      }
      if (quoteBox) quoteBox.textContent = data.quote;
      if (provenanceText) provenanceText.textContent = data.provenance;
    }

    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        updateSource(pill.dataset.sourceKey);
      });
    });

    if (btnCopy && quoteBox) {
      btnCopy.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(quoteBox.textContent).then(() => {
          const orig = btnCopy.textContent;
          btnCopy.textContent = 'Copied ✓';
          setTimeout(() => { btnCopy.textContent = orig; }, 1500);
        }).catch(() => {
          btnCopy.textContent = 'Copied ✓';
          setTimeout(() => { btnCopy.textContent = 'Copy quote'; }, 1500);
        });
      });
    }
  }

  // ==========================================
  // 3. INTERACTIVE MULTI-PERSONA SIMULATOR
  // ==========================================
  const personaWidget = document.getElementById('persona-simulator-widget');
  if (personaWidget) {
    const personas = {
      sari: {
        name: 'Sari',
        role: 'Rural resident (remote area)',
        round1: {
          stance: 'concern',
          stanceLabel: 'Concern',
          text: '“In our village power and mobile signal are often out for days. If permits and aid only go through an app portal, residents’ affairs will grind to a halt.”'
        },
        round2: {
          stance: 'conditional',
          stanceLabel: 'Conditional',
          text: '“Adding an offline counter and assistance at the village office in the revised Pasal 4 is a relief, so residents far away are not hurt by deadlines.”'
        }
      },
      nadia: {
        name: 'Nadia',
        role: 'Person with a disability (screen reader)',
        round1: {
          stance: 'conditional',
          stanceLabel: 'Conditional',
          text: '“Digital portals often hold only scanned PDFs without text tags that screen readers cannot read. WCAG compliance is a must.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Support',
          text: '“The reasonable-accommodation clause is now clearly in the draft. We are waiting for technical guidance on auditing the portal’s accessibility.”'
        }
      },
      raka: {
        name: 'Raka',
        role: 'Culinary MSME owner',
        round1: {
          stance: 'support',
          stanceLabel: 'Support',
          text: '“One-stop integration cuts illegal fees and shortens our distribution permits. What matters is a stable server and verification within 3 working days.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Support',
          text: '“Integrating central permit data with physical counter assistance for traditional producers is balanced. This rule gives business certainty.”'
        }
      },
      bima: {
        name: 'Bima',
        role: 'One-stop service officer',
        round1: {
          stance: 'conditional',
          stanceLabel: 'Conditional',
          text: '“Many elderly residents still come to the counter. We are ready to assist them, as long as there is staff quota and written operating guidance.”'
        },
        round2: {
          stance: 'conditional',
          stanceLabel: 'Conditional',
          text: '“With Ms Dewi’s training budget, we are ready to run mobile digital assistance posts in the villages we support.”'
        }
      },
      dewi: {
        name: 'Dewi',
        role: 'Operational budget officer',
        round1: {
          stance: 'support',
          stanceLabel: 'Support',
          text: '“Digital transformation cuts 65% of paper printing and physical archives. The savings can fund bandwidth for service offices.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Support',
          text: '“The budget for assistance in remote areas is still within healthy fiscal limits. RuleLab’s impact simulation model really helps this projection.”'
        }
      }
    };

    let activePid = 'sari';
    let activeRound = 1;

    const avatarBtns = personaWidget.querySelectorAll('.persona-avatar-btn');
    const nameElem = personaWidget.querySelector('.persona-current-name');
    const roleElem = personaWidget.querySelector('.persona-current-role');
    const stanceBadge = personaWidget.querySelector('.stance-badge');
    const dialogueText = personaWidget.querySelector('.persona-dialogue-text');
    const roundBtns = personaWidget.querySelectorAll('.round-btn');

    function renderPersona() {
      const p = personas[activePid];
      if (!p) return;

      avatarBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pid === activePid);
      });

      const rData = activeRound === 1 ? p.round1 : p.round2;

      if (nameElem) nameElem.textContent = p.name;
      if (roleElem) roleElem.textContent = `· ${p.role}`;
      if (stanceBadge) {
        stanceBadge.textContent = rData.stanceLabel;
        stanceBadge.className = `stance-badge ${rData.stance}`;
      }
      if (dialogueText) dialogueText.textContent = rData.text;

      roundBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.round, 10) === activeRound);
      });
    }

    avatarBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        activePid = btn.dataset.pid;
        renderPersona();
      });
    });

    roundBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        activeRound = parseInt(btn.dataset.round, 10);
        renderPersona();
      });
    });

    renderPersona();
  }

  // ==========================================
  // 4. MAGIC UI: AGENT ORCHESTRATION PIPELINE
  // ==========================================
  const agentSection = document.querySelector('.magic-agents-section') || document.querySelector('.landing-agents');
  if (agentSection) {
    const agentLogs = {
      1: {
        stream: [
          { type: 'tag', text: '[retrieval_agent]' },
          { text: ' Scanning the source corpus…' },
          { type: 'dim', text: ' > Index: sqlite_rag + bm25_hybrid' },
          { type: 'success', text: ' ✔ Found: UU 12/2011 (hierarchy) & UU 25/2009 (public services)' },
          { type: 'dim', text: ' > Provenance: Lembaran Negara No. 82/2011 · SHA256 verified' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: retrieval]' },
          { text: ' Status: COMPLETED · Latency: 118ms · Corpus: 406 Pasal' },
          { text: ' Retrieval Strategy: Hybrid (Dense Vector + BM25 Lexical)' },
          { type: 'success', text: ' Top Match: UU 12/2011 (Relevance Score: 0.942)' },
          { type: 'dim', text: ' Cache Hit: 100% · Memory: 42.1 MB' }
        ]
      },
      2: {
        stream: [
          { type: 'tag', text: '[legal_review_agent]' },
          { text: ' Analyzing Pasal 4 RPP against UU 12/2011 hierarchy...' },
          { type: 'warn', text: ' ⚠ Detected: Conflict between strict digital-only clause and fairness principle' },
          { type: 'dim', text: ' > Test basis: Pasal 5 ayat (3) UU 25/2009' },
          { type: 'success', text: ' ✔ Composing alternative drafting proposals and mitigation notes' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: legal_review]' },
          { text: ' Status: COMPLETED · Latency: 240ms · 1 Critical Issue' },
          { text: ' Harmonization Model: Legal-BERT fine-tuned on Indonesian regulations' },
          { type: 'warn', text: ' Norm risk score: 0.78 (high on absolute-obligation articles)' },
          { type: 'dim', text: ' Verified recommendation: 1 inclusive drafting proposal' }
        ]
      },
      3: {
        stream: [
          { type: 'tag', text: '[social_simulation_agent]' },
          { text: ' Running 5 synthetic personas over 3 dialogue rounds...' },
          { type: 'dim', text: ' > Personas: Sari (rural, remote), Nadia (disability), Raka (MSME), Bima, Dewi' },
          { type: 'warn', text: ' ⚠ Round 1 reactions: 2 concerns (accessibility & infrastructure)' },
          { type: 'success', text: ' ✔ Round 2 reactions: agreement reached on offline assistance' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: social_simulation]' },
          { text: ' Status: COMPLETED · Latency: 320ms · 5 Active Personas' },
          { text: ' Opinion convergence: 76.4% after the offline-channel mitigation' },
          { type: 'success', text: ' Highest Resonance: Sari (Remote Rural) & Nadia (Disability)' },
          { type: 'dim', text: ' Implementation cost: within the state budget ceiling (confirmed by Dewi)' }
        ]
      },
      4: {
        stream: [
          { type: 'tag', text: '[human_in_the_loop]' },
          { text: ' Consolidating all findings and the review trail...' },
          { type: 'success', text: ' ✔ Drafter decision: mitigation proposal approved for version 2.2' },
          { type: 'dim', text: ' > Reviewer notes saved · Revision history bound to snapshot' },
          { type: 'success', text: ' ✔ Ready to export as an official Microsoft Word document (.DOCX)' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: human_review]' },
          { text: ' Status: READY_FOR_EXPORT · Reviewer: Aril Indra Permana' },
          { text: ' Target draft: RPP_Layanan_Digital_2026_Final.docx' },
          { type: 'success', text: ' Format Integrity: Complies with Lampiran II UU 12/2011' },
          { type: 'dim', text: ' Hash Signature: a9f8e4c7... session-bound' }
        ]
      }
    };

    let currentStep = 1;
    let currentConsoleTab = 'stream';
    let isAutoplayRunning = true;
    let autoplayTimer = null;
    const STEP_DURATION = 4000; // 4 seconds per step

    const stepItems = agentSection.querySelectorAll('.agent-step-item');
    const nodeBadges = agentSection.querySelectorAll('.agent-node-badge');
    const consoleBody = agentSection.querySelector('#agent-console-output');
    const autoplayToggle = document.getElementById('agent-autoplay-toggle');
    const consoleTabs = agentSection.querySelectorAll('.console-tab-btn');
    const commandCenter = agentSection.querySelector('.magic-command-center');

    function renderConsole(stepNum) {
      if (!consoleBody) return;
      const stepData = agentLogs[stepNum] || agentLogs[1];
      const lines = stepData[currentConsoleTab] || stepData.stream;

      consoleBody.innerHTML = '';
      lines.forEach((line, idx) => {
        const div = document.createElement('div');
        div.className = 'console-line';
        div.style.animationDelay = `${idx * 40}ms`;

        if (line.type === 'tag') {
          div.innerHTML = `<span class="console-tag">${line.text}</span>`;
        } else if (line.type === 'success') {
          div.innerHTML = `<span class="console-success">${line.text}</span>`;
        } else if (line.type === 'warn') {
          div.innerHTML = `<span class="console-warn">${line.text}</span>`;
        } else if (line.type === 'dim') {
          div.innerHTML = `<span class="console-dim">${line.text}</span>`;
        } else {
          div.textContent = line.text;
        }
        consoleBody.appendChild(div);
      });
    }

    function setActiveStep(stepNum, resetProgressAnimation = true) {
      currentStep = stepNum;

      // Update Step Items
      stepItems.forEach(item => {
        const num = parseInt(item.dataset.step, 10);
        const isActive = num === stepNum;
        item.classList.toggle('active', isActive);

        const statusChip = item.querySelector('.step-status-chip');
        if (statusChip) {
          if (num < stepNum) {
            statusChip.textContent = 'Done ✔';
            statusChip.className = 'step-status-chip complete';
          } else if (num === stepNum) {
            statusChip.textContent = 'Running';
            statusChip.className = 'step-status-chip running';
          } else {
            statusChip.textContent = 'Queued';
            statusChip.className = 'step-status-chip pending';
          }
        }

        // Progress bar reset & trigger
        item.classList.remove('animating');
        const fill = item.querySelector('.step-progress-fill');
        if (fill) fill.style.width = '0%';

        if (isActive && resetProgressAnimation && isAutoplayRunning) {
          // Force reflow to restart CSS transition
          void item.offsetWidth;
          item.classList.add('animating');
        }
      });

      // Update Node Badges
      nodeBadges.forEach(badge => {
        const num = parseInt(badge.dataset.step, 10);
        badge.classList.toggle('active', num === stepNum);
      });

      // Render Console Lines
      renderConsole(stepNum);
    }

    function startAutoplay() {
      stopAutoplay();
      isAutoplayRunning = true;
      if (autoplayToggle) {
        autoplayToggle.classList.remove('paused');
        const lbl = autoplayToggle.querySelector('.autoplay-label');
        if (lbl) lbl.textContent = '▶ Auto simulation running (4s)';
      }
      setActiveStep(currentStep, true);

      autoplayTimer = setInterval(() => {
        const nextStep = currentStep >= 4 ? 1 : currentStep + 1;
        setActiveStep(nextStep, true);
      }, STEP_DURATION);
    }

    function stopAutoplay(label = '⏸ Simulation paused') {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
      isAutoplayRunning = false;
      if (autoplayToggle) {
        autoplayToggle.classList.add('paused');
        const lbl = autoplayToggle.querySelector('.autoplay-label');
        if (lbl) lbl.textContent = label;
      }

      // Stop current progress bar animation
      stepItems.forEach(item => {
        item.classList.remove('animating');
      });
    }

    // Step Item Click Handlers
    stepItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(item.dataset.step, 10);
        stopAutoplay('⏸ Paused (Manual)');
        setActiveStep(stepNum, false);
      });
    });

    // Node Badge Click Handlers
    nodeBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(badge.dataset.step, 10);
        stopAutoplay('⏸ Paused (Manual)');
        setActiveStep(stepNum, false);
      });
    });

    // Console Tab Switcher
    consoleTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        consoleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentConsoleTab = tab.dataset.consoleTab || 'stream';
        renderConsole(currentStep);
      });
    });

    // Autoplay Toggle Button Click
    if (autoplayToggle) {
      autoplayToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAutoplayRunning) {
          stopAutoplay('⏸ Paused (click to continue)');
        } else {
          startAutoplay();
        }
      });
    }

    // Pause on Hover over Command Center
    if (commandCenter) {
      commandCenter.addEventListener('mouseenter', () => {
        if (isAutoplayRunning) {
          if (autoplayTimer) clearInterval(autoplayTimer);
          const lbl = autoplayToggle ? autoplayToggle.querySelector('.autoplay-label') : null;
          if (lbl) lbl.textContent = '⏸ Paused (Cursor active)';
        }
      });

      commandCenter.addEventListener('mouseleave', () => {
        if (isAutoplayRunning) {
          startAutoplay();
        }
      });
    }

    // Start auto-play initially
    startAutoplay();
  }

  // ==========================================
  // 5. MAGIC UI: SPOTLIGHT ON CARA KERJA CARDS
  // ==========================================
  const howCards = document.querySelectorAll('.magic-how-card');
  howCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Micro-widget click demo in Card 1 & 3
  const docChip = document.querySelector('.doc-chip');
  if (docChip) {
    docChip.addEventListener('click', () => {
      const okBadge = docChip.querySelector('.doc-status-ok');
      if (okBadge) {
        okBadge.textContent = 'Scanning...';
        setTimeout(() => {
          okBadge.textContent = '✔ 12 articles ready';
        }, 600);
      }
    });
  }

  const exportChip = document.querySelector('.export-preview-chip');
  if (exportChip) {
    exportChip.addEventListener('click', () => {
      const orig = exportChip.innerHTML;
      exportChip.innerHTML = '<span class="exp-icon-svg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span><span>Preparing document...</span>';
      setTimeout(() => {
        exportChip.innerHTML = '<span class="exp-icon-svg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span><span>Draft downloaded (simulation)</span>';
        setTimeout(() => { exportChip.innerHTML = orig; }, 2000);
      }, 700);
    });
  }

  // ==========================================
  // 6. DYNAMIC FLOATING FIXED HEADER DOCK
  // ==========================================
  const dock = document.getElementById('landing-nav-dock');
  const nav = document.getElementById('main-landing-nav') || document.querySelector('.landing-nav');
  if (nav) {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 25;
          if (dock) {
            dock.classList.toggle('scrolled', isScrolled);
          }
          nav.classList.toggle('floating-pill', isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ==========================================
  // 7. HERO DOSSIER CARD 3D TILT EFFECT
  // ==========================================
  const dossierCard = document.querySelector('.hero-dossier-card');
  if (dossierCard) {
    dossierCard.addEventListener('mousemove', (e) => {
      const rect = dossierCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / 32).toFixed(2);
      const rotateY = (x / 32).toFixed(2);
      dossierCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    dossierCard.addEventListener('mouseleave', () => {
      dossierCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

});

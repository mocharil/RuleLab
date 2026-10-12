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

    // "Terapkan Perbaikan Klausul" Button
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

    // "Ulangi Uji Coba" Button
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
        verdict: 'Hierarki Selaras',
        verdictType: 'valid',
        quote: '“Kekuatan hukum Peraturan Perundang-undangan adalah sesuai dengan hierarki sebagaimana dimaksud pada ayat (1)... materi muatan Peraturan Pemerintah tidak boleh melampaui delegasi UU.”',
        provenance: 'Corpus Resmi Lembaran Negara RI · Terverifikasi'
      },
      harmony: {
        doc: 'UU No. 25 Tahun 2009 · Pelayanan Publik',
        article: 'Pasal 5 ayat (3) & (4)',
        verdict: '1 Perhatian Norma',
        verdictType: 'warning',
        quote: '“Pelayanan publik yang diselenggarakan secara elektronik wajib tetap mengedepankan asas kemudahan aksesibilitas serta akomodasi bagi masyarakat rentan.”',
        provenance: 'Uji Keselarasan Antar-Regulasi · Rekomendasi Tersedia'
      },
      disability: {
        doc: 'UU No. 8 Tahun 2016 · Penyandang Disabilitas',
        article: 'Pasal 19 huruf a & b',
        verdict: 'Wajib Akomodasi',
        verdictType: 'info',
        quote: '“Hak pelayanan publik bagi Penyandang Disabilitas meliputi hak: a. memperoleh akomodasi yang layak... dan format dokumen yang aksesibel secara mandiri.”',
        provenance: 'Standar Internasional WCAG 2.1 AA · Terdaftar'
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
          btnCopy.textContent = 'Tersalin ✓';
          setTimeout(() => { btnCopy.textContent = orig; }, 1500);
        }).catch(() => {
          btnCopy.textContent = 'Tersalin ✓';
          setTimeout(() => { btnCopy.textContent = 'Salin'; }, 1500);
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
        role: 'Warga Rural (Wilayah 3T)',
        round1: {
          stance: 'concern',
          stanceLabel: 'Perhatian (Concern)',
          text: '“Di desa kami jaringan listrik dan sinyal seluler sering padam berhari-hari. Kalau izin dan bantuan hanya lewat portal aplikasi, urusan warga pasti macet total.”'
        },
        round2: {
          stance: 'conditional',
          stanceLabel: 'Bersyarat (Conditional)',
          text: '“Penambahan opsi loket luring dan asistensi di kantor desa pada revisi Pasal 4 sangat melegakan, agar warga yang jauh tidak dirugikan batas waktu.”'
        }
      },
      nadia: {
        name: 'Nadia',
        role: 'Penyandang Disabilitas (Screen Reader)',
        round1: {
          stance: 'conditional',
          stanceLabel: 'Bersyarat (Conditional)',
          text: '“Portal digital sering kali hanya memuat dokumen pindaian (PDF scan) tanpa tag teks yang tidak terbaca pembaca layar. Harus ada kepatuhan standar WCAG.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Mendukung (Support)',
          text: '“Klausul akomodasi yang layak kini tercantum jelas di rancangan. Kami menunggu petunjuk teknis audit aksesibilitas portal ini.”'
        }
      },
      raka: {
        name: 'Raka',
        role: 'Pelaku UMKM Kuliner',
        round1: {
          stance: 'support',
          stanceLabel: 'Mendukung (Support)',
          text: '“Integrasi satu pintu memotong rantai pungutan liar dan mempersingkat izin edar kami. Yang penting server stabil dan verifikasi selesai maksimal 3 hari kerja.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Mendukung (Support)',
          text: '“Integrasi data izin pusat dan pendampingan loket fisik bagi produsen bahan baku tradisional sudah seimbang. Aturan ini memberi kepastian berusaha.”'
        }
      },
      bima: {
        name: 'Bima',
        role: 'Petugas Pelayanan Terpadu',
        round1: {
          stance: 'conditional',
          stanceLabel: 'Bersyarat (Conditional)',
          text: '“Masyarakat lansia yang datang ke loket masih banyak. Kami siap mendampingi, asalkan ada kuota petugas dan pedoman operasional tertulis.”'
        },
        round2: {
          stance: 'conditional',
          stanceLabel: 'Bersyarat (Conditional)',
          text: '“Dengan alokasi anggaran pelatihan dari Bu Dewi, kami siap menjalankan posko asistensi digital jemput bola ke desa-desa binaan.”'
        }
      },
      dewi: {
        name: 'Dewi',
        role: 'Pengelola Anggaran Operasional',
        round1: {
          stance: 'support',
          stanceLabel: 'Mendukung (Support)',
          text: '“Transformasi digital memangkas 65% beban cetak kertas dan arsip fisik. Penghematan ini dapat dialihkan untuk subsidi bandwidth kantor pelayanan.”'
        },
        round2: {
          stance: 'support',
          stanceLabel: 'Mendukung (Support)',
          text: '“Anggaran untuk pendampingan daerah 3T masih berada dalam batas efisiensi fiskal yang sehat. Model simulasi dampak RuleLab sangat membantu proyeksi ini.”'
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
          { text: ' Memulai pemindaian naskah sumber (6 regulasi, 406 pasal)...' },
          { type: 'dim', text: ' > Index: sqlite_rag + bm25_hybrid' },
          { type: 'success', text: ' ✔ Ditemukan: UU 12/2011 (Hierarki) & UU 25/2009 (Pelayanan Publik)' },
          { type: 'dim', text: ' > Provenance: Lembaran Negara No. 82/2011 · SHA256 terverifikasi' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: retrieval]' },
          { text: ' Status: COMPLETED · Latency: 118ms · Corpus: 406 pasal' },
          { text: ' Retrieval Strategy: Hybrid (Dense Vector + BM25 Lexical)' },
          { type: 'success', text: ' Top Match: UU 12/2011 (Skor Relevansi: 0.942)' },
          { type: 'dim', text: ' Cache Hit: 100% · Memory: 42.1 MB' }
        ]
      },
      2: {
        stream: [
          { type: 'tag', text: '[legal_review_agent]' },
          { text: ' Menganalisis Pasal 4 RPP terhadap hierarki UU 12/2011...' },
          { type: 'warn', text: ' ⚠ Deteksi: Benturan klausul mutlak format digital vs asas keadilan' },
          { type: 'dim', text: ' > Dasar pengujian: Pasal 5 ayat (3) UU 25/2009' },
          { type: 'success', text: ' ✔ Menyusun usulan redaksional alternatif dan catatan mitigasi' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: legal_review]' },
          { text: ' Status: COMPLETED · Latency: 240ms · 1 Isu Kritis' },
          { text: ' Harmonisasi Model: Legal-BERT fine-tuned PUU Indonesia' },
          { type: 'warn', text: ' Skor Risiko Norma: 0.78 (Tinggi pada pasal kewajiban mutlak)' },
          { type: 'dim', text: ' Rekomendasi Terverifikasi: 1 Usulan Redaksional Inklusif' }
        ]
      },
      3: {
        stream: [
          { type: 'tag', text: '[social_simulation_agent]' },
          { text: ' Menjalankan 5 persona sintetis dalam 3 putaran dialog...' },
          { type: 'dim', text: ' > Persona: Sari (Rural 3T), Nadia (Disabilitas), Raka (UMKM), Bima, Dewi' },
          { type: 'warn', text: ' ⚠ Reaksi Putaran 1: 2 Perhatian (Aksesibilitas & Infrastruktur)' },
          { type: 'success', text: ' ✔ Reaksi Putaran 2: Tercapai kesepahaman opsi pendampingan luring' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: social_simulation]' },
          { text: ' Status: COMPLETED · Latency: 320ms · 5 Persona Aktif' },
          { text: ' Konvergensi Opini: 76.4% setelah mitigasi klausul luring' },
          { type: 'success', text: ' Resonansi Tertinggi: Sari (Rural 3T) & Nadia (Disabilitas)' },
          { type: 'dim', text: ' Biaya Pelaksanaan: Sesuai pagu APBN (Konfirmasi Dewi)' }
        ]
      },
      4: {
        stream: [
          { type: 'tag', text: '[human_in_the_loop]' },
          { text: ' Konsolidasi seluruh temuan dan jejak pemeriksaan...' },
          { type: 'success', text: ' ✔ Keputusan perancang: Usulan mitigasi disetujui untuk versi 2.2' },
          { type: 'dim', text: ' > Catatan reviewer tersimpan · Riwayat revisi terikat snapshot' },
          { type: 'success', text: ' ✔ Siap diekspor ke naskah resmi Microsoft Word (.DOCX)' }
        ],
        telemetry: [
          { type: 'tag', text: '[telemetry :: human_review]' },
          { text: ' Status: READY_FOR_EXPORT · Reviewer: Aril Indra Permana' },
          { text: ' Draf Target: RPP_Layanan_Digital_2026_Final.docx' },
          { type: 'success', text: ' Integritas Format: Sesuai Lampiran II UU 12/2011' },
          { type: 'dim', text: ' Tanda Tangan Hash: a9f8e4c7... terikat sesi' }
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
            statusChip.textContent = 'Selesai ✔';
            statusChip.className = 'step-status-chip complete';
          } else if (num === stepNum) {
            statusChip.textContent = 'Running';
            statusChip.className = 'step-status-chip running';
          } else {
            statusChip.textContent = 'Antrean';
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
        if (lbl) lbl.textContent = '▶ Simulasi Otomatis Berjalan (4s)';
      }
      setActiveStep(currentStep, true);

      autoplayTimer = setInterval(() => {
        const nextStep = currentStep >= 4 ? 1 : currentStep + 1;
        setActiveStep(nextStep, true);
      }, STEP_DURATION);
    }

    function stopAutoplay(label = '⏸ Simulasi Dijeda') {
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
        stopAutoplay('⏸ Dijeda (Manual)');
        setActiveStep(stepNum, false);
      });
    });

    // Node Badge Click Handlers
    nodeBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(badge.dataset.step, 10);
        stopAutoplay('⏸ Dijeda (Manual)');
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
          stopAutoplay('⏸ Dijeda (Klik untuk lanjut)');
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
          if (lbl) lbl.textContent = '⏸ Jeda (Kursor aktif)';
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
        okBadge.textContent = 'Memindai...';
        setTimeout(() => {
          okBadge.textContent = '✔ 12 Pasal Siap';
        }, 600);
      }
    });
  }

  const exportChip = document.querySelector('.export-preview-chip');
  if (exportChip) {
    exportChip.addEventListener('click', () => {
      const orig = exportChip.innerHTML;
      exportChip.innerHTML = '<span class="exp-icon-svg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span><span>Mempersiapkan Dokumen...</span>';
      setTimeout(() => {
        exportChip.innerHTML = '<span class="exp-icon-svg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span><span>Draf Terunduh (Simulasi)</span>';
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

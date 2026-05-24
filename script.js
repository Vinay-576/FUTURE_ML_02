document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 🌌 INTERACTIVE SPACE BACKGROUND
    // ==========================================
    const canvas = document.getElementById('spaceBg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseout',  () => { mouse.x = undefined; mouse.y = undefined; });
    window.addEventListener('resize',    () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); });

    class Particle {
        constructor(x, y, dx, dy, size) { this.x=x; this.y=y; this.directionX=dx; this.directionY=dy; this.size=size; this.color='#ffffff'; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false); ctx.fillStyle=this.color; ctx.fill(); }
        update() {
            if(this.x>canvas.width||this.x<0) this.directionX=-this.directionX;
            if(this.y>canvas.height||this.y<0) this.directionY=-this.directionY;
            this.x+=this.directionX; this.y+=this.directionY; this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let n = (canvas.height * canvas.width) / 9000;
        for(let i=0; i<n; i++) {
            let s=(Math.random()*2)+0.5, x=Math.random()*(innerWidth-s*4)+s*2, y=Math.random()*(innerHeight-s*4)+s*2;
            particlesArray.push(new Particle(x,y,(Math.random()*0.4)-0.2,(Math.random()*0.4)-0.2,s));
        }
    }

    function connect() {
        for(let a=0; a<particlesArray.length; a++) for(let b=a; b<particlesArray.length; b++) {
            let d=((particlesArray[a].x-particlesArray[b].x)**2)+((particlesArray[a].y-particlesArray[b].y)**2);
            if(d<(canvas.width/10)*(canvas.height/10)) {
                let md=((mouse.x-particlesArray[a].x)**2)+((mouse.y-particlesArray[a].y)**2);
                if(md<mouse.radius**2) {
                    ctx.strokeStyle=`rgba(0,195,255,${1-(d/20000)})`; ctx.lineWidth=1;
                    ctx.beginPath(); ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x,particlesArray[b].y); ctx.stroke();
                }
            }
        }
    }

    function animate() { requestAnimationFrame(animate); ctx.clearRect(0,0,innerWidth,innerHeight); particlesArray.forEach(p=>p.update()); connect(); }
    initParticles(); animate();


    // ==========================================
    // 📊 CHART SETUP
    // ==========================================
    Chart.defaults.color = '#8888aa';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
    Chart.defaults.font.family = "'Syne', sans-serif";
    Chart.defaults.font.size = 13;

    const anim = { duration: 1100, easing: 'easeOutQuart' };

    // --- LINE CHART: Ticket Volume Trend ---
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Live'],
            datasets: [{
                label: 'Tickets Received',
                data: [450, 520, 480, 610, 590, 846],
                borderColor: '#00c3ff',
                backgroundColor: 'rgba(0,195,255,0.15)',
                borderWidth: 3, tension: 0.4, fill: true,
                pointBackgroundColor: '#00c3ff', pointRadius: 6, pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: anim,
            plugins: { title: { display: true, text: 'Ticket Volume Trend', font: { size: 16, weight: '700' }, color: '#ccd', padding: { bottom: 15 } }, legend: { display: false } },
            scales: { y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
    });

    // --- BAR CHART: Tickets by Category ---
    const barLabels = ['Refund Request', 'Technical Issue', 'Cancellation Request', 'Product Inquiry', 'Billing Inquiry'];
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: 'Number of Tickets',
                data: [1752, 1747, 1695, 1641, 1634],
                backgroundColor: ['rgba(255,99,132,0.8)','rgba(54,162,235,0.8)','rgba(255,206,86,0.8)','rgba(75,192,192,0.8)','rgba(153,102,255,0.8)'],
                borderWidth: 0, borderRadius: 6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: anim,
            plugins: { title: { display: true, text: 'Tickets by Category', font: { size: 16, weight: '700' }, color: '#ccd', padding: { bottom: 15 } }, legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }
        }
    });

    // --- PIE CHART: Priority Distribution ---
    const pieLabels = ['Medium', 'Critical', 'High', 'Low'];
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: pieLabels,
            datasets: [{
                data: [2192, 2129, 2085, 2063],
                backgroundColor: ['rgba(255,206,86,0.85)','rgba(255,99,132,0.85)','rgba(255,159,64,0.85)','rgba(75,192,192,0.85)'],
                borderWidth: 3, borderColor: '#0f0f1c', hoverOffset: 18
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            animation: { animateScale: true, animateRotate: true, duration: 1200 },
            plugins: {
                title: { display: true, text: 'Priority Distribution', font: { size: 16, weight: '700' }, color: '#ccd', padding: { bottom: 15 } },
                legend: { position: 'right', labels: { padding: 16, boxWidth: 14, font: { size: 12 } } }
            },
            cutout: '55%'
        }
    });

    // --- HORIZONTAL BAR: Resolution Rate by Category ---
    const hbarCtx = document.getElementById('hbarChart').getContext('2d');
    const hbarChart = new Chart(hbarCtx, {
        type: 'bar',
        data: {
            labels: ['Refund Request', 'Technical Issue', 'Cancellation', 'Product Inquiry', 'Billing Inquiry'],
            datasets: [{
                label: 'Resolution Rate (%)',
                data: [78, 65, 91, 85, 72],
                backgroundColor: [
                    'rgba(0,195,255,0.75)', 'rgba(255,99,132,0.75)', 'rgba(0,255,136,0.75)',
                    'rgba(153,102,255,0.75)', 'rgba(255,206,86,0.75)'
                ],
                borderWidth: 0, borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false, animation: anim,
            plugins: {
                title: { display: true, text: 'Resolution Rate by Category (%)', font: { size: 16, weight: '700' }, color: '#ccd', padding: { bottom: 15 } },
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v+'%' } },
                y: { grid: { display: false } }
            }
        }
    });

    // --- RADAR CHART: Category Performance Metrics ---
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Volume', 'Resolution Rate', 'Avg Response Time', 'Critical Rate', 'Customer Satisfaction', 'Reopened Rate'],
            datasets: [
                {
                    label: 'Refund Request',
                    data: [88, 78, 65, 42, 72, 18],
                    borderColor: 'rgba(255,99,132,0.9)', backgroundColor: 'rgba(255,99,132,0.1)', borderWidth: 2, pointRadius: 4
                },
                {
                    label: 'Technical Issue',
                    data: [87, 65, 45, 55, 60, 28],
                    borderColor: 'rgba(54,162,235,0.9)', backgroundColor: 'rgba(54,162,235,0.1)', borderWidth: 2, pointRadius: 4
                },
                {
                    label: 'Billing Inquiry',
                    data: [82, 72, 70, 30, 80, 12],
                    borderColor: 'rgba(153,102,255,0.9)', backgroundColor: 'rgba(153,102,255,0.1)', borderWidth: 2, pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: anim,
            plugins: {
                title: { display: true, text: 'Category Performance Radar (Normalized 0–100)', font: { size: 16, weight: '700' }, color: '#ccd', padding: { bottom: 10 } },
                legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } }
            },
            scales: {
                r: {
                    min: 0, max: 100, ticks: { stepSize: 20, font: { size: 10 }, color: '#555577', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { font: { size: 11, weight: '600' }, color: '#aab' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' }
                }
            }
        }
    });


    // ==========================================
    // 🧠 SESSION ANALYTICS STATE
    // ==========================================
    let sessionHistory = [];
    let sessionConfidenceSum = 0;

    const kpiTotalTickets  = document.getElementById('kpiTotalTickets');
    const kpiTopCategory   = document.getElementById('kpiTopCategory');
    const kpiTopCatPct     = document.getElementById('kpiTopCatPct');
    const kpiCriticalRate  = document.getElementById('kpiCriticalRate');
    const kpiAvgConfidence = document.getElementById('kpiAvgConfidence');
    const kpiSessionCount  = document.getElementById('kpiSessionCount');

    // Base totals for KPI calculations
    let baseTotal = 8469;
    let baseCritical = 2129;
    let baseCatCounts = { 'Refund Request': 1752, 'Technical Issue': 1747, 'Cancellation Request': 1695, 'Product Inquiry': 1641, 'Billing Inquiry': 1634 };


    // ==========================================
    // 🔑 KEYWORD DETECTION
    // ==========================================
    const keywordGroups = {
        refund:   ['refund','money back','return','reimburse'],
        cancel:   ['cancel','unsubscribe','stop','close account'],
        billing:  ['charge','invoice','receipt','fee','payment','card','bill'],
        technical:['broken','not working','bug','error','glitch','crash','turn on','slow','freeze','issue'],
        urgent:   ['angry','worst','terrible','unacceptable','lawsuit','scam','threat'],
        priority: ['urgent','asap','immediately','now','fast'],
        timing:   ['soon','when','please','delay']
    };

    function detectKeywords(text) {
        const found = [];
        for (const [group, words] of Object.entries(keywordGroups)) {
            for (const w of words) {
                if (text.includes(w) && !found.includes(w)) found.push(w);
            }
        }
        return found.slice(0, 7); // max 7 tags
    }

    // ==========================================
    // 🎯 CONFIDENCE SCORING
    // ==========================================
    function computeConfidence(text, category, priority) {
        let score = 55; // base
        const kws = detectKeywords(text);
        score += Math.min(kws.length * 7, 30); // keywords boost
        if (category !== 'Product Inquiry') score += 8; // non-default category
        if (priority !== 'Low') score += 5;
        if (text.length > 80) score += 4;
        return Math.min(score, 97);
    }

    // ==========================================
    // 📋 HISTORY TABLE RENDERING
    // ==========================================
    function renderHistory() {
        const tbody = document.getElementById('historyBody');
        const wrap  = document.getElementById('historyTableWrap');
        const empty = document.getElementById('emptyState');
        const exportBtn = document.getElementById('exportBtn');

        if (sessionHistory.length === 0) { wrap.classList.add('hidden'); empty.classList.remove('hidden'); exportBtn.disabled = true; return; }
        wrap.classList.remove('hidden'); empty.classList.add('hidden'); exportBtn.disabled = false;

        tbody.innerHTML = sessionHistory.map((r, i) => {
            const priClass = 'pri-' + r.priority.toLowerCase();
            const confClass = r.confidence >= 80 ? 'conf-high' : r.confidence >= 65 ? 'conf-medium' : 'conf-low';
            return `<tr>
                <td>${sessionHistory.length - i}</td>
                <td>${r.time}</td>
                <td title="${r.text}">${r.text.length>50 ? r.text.slice(0,50)+'…' : r.text}</td>
                <td><span class="tbl-cat">${r.category}</span></td>
                <td><span class="tbl-pri ${priClass}">${r.priority}</span></td>
                <td><span class="tbl-conf ${confClass}">${r.confidence}%</span></td>
            </tr>`;
        }).join('');
    }


    // ==========================================
    // 📤 EXPORT CSV
    // ==========================================
    document.getElementById('exportBtn').addEventListener('click', () => {
        const header = ['#','Time','Text','Category','Priority','Confidence'];
        const rows = sessionHistory.map((r, i) =>
            [sessionHistory.length-i, r.time, `"${r.text.replace(/"/g,'""')}"`, r.category, r.priority, r.confidence+'%'].join(',')
        );
        const csv = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = 'session_predictions.csv'; a.click();
    });


    // ==========================================
    // 🧠 PREDICTION ENGINE
    // ==========================================
    document.getElementById('predictBtn').addEventListener('click', () => {
        const raw  = document.getElementById('ticketInput').value.trim();
        const text = raw.toLowerCase();
        if (!text) { alert('Please enter a ticket description.'); return; }

        const cleaned = text.replace(/\{.*?\}/g, '').replace(/[\n\t\r]/g, ' ');
        document.getElementById('resCleaned').textContent = cleaned;

        // --- Category ---
        let category = 'Product Inquiry';
        if (cleaned.match(/refund|money back|return|reimburse/))            category = 'Refund Request';
        else if (cleaned.match(/cancel|unsubscribe|stop|close account/))    category = 'Cancellation Request';
        else if (cleaned.match(/charge|invoice|receipt|fee|payment|card|bill/)) category = 'Billing Inquiry';
        else if (cleaned.match(/broken|not working|bug|error|glitch|crash|turn on|slow|freeze|issue/)) category = 'Technical Issue';

        // --- Priority ---
        let priority = 'Low';
        if (cleaned.match(/angry|worst|terrible|unacceptable|lawsuit|scam|threat/)) priority = 'Critical';
        else if (cleaned.match(/urgent|asap|immediately|now|fast/)) priority = 'High';
        else if (cleaned.match(/soon|when|please|delay/)) priority = 'Medium';
        const urgentWords = ['angry','refund','money back','not working','broken','worst'];
        if (urgentWords.some(w => cleaned.includes(w)) && (priority === 'Low' || priority === 'Medium')) priority = 'High';

        // --- Confidence ---
        const confidence = computeConfidence(cleaned, category, priority);

        // --- Keywords ---
        const kws = detectKeywords(cleaned);

        // --- Display result ---
        document.getElementById('resCategory').textContent = `Category: ${category}`;
        document.getElementById('resPriority').textContent = `Priority: ${priority}`;
        document.getElementById('resultCard').classList.remove('hidden');

        // Confidence bar
        document.getElementById('confidenceValue').textContent = confidence + '%';
        const fill = document.getElementById('confidenceFill');
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = confidence + '%'; }, 50);

        // Keyword tags
        const tagsEl = document.getElementById('keywordTags');
        tagsEl.innerHTML = kws.length
            ? kws.map(k => `<span class="kw-tag">${k}</span>`).join('')
            : '<span class="kw-none">None detected</span>';

        // --- Update charts ---
        const catIdx = barLabels.indexOf(category);
        if (catIdx !== -1) { barChart.data.datasets[0].data[catIdx] += 15; barChart.update(); }

        const priIdx = pieLabels.indexOf(priority);
        if (priIdx !== -1) { pieChart.data.datasets[0].data[priIdx] += 15; pieChart.update(); }

        lineChart.data.datasets[0].data[5] += 15;
        lineChart.update();

        // --- Update KPIs ---
        baseTotal += 1;
        if (priority === 'Critical') baseCritical += 1;
        baseCatCounts[category] = (baseCatCounts[category] || 0) + 1;

        // Total tickets (with comma separator)
        kpiTotalTickets.textContent = baseTotal.toLocaleString();

        // Top category
        const topCat = Object.entries(baseCatCounts).sort((a,b)=>b[1]-a[1])[0];
        const shortNames = { 'Refund Request':'Refund', 'Technical Issue':'Technical', 'Cancellation Request':'Cancel', 'Product Inquiry':'Product', 'Billing Inquiry':'Billing' };
        kpiTopCategory.textContent = shortNames[topCat[0]] || topCat[0];
        kpiTopCatPct.textContent = ((topCat[1]/baseTotal)*100).toFixed(1) + '% of all tickets';

        // Critical rate
        kpiCriticalRate.textContent = ((baseCritical/baseTotal)*100).toFixed(1) + '%';

        // Session confidence
        sessionConfidenceSum += confidence;
        const avgConf = Math.round(sessionConfidenceSum / (sessionHistory.length + 1));
        kpiAvgConfidence.textContent = avgConf + '%';
        kpiSessionCount.textContent = (sessionHistory.length + 1) + ' prediction' + (sessionHistory.length === 0 ? '' : 's') + ' this session';

        // --- Add to session history ---
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        sessionHistory.unshift({ time: timeStr, text: cleaned, category, priority, confidence });
        if (sessionHistory.length > 20) sessionHistory.pop(); // keep last 20
        renderHistory();
    });

});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 🌌 INTERACTIVE SPACE BACKGROUND ANIMATION
    // ==========================================
    const canvas = document.getElementById('spaceBg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2; 
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = '#ffffff';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    let mouseDistance = ((mouse.x - particlesArray[a].x) * (mouse.x - particlesArray[a].x))
                                      + ((mouse.y - particlesArray[a].y) * (mouse.y - particlesArray[a].y));
                    
                    if (mouseDistance < (mouse.radius * mouse.radius)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(0, 195, 255, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    initParticles();
    animate();


    // ==========================================
    // 📊 DASHBOARD & DYNAMIC GRAPH LOGIC
    // ==========================================
    const predictBtn = document.getElementById('predictBtn');
    const ticketInput = document.getElementById('ticketInput');
    const resultCard = document.getElementById('resultCard');
    const resCleaned = document.getElementById('resCleaned');
    const resCategory = document.getElementById('resCategory');
    const resPriority = document.getElementById('resPriority');

    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.size = 14; 

    const smoothAnimation = {
        duration: 1200,
        easing: 'easeOutQuart'
    };

    // --- Line Chart ---
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Current Live'],
            datasets: [{
                label: 'Tickets Received',
                data: [450, 520, 480, 610, 590, 846],
                borderColor: '#00c3ff',
                backgroundColor: 'rgba(0, 195, 255, 0.2)',
                borderWidth: 3, 
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00c3ff',
                pointRadius: 6, 
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: smoothAnimation,
            plugins: { title: { display: true, text: 'Ticket Volume Trend', font: { size: 18 } } }
        }
    });

    // --- Bar Chart (Categories) ---
    // Strict alignment with dataset categories
    const barLabels = ['Refund Request', 'Technical Issue', 'Cancellation Request', 'Product Inquiry', 'Billing Inquiry'];
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: 'Number of Tickets',
                data: [1752, 1747, 1695, 1641, 1634],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderWidth: 2, 
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: smoothAnimation,
            plugins: { title: { display: true, text: 'Tickets by Category', font: { size: 18 } } }
        }
    });

    // --- Pie Chart (Priorities) ---
    const pieLabels = ['Medium', 'Critical', 'High', 'Low'];
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                data: [2192, 2129, 2085, 2063],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#1e1e2f',
                hoverOffset: 15 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { animateScale: true, animateRotate: true, duration: 1200 },
            plugins: { title: { display: true, text: 'Priority Distribution', font: { size: 18 } } }
        }
    });


    // ==========================================
    // 🧠 ADVANCED MOCK AI PREDICTION ENGINE
    // ==========================================
    predictBtn.addEventListener('click', () => {
        const text = ticketInput.value.trim().toLowerCase();
        if (!text) {
            alert("Please enter a ticket description.");
            return;
        }

        // Mock Text Cleaning
        let cleaned = text.replace(/\{.*?\}/g, '').replace(/[\n\t\r]/g, ' ');
        resCleaned.textContent = cleaned;

        // Default Predictions
        let category = "Product Inquiry"; 
        let priority = "Low";

        // 1. Determine Category based on keywords
        if (cleaned.match(/refund|money back|return|reimburse/)) {
            category = "Refund Request";
        } else if (cleaned.match(/cancel|unsubscribe|stop|close account/)) {
            category = "Cancellation Request";
        } else if (cleaned.match(/charge|invoice|receipt|fee|payment|card|bill/)) {
            category = "Billing Inquiry";
        } else if (cleaned.match(/broken|not working|bug|error|glitch|crash|turn on|slow|freeze|issue/)) {
            category = "Technical Issue";
        }

        // 2. Determine Priority based on sentiment/urgency
        if (cleaned.match(/angry|worst|terrible|unacceptable|lawsuit|scam|threat/)) {
            priority = "Critical";
        } else if (cleaned.match(/urgent|asap|immediately|now|fast/)) {
            priority = "High";
        } else if (cleaned.match(/soon|when|please|delay/)) {
            priority = "Medium";
        }

        // 3. Applying custom boost rules from backend data processing notebook
        const urgentWords = ["angry", "refund", "money back", "not working", "broken", "worst"];
        if (urgentWords.some(word => cleaned.includes(word))) {
            if (priority === "Low" || priority === "Medium") priority = "High"; 
        }

        // Display results
        resCategory.textContent = `Category: ${category}`;
        resPriority.textContent = `Priority: ${priority}`;
        resultCard.classList.remove('hidden');
        
        // 4. Update the Specific Graphs dynamically
        const catIndex = barLabels.indexOf(category);
        if (catIndex !== -1) {
            // Adding 15 visually bumps the bar high enough so you see it move on the dashboard
            barChart.data.datasets[0].data[catIndex] += 15; 
            barChart.update();
        }

        const priIndex = pieLabels.indexOf(priority);
        if (priIndex !== -1) {
            pieChart.data.datasets[0].data[priIndex] += 15; 
            pieChart.update();
        }

        // Increment the current month line chart
        lineChart.data.datasets[0].data[5] += 15;
        lineChart.update();
    });
});

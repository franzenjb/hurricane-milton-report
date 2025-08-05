// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Initialize charts
    initializeCharts();
    
    // Initialize animations
    initializeAnimations();
    
    // Smooth scroll for navigation
    initializeSmoothScroll();
    
    // Initialize donation calculator
    initializeDonationCalculator();
    
    // Initialize interactive map
    initializeInteractiveMap();
});

// Chart initialization
function initializeCharts() {
    // Assistance Timeline Chart
    const assistanceCtx = document.getElementById('assistanceChart').getContext('2d');
    new Chart(assistanceCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 4', 'Month 2', 'Month 3', 'Month 6'],
            datasets: [{
                label: 'Cumulative People Helped',
                data: [2000, 5000, 8000, 10000, 12000, 13000],
                borderColor: '#ED1B2E',
                backgroundColor: 'rgba(237, 27, 46, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Assistance Over Time',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize animations on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate progress bars when visible
                if (entry.target.classList.contains('financial-breakdown')) {
                    animateProgressBars();
                }
                
                // Animate stat numbers
                if (entry.target.classList.contains('stat-card')) {
                    animateStatNumber(entry.target);
                }
                
                // Animate service metrics
                if (entry.target.classList.contains('service-card')) {
                    const metricElement = entry.target.querySelector('.service-metric');
                    if (metricElement && !metricElement.dataset.animated) {
                        animateServiceMetric(entry.target);
                    }
                }
                
                // Animate recovery stats
                if (entry.target.classList.contains('recovery-stat')) {
                    animateRecoveryStat(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.impact-card, .service-card, .story-card, .timeline-item, .stat-card, .financial-breakdown, .recovery-stat'
    );
    
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Animate stat numbers counting up
function animateStatNumber(statCard) {
    const numberElement = statCard.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    numberElement.dataset.animated = 'true';
    const targetText = numberElement.textContent;
    const isMonetary = targetText.includes('$');
    const hasPlus = targetText.includes('+');
    const hasM = targetText.includes('M');
    
    // Extract number
    let targetNumber = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    if (hasM) targetNumber *= 1000000;
    
    // Set initial value to 80% of target to reduce distraction
    let current = targetNumber * 0.8;
    const duration = 1000; // Reduced duration
    const steps = 30; // Reduced steps for smoother animation
    const increment = (targetNumber - current) / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        let displayValue = current;
        if (hasM) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (current >= 1000) {
            displayValue = Math.round(current).toLocaleString();
        } else {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        if (isMonetary) displayValue = '$' + displayValue;
        if (hasPlus && current === targetNumber) displayValue += '+';
        
        numberElement.textContent = displayValue;
    }, duration / steps);
}

// Initialize donation calculator
function initializeDonationCalculator() {
    const donationBtns = document.querySelectorAll('.donation-btn');
    const donationAmount = document.getElementById('donationAmount');
    const mealsProvided = document.getElementById('mealsProvided');
    const shelterNights = document.getElementById('shelterNights');
    const reliefKits = document.getElementById('reliefKits');
    
    if (!donationBtns.length) return;
    
    const impactRates = {
        meals: 2.5, // $2.50 per meal
        shelter: 25, // $25 per night
        kits: 20 // $20 per kit
    };
    
    donationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            donationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get donation amount
            const amount = parseInt(this.dataset.amount);
            
            // Update display
            donationAmount.textContent = '$' + amount;
            
            // Calculate impact
            const meals = Math.floor(amount / impactRates.meals);
            const nights = Math.floor(amount / impactRates.shelter);
            const kits = Math.floor(amount / impactRates.kits);
            
            // Animate values
            animateValue(mealsProvided, meals);
            animateValue(shelterNights, nights);
            animateValue(reliefKits, kits);
        });
    });
}

// Animate value changes
function animateValue(element, targetValue) {
    const currentValue = parseInt(element.textContent);
    const duration = 500;
    const steps = 20;
    const increment = (targetValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
            current = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current);
    }, duration / steps);
}

// Initialize interactive map
function initializeInteractiveMap() {
    const mapContainer = document.getElementById('interactiveMap');
    if (!mapContainer) return;
    
    // Add interactive overlay
    const locations = [
        { name: 'Tampa Bay', x: '20%', y: '45%', type: 'shelter' },
        { name: 'Fort Myers', x: '30%', y: '65%', type: 'feeding' },
        { name: 'Sarasota', x: '25%', y: '55%', type: 'distribution' },
        { name: 'Orlando', x: '60%', y: '30%', type: 'recovery' }
    ];
    
    locations.forEach(location => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.left = location.x;
        marker.style.top = location.y;
        marker.dataset.type = location.type;
        marker.title = location.name;
        
        const pulse = document.createElement('div');
        pulse.className = 'marker-pulse';
        marker.appendChild(pulse);
        
        mapContainer.appendChild(marker);
    });
    
    // Add CSS for map markers
    const style = document.createElement('style');
    style.textContent = `
        .map-marker {
            position: absolute;
            width: 16px;
            height: 16px;
            background: var(--red-cross-red);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 2;
        }
        
        .marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            background: var(--red-cross-red);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                opacity: 0.6;
                transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(2);
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-bg');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add resize handler for responsive charts
window.addEventListener('resize', () => {
    Chart.instances.forEach((chart) => {
        chart.resize();
    });
});

// Animate service metrics
function animateServiceMetric(serviceCard) {
    const metricElement = serviceCard.querySelector('.service-metric');
    if (!metricElement || metricElement.dataset.animated) return;
    
    metricElement.dataset.animated = 'true';
    const targetText = metricElement.textContent;
    const hasPlus = targetText.includes('+');
    
    // Handle different types of metrics
    if (targetText === '24/7') {
        // No animation for 24/7
        return;
    }
    
    // Extract number
    let targetNumber = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    
    // Set initial value to 80% of target
    let current = targetNumber * 0.8;
    const duration = 1000;
    const steps = 30;
    const increment = (targetNumber - current) / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        let displayValue = Math.round(current).toLocaleString();
        if (hasPlus && current === targetNumber) displayValue += '+';
        
        metricElement.textContent = displayValue;
    }, duration / steps);
}

// Animate recovery stats
function animateRecoveryStat(recoveryStat) {
    const numberElement = recoveryStat.querySelector('.recovery-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    numberElement.dataset.animated = 'true';
    const targetText = numberElement.textContent;
    const isMonetary = targetText.includes('$');
    const hasPlus = targetText.includes('+');
    const hasM = targetText.includes('M');
    
    // Extract number
    let targetNumber = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    if (hasM) targetNumber *= 1000000;
    
    // Set initial value to 80% of target
    let current = targetNumber * 0.8;
    const duration = 1000;
    const steps = 30;
    const increment = (targetNumber - current) / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        let displayValue = current;
        if (hasM) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (current >= 1000) {
            displayValue = Math.round(current).toLocaleString();
        } else {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        if (isMonetary) displayValue = '$' + displayValue;
        if (hasPlus && current === targetNumber) displayValue += '+';
        
        numberElement.textContent = displayValue;
    }, duration / steps);
}

// Initialize donation calculator
function initializeDonationCalculator() {
    const donationBtns = document.querySelectorAll('.donation-btn');
    const donationAmount = document.getElementById('donationAmount');
    const mealsProvided = document.getElementById('mealsProvided');
    const shelterNights = document.getElementById('shelterNights');
    const reliefKits = document.getElementById('reliefKits');
    
    if (!donationBtns.length) return;
    
    const impactRates = {
        meals: 2.5, // $2.50 per meal
        shelter: 25, // $25 per night
        kits: 20 // $20 per kit
    };
    
    donationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            donationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get donation amount
            const amount = parseInt(this.dataset.amount);
            
            // Update display
            donationAmount.textContent = '$' + amount;
            
            // Calculate impact
            const meals = Math.floor(amount / impactRates.meals);
            const nights = Math.floor(amount / impactRates.shelter);
            const kits = Math.floor(amount / impactRates.kits);
            
            // Animate values
            animateValue(mealsProvided, meals);
            animateValue(shelterNights, nights);
            animateValue(reliefKits, kits);
        });
    });
}

// Animate value changes
function animateValue(element, targetValue) {
    const currentValue = parseInt(element.textContent);
    const duration = 500;
    const steps = 20;
    const increment = (targetValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
            current = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current);
    }, duration / steps);
}

// Initialize interactive map
function initializeInteractiveMap() {
    const mapContainer = document.getElementById('interactiveMap');
    if (!mapContainer) return;
    
    // Add interactive overlay
    const locations = [
        { name: 'Tampa Bay', x: '20%', y: '45%', type: 'shelter' },
        { name: 'Fort Myers', x: '30%', y: '65%', type: 'feeding' },
        { name: 'Sarasota', x: '25%', y: '55%', type: 'distribution' },
        { name: 'Orlando', x: '60%', y: '30%', type: 'recovery' }
    ];
    
    locations.forEach(location => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.left = location.x;
        marker.style.top = location.y;
        marker.dataset.type = location.type;
        marker.title = location.name;
        
        const pulse = document.createElement('div');
        pulse.className = 'marker-pulse';
        marker.appendChild(pulse);
        
        mapContainer.appendChild(marker);
    });
    
    // Add CSS for map markers
    const style = document.createElement('style');
    style.textContent = `
        .map-marker {
            position: absolute;
            width: 16px;
            height: 16px;
            background: var(--red-cross-red);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 2;
        }
        
        .marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            background: var(--red-cross-red);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                opacity: 0.6;
                transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(2);
            }
        }
    `;
    document.head.appendChild(style);
}
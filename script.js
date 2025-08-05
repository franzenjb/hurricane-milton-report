// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Initialize animations
    initializeAnimations();
    
    // Smooth scroll for navigation
    initializeSmoothScroll();
});

// Chart initialization
function initializeCharts() {
    // Services Chart
    const servicesCtx = document.getElementById('servicesChart').getContext('2d');
    new Chart(servicesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Shelter Stays', 'Meals Served', 'Relief Items', 'People Helped'],
            datasets: [{
                data: [153300, 500000, 1860, 13000],
                backgroundColor: [
                    '#ED1B2E',
                    '#B91C26',
                    '#6B7280',
                    '#1F2937'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Services Provided',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            label += value.toLocaleString();
                            return label;
                        }
                    }
                }
            }
        }
    });
    
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
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.impact-card, .service-card, .story-card, .timeline-item, .stat-card, .financial-breakdown'
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
    
    const duration = 2000;
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    
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
            displayValue = current.toLocaleString();
        } else {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        if (isMonetary) displayValue = '$' + displayValue;
        if (hasPlus && current === targetNumber) displayValue += '+';
        
        numberElement.textContent = displayValue;
    }, duration / steps);
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
// SLBVI Calculator
let calculator = {
    // Default values
    basePrice: 85,
    stateOfHealth: 80,
    batteryChemistry: 'NMC',
    useCase: 'grid',
    remainingYears: 8,
    degradationRate: 2.0,
    
    // Chemistry-specific modifiers
    chemistryModifiers: {
        'NMC': { value: 1.0, cycleLife: 'Medium-High', thermalStability: 'Medium', costFactor: 'Medium' },
        'LFP': { value: 0.9, cycleLife: 'High', thermalStability: 'High', costFactor: 'Low' },
        'NCA': { value: 1.1, cycleLife: 'Medium', thermalStability: 'Low', costFactor: 'High' },
        'LMO': { value: 0.8, cycleLife: 'Low', thermalStability: 'Medium', costFactor: 'Low' }
    },
    
    // Use case modifiers
    useCaseModifiers: {
        'grid': { value: 1.0, description: 'Frequency regulation, energy arbitrage, peak shaving' },
        'commercial': { value: 0.9, description: 'Backup power, demand charge reduction' }
    },
    
    // Degradation rates by chemistry
    degradationRates: {
        'NMC': 2.0,
        'LFP': 1.2,
        'NCA': 2.2,
        'LMO': 3.0
    },
    
    // Charts
    charts: {
        sohChart: null,
        projectionChart: null,
        chemistryChart: null
    }
};

// Initialize calculator with region-specific data
window.initSLBVICalculator = function(regionData) {
    // Update regional data
    calculator.basePrice = regionData.basePrice;
    calculator.chemistryModifiers = regionData.chemistryModifiers;
    calculator.degradationRates = regionData.degradationRates;
    calculator.regionCode = regionData.regionCode;
    
    // Initialize UI
    initializeUI();
    
    // Calculate initial values
    calculateDegradationRate();
    calculateRemainingYears();
    calculateSLBVI();
    
    // Initialize charts
    initializeCharts();
    
    // Update UI with calculated values
    updateResultsUI();
};

// Initialize UI elements and event listeners
function initializeUI() {
    // SoH slider
    const sohSlider = document.getElementById('soh-slider');
    const sohValue = document.getElementById('soh-value');
    
    sohSlider.addEventListener('input', function() {
        calculator.stateOfHealth = parseInt(this.value);
        sohValue.textContent = `${calculator.stateOfHealth}%`;
        
        // Recalculate values
        calculateDegradationRate();
        calculateRemainingYears();
        calculateSLBVI();
        
        // Update charts and UI
        updateCharts();
        updateResultsUI();
    });
    
    // Chemistry options
    const chemistryOptions = document.querySelectorAll('.chemistry-option');
    
    chemistryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            chemistryOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Update calculator
            calculator.batteryChemistry = this.getAttribute('data-chemistry');
            
            // Update chemistry details
            updateChemistryDetails();
            
            // Recalculate values
            calculateDegradationRate();
            calculateRemainingYears();
            calculateSLBVI();
            
            // Update charts and UI
            updateCharts();
            updateResultsUI();
        });
    });
    
    // Use case options
    const useCaseOptions = document.querySelectorAll('.use-case-option');
    
    useCaseOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            useCaseOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Update calculator
            calculator.useCase = this.getAttribute('data-usecase');
            
            // Recalculate SLBVI
            calculateSLBVI();
            
            // Update charts and UI
            updateCharts();
            updateResultsUI();
        });
    });
    
    // Initial chemistry details
    updateChemistryDetails();
}

// Update chemistry details in UI
function updateChemistryDetails() {
    const chemistry = calculator.batteryChemistry;
    const chemistryInfo = calculator.chemistryModifiers[chemistry];
    
    // Update chemistry name
    const chemistryNames = {
        'NMC': 'NMC (Nickel Manganese Cobalt)',
        'LFP': 'LFP (Lithium Iron Phosphate)',
        'NCA': 'NCA (Nickel Cobalt Aluminum)',
        'LMO': 'LMO (Lithium Manganese Oxide)'
    };
    
    document.getElementById('selected-chemistry-name').textContent = chemistryNames[chemistry];
    document.getElementById('chemistry-cycle-life').textContent = chemistryInfo.cycleLife;
    document.getElementById('chemistry-thermal').textContent = chemistryInfo.thermalStability;
    document.getElementById('chemistry-cost').textContent = chemistryInfo.costFactor;
}

// Calculate degradation rate based on chemistry and SoH
function calculateDegradationRate() {
    // Base degradation rate for the selected chemistry
    const baseDegradation = calculator.degradationRates[calculator.batteryChemistry];
    
    // Adjust based on current SoH (lower SoH = higher degradation rate in most cases)
    const sohFactor = 1 + (0.5 * (80 - calculator.stateOfHealth) / 30); // Adjusts degradation up when SoH is below 80%
    
    calculator.degradationRate = Math.max(baseDegradation * sohFactor, 0.5);
    
    return calculator.degradationRate;
}

// Calculate remaining years based on SoH and degradation
function calculateRemainingYears() {
    const endOfLifeSoH = 50; // Battery considered end-of-life at 50% SoH
    const yearsLeft = Math.max(Math.round((calculator.stateOfHealth - endOfLifeSoH) / calculator.degradationRate), 1);
    
    calculator.remainingYears = yearsLeft;
    
    return calculator.remainingYears;
}

// Calculate SLBVI
function calculateSLBVI() {
    const sohFactor = calculator.stateOfHealth / 100;
    const chemistryFactor = calculator.chemistryModifiers[calculator.batteryChemistry].value;
    const useCaseFactor = calculator.useCaseModifiers[calculator.useCase].value;
    const lifeFactor = Math.min(calculator.remainingYears / 10, 1); // Normalized to 10 years
    
    calculator.slbvi = calculator.basePrice * sohFactor * chemistryFactor * useCaseFactor * lifeFactor;
    
    return calculator.slbvi;
}

// Update results UI
function updateResultsUI() {
    document.getElementById('slbvi-value').textContent = `$${calculator.slbvi.toFixed(2)}`;
    document.getElementById('degradation-rate').textContent = `${calculator.degradationRate.toFixed(1)}%`;
    document.getElementById('remaining-years').textContent = calculator.remainingYears;
    document.getElementById('soh-factor').textContent = (calculator.stateOfHealth / 100).toFixed(2);
}

// Initialize charts
function initializeCharts() {
    initializeSohChart();
    initializeProjectionChart();
    initializeChemistryChart();
}

// Initialize SoH vs Value chart
function initializeSohChart() {
    const ctx = document.getElementById('sohChart').getContext('2d');
    
    // Use SoH value data from regions.js
    const baseCurve = window.sohValueData.baseCurve;
    const chemCurve = window.sohValueData.chemCurves[calculator.batteryChemistry];
    
    // Current SoH marker
    const sohMarker = [
        { soh: calculator.stateOfHealth, value: 0 },
        { soh: calculator.stateOfHealth, value: 120 }
    ];
    
    calculator.charts.sohChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Base Value Curve',
                data: baseCurve,
                borderColor: '#0088FE',
                backgroundColor: 'rgba(0, 136, 254, 0.1)',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }, {
                label: `${calculator.batteryChemistry} Value`,
                data: chemCurve,
                borderColor: '#FF8042',
                backgroundColor: 'rgba(255, 128, 66, 0.1)',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }, {
                label: 'Current SoH',
                data: sohMarker,
                borderColor: '#22C55E',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            parsing: {
                xAxisKey: 'soh',
                yAxisKey: 'value'
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'State of Health (%)'
                    },
                    ticks: {
                        stepSize: 10
                    }
                },
                y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Value (USD/kWh)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            animation: false,
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Initialize Projection Chart
function initializeProjectionChart() {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    
    // Generate projection data
    const projectionData = generateProjectionData();
    
    calculator.charts.projectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: projectionData.years,
            datasets: [{
                label: 'SLBVI Value',
                data: projectionData.values,
                borderColor: '#0088FE',
                backgroundColor: 'rgba(0, 136, 254, 0.1)',
                borderWidth: 3,
                pointRadius: 3,
                tension: 0.4,
                fill: true
            }, {
                label: 'State of Health',
                data: projectionData.soh,
                borderColor: '#FF8042',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointRadius: 3,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Value (USD/kWh/year)'
                    }
                },
                y1: {
                    min: 0,
                    max: 100,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'State of Health (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Years from now'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === 'SLBVI Value') {
                                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                            } else {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Initialize Chemistry Comparison Chart
function initializeChemistryChart() {
    const ctx = document.getElementById('chemistryChart').getContext('2d');
    
    // Generate chemistry comparison data
    const chemistryData = generateChemistryData();
    
    calculator.charts.chemistryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chemistryData.labels,
            datasets: [{
                label: 'SLBVI Value',
                data: chemistryData.values,
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Value (USD/kWh/year)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Update charts when parameters change
function updateCharts() {
    updateSohChart();
    updateProjectionChart();
    updateChemistryChart();
}

// Update SoH Chart
function updateSohChart() {
    if (!calculator.charts.sohChart) return;
    
    const chart = calculator.charts.sohChart;
    
    // Update chemistry curve
    chart.data.datasets[1].data = window.sohValueData.chemCurves[calculator.batteryChemistry];
    chart.data.datasets[1].label = `${calculator.batteryChemistry} Value`;
    
    // Update SoH marker
    chart.data.datasets[2].data = [
        { soh: calculator.stateOfHealth, value: 0 },
        { soh: calculator.stateOfHealth, value: 120 }
    ];
    
    chart.update();
}

// Update Projection Chart
function updateProjectionChart() {
    if (!calculator.charts.projectionChart) return;
    
    const chart = calculator.charts.projectionChart;
    const projectionData = generateProjectionData();
    
    chart.data.labels = projectionData.years;
    chart.data.datasets[0].data = projectionData.values;
    chart.data.datasets[1].data = projectionData.soh;
    
    chart.update();
}

// Update Chemistry Chart
function updateChemistryChart() {
    if (!calculator.charts.chemistryChart) return;
    
    const chart = calculator.charts.chemistryChart;
    const chemistryData = generateChemistryData();
    
    chart.data.datasets[0].data = chemistryData.values;
    
    // Highlight selected chemistry
    const backgroundColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'].map((color, index) => {
        if (chemistryData.labels[index] === calculator.batteryChemistry) {
            return color;
        } else {
            return color + '80'; // Add transparency to non-selected
        }
    });
    
    chart.data.datasets[0].backgroundColor = backgroundColors;
    chart.update();
}

// Generate projection data over time
function generateProjectionData() {
    const years = [];
    const values = [];
    const soh = [];
    
    const currentSoH = calculator.stateOfHealth;
    const degradationRate = calculator.degradationRate;
    
    for (let year = 0; year <= calculator.remainingYears; year++) {
        years.push(year);
        
        // Calculate projected SoH
        const projectedSoH = Math.max(currentSoH - (degradationRate * year), 0);
        soh.push(projectedSoH);
        
        // Calculate SLBVI for that year
        const sohFactor = projectedSoH / 100;
        const chemistryFactor = calculator.chemistryModifiers[calculator.batteryChemistry].value;
        const useCaseFactor = calculator.useCaseModifiers[calculator.useCase].value;
        const lifeFactor = Math.min((calculator.remainingYears - year) / 10, 1);
        
        const yearlyValue = calculator.basePrice * sohFactor * chemistryFactor * useCaseFactor * lifeFactor;
        values.push(parseFloat(yearlyValue.toFixed(2)));
    }
    
    return { years, values, soh };
}

// Generate chemistry comparison data
function generateChemistryData() {
    const labels = Object.keys(calculator.chemistryModifiers);
    const values = [];
    
    labels.forEach(chemistry => {
        const sohFactor = calculator.stateOfHealth / 100;
        const chemistryFactor = calculator.chemistryModifiers[chemistry].value;
        const useCaseFactor = calculator.useCaseModifiers[calculator.useCase].value;
        const lifeFactor = Math.min(calculator.remainingYears / 10, 1);
        
        const value = calculator.basePrice * sohFactor * chemistryFactor * useCaseFactor * lifeFactor;
        values.push(parseFloat(value.toFixed(2)));
    });
    
    return { labels, values };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Authentication check is handled by auth.js
    
    // The calculator initialization will be triggered by regions.js
    // after getting the region data from the URL
});
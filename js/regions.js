// Region Data with battery value index details
const regionData = {
    'north-america': {
        name: 'North America',
        icon: '🇺🇸',
        basePrice: 85.00,
        gridServicesValue: 73.10,
        ciValue: 68.00,
        inventory: '17,850 MWh',
        updated: 'Today',
        chemistryModifiers: {
            'NMC': { value: 1.0, cycleLife: 'Medium-High', thermalStability: 'Medium', costFactor: 'Medium' },
            'LFP': { value: 0.9, cycleLife: 'High', thermalStability: 'High', costFactor: 'Low' },
            'NCA': { value: 1.1, cycleLife: 'Medium', thermalStability: 'Low', costFactor: 'High' },
            'LMO': { value: 0.8, cycleLife: 'Low', thermalStability: 'Medium', costFactor: 'Low' }
        },
        degradationRates: {
            'NMC': 2.0,
            'LFP': 1.2,
            'NCA': 2.2,
            'LMO': 3.0
        },
        description: 'The North American market shows strong demand for second-life batteries in grid services, with California and Texas leading adoption. Base pricing reflects the premium market for energy storage solutions and higher labor costs for refurbishment.'
    },
    'europe': {
        name: 'Europe',
        icon: '🇪🇺',
        basePrice: 62.00,
        gridServicesValue: 53.32,
        ciValue: 49.60,
        inventory: '22,430 MWh',
        updated: 'Today',
        chemistryModifiers: {
            'NMC': { value: 1.0, cycleLife: 'Medium-High', thermalStability: 'Medium', costFactor: 'Medium' },
            'LFP': { value: 0.95, cycleLife: 'High', thermalStability: 'High', costFactor: 'Low' },
            'NCA': { value: 1.05, cycleLife: 'Medium', thermalStability: 'Low', costFactor: 'High' },
            'LMO': { value: 0.8, cycleLife: 'Low', thermalStability: 'Medium', costFactor: 'Low' }
        },
        degradationRates: {
            'NMC': 1.9,
            'LFP': 1.1,
            'NCA': 2.1,
            'LMO': 2.8
        },
        description: 'European markets benefit from supportive regulatory frameworks and circular economy initiatives. The EU Battery Directive helps create value for second-life applications, though labor costs impact overall economics. Germany, France, and the UK lead in deployment.'
    },
    'asia-pacific': {
        name: 'Asia Pacific',
        icon: '🌏',
        basePrice: 50.00,
        gridServicesValue: 43.00,
        ciValue: 40.00,
        inventory: '30,760 MWh',
        updated: 'Yesterday',
        chemistryModifiers: {
            'NMC': { value: 1.0, cycleLife: 'Medium-High', thermalStability: 'Medium', costFactor: 'Medium' },
            'LFP': { value: 1.1, cycleLife: 'High', thermalStability: 'High', costFactor: 'Low' },
            'NCA': { value: 0.95, cycleLife: 'Medium', thermalStability: 'Low', costFactor: 'High' },
            'LMO': { value: 0.9, cycleLife: 'Low', thermalStability: 'Medium', costFactor: 'Low' }
        },
        degradationRates: {
            'NMC': 2.1,
            'LFP': 1.0,
            'NCA': 2.3,
            'LMO': 2.7
        },
        description: 'Asia Pacific represents the largest market by volume with China, Japan, and South Korea dominating battery manufacturing and recycling. Lower labor costs and high technical expertise contribute to competitive pricing. LFP chemistry is particularly favored in this region.'
    },
    'middle-east': {
        name: 'Middle East',
        icon: '🇦🇪',
        basePrice: 70.00,
        gridServicesValue: 60.20,
        ciValue: 56.00,
        inventory: '5,420 MWh',
        updated: '2 days ago',
        chemistryModifiers: {
            'NMC': { value: 1.0, cycleLife: 'Medium-High', thermalStability: 'Medium', costFactor: 'Medium' },
            'LFP': { value: 0.9, cycleLife: 'High', thermalStability: 'High', costFactor: 'Low' },
            'NCA': { value: 1.15, cycleLife: 'Medium', thermalStability: 'Low', costFactor: 'High' },
            'LMO': { value: 0.75, cycleLife: 'Low', thermalStability: 'Medium', costFactor: 'Low' }
        },
        degradationRates: {
            'NMC': 2.2,
            'LFP': 1.3,
            'NCA': 2.4,
            'LMO': 3.2
        },
        description: 'The Middle East is an emerging market for energy storage, with UAE and Saudi Arabia making significant investments in renewable energy integration. High ambient temperatures create challenges for battery longevity, affecting valuation models.'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication and update user info
    updateUserInfo();
    
    // Handle table row clicks
    const tableRows = document.querySelectorAll('#regions-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            window.location.href = `calculator.html?region=${region}`;
        });
    });
    
    // Handle URL parameter if on calculator page
    if (window.location.pathname.includes('calculator.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const region = urlParams.get('region');
        
        if (region && regionData[region]) {
            initializeCalculator(region);
        } else {
            // Default to North America if no valid region specified
            initializeCalculator('north-america');
        }
    }
});

// Initialize the calculator with region-specific data
function initializeCalculator(regionCode) {
    const region = regionData[regionCode];
    
    // Update region info on the page
    document.querySelectorAll('.region-name').forEach(el => {
        el.textContent = region.name;
    });
    
    document.querySelectorAll('.region-icon').forEach(el => {
        el.textContent = region.icon;
    });
    
    document.querySelectorAll('.region-description').forEach(el => {
        el.textContent = region.description;
    });
    
    // Set base price
    if (document.getElementById('base-price')) {
        document.getElementById('base-price').textContent = `$${region.basePrice.toFixed(2)}`;
    }
    
    // Initialize calculator with regional data
    if (window.initSLBVICalculator) {
        window.initSLBVICalculator({
            basePrice: region.basePrice,
            chemistryModifiers: region.chemistryModifiers,
            degradationRates: region.degradationRates,
            regionCode: regionCode
        });
    }
    
    // Generate SoH value curve data based on region
    generateSohValueData(regionCode);
    
    // Update breadcrumb
    const breadcrumbRegion = document.querySelector('.breadcrumb-region');
    if (breadcrumbRegion) {
        breadcrumbRegion.textContent = region.name;
    }
}

// Generate State of Health vs Value curve data
function generateSohValueData(regionCode) {
    const region = regionData[regionCode];
    const basePrice = region.basePrice;
    
    // Base curve data
    const baseCurveData = [
        { soh: 50, value: basePrice * 0.25 },
        { soh: 60, value: basePrice * 0.4 },
        { soh: 70, value: basePrice * 0.6 },
        { soh: 80, value: basePrice * 0.75 },
        { soh: 90, value: basePrice * 0.9 },
        { soh: 100, value: basePrice }
    ];
    
    // Chemistry specific curves for the selected region
    const chemCurves = {};
    
    Object.keys(region.chemistryModifiers).forEach(chemistry => {
        const modifier = region.chemistryModifiers[chemistry].value;
        
        chemCurves[chemistry] = [
            { soh: 50, value: basePrice * 0.25 * modifier },
            { soh: 60, value: basePrice * 0.4 * modifier },
            { soh: 70, value: basePrice * 0.6 * modifier },
            { soh: 80, value: basePrice * 0.75 * modifier },
            { soh: 90, value: basePrice * 0.9 * modifier },
            { soh: 100, value: basePrice * modifier }
        ];
    });
    
    // Store data in window object for access by calculator.js
    window.sohValueData = {
        baseCurve: baseCurveData,
        chemCurves: chemCurves
    };
}

// Export region data for use in other scripts
window.regionData = regionData;
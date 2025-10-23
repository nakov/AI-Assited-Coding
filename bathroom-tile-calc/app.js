/**
 * Main Application Module
 * Coordinates between calculator, visualizer, and UI
 */

class BathroomTileApp {
    constructor() {
        this.calculator = new TileCalculator();
        this.visualizer = new BathroomVisualizer('visualization-canvas');
        this.currentResults = null;
        
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Form submission
        const form = document.getElementById('tile-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // View tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e));
        });

        // Input changes for real-time validation
        const inputs = form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(event) {
        event.preventDefault();

        // Get form values
        const params = this.getFormValues();

        // Validate parameters
        const validation = this.calculator.validateParams(params);
        
        if (!validation.isValid) {
            this.showErrors(validation.errors);
            return;
        }

        // Calculate tiles
        const results = this.calculator.calculateAllTiles(params);
        this.currentResults = results;

        // Display results
        this.displayResults(results);

        // Show results and visualization sections
        this.showSections();

        // Draw initial visualization
        this.visualizer.draw(results, 'floor');

        // Smooth scroll to results
        document.getElementById('results-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    /**
     * Get all form values
     */
    getFormValues() {
        return {
            floorWidth: parseFloat(document.getElementById('floor-width').value),
            floorLength: parseFloat(document.getElementById('floor-length').value),
            floorTileWidth: parseFloat(document.getElementById('floor-tile-width').value),
            floorTileLength: parseFloat(document.getElementById('floor-tile-length').value),
            wallHeight: parseFloat(document.getElementById('wall-height').value),
            wallTileWidth: parseFloat(document.getElementById('wall-tile-width').value),
            wallTileHeight: parseFloat(document.getElementById('wall-tile-height').value),
            doorWidth: parseFloat(document.getElementById('door-width').value),
            doorHeight: parseFloat(document.getElementById('door-height').value)
        };
    }

    /**
     * Display calculation results
     */
    displayResults(results) {
        // Floor tiles
        document.getElementById('floor-tiles').textContent = results.floor.tilesNeeded.toLocaleString();
        document.getElementById('floor-area').textContent = results.floor.area;

        // Wall tiles
        document.getElementById('wall-tiles').textContent = results.wall.tilesNeeded.toLocaleString();
        document.getElementById('wall-area').textContent = results.wall.area;
    }

    /**
     * Show results and visualization sections
     */
    showSections() {
        document.getElementById('results-section').style.display = 'block';
        document.getElementById('visualization-section').style.display = 'block';
    }

    /**
     * Handle view change between floor and walls
     */
    handleViewChange(event) {
        const button = event.target;
        const view = button.dataset.view;

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Draw visualization
        if (this.currentResults) {
            this.visualizer.draw(this.currentResults, view);
        }
    }

    /**
     * Validate individual input
     */
    validateInput(input) {
        const value = parseFloat(input.value);
        
        if (isNaN(value) || value <= 0) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#4A90E2';
        }
    }

    /**
     * Show validation errors
     */
    showErrors(errors) {
        let errorMessage = 'Please fix the following errors:\n\n';
        errors.forEach(error => {
            errorMessage += `• ${error}\n`;
        });
        
        alert(errorMessage);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BathroomTileApp();
    console.log('Bathroom Tile Calculator initialized successfully!');
});

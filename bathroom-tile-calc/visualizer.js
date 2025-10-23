/**
 * Bathroom Visualizer Module
 * Handles canvas-based visualization of bathroom floor and walls with tiles
 */

class BathroomVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentView = 'floor';
        this.params = null;
        
        // Colors
        this.colors = {
            floorTile: '#8B4513',
            wallTile: '#4A90E2',
            grout: '#CCCCCC',
            door: 'rgba(139, 69, 19, 0.3)',
            background: '#F5F5F5',
            text: '#2c3e50',
            border: '#333333'
        };

        // Set canvas size
        this.setCanvasSize();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Set canvas size based on container
     */
    setCanvasSize() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(container.offsetWidth - 40, 1000);
        const maxHeight = Math.min(window.innerHeight * 0.6, 600);
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.setCanvasSize();
        if (this.params) {
            this.draw(this.params, this.currentView);
        }
    }

    /**
     * Draw visualization based on view type
     * @param {Object} params - Bathroom parameters
     * @param {string} view - 'floor' or 'walls'
     */
    draw(params, view) {
        this.params = params;
        this.currentView = view;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (view === 'floor') {
            this.drawFloorPlan();
        } else {
            this.drawWallElevations();
        }
    }

    /**
     * Draw floor plan with tiles
     */
    drawFloorPlan() {
        const params = this.params.bathroomParams;
        
        // Calculate scale to fit canvas
        const padding = 80;
        const availableWidth = this.canvas.width - padding * 2;
        const availableHeight = this.canvas.height - padding * 2;
        
        const scaleW = availableWidth / params.floorWidth;
        const scaleH = availableHeight / params.floorLength;
        const scale = Math.min(scaleW, scaleH);
        
        const floorWidth = params.floorWidth * scale;
        const floorLength = params.floorLength * scale;
        const tileWidth = params.floorTileWidth * scale;
        const tileLength = params.floorTileLength * scale;
        
        // Center the drawing
        const startX = (this.canvas.width - floorWidth) / 2;
        const startY = (this.canvas.height - floorLength) / 2;
        
        // Draw title
        this.drawTitle('Floor Plan View');
        
        // Draw floor tiles
        this.ctx.strokeStyle = this.colors.grout;
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < floorWidth; x += tileWidth) {
            for (let y = 0; y < floorLength; y += tileLength) {
                // Tile color with slight variation
                const variation = Math.random() * 20 - 10;
                this.ctx.fillStyle = this.adjustColor(this.colors.floorTile, variation);
                
                // Draw tile
                const tileX = startX + x;
                const tileY = startY + y;
                const actualTileW = Math.min(tileWidth, floorWidth - x);
                const actualTileL = Math.min(tileLength, floorLength - y);
                
                this.ctx.fillRect(tileX, tileY, actualTileW, actualTileL);
                this.ctx.strokeRect(tileX, tileY, actualTileW, actualTileL);
            }
        }
        
        // Draw border
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(startX, startY, floorWidth, floorLength);
        
        // Draw dimensions
        this.drawDimensions(startX, startY, floorWidth, floorLength, params.floorWidth, params.floorLength);
        
        // Draw legend
        this.drawFloorLegend(startX, startY + floorLength + 30);
    }

    /**
     * Draw wall elevations with tiles
     */
    drawWallElevations() {
        const params = this.params.bathroomParams;
        
        // Calculate scale
        const padding = 60;
        const gapBetweenWalls = 40;
        
        // Arrange 4 walls in 2x2 grid
        const availableWidth = (this.canvas.width - padding * 2 - gapBetweenWalls) / 2;
        const availableHeight = (this.canvas.height - padding * 2 - gapBetweenWalls - 40) / 2; // 40 for title
        
        // Calculate scales for different walls
        const wall1Scale = this.calculateWallScale(params.floorWidth, params.wallHeight, availableWidth, availableHeight);
        const wall2Scale = this.calculateWallScale(params.floorLength, params.wallHeight, availableWidth, availableHeight);
        
        // Draw title
        this.drawTitle('Wall Elevations (4 Walls)');
        
        const titleOffset = 50;
        
        // Wall 1 (Front wall with door) - Top left
        this.drawWall(
            padding,
            padding + titleOffset,
            params.floorWidth,
            params.wallHeight,
            params.wallTileWidth,
            params.wallTileHeight,
            wall1Scale,
            'Front Wall (with door)',
            { width: params.doorWidth, height: params.doorHeight }
        );
        
        // Wall 2 (Left wall) - Top right
        this.drawWall(
            padding + availableWidth + gapBetweenWalls,
            padding + titleOffset,
            params.floorLength,
            params.wallHeight,
            params.wallTileWidth,
            params.wallTileHeight,
            wall2Scale,
            'Left Wall',
            null
        );
        
        // Wall 3 (Back wall) - Bottom left
        this.drawWall(
            padding,
            padding + availableHeight + gapBetweenWalls + titleOffset,
            params.floorWidth,
            params.wallHeight,
            params.wallTileWidth,
            params.wallTileHeight,
            wall1Scale,
            'Back Wall',
            null
        );
        
        // Wall 4 (Right wall) - Bottom right
        this.drawWall(
            padding + availableWidth + gapBetweenWalls,
            padding + availableHeight + gapBetweenWalls + titleOffset,
            params.floorLength,
            params.wallHeight,
            params.wallTileWidth,
            params.wallTileHeight,
            wall2Scale,
            'Right Wall',
            null
        );
    }

    /**
     * Calculate scale for a wall
     */
    calculateWallScale(width, height, availableWidth, availableHeight) {
        const scaleW = availableWidth / width;
        const scaleH = availableHeight / height;
        return Math.min(scaleW, scaleH, 0.3); // Cap at 0.3 for better visibility
    }

    /**
     * Draw a single wall with tiles
     */
    drawWall(startX, startY, width, height, tileWidth, tileHeight, scale, label, door) {
        const wallWidth = width * scale;
        const wallHeight = height * scale;
        const scaledTileWidth = tileWidth * scale;
        const scaledTileHeight = tileHeight * scale;
        
        // Draw wall tiles
        this.ctx.strokeStyle = this.colors.grout;
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x < wallWidth; x += scaledTileWidth) {
            for (let y = 0; y < wallHeight; y += scaledTileHeight) {
                const tileX = startX + x;
                const tileY = startY + y;
                const actualTileW = Math.min(scaledTileWidth, wallWidth - x);
                const actualTileH = Math.min(scaledTileHeight, wallHeight - y);
                
                // Tile color with slight variation
                const variation = Math.random() * 15 - 7;
                this.ctx.fillStyle = this.adjustColor(this.colors.wallTile, variation);
                
                this.ctx.fillRect(tileX, tileY, actualTileW, actualTileH);
                this.ctx.strokeRect(tileX, tileY, actualTileW, actualTileH);
            }
        }
        
        // Draw door if specified
        if (door) {
            const doorWidth = door.width * scale;
            const doorHeight = door.height * scale;
            const doorX = startX + (wallWidth - doorWidth) / 2;
            const doorY = startY + wallHeight - doorHeight;
            
            this.ctx.fillStyle = this.colors.door;
            this.ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
            this.ctx.strokeStyle = this.colors.border;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
            
            // Door label
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('DOOR', doorX + doorWidth / 2, doorY + doorHeight / 2 + 4);
        }
        
        // Draw border
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(startX, startY, wallWidth, wallHeight);
        
        // Draw label
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, startX + wallWidth / 2, startY - 10);
        
        // Draw dimensions
        this.ctx.font = '11px Arial';
        this.ctx.fillText(`${width}mm × ${height}mm`, startX + wallWidth / 2, startY + wallHeight + 20);
    }

    /**
     * Draw title
     */
    drawTitle(title) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.canvas.width / 2, 30);
    }

    /**
     * Draw dimensions for floor plan
     */
    drawDimensions(x, y, width, height, actualWidth, actualLength) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        
        // Width dimension (top)
        this.ctx.fillText(`${actualWidth} mm`, x + width / 2, y - 20);
        
        // Length dimension (right)
        this.ctx.save();
        this.ctx.translate(x + width + 30, y + height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(`${actualLength} mm`, 0, 0);
        this.ctx.restore();
    }

    /**
     * Draw legend for floor plan
     */
    drawFloorLegend(x, y) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Floor Tile: ${this.params.bathroomParams.floorTileWidth} × ${this.params.bathroomParams.floorTileLength} mm`, x, y);
    }

    /**
     * Adjust color brightness
     */
    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BathroomVisualizer;
}

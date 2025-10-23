/**
 * Bathroom Tile Calculator Module
 * Handles all tile calculation logic with waste allowance
 */

class TileCalculator {
    constructor() {
        this.WASTE_ALLOWANCE = 0.10; // 10% waste allowance
    }

    /**
     * Calculate number of floor tiles needed
     * @param {Object} params - Floor parameters
     * @returns {Object} Calculation results
     */
    calculateFloorTiles(params) {
        const { floorWidth, floorLength, tileWidth, tileLength } = params;

        // Calculate floor area in square meters
        const floorArea = (floorWidth * floorLength) / 1000000;

        // Calculate tile area in square meters
        const tileArea = (tileWidth * tileLength) / 1000000;

        // Calculate number of tiles without waste
        const tilesNeeded = Math.ceil(floorArea / tileArea);

        // Add waste allowance
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + this.WASTE_ALLOWANCE));

        return {
            area: floorArea.toFixed(2),
            tilesNeeded: tilesWithWaste,
            tilesWithoutWaste: tilesNeeded,
            wasteAllowance: this.WASTE_ALLOWANCE * 100
        };
    }

    /**
     * Calculate number of wall tiles needed
     * @param {Object} params - Wall parameters
     * @returns {Object} Calculation results
     */
    calculateWallTiles(params) {
        const { 
            floorWidth, 
            floorLength, 
            wallHeight, 
            tileWidth, 
            tileHeight,
            doorWidth,
            doorHeight 
        } = params;

        // Calculate perimeter of the bathroom
        const perimeter = 2 * (floorWidth + floorLength);

        // Calculate total wall area in square meters
        const totalWallArea = (perimeter * wallHeight) / 1000000;

        // Calculate door area in square meters
        const doorArea = (doorWidth * doorHeight) / 1000000;

        // Calculate net wall area (excluding door)
        const netWallArea = totalWallArea - doorArea;

        // Calculate wall tile area in square meters
        const tileArea = (tileWidth * tileHeight) / 1000000;

        // Calculate number of tiles without waste
        const tilesNeeded = Math.ceil(netWallArea / tileArea);

        // Add waste allowance
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + this.WASTE_ALLOWANCE));

        return {
            area: netWallArea.toFixed(2),
            totalArea: totalWallArea.toFixed(2),
            doorArea: doorArea.toFixed(2),
            tilesNeeded: tilesWithWaste,
            tilesWithoutWaste: tilesNeeded,
            wasteAllowance: this.WASTE_ALLOWANCE * 100
        };
    }

    /**
     * Calculate all tiles needed for the bathroom
     * @param {Object} bathroomParams - All bathroom parameters
     * @returns {Object} Complete calculation results
     */
    calculateAllTiles(bathroomParams) {
        const floorResults = this.calculateFloorTiles({
            floorWidth: bathroomParams.floorWidth,
            floorLength: bathroomParams.floorLength,
            tileWidth: bathroomParams.floorTileWidth,
            tileLength: bathroomParams.floorTileLength
        });

        const wallResults = this.calculateWallTiles({
            floorWidth: bathroomParams.floorWidth,
            floorLength: bathroomParams.floorLength,
            wallHeight: bathroomParams.wallHeight,
            tileWidth: bathroomParams.wallTileWidth,
            tileHeight: bathroomParams.wallTileHeight,
            doorWidth: bathroomParams.doorWidth,
            doorHeight: bathroomParams.doorHeight
        });

        return {
            floor: floorResults,
            wall: wallResults,
            bathroomParams: bathroomParams
        };
    }

    /**
     * Validate input parameters
     * @param {Object} params - Parameters to validate
     * @returns {Object} Validation result
     */
    validateParams(params) {
        const errors = [];

        // Check for required fields
        const requiredFields = [
            'floorWidth', 'floorLength', 'floorTileWidth', 'floorTileLength',
            'wallHeight', 'wallTileWidth', 'wallTileHeight', 'doorWidth', 'doorHeight'
        ];

        for (const field of requiredFields) {
            if (!params[field] || params[field] <= 0) {
                errors.push(`${field} must be a positive number`);
            }
        }

        // Check if tile sizes are not larger than dimensions
        if (params.floorTileWidth > params.floorWidth) {
            errors.push('Floor tile width cannot be larger than floor width');
        }

        if (params.floorTileLength > params.floorLength) {
            errors.push('Floor tile length cannot be larger than floor length');
        }

        if (params.wallTileHeight > params.wallHeight) {
            errors.push('Wall tile height cannot be larger than wall height');
        }

        if (params.doorWidth > params.floorWidth) {
            errors.push('Door width cannot be larger than floor width');
        }

        if (params.doorHeight > params.wallHeight) {
            errors.push('Door height cannot be larger than wall height');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileCalculator;
}

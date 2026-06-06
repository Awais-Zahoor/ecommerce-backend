import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';

const execPromise = util.promisify(exec);

/**
 * Compresses a GLB file using gltf-pipeline with Draco compression.
 * Note: gltf-pipeline must be installed in the project.
 * 
 * @param {string} inputPath - Path to the original GLB file
 * @param {string} outputPath - Path where the compressed GLB will be saved
 * @returns {Promise<Object>} - Compression statistics
 */
async function compressGLB(inputPath, outputPath) {
    try {
        // Using npx to ensure the command is available if not globally installed
        const command = `npx gltf-pipeline -i "${inputPath}" -o "${outputPath}" -d`;
        
        await execPromise(command);
        
        // Get file sizes for comparison
        const originalStats = await fs.stat(inputPath);
        const compressedStats = await fs.stat(outputPath);
        
        const compressionRatio = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(2);
        
        console.log(`[Compression] Success: ${compressionRatio}% reduction (${(originalStats.size / 1024).toFixed(1)}KB -> ${(compressedStats.size / 1024).toFixed(1)}KB)`);
        
        return {
            originalSize: originalStats.size,
            compressedSize: compressedStats.size,
            compressionRatio: compressionRatio
        };
        
    } catch (error) {
        console.error('[Compression] Error during GLB compression:', error);
        // Fallback: If compression fails (e.g. tool not installed), just copy the file
        try {
            await fs.copyFile(inputPath, outputPath);
            const stats = await fs.stat(outputPath);
            return {
                originalSize: stats.size,
                compressedSize: stats.size,
                compressionRatio: 0,
                error: 'Compression tool failed, using original file'
            };
        } catch (copyError) {
            throw error;
        }
    }
}

export { compressGLB };

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

/**
 * Cloudinary Multi-Account Uploader
 * 
 * Reads CLOUDINARY_CONFIGS from env as:
 *   "cloudName1:apiKey1:apiSecret1,cloudName2:apiKey2:apiSecret2"
 * 
 * Rotates between accounts on each upload (round-robin).
 */

let configs = [];
let currentIndex = 0;

// Parse configs from env
const initConfigs = () => {
    if (configs.length > 0) return;

    const raw = process.env.CLOUDINARY_CONFIGS;
    if (!raw) {
        console.error('❌ CLOUDINARY_CONFIGS not set in .env');
        return;
    }

    configs = raw.split(',').map((entry, i) => {
        const [cloud_name, api_key, api_secret] = entry.trim().split(':');
        if (!cloud_name || !api_key || !api_secret) {
            console.error(`❌ Invalid Cloudinary config at index ${i}: "${entry}"`);
            return null;
        }
        return { cloud_name, api_key, api_secret };
    }).filter(Boolean);

    console.log(`☁️  Loaded ${configs.length} Cloudinary account(s)`);
};

// Get a random config to ensure load balancing across accounts
const getRandomConfig = () => {
    initConfigs();
    if (configs.length === 0) throw new Error('No Cloudinary configs available');
    const randomIndex = Math.floor(Math.random() * configs.length);
    return configs[randomIndex];
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'treasure_hunt') => {
    const config = getRandomConfig();

    cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret,
    });

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                format: 'jpg',            // Convert to jpg for consistency
                transformation: [
                    { width: 1200, crop: 'limit', quality: 'auto:low' },
                ],
            },
            (error, result) => {
                if (error) {
                    console.error(`❌ Cloudinary upload failed (${config.cloud_name}):`, error.message);
                    reject(error);
                } else {
                    console.log(`☁️  Uploaded to ${config.cloud_name}: ${result.secure_url}`);
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export default uploadToCloudinary;

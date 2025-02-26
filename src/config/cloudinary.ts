import { v2 as cloudinary } from 'cloudinary';

async function manageCloudinary() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dsq9xjw3d', 
        api_key: '411199111462972', 
        api_secret: '6D_-vbgCL4AhsYUY0hzz8bRPPug' // Replace with your actual API secret
    });

    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            { public_id: 'shoes' }
        );
        console.log('Upload Result:', uploadResult);

        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('shoes', {
            fetch_format: 'auto',
            quality: 'auto'
        });
        console.log('Optimized URL:', optimizeUrl);

        // Transform the image: auto-crop to square aspect ratio
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500
        });
        console.log('Auto-Cropped URL:', autoCropUrl);

    } catch (error) {
        console.error('Error:', error);
    }
}

manageCloudinary();

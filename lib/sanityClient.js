    // client.js
    import { createClient } from '@sanity/client';
    
    const client = createClient({
        projectId:'8pz7ls2k', // Replace with your Sanity project ID
        dataset: 'production', // Replace with your Sanity dataset name (e.g., 'production')
        apiVersion: '2025-02-06', // Use the current date (YYYY-MM-DD) for the latest API version
        useCdn: false, // Set to `false` to bypass the edge cache for fresh content
    });

    export default client;
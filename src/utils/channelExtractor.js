// YouTube Data API integration for channel video extraction

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch channel ID from various channel identifier types
 * @param {Object} channelIdentifier - { type: 'handle'|'id'|'custom'|'user', value: string }
 * @param {string} apiKey - YouTube Data API key
 * @returns {Promise<string>} - Channel ID
 */
async function getChannelId(channelIdentifier, apiKey) {
    if (channelIdentifier.type === 'id') {
        return channelIdentifier.value;
    }

    // For @handle format
    if (channelIdentifier.type === 'handle') {
        const handle = channelIdentifier.value.replace('@', '');

        try {
            // Method 1: Try forUsername parameter (works for some handles)
            const usernameResponse = await fetch(
                `${API_BASE_URL}/channels?part=id&forUsername=${handle}&key=${apiKey}`
            );
            const usernameData = await usernameResponse.json();

            if (usernameData.items && usernameData.items.length > 0) {
                return usernameData.items[0].id;
            }

            // Method 2: Use search API with exact match verification
            const searchResponse = await fetch(
                `${API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${apiKey}&maxResults=10`
            );

            if (!searchResponse.ok) {
                const errorData = await searchResponse.json();
                throw new Error(errorData.error?.message || 'Search failed');
            }

            const searchData = await searchResponse.json();

            if (searchData.items && searchData.items.length > 0) {
                // Try to find exact match by custom URL
                for (const item of searchData.items) {
                    const channelId = item.id.channelId;

                    // Fetch full channel details to verify custom URL
                    const verifyResponse = await fetch(
                        `${API_BASE_URL}/channels?part=snippet,contentDetails&id=${channelId}&key=${apiKey}`
                    );
                    const verifyData = await verifyResponse.json();

                    if (verifyData.items && verifyData.items.length > 0) {
                        const channel = verifyData.items[0];
                        const customUrl = channel.snippet.customUrl;

                        // Check if custom URL matches (with or without @)
                        if (customUrl && (
                            customUrl === `@${handle}` ||
                            customUrl === handle ||
                            customUrl.toLowerCase() === `@${handle.toLowerCase()}` ||
                            customUrl.toLowerCase() === handle.toLowerCase()
                        )) {
                            return channelId;
                        }
                    }
                }

                // If no exact match found, return the first result as fallback
                // (but this might be wrong - user should verify)
                return searchData.items[0].id.channelId;
            }

            throw new Error(`Could not find channel for handle: @${handle}`);
        } catch (error) {
            throw new Error(`Failed to find channel ID for handle @${handle}: ${error.message}`);
        }
    }

    // For /user/USERNAME format
    if (channelIdentifier.type === 'user') {
        const username = channelIdentifier.value;
        try {
            const response = await fetch(
                `${API_BASE_URL}/channels?part=id&forUsername=${username}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                return data.items[0].id;
            }

            throw new Error(`Could not find channel for username: ${username}`);
        } catch (error) {
            throw new Error(`Failed to find channel ID for username ${username}: ${error.message}`);
        }
    }

    // For /c/CUSTOM or other formats, use search
    const searchQuery = channelIdentifier.value;
    try {
        const response = await fetch(
            `${API_BASE_URL}/search?part=id&type=channel&q=${encodeURIComponent(searchQuery)}&key=${apiKey}&maxResults=1`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].id.channelId;
        }

        throw new Error(`Could not find channel for: ${searchQuery}`);
    } catch (error) {
        throw new Error(`Failed to find channel ID for ${searchQuery}: ${error.message}`);
    }
}

/**
 * Fetch all videos from a channel
 * @param {string} channelId - YouTube channel ID  
 * @param {string} apiKey - YouTube Data API key
 * @param {number} maxResults - Maximum number of videos to fetch (default: 50)
 * @returns {Promise<Object>} - Object with videos array and metadata
 */
async function fetchChannelVideos(channelId, apiKey, maxResults = 50) {
    try {
        // First, get the uploads playlist ID
        const channelResponse = await fetch(
            `${API_BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
        );

        if (!channelResponse.ok) {
            const errorData = await channelResponse.json();
            throw new Error(errorData.error?.message || 'Failed to fetch channel details');
        }

        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            throw new Error('Channel not found');
        }

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Fetch videos from the uploads playlist
        const playlistResponse = await fetch(
            `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
        );

        if (!playlistResponse.ok) {
            const errorData = await playlistResponse.json();
            throw new Error(errorData.error?.message || 'Failed to fetch videos');
        }

        const playlistData = await playlistResponse.json();

        // Transform the response into a simpler format
        const videos = playlistData.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt
        }));

        return {
            videos,
            totalResults: playlistData.pageInfo.totalResults,
            hasMore: !!playlistData.nextPageToken,
            nextPageToken: playlistData.nextPageToken
        };
    } catch (error) {
        throw new Error(`Failed to fetch channel videos: ${error.message}`);
    }
}

/**
 * Main function to extract videos from a channel URL
 * @param {Object} channelIdentifier - Channel identifier object from getChannelIdentifier
 * @param {string} apiKey - YouTube Data API key
 * @param {number} maxResults - Maximum number of videos to fetch
 * @returns {Promise<Object>} - Object containing videos array and metadata
 */
export async function extractChannelVideos(channelIdentifier, apiKey, maxResults = 50) {
    if (!apiKey) {
        throw new Error('API key is required');
    }

    if (!channelIdentifier) {
        throw new Error('Channel identifier is required');
    }

    try {
        // Get the channel ID
        const channelId = await getChannelId(channelIdentifier, apiKey);

        console.log('Found channel ID:', channelId); // Debug logging

        // Fetch videos from the channel
        const result = await fetchChannelVideos(channelId, apiKey, maxResults);

        return result;
    } catch (error) {
        throw new Error(`Failed to extract channel videos: ${error.message}`);
    }
}

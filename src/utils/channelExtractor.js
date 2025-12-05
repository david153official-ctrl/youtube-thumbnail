// YouTube Data API integration for channel video extraction

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch channel ID from various channel identifier types
 * @param {Object} channelIdentifier - { type: 'handle'|'id'|'custom'|'user', value: string }
 * @param {string} apiKey - YouTube Data API key
 * @returns {Promise<string>} - Channel ID
 */
async function getChannelId(channelIdentifier, apiKey) {
    console.log('🔍 Getting channel ID for:', channelIdentifier);

    if (channelIdentifier.type === 'id') {
        return channelIdentifier.value;
    }

    // For @handle format
    if (channelIdentifier.type === 'handle') {
        const handle = channelIdentifier.value.replace('@', '');
        console.log('🔍 Searching for handle:', handle);

        try {
            // Method 1: Try forUsername parameter (works for some handles)
            console.log('📡 Trying forUsername API...');
            const usernameResponse = await fetch(
                `${API_BASE_URL}/channels?part=snippet&forUsername=${handle}&key=${apiKey}`
            );
            const usernameData = await usernameResponse.json();
            console.log('📡 forUsername response:', usernameData);

            if (usernameData.items && usernameData.items.length > 0) {
                const channelId = usernameData.items[0].id;
                console.log('✅ Found via forUsername:', channelId);
                return channelId;
            }

            // Method 2: Use search API and verify each result
            console.log('📡 Trying search API...');
            const searchResponse = await fetch(
                `${API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent('@' + handle)}&key=${apiKey}&maxResults=10`
            );

            if (!searchResponse.ok) {
                const errorData = await searchResponse.json();
                console.error('❌ Search failed:', errorData);
                throw new Error(errorData.error?.message || 'Search failed');
            }

            const searchData = await searchResponse.json();
            console.log('📡 Search results:', searchData);

            if (searchData.items && searchData.items.length > 0) {
                // Check each search result
                for (let i = 0; i < searchData.items.length; i++) {
                    const item = searchData.items[i];
                    const channelId = item.id.channelId;
                    console.log(`🔍 Checking search result ${i + 1}:`, item.snippet.title, channelId);

                    // Fetch full channel details
                    const verifyResponse = await fetch(
                        `${API_BASE_URL}/channels?part=snippet&id=${channelId}&key=${apiKey}`
                    );
                    const verifyData = await verifyResponse.json();
                    console.log(`📡 Channel details for ${channelId}:`, verifyData);

                    if (verifyData.items && verifyData.items.length > 0) {
                        const channel = verifyData.items[0].snippet;
                        console.log(`📋 Channel info:`, {
                            title: channel.title,
                            customUrl: channel.customUrl,
                            description: channel.description?.substring(0, 100)
                        });

                        // Check multiple fields for matching
                        const customUrl = channel.customUrl?.toLowerCase();
                        const handleLower = handle.toLowerCase();

                        // Match against customUrl
                        if (customUrl && (
                            customUrl === `@${handleLower}` ||
                            customUrl === handleLower
                        )) {
                            console.log('✅ Found exact match via customUrl:', channelId);
                            return channelId;
                        }
                    }
                }

                // If no exact match, ask user or return error
                console.warn('⚠️ No exact match found. Search results:');
                searchData.items.forEach((item, i) => {
                    console.log(`  ${i + 1}. ${item.snippet.title} (${item.id.channelId})`);
                });

                // For now, let's NOT return the first result automatically
                throw new Error(
                    `정확히 일치하는 채널을 찾을 수 없습니다. 검색 결과: ${searchData.items.map(i => i.snippet.title).join(', ')}`
                );
            }

            throw new Error(`채널을 찾을 수 없습니다: @${handle}`);
        } catch (error) {
            console.error('❌ Error in getChannelId:', error);
            throw new Error(`채널 ID를 찾는데 실패했습니다 (@${handle}): ${error.message}`);
        }
    }

    // For /user/USERNAME format
    if (channelIdentifier.type === 'user') {
        const username = channelIdentifier.value;
        console.log('🔍 Searching for user:', username);

        try {
            const response = await fetch(
                `${API_BASE_URL}/channels?part=id&forUsername=${username}&key=${apiKey}`
            );
            const data = await response.json();
            console.log('📡 User response:', data);

            if (data.items && data.items.length > 0) {
                const channelId = data.items[0].id;
                console.log('✅ Found channel via username:', channelId);
                return channelId;
            }

            throw new Error(`채널을 찾을 수 없습니다: ${username}`);
        } catch (error) {
            console.error('❌ Error getting user channel:', error);
            throw new Error(`채널 ID를 찾는데 실패했습니다 (${username}): ${error.message}`);
        }
    }

    // For /c/CUSTOM or other formats
    const searchQuery = channelIdentifier.value;
    console.log('🔍 Searching for:', searchQuery);

    try {
        const response = await fetch(
            `${API_BASE_URL}/search?part=id&type=channel&q=${encodeURIComponent(searchQuery)}&key=${apiKey}&maxResults=1`
        );
        const data = await response.json();
        console.log('📡 Search response:', data);

        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].id.channelId;
            console.log('✅ Found channel:', channelId);
            return channelId;
        }

        throw new Error(`채널을 찾을 수 없습니다: ${searchQuery}`);
    } catch (error) {
        console.error('❌ Error searching channel:', error);
        throw new Error(`채널 ID를 찾는데 실패했습니다 (${searchQuery}): ${error.message}`);
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
    console.log('📹 Fetching videos for channel:', channelId);

    try {
        // First, get the uploads playlist ID
        const channelResponse = await fetch(
            `${API_BASE_URL}/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`
        );

        if (!channelResponse.ok) {
            const errorData = await channelResponse.json();
            console.error('❌ Failed to fetch channel:', errorData);
            throw new Error(errorData.error?.message || 'Failed to fetch channel details');
        }

        const channelData = await channelResponse.json();
        console.log('📡 Channel data:', channelData);

        if (!channelData.items || channelData.items.length === 0) {
            throw new Error('Channel not found');
        }

        const channel = channelData.items[0];
        console.log('📋 Channel:', channel.snippet.title, '(@' + (channel.snippet.customUrl || 'N/A') + ')');

        const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
        console.log('📋 Uploads playlist ID:', uploadsPlaylistId);

        // Fetch videos from the uploads playlist
        const playlistResponse = await fetch(
            `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
        );

        if (!playlistResponse.ok) {
            const errorData = await playlistResponse.json();
            console.error('❌ Failed to fetch playlist:', errorData);
            throw new Error(errorData.error?.message || 'Failed to fetch videos');
        }

        const playlistData = await playlistResponse.json();
        console.log('📹 Found', playlistData.items?.length || 0, 'videos');

        // Transform the response into a simpler format
        const videos = playlistData.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt
        }));

        console.log('✅ Successfully fetched videos from:', channel.snippet.title);

        return {
            videos,
            channelTitle: channel.snippet.title,
            channelCustomUrl: channel.snippet.customUrl,
            totalResults: playlistData.pageInfo.totalResults,
            hasMore: !!playlistData.nextPageToken,
            nextPageToken: playlistData.nextPageToken
        };
    } catch (error) {
        console.error('❌ Error in fetchChannelVideos:', error);
        throw new Error(`채널 영상을 가져오는데 실패했습니다: ${error.message}`);
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
        console.log('🚀 Starting channel extraction...');

        // Get the channel ID
        const channelId = await getChannelId(channelIdentifier, apiKey);
        console.log('✅ Channel ID found:', channelId);

        // Fetch videos from the channel
        const result = await fetchChannelVideos(channelId, apiKey, maxResults);

        console.log('🎉 Extraction complete!');
        return result;
    } catch (error) {
        console.error('❌ Extraction failed:', error);
        throw new Error(`채널 영상 추출 실패: ${error.message}`);
    }
}

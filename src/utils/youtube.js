// Extract video ID from YouTube URL
export function getYouTubeVideoId(url) {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

// Detect if URL is a channel URL
export function isChannelUrl(url) {
  if (!url) return false;

  const channelPatterns = [
    /youtube\.com\/@/,                  // @username format (any characters after @)
    /youtube\.com\/channel\//,          // /channel/ID format
    /youtube\.com\/c\//,                // /c/customname format
    /youtube\.com\/user\//              // /user/username format
  ];

  return channelPatterns.some(pattern => pattern.test(url));
}

// Extract channel identifier from URL
export function getChannelIdentifier(url) {
  if (!url) return null;

  // Decode URL to handle Korean and other non-ASCII characters
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    // If decoding fails, use original URL
    console.warn('Failed to decode URL:', e);
  }

  console.log('Parsing channel URL:', url);

  // @username format - match everything after @ until next slash or end
  const handleMatch = url.match(/youtube\.com\/@([^\/\?#]+)/);
  if (handleMatch) {
    const handle = handleMatch[1];
    console.log('Extracted handle:', handle);
    return { type: 'handle', value: '@' + handle };
  }

  // /channel/ID format
  const channelMatch = url.match(/youtube\.com\/channel\/([^\/\?#]+)/);
  if (channelMatch) {
    const channelId = channelMatch[1];
    console.log('Extracted channel ID:', channelId);
    return { type: 'id', value: channelId };
  }

  // /c/customname format
  const customMatch = url.match(/youtube\.com\/c\/([^\/\?#]+)/);
  if (customMatch) {
    const customName = customMatch[1];
    console.log('Extracted custom name:', customName);
    return { type: 'custom', value: customName };
  }

  // /user/username format
  const userMatch = url.match(/youtube\.com\/user\/([^\/\?#]+)/);
  if (userMatch) {
    const username = userMatch[1];
    console.log('Extracted username:', username);
    return { type: 'user', value: username };
  }

  console.warn('Could not extract channel identifier from URL:', url);
  return null;
}

// Determine URL type
export function getUrlType(url) {
  if (!url) return null;

  if (getYouTubeVideoId(url)) return 'video';
  if (isChannelUrl(url)) return 'channel';

  return null;
}

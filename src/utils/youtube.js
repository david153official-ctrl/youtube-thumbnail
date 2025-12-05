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
    /youtube\.com\/@[\w-]+/,           // @username format
    /youtube\.com\/channel\/[\w-]+/,   // /channel/ID format
    /youtube\.com\/c\/[\w-]+/,         // /c/customname format
    /youtube\.com\/user\/[\w-]+/       // /user/username format
  ];
  
  return channelPatterns.some(pattern => pattern.test(url));
}

// Extract channel identifier from URL
export function getChannelIdentifier(url) {
  if (!url) return null;
  
  // @username format
  const handleMatch = url.match(/youtube\.com\/@([\w-]+)/);
  if (handleMatch) {
    return { type: 'handle', value: '@' + handleMatch[1] };
  }
  
  // /channel/ID format
  const channelMatch = url.match(/youtube\.com\/channel\/([\w-]+)/);
  if (channelMatch) {
    return { type: 'id', value: channelMatch[1] };
  }
  
  // /c/customname format
  const customMatch = url.match(/youtube\.com\/c\/([\w-]+)/);
  if (customMatch) {
    return { type: 'custom', value: customMatch[1] };
  }
  
  // /user/username format
  const userMatch = url.match(/youtube\.com\/user\/([\w-]+)/);
  if (userMatch) {
    return { type: 'user', value: userMatch[1] };
  }
  
  return null;
}

// Determine URL type
export function getUrlType(url) {
  if (!url) return null;
  
  if (getYouTubeVideoId(url)) return 'video';
  if (isChannelUrl(url)) return 'channel';
  
  return null;
}

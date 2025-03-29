'use client';

/**
 * Safely get the window location origin, returns a default value during SSR
 */
export const getOrigin = (): string => {
  if (typeof window === 'undefined') {
    return process.env.APP_URL || 'http://localhost:3000';
  }
  return window.location.origin;
};

/**
 * Safely handle clipboard operations
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Safely handle social sharing
 */
export const shareToSocial = (platform: 'twitter' | 'telegram' | 'whatsapp' | 'facebook', text: string, url: string): void => {
  if (typeof window === 'undefined') return;

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}\n${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  };

  window.open(urls[platform], '_blank');
};
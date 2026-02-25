
export const formatImageUrl = (url: string) => {
  if (!url) return '';
  
  // Handle Google Drive links
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/(.+?)(\/|$|#|\?)/) || url.match(/id=(.+?)(&|$|#)/);
    if (idMatch && idMatch[1]) {
      // Use the direct link for Google Drive images
      return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}=w1000`;
    }
  }
  
  return url;
};

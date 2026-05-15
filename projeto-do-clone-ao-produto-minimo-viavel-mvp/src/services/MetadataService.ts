import ExifReader from 'exifreader';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';

// Fix for music-metadata-browser in some environments
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export interface MetadataResult {
  source: string;
  format: string;
  groups: Record<string, Record<string, any>>;
  thumbnail?: string;
  isImage?: boolean;
  originalUrl?: string;
}

export class MetadataService {
  static async extractFromFile(file: File): Promise<MetadataResult> {
    const originalUrl = URL.createObjectURL(file);
    const result: MetadataResult = {
      source: file.name,
      format: file.type || 'unknown',
      groups: {
        'File Info': {
          'File Name': file.name,
          'File Size': `${(file.size / 1024).toFixed(2)} KB`,
          'MIME Type': file.type || 'unknown',
          'Last Modified': new Date(file.lastModified).toLocaleString(),
        }
      },
      isImage: file.type.startsWith('image/'),
      originalUrl,
    };

    try {
      const arrayBuffer = await file.arrayBuffer();

      // 1. Try Image Metadata (ExifReader)
      let rawTags: any = {};
      try {
        // Use expanded: true to get all metadata groups (File, JFIF, EXIF, etc.)
        rawTags = await ExifReader.load(arrayBuffer, { expanded: true });
      } catch (e) {
        console.warn('ExifReader failed to load metadata:', e);
      }
      
      // Process expanded tags into groups
      for (const [groupName, groupTags] of Object.entries(rawTags)) {
        if (groupName === 'thumbnail' || !groupTags || typeof groupTags !== 'object') continue;

        // Normalize group name (e.g., 'exif' -> 'EXIF')
        const normalizedGroupName = groupName.toUpperCase();
        if (!result.groups[normalizedGroupName]) result.groups[normalizedGroupName] = {};

        for (const [tagName, tag] of Object.entries(groupTags)) {
          if (tagName === 'Thumbnail' || tagName === 'image') continue;
          
          const t = tag as any;
          let value = t.description || t.value;
          if (Array.isArray(value) && value.length === 1) value = value[0];
          
          // Format complex values
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            value = t.description || JSON.stringify(value);
          }

          if (value !== undefined && value !== null) {
            result.groups[normalizedGroupName][tagName] = value;
          }
        }
      }

      // Extract embedded thumbnail
      const thumb = rawTags.thumbnail || rawTags.Thumbnail;
      if (thumb && thumb.image) {
        const base64 = btoa(String.fromCharCode.apply(null, Array.from(thumb.image as any)));
        result.thumbnail = `data:image/jpeg;base64,${base64}`;
      } else if (result.isImage) {
        result.thumbnail = URL.createObjectURL(file);
      }

      // Extract Image Dimensions and Megapixels safely
      if (result.isImage) {
        let width, height;
        
        // Helper to extract numeric value from strings like "1024px"
        const parseDim = (val: any) => {
          if (typeof val === 'number') return val;
          const match = String(val).match(/\d+/);
          return match ? Number(match[0]) : NaN;
        };

        // Search for dimensions in normalized groups
        const findDim = (names: string[]) => {
          for (const group of Object.values(result.groups)) {
            for (const name of names) {
              if (group[name]) return group[name];
            }
          }
          return null;
        };

        width = findDim(['Image Width', 'PixelXDimension', 'width']);
        height = findDim(['Image Height', 'PixelYDimension', 'height']);

        // Fallback: Load image if dimensions missing from metadata
        if (!width || !height) {
          try {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = objectUrl;
            });
            width = img.width;
            height = img.height;
            URL.revokeObjectURL(objectUrl);
          } catch (e) {
            console.warn('Fallback dimension check failed:', e);
          }
        }

        if (width && height) {
          const wNum = parseDim(width);
          const hNum = parseDim(height);
          
          if (!isNaN(wNum) && !isNaN(hNum)) {
            if (!result.groups['IMAGE INFO']) result.groups['IMAGE INFO'] = {};
            result.groups['IMAGE INFO']['Dimensions'] = `${wNum} x ${hNum}`;
            const mp = (wNum * hNum) / 1000000;
            result.groups['IMAGE INFO']['Megapixels'] = `${mp.toFixed(2)} MP`;
          }
        }
      }

      // 2. Try Audio/Video Metadata (music-metadata)
      const isVideo = file.type.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov'].some(ext => file.name.toLowerCase().endsWith(ext));
      const isAudio = file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac'].some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isVideo || isAudio) {
        try {
          const audioMetadata = await mm.parseBuffer(Buffer.from(arrayBuffer), file.type);
          if (audioMetadata) {
            if (!result.groups['MediaInfo']) result.groups['MediaInfo'] = {};
            
            const info = result.groups['MediaInfo'];
            if (audioMetadata.common.title) info['Title'] = audioMetadata.common.title;
            if (audioMetadata.common.artist) info['Artist'] = audioMetadata.common.artist;
            if (audioMetadata.common.album) info['Album'] = audioMetadata.common.album;
            if (audioMetadata.format.duration) info['Duration'] = `${audioMetadata.format.duration.toFixed(2)}s`;
            if (audioMetadata.format.bitrate) info['Bitrate'] = `${(audioMetadata.format.bitrate / 1000).toFixed(0)} kbps`;
            if (audioMetadata.format.container) info['Container'] = audioMetadata.format.container;
            
            // If music-metadata found a picture and we don't have a thumbnail yet
            if (!result.thumbnail && audioMetadata.common.picture && audioMetadata.common.picture.length > 0) {
              const pic = audioMetadata.common.picture[0];
              const base64 = btoa(
                String.fromCharCode.apply(null, Array.from(pic.data as any))
              );
              result.thumbnail = `data:${pic.format};base64,${base64}`;
            }
          }
        } catch (e) {
          console.warn('Music-metadata analysis skipped:', e);
        }

        // Fallback for Video Thumbnails: Generate from frame if still missing
        if (!result.thumbnail && isVideo) {
          try {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.src = result.originalUrl || URL.createObjectURL(file);
            
            await new Promise((resolve, reject) => {
              video.onloadedmetadata = () => {
                video.currentTime = 1; // Seek to 1 second
              };
              video.onseeked = resolve;
              video.onerror = reject;
              // Timeout after 3 seconds
              setTimeout(resolve, 3000);
            });

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              result.thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            }
          } catch (e) {
            console.warn('Failed to generate video thumbnail:', e);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      throw new Error('Failed to analyze file. Format might not be supported or file is corrupted.');
    }
  }

  static async extractFromUrl(url: string): Promise<MetadataResult> {
    try {
      // Use our backend proxy to bypass CORS via POST to avoid 414 URI Too Long errors
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || blob.type;
      const fileName = url.split('/').pop()?.split('?')[0] || 'remote-file';
      
      const file = new File([blob], fileName, { type: contentType });
      const result = await this.extractFromFile(file);
      // If it's a remote URL, we can use the original URL directly for analysis
      // but the Blob URL created in extractFromFile is safer for consistent handling
      return result;
    } catch (error: any) {
      console.error('Error fetching from URL:', error);
      throw new Error(`Failed to fetch or analyze the URL: ${error.message}`);
    }
  }
}

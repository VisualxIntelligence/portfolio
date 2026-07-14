/** Parse YouTube/Vimeo URLs into privacy-friendly embed sources + poster images.
 *  Embeds are click-to-load (poster first) per spec §1.4 — no self-hosted video. */

export interface VideoEmbedInfo {
  provider: 'youtube' | 'vimeo';
  id: string;
  embedSrc: string;
  posterSrc?: string;
}

export function parseVideoUrl(url: string): VideoEmbedInfo | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) {
    const id = yt[1];
    return {
      provider: 'youtube',
      id,
      embedSrc: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      posterSrc: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    return {
      provider: 'vimeo',
      id,
      embedSrc: `https://player.vimeo.com/video/${id}?autoplay=1`,
      // Vimeo posters need an API call; the component falls back to a styled cover.
    };
  }
  return null;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Frame styles available in the editor (shared desktop panel + mobile dock). */
export const EDITOR_FRAME_CHOICES = [
  { id: 'none', label: 'None', src: null as string | null },
  { id: 'standard', label: '01', src: `${BASE}/frames/01.svg?v=8` },
  { id: 'fade', label: '02', src: `${BASE}/frames/02.svg?v=8` },
  { id: 'torn1', label: '03', src: `${BASE}/frames/03.svg?v=8` },
  { id: 'torn2', label: '04', src: `${BASE}/frames/04.svg?v=8` },
  { id: 'wobble', label: '05', src: `${BASE}/frames/05.svg?v=8` },
  { id: 'floral', label: '06', src: `${BASE}/frames/06.svg?v=8` },
  { id: 'scallop', label: '07', src: `${BASE}/frames/07.svg?v=8` },
  { id: 'stamp', label: '08', src: `${BASE}/frames/08.svg?v=8` },
  { id: 'wavy', label: '09', src: `${BASE}/frames/09.svg?v=8` },
  { id: 'zigzag', label: '10', src: `${BASE}/frames/10.svg?v=8` },
] as const;

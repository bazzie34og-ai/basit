const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** "*word*" → <em>word</em>. Used for the one italic phrase per headline. */
export const emph = (s: string) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
export const plain = (s: string) => s.replace(/\*/g, '');
export const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

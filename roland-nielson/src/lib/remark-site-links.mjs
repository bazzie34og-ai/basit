// Lets Markdown posts link to NAP-driven URLs without hard-coding them:
// [text](#book) → booking link, [text](#call) → tel:, [text](#text) → sms:
import { visit } from 'unist-util-visit';

export default function remarkSiteLinks({ booking, phoneE164 }) {
  const map = { '#book': booking, '#call': `tel:${phoneE164}`, '#text': `sms:${phoneE164}` };
  return () => (tree) => {
    visit(tree, 'link', (node) => {
      if (map[node.url]) node.url = map[node.url];
    });
  };
}

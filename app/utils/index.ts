import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function getFaviconByUrl(
  url: string
): Promise<string | undefined> {
  if (!url.length) return undefined;

  const linkRes = await fetch(url);
  const html = await linkRes.text();
  const root = parse(html);

  const links = root.querySelectorAll('link');
  const findByContent = (content: string): undefined | string => {
    const target = links.find((x) => x.getAttribute('rel') === content);
    if (!target) return undefined;
    const href = target.getAttribute('href');
    if (!href) return undefined;
    return href.startsWith('/') ? url + href : href;
  };
  const shortCut = findByContent('shortcut icon');
  if (shortCut) return shortCut;

  const icon = findByContent('icon');
  if (icon) return icon;

  const appleIcon = findByContent('apple-touch-icon');
  if (appleIcon) return appleIcon;

  return undefined;
}

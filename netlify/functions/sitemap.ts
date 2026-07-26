import { generateSitemapXml } from '../../src/lib/sitemapGenerator';

export async function handler(event: any, context: any) {
  try {
    const host = event.headers.host || 'srivelan.co';
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    const xml = generateSitemapXml(baseUrl);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400'
      },
      body: xml
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate sitemap', message: err.message })
    };
  }
}

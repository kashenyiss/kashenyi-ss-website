# Kashenyi Secondary School — Deployment Notes

Static website built with HTML, CSS and vanilla JavaScript. The canonical site domain is **https://www.kashenyisecondaryschool.com/**.

## Upload

Upload the root HTML pages, `llms.txt`, `robots.txt`, `sitemap.xml` and the `assets/` directory. Keep `.htaccess` on Apache/cPanel; configure equivalent 404, compression, caching and CORS rules on other hosts. Serve over HTTPS.

- AOS and Font Awesome are loaded from cdnjs; Inter and Playfair Display are loaded from Google Fonts.
- EmailJS Browser SDK v4 is loaded from jsDelivr on Contact and Apply pages; its separate integration and configuration are in `assets/js/email-service.js`.
- `assets/css/site.min.css` and `assets/js/site.min.js` are production bundles. Hero images use responsive WebP variants; lower-page images are lazy-loaded.
- `llms.txt` summarizes official school information for AI/search agents; `robots.txt` allows public pages, documents and common browsing agents.

The admission form, school calendar and school rules PDFs remain in `assets/documents/`.

## Before launch

- Point `www.kashenyisecondaryschool.com` to the production host and verify its HTTPS certificate. The canonical URLs, Open Graph metadata, sitemap and `llms.txt` now use this domain.
- Contact and Apply are configured for EmailJS. Add `www.kashenyisecondaryschool.com` to EmailJS's allowed domains and test both forms on the live site; do not add a private key to the client bundle.
- Test the map, navigation, gallery, keyboard access and forms on the live host. CORS headers in `.htaccess` cover public files; third-party APIs must allow the production origin themselves.

Actual Lighthouse results depend on the deployed host, CDN latency, device and network. Measure on production before claiming a sub-one-second Speed Index.

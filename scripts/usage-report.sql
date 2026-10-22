-- The anonymous usage counts (issue #85) for the last 30 days, from the
-- usage_events dataset in Workers Analytics Engine. Run one statement at a
-- time against the SQL API, with a token that has Account Analytics Read:
--
--   curl "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/analytics_engine/sql" \
--     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
--     --data "SELECT blob1 AS event, SUM(_sample_interval) AS events FROM usage_events GROUP BY event"
--
-- Analytics Engine samples rows, so count with SUM(_sample_interval), never
-- count(). The columns are positional (app/analytics-event.ts): blob1 event,
-- blob2 country, blob3 browser, blob4 OS, blob5 device, blob6 page path.
-- page_view is the closest thing to visits, pdf_opened to invoices made and
-- invoice_saved to invoices kept.

-- How often each event happened: page views, editor opens, PDFs, saves,
-- templates, exports and imports.
SELECT blob1 AS event, SUM(_sample_interval) AS events
FROM usage_events
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY event
ORDER BY events DESC;

-- Each event by country (ISO code; XX when unknown).
SELECT blob1 AS event, blob2 AS country, SUM(_sample_interval) AS events
FROM usage_events
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY event, country
ORDER BY event, events DESC;

-- Each event by browser family.
SELECT blob1 AS event, blob3 AS browser, SUM(_sample_interval) AS events
FROM usage_events
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY event, browser
ORDER BY event, events DESC;

-- Each event by operating system.
SELECT blob1 AS event, blob4 AS os, SUM(_sample_interval) AS events
FROM usage_events
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY event, os
ORDER BY event, events DESC;

-- Each event by device type.
SELECT blob1 AS event, blob5 AS device, SUM(_sample_interval) AS events
FROM usage_events
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY event, device
ORDER BY event, events DESC;

-- Page views by page.
SELECT blob6 AS page, SUM(_sample_interval) AS page_views
FROM usage_events
WHERE blob1 = 'page_view' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY page
ORDER BY page_views DESC;

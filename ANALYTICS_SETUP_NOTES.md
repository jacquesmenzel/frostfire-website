# Frost Fire Analytics + SEO Setup Notes

This file documents the account-side setup still needed after the code changes in the Frost Fire website and Forge Flow CRM.

## What the code now supports

- First-touch attribution persistence in `localStorage` / `sessionStorage`
- Website session + event + lead ingestion into Forge Flow CRM
- Tracking for:
  - page views
  - scroll depth
  - `tel:` clicks
  - CTA clicks
  - contact form submissions
  - chat opens / messages / chat-qualified leads
  - calculator views / completions
- Optional vendor-side analytics bootstrap from `js/analytics-config.js`

## Files to update later

- `js/analytics-config.js`
- Cloudflare Pages / Worker settings for the Frost Fire website project
- Google Tag Manager
- Google Analytics 4
- Microsoft Clarity
- Google Search Console
- Optional Cloudflare Web Analytics

## 1. Google Tag Manager

Create a GTM container for `frostfirehvacr.com`.

When ready, set:

```js
window.FrostFireAnalyticsConfig = {
  gtmId: 'GTM-XXXXXXX',
  ga4MeasurementId: '',
  clarityProjectId: '',
  enableCloudflareWebAnalytics: false,
  cloudflareBeaconToken: ''
};
```

Recommended GTM events to map:

- `page_view`
- `scroll_depth`
- `click_to_call`
- `cta_click`
- `form_submit`
- `chat_open`
- `chat_message_sent`
- `chat_lead`
- `calculator_view`
- `calculator_complete`

Suggested GTM variables:

- `page_path`
- `page_type`
- `lead_channel`
- `cta_type`
- `utm_source`
- `utm_medium`
- `utm_campaign`

## 2. Google Analytics 4

Create a GA4 property for Frost Fire.

When ready, either:

1. Put GA4 behind GTM only, or
2. Also set the direct measurement ID:

```js
ga4MeasurementId: 'G-XXXXXXXXXX'
```

Recommended GA4 custom dimensions:

- `page_type`
- `lead_channel`
- `cta_type`
- `utm_source`
- `utm_medium`
- `utm_campaign`

Recommended GA4 conversions:

- `form_submit`
- `chat_lead`
- `calculator_complete`
- `click_to_call` (optional; useful as a micro-conversion)

## 3. Microsoft Clarity

Create a Clarity project for `frostfirehvacr.com`.

When ready, set:

```js
clarityProjectId: 'YOUR_CLARITY_PROJECT_ID'
```

Use Clarity primarily for:

- service page friction
- location page behavior
- calculator abandonment
- contact form abandonment

## 4. Google Search Console

Verify the domain property for `frostfirehvacr.com`.

Recommended:

- domain property verification in Google Search Console
- submit the existing `https://frostfirehvacr.com/sitemap.xml`
- later connect GSC exports/imports into Forge Flow `landing_page_performance_snapshots`

## 5. Optional Cloudflare Web Analytics

If you want a lightweight second signal, enable Cloudflare Web Analytics in the Cloudflare dashboard and then set:

```js
enableCloudflareWebAnalytics: true,
cloudflareBeaconToken: 'YOUR_TOKEN'
```

Note: this is optional and should not replace GA4.

## 6. Forge Flow CRM setup / checks

The CRM now expects the new website growth tables to exist:

- `website_sessions`
- `website_events`
- `website_leads`
- `seo_content_targets`
- `seo_coverage_targets`
- `search_reporting_sources`
- `landing_page_performance_snapshots`

Backend file:

- `backend/migrations/20260523_seo_growth_foundation.sql`

Backend API:

- `backend/app/api/website_growth.py`

Make sure the migration is applied in production before relying on the website tracking endpoints.

## 7. Website deployment checks

After deploy, verify:

1. Open the site and submit the contact form.
2. Open chat and send a test message.
3. Click a phone link.
4. Complete the calculator.
5. Confirm records appear in Forge Flow:
   - `SEO & Growth`
   - `Website Chat`
   - website lead/session/event tables

## 8. Suggested later improvements

- Add real GTM snippets to page templates once container details are final
- Add a `noscript` GTM iframe if desired
- Add Search Console import jobs into the CRM
- Add Clarity session deep links into `SEO & Growth`
- Add optional CallRail if phone attribution remains the bottleneck
- Add a production blog publish checklist tied to:
  - schema
  - canonical
  - sitemap update
  - CTA placement
  - attribution-ready internal links

## Microsoft Advertising UET + call-tracking numbers (2026-10-18)

- `js/microsoft-uet.js` loads the Bing UET tag on every page (main.js and attribution.js inject it).
  It does nothing until `UET_TAG_ID` is filled in (Microsoft Advertising → Tools → UET tag).
  Events: `submit_lead_form` (any CRM lead form succeeds) and `phone_call_click` (any tel: tap).
  Create matching "Event" conversion goals with those Action values.
- `js/phone-numbers.js` swaps in the channel's Twilio tracking number on ad-click visits
  (`msclkid`/`utm_source=bing` → Bing, `gclid`/google+cpc → Google Ads, `fbclid`/facebook → Meta,
  `oppref`/chatgpt+cpc → ChatGPT) for the whole session, site-wide. Organic/direct visits keep
  (919) 230-4439. Add `data-ff-phone-keep` around anything that must keep the main number.
- The `/lp/{bing,google,meta,chatgpt}/` pages ship with their tracking number in the static HTML.

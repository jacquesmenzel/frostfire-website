/* Frost Fire analytics vendor bootstrap config.
 * GTM is the primary container. We still keep the GA4 measurement ID here
 * so first-party website events can be forwarded cleanly while the container
 * handles standard pageview collection.
 */
(function () {
  window.FrostFireAnalyticsConfig = {
    gtmId: 'GTM-5MTHDJX9',
    ga4MeasurementId: 'G-EE4GQB1MS5',
    // Google Ads account 251-537-1378 tag: sets the gclid cookie (conversion linker).
    // Conversions themselves are uploaded server-side (Booked job, Qualified lead).
    googleAdsId: 'AW-11546306477',
    clarityProjectId: 'wvxk34tp2b',
    enableCloudflareWebAnalytics: false,
    cloudflareBeaconToken: ''
  };
})();

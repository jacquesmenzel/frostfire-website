/* Frost Fire analytics vendor bootstrap config.
 * GTM is the primary container. We still keep the GA4 measurement ID here
 * so first-party website events can be forwarded cleanly while the container
 * handles standard pageview collection.
 */
(function () {
  window.FrostFireAnalyticsConfig = {
    gtmId: 'GTM-5MTHDJX9',
    ga4MeasurementId: 'G-EE4GQB1MS5',
    clarityProjectId: 'wvxk34tp2b',
    enableCloudflareWebAnalytics: false,
    cloudflareBeaconToken: ''
  };
})();

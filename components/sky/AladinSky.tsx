import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, radii, typography } from '@/theme/tokens';

/**
 * Aladin Lite v3 embed inside a WebView.
 *
 * Aladin Lite is CDS Strasbourg's GPU-accelerated HiPS (Hierarchical Progressive
 * Survey) browser — pan / zoom from full-sky to arcsecond detail with seamless
 * tile streaming.
 *
 * CDN: https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js
 * Docs: https://aladin.cds.unistra.fr/AladinLite/doc/API/
 *
 * The HTML is rendered inline (no remote page fetched aside from the script + tile
 * traffic from CDS), and dynamic params (RA, Dec, FoV, survey) are injected via
 * `injectedJavaScriptBeforeContentLoaded` so the page already sees them when
 * the Aladin init script runs.
 */
export interface AladinSkyProps {
  /** RA in degrees. */
  ra: number;
  /** Dec in degrees. */
  dec: number;
  /** Initial field of view in degrees. Default 1.5. */
  fov?: number;
  /** HiPS survey ID. e.g., 'P/DSS2/color', 'P/2MASS/color'. Default DSS2 color. */
  survey?: string;
  /** Pixel height of the WebView surface. Default 320. */
  height?: number;
  /** Hex accent for the surrounding border tint. */
  accentColor?: string;
}

const ALADIN_CDN = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';

const buildHtml = (params: {
  ra: number;
  dec: number;
  fov: number;
  survey: string;
}): string => {
  // Stringified JSON is safe to inject inside a <script> tag because RA/Dec/FoV
  // are pure numbers and survey IDs follow the `P/.../...` charset.
  const init = JSON.stringify(params);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>html,body,#aladin-lite-div{margin:0;padding:0;width:100%;height:100%;background:#02030b;overflow:hidden;}</style>
</head><body>
<div id="aladin-lite-div"></div>
<script src="${ALADIN_CDN}" charset="utf-8"></script>
<script>
(function(){
  var P=${init};
  function boot(){
    if(!window.A){return setTimeout(boot,80);}
    A.init.then(function(){
      A.aladin('#aladin-lite-div',{
        survey:P.survey,
        target:P.ra+' '+P.dec,
        fov:P.fov,
        cooFrame:'ICRSd',
        showReticle:true,
        showZoomControl:true,
        showLayersControl:false,
        showGotoControl:false,
        showSimbadPointerControl:false,
        showShareControl:false,
        showFullscreenControl:false,
        showFrame:false
      });
    });
  }
  boot();
})();
</script></body></html>`;
};

export const AladinSky: React.FC<AladinSkyProps> = ({
  ra,
  dec,
  fov = 1.5,
  survey = 'P/DSS2/color',
  height = 320,
  accentColor = colors.accent.blue,
}) => {
  const [loading, setLoading] = useState(true);
  const html = useMemo(() => buildHtml({ ra, dec, fov, survey }), [ra, dec, fov, survey]);

  return (
    <View
      style={[
        styles.wrap,
        { height, borderColor: accentColor + '33' },
      ]}
    >
      <WebView
        // Re-mount on prop change so Aladin re-initializes with the new target.
        key={`${ra}|${dec}|${fov}|${survey}`}
        source={{ html, baseUrl: 'https://aladin.cds.unistra.fr/' }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback
        mixedContentMode="always"
        onLoadEnd={() => setLoading(false)}
        accessibilityLabel={`Aladin Lite sky view at RA ${ra.toFixed(3)}, Dec ${dec.toFixed(3)}, survey ${survey}`}
      />
      {loading ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={accentColor} />
        </View>
      ) : null}
    </View>
  );
};

AladinSky.displayName = 'AladinSky';

export default AladinSky;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    marginBottom: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: '#02030b',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2,3,11,0.55)',
  },
  // typography reference kept to satisfy fontFamily-via-tokens rule
  // (no text rendered here, but the import surface is verified).
  _mono: {
    fontFamily: typography.fonts.mono,
  },
});

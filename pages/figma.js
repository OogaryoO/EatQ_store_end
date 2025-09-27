import Head from 'next/head'
import Layout from '../components/Layout'

export default function FigmaPage() {
  return (
    <Layout title="PWA Management System">
      <Head>
        {/* Meta tags from your Figma export */}
        <meta charSet="utf-8" />
        <meta name="entrypoint_variant" content="figma_app" />
        <meta name="is_preload_streaming" content="true" />
        <meta name="twitter:card" content="player" />
        <meta name="twitter:site" content="@figma" />
        <meta name="twitter:title" content="PWA Management System" />
        <meta property="og:description" content="Created with Figma" />
        <meta name="description" content="Created with Figma" />
        
        {/* Font styles from your Figma export */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                src:
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZFhjA.eot?#)
                    format('eot'),
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)
                    format('woff2'),
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZFhjg.woff)
                    format('woff');
              }
              
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 600;
                src:
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjA.eot?#)
                    format('eot'),
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2)
                    format('woff2'),
                  url(https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjg.woff)
                    format('woff');
              }
              
              /* Add your other font definitions and styles here */
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              }
            `
          }}
        />
      </Head>

      <div className="figma-content">
        {/* File browser loading page structure from your Figma export */}
        <div className="file-browser-loading-page-container">
          <div
            id="filebrowser-loading-page"
            className="fb-page-layout"
          >
            <div className="fb-flex-row">
              <div id="filebrowser-loading-sidebar" className="fb-sidebar">
                <div className="fb-sidebar-account-and-notifications">
                  <div className="fb-circle-24 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-120" />
                </div>
                <div className="fb-sidebar-searchbar">
                  <div className="fb-rectangle-32 fb-width-full" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-70" />
                </div>
                <div className="fb-divider" />
                <div className="fb-sidebar-row">
                  <div className="fb-circle-16" />
                  <div className="fb-rectangle-16 fb-width-115" />
                </div>
                {/* Add more sidebar elements as needed */}
              </div>
              
              <div className="fb-page">
                <div className="fb-toolbar-48">
                  <div className="fb-rectangle-16 fb-width-120" />
                </div>
                <div className="fb-page-content-columns">
                  <div className="fb-page-content">
                    <div className="fb-fading-content">
                      <div className="fb-tile-grid fb-tile-grid-top-padding">
                        {/* Sample file cards */}
                        {Array.from({ length: 21 }).map((_, index) => (
                          <div key={index} className="fb-card">
                            <div className="fb-file-thumbnail" />
                            <div className="fb-file-card-footer">
                              <div className="fb-rectangle-16 fb-width-16" />
                              <div className="fb-file-card-footer-text-container">
                                <div className="fb-rectangle-16 fb-width-120" />
                                <div className="fb-rectangle-16 fb-width-88" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
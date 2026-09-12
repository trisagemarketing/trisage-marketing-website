<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Trisage Marketing</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          :root {
            --primary: #243384;
            --primary-dark: #192361;
            --primary-light: #eef2ff;
            --secondary: #0ea5e9;
            --secondary-dark: #0284c7;
            --accent: #10b981;
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --badge-bg: #f1f5f9;
            --badge-text: #334155;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-page: #050b14;
              --bg-card: #0c1626;
              --text-main: #f8fafc;
              --text-muted: #94a3b8;
              --border-color: #1e293b;
              --primary-light: #1e293b;
              --badge-bg: #1e293b;
              --badge-text: #cbd5e1;
            }
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-page);
            color: var(--text-main);
            line-height: 1.6;
            padding: 24px 16px 64px 16px;
            -webkit-font-smoothing: antialiased;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Header Card */
          .header-card {
            background: linear-gradient(135deg, #192361 0%, #243384 50%, #0284c7 100%);
            border-radius: 24px;
            padding: 40px 32px;
            color: #ffffff;
            margin-bottom: 24px;
            box-shadow: 0 20px 40px -15px rgba(36, 51, 132, 0.35);
            position: relative;
            overflow: hidden;
          }

          .header-card::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
          }

          .brand-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 20px;
          }

          .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #e0f2fe;
          }

          .brand-badge .dot {
            width: 8px;
            height: 8px;
            background-color: #38bdf8;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #38bdf8;
          }

          .site-link {
            color: #ffffff;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.1);
            padding: 6px 16px;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
          }

          .site-link:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
          }

          h1 {
            font-size: clamp(28px, 4vw, 38px);
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.02em;
            margin-bottom: 12px;
          }

          .description {
            font-size: 15px;
            color: #e2e8f0;
            max-width: 760px;
            line-height: 1.6;
          }

          /* Stat Cards Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .stat-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .stat-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
          }

          .stat-value {
            font-size: 28px;
            font-weight: 800;
            color: var(--text-main);
          }

          /* Control Bar (Search & Info) */
          .control-bar {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 16px 20px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }

          .search-box {
            position: relative;
            flex: 1;
            min-width: 260px;
          }

          .search-input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            font-size: 14px;
            font-family: inherit;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            background-color: var(--bg-page);
            color: var(--text-main);
            outline: none;
            transition: border-color 0.2s;
          }

          .search-input:focus {
            border-color: var(--secondary);
          }

          .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
          }

          .info-note {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 500;
          }

          /* Table Styling */
          .table-container {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
          }

          thead {
            background-color: var(--badge-bg);
            border-bottom: 2px solid var(--border-color);
          }

          th {
            padding: 16px 20px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-muted);
          }

          th.col-idx { width: 50px; text-align: center; }
          th.col-url { width: auto; }
          th.col-prio { width: 110px; text-align: center; }
          th.col-freq { width: 130px; text-align: center; }
          th.col-date { width: 160px; text-align: right; }

          tbody tr {
            border-bottom: 1px solid var(--border-color);
            transition: background-color 0.15s ease;
          }

          tbody tr:last-child {
            border-bottom: none;
          }

          tbody tr:hover {
            background-color: rgba(14, 165, 233, 0.04);
          }

          td {
            padding: 14px 20px;
            vertical-align: middle;
          }

          td.col-idx {
            text-align: center;
            font-weight: 700;
            color: var(--text-muted);
            font-size: 12px;
          }

          td.col-url a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
            transition: color 0.15s ease;
          }

          @media (prefers-color-scheme: dark) {
            td.col-url a {
              color: #38bdf8;
            }
          }

          td.col-url a:hover {
            text-decoration: underline;
            color: var(--secondary-dark);
          }

          /* Badges */
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
          }

          .badge-freq {
            background-color: var(--badge-bg);
            color: var(--badge-text);
            text-transform: capitalize;
            border: 1px solid var(--border-color);
          }

          .prio-high {
            background: rgba(16, 185, 129, 0.12);
            color: #059669;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }

          .prio-med {
            background: rgba(14, 165, 233, 0.12);
            color: #0284c7;
            border: 1px solid rgba(14, 165, 233, 0.3);
          }

          .prio-low {
            background: rgba(148, 163, 184, 0.12);
            color: #64748b;
            border: 1px solid rgba(148, 163, 184, 0.3);
          }

          @media (prefers-color-scheme: dark) {
            .prio-high { color: #34d399; }
            .prio-med { color: #38bdf8; }
            .prio-low { color: #94a3b8; }
          }

          .col-date {
            text-align: right;
            color: var(--text-muted);
            font-size: 13px;
            font-variant-numeric: tabular-nums;
          }

          /* Footer */
          .sitemap-footer {
            margin-top: 32px;
            text-align: center;
            font-size: 13px;
            color: var(--text-muted);
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }

          .footer-links {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .footer-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.15s;
          }

          .footer-links a:hover {
            color: var(--primary);
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- Header Card -->
          <div class="header-card">
            <div class="brand-row">
              <div class="brand-badge">
                <span class="dot"></span>
                <span>Hospitality Digital Marketing</span>
              </div>
              <a href="https://trisagemarketing.com" class="site-link" target="_blank" rel="noopener noreferrer">
                Visit trisagemarketing.com &#8599;
              </a>
            </div>
            <h1>XML Sitemap Index</h1>
            <p class="description">
              This is a stylized XML Sitemap generated for search engines (Google, Bing, Yahoo) and human visitors.
              It lists the canonical crawlable URLs for <strong>Trisage Marketing</strong>, structured for optimal indexing and discovery.
            </p>
          </div>

          <!-- Quick Statistics Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">Total URLs</span>
              <span class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Core Services</span>
              <span class="stat-value">8</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Crawl Protocol</span>
              <span class="stat-value" style="font-size: 20px; color: var(--secondary);">Sitemaps 0.9</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Primary Entity</span>
              <span class="stat-value" style="font-size: 20px; color: var(--primary);">Trisage Marketing</span>
            </div>
          </div>

          <!-- Search / Filter Control -->
          <div class="control-bar">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="sitemap-search" class="search-input" placeholder="Filter URLs by keyword..." onkeyup="filterUrls()" />
            </div>
            <div class="info-note">
              Showing <span id="visible-count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> URLs
            </div>
          </div>

          <!-- Sitemaps Table -->
          <div class="table-container">
            <table id="sitemap-table">
              <thead>
                <tr>
                  <th class="col-idx">#</th>
                  <th class="col-url">URL / Location</th>
                  <th class="col-prio">Priority</th>
                  <th class="col-freq">Change Freq</th>
                  <th class="col-date">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="col-idx">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td class="col-url">
                      <a href="{sitemap:loc}" target="_blank" rel="noopener noreferrer">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="col-prio" style="text-align: center;">
                      <xsl:variable name="prio" select="sitemap:priority"/>
                      <span class="badge">
                        <xsl:choose>
                          <xsl:when test="$prio &gt;= 0.9">
                            <xsl:attribute name="class">badge prio-high</xsl:attribute>
                          </xsl:when>
                          <xsl:when test="$prio &gt;= 0.7">
                            <xsl:attribute name="class">badge prio-med</xsl:attribute>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:attribute name="class">badge prio-low</xsl:attribute>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td class="col-freq" style="text-align: center;">
                      <span class="badge badge-freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td class="col-date">
                      <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="sitemap-footer">
            <div class="footer-links">
              <a href="https://trisagemarketing.com">Home</a>
              <span>•</span>
              <a href="https://trisagemarketing.com/services">Services</a>
              <span>•</span>
              <a href="https://trisagemarketing.com/case-studies">Case Studies</a>
              <span>•</span>
              <a href="https://trisagemarketing.com/blog">Blog</a>
              <span>•</span>
              <a href="https://trisagemarketing.com/contact">Contact</a>
              <span>•</span>
              <a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview" target="_blank" rel="noopener noreferrer">Google Sitemaps Guide &#8599;</a>
            </div>
            <p>Trisage Marketing — Hospitality Digital Marketing Agency in India. All Rights Reserved.</p>
          </div>

        </div>

        <script type="text/javascript">
          function filterUrls() {
            var input = document.getElementById("sitemap-search");
            var filter = input.value.toLowerCase();
            var table = document.getElementById("sitemap-table");
            var tr = table.getElementsByTagName("tr");
            var visible = 0;

            for (var i = 1; i &lt; tr.length; i++) {
              var td = tr[i].getElementsByTagName("td")[1];
              if (td) {
                var txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) &gt; -1) {
                  tr[i].style.display = "";
                  visible++;
                } else {
                  tr[i].style.display = "none";
                }
              }
            }
            document.getElementById("visible-count").innerText = visible;
          }
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

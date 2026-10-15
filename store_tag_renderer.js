// Official Store Price Tag SVG Renderer for GT Racer (Exact 1:1 match to Desktop App)

function formatTagPrice(val) {
  if (!val) return "";
  let num = parseFloat(val);
  if (isNaN(num)) return String(val);
  return Math.round(num).toLocaleString('ru-RU').replace(/\s/g, ' ');
}

function splitTagTitle(name) {
  let title = (name || '').trim();
  // If title has "GT Racer Model Color":
  // e.g. "GT Racer X-2534-F Fabric Black" -> "GT Racer X-2534-F", "Fabric Black"
  // "GT Racer B-121A Black" -> "GT Racer B-121A", "Black"
  let match = title.match(/^(GT Racer\s+[A-Za-z0-9\-]+)(.*)$/i);
  if (match) {
    let t1 = match[1].trim();
    let t2 = match[2].trim();
    return { line1: t1, line2: t2 };
  }

  let words = title.split(' ');
  if (words.length >= 4) {
    if (words[3].toLowerCase() === 'fabric') {
      return {
        line1: words.slice(0, 4).join(' '),
        line2: words.slice(4).join(' ')
      };
    } else {
      return {
        line1: words.slice(0, 3).join(' '),
        line2: words.slice(3).join(' ')
      };
    }
  } else if (words.length >= 2) {
    let mid = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' ')
    };
  }
  return { line1: title, line2: "" };
}

function getTagTitleFontSize(text, defaultSize = 26.0883) {
  if (!text) return defaultSize;
  const len = text.length;
  // Maximum inner width between margins is ~268px
  // In bold sans-serif, character advance width is approx 0.58 * font_size
  if (len <= 18) return defaultSize;
  const calcSize = Math.floor((268 / (len * 0.58)) * 10) / 10;
  return Math.max(11, Math.min(defaultSize, calcSize));
}

function generateStoreTagSvgString(item, qrDataUrl) {
  const { line1, line2 } = splitTagTitle(item.name);
  const fs1 = getTagTitleFontSize(line1, 26.0883);
  const fs2 = getTagTitleFontSize(line2, 26.0883);
  const titleY = line2 ? 39.1885 : 52;
  const dy2 = line2 ? Math.round((fs1 * 0.6) + (fs2 * 0.6)) : 0;
  
  const pNewVal = item.price_rt || 0;
  const pOldVal = item.price_old || (pNewVal > 0 ? Math.round(pNewVal * 1.15) : 0);
  
  const hasOldPrice = pOldVal > pNewVal && pOldVal > 0;
  const pOldStr = hasOldPrice ? formatTagPrice(pOldVal) : "";
  const pNewStr = pNewVal > 0 ? formatTagPrice(pNewVal) : "Ціну уточнюйте";

  const mat = item.material || "Зносостійка тканина";
  const arm = item.armrests || "1D";
  const load = item.max_load || "120 кг";
  const war = item.warranty || "12 місяців";

  // Dynamic typography and positioning to guarantee "грн" NEVER overflows card border
  // Tag width is 309, right border rect is at 307. Right margin x = 288 gives clean 19px padding.
  let newPriceFontSize = hasOldPrice ? 64 : 68;
  let newUnitFontSize = hasOldPrice ? 33 : 35;
  const newPriceY = hasOldPrice ? 350.8818 : 334;

  if (pNewVal > 99999) {
    newPriceFontSize = hasOldPrice ? 46 : 50;
    newUnitFontSize = hasOldPrice ? 24 : 26;
  } else if (pNewVal > 9999) {
    newPriceFontSize = hasOldPrice ? 54 : 58;
    newUnitFontSize = hasOldPrice ? 28 : 30;
  } else if (pNewVal > 999) {
    newPriceFontSize = hasOldPrice ? 64 : 68;
    newUnitFontSize = hasOldPrice ? 33 : 35;
  } else if (pNewVal > 0) {
    newPriceFontSize = hasOldPrice ? 72 : 76;
    newUnitFontSize = hasOldPrice ? 38 : 40;
  } else {
    newPriceFontSize = 24;
    newUnitFontSize = 0;
  }

  let oldPriceFontSize = 32;
  let oldUnitFontSize = 20;
  if (pOldVal > 9999) {
    oldPriceFontSize = 28;
    oldUnitFontSize = 18;
  }

  // Old price: text-anchor="end" locked to right margin x = 288
  const oldPriceXml = hasOldPrice ? `
  <text x="288" y="288.2741" text-anchor="end" xml:space="preserve">
    <tspan class="st2" style="font-size: ${oldPriceFontSize}px; text-decoration: line-through;">${pOldStr}</tspan><tspan class="st2" style="font-size: ${oldUnitFontSize}px;" dx="5"> грн</tspan>
  </text>
  ` : '';

  // New price: text-anchor="end" locked to right margin x = 288, or centered if no price
  const newPriceXml = pNewVal > 0 ? `
  <text x="288" y="${newPriceY}" text-anchor="end" xml:space="preserve">
    <tspan class="st2" style="font-size: ${newPriceFontSize}px; letter-spacing: -0.5px;">${pNewStr}</tspan><tspan class="st2" style="font-size: ${newUnitFontSize}px;" dx="6"> грн</tspan>
  </text>
  ` : `
  <text x="154.5" y="340" text-anchor="middle" class="st2" style="font-size: 24px; fill: #4b5563;">
    ${escapeXml(pNewStr)}
  </text>
  `;

  const monoImg = (typeof window !== 'undefined' && window.IMG_MONOBANK) ? window.IMG_MONOBANK : "";
  const privatImg = (typeof window !== 'undefined' && window.IMG_PRIVAT) ? window.IMG_PRIVAT : "";

  const fontRegSrc = (typeof window !== 'undefined' && window.FONT_MYRIAD_REGULAR) ? window.FONT_MYRIAD_REGULAR : "fonts/MyriadPro-Regular.ttf";
  const fontBoldSrc = (typeof window !== 'undefined' && window.FONT_MYRIAD_BOLD) ? window.FONT_MYRIAD_BOLD : "fonts/MyriadPro-Bold.ttf";

  return `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 309 430.9" style="background:#ffffff; max-width: 100%; height: auto;" class="store-tag-svg">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: 'Myriad Pro';
        src: url('${fontRegSrc}') format('truetype');
        font-weight: normal;
      }
      @font-face {
        font-family: 'Myriad Pro';
        src: url('${fontBoldSrc}') format('truetype');
        font-weight: bold;
      }
      .st0{font-family:'Myriad Pro', 'Montserrat', Arial, sans-serif; font-weight:normal;}
      .st1{font-size:12px; fill:#000000;}
      .st2{font-family:'Myriad Pro', 'Montserrat', Arial, sans-serif; font-weight:bold;}
      .st3{font-size:26.0883px; fill:#000000;}
      .st4{font-size:40px; fill:#000000;}
      .st5{font-size:25px; fill:#000000;}
      .st6{font-size:75.3923px; fill:#000000;}
      .st7{font-size:43.0813px; fill:#000000;}
      .st8{font-family:'Myriad Pro', 'Montserrat', Arial, sans-serif; font-weight:600;}
      .st9{fill:none;stroke:#000000;stroke-miterlimit:10;}
      .st10{fill:none;stroke:#000000;stroke-width:3.01;stroke-miterlimit:10;}
      .card-border{fill:none;stroke:#000000;stroke-width:1.5;}
    </style>
  </defs>

  <!-- Clean outer border -->
  <rect x="2" y="2" width="305" height="426.9" rx="10" ry="10" class="card-border"/>

  <!-- Title (Model & Color) with dynamic auto-fit font sizing -->
  <text transform="matrix(1 0 0 1 154.5 ${titleY})" text-anchor="middle">
    <tspan x="0" y="0" class="st2" style="font-size: ${fs1}px;">${escapeXml(line1)}</tspan>
    ${line2 ? `<tspan x="0" y="${dy2}" class="st2" style="font-size: ${fs2}px; letter-spacing: ${fs2 < 14 ? '-0.4px' : 'normal'};">${escapeXml(line2)}</tspan>` : ''}
  </text>

  <!-- QR Code Image -->
  ${qrDataUrl ? `<image x="104.9" y="86" width="99.2" height="99.2" xlink:href="${qrDataUrl}" />` : ''}

  <!-- Specifications (Characteristics) -->
  <text transform="matrix(1 0 0 1 15.9055 206.9183)">
    <tspan x="0" y="0" class="st0 st1">Матеріал оббивки: ${escapeXml(mat)}</tspan>
    <tspan x="0" y="14.4" class="st0 st1">Підлокітники: ${escapeXml(arm)}</tspan>
    <tspan x="0" y="28.8" class="st0 st1">Максимальне навантаження: ${escapeXml(load)}</tspan>
    <tspan x="0" y="43.2" class="st0 st1">Гарантія: ${escapeXml(war)}</tspan>
  </text>

  <!-- Old Price (Strikethrough) -->
  ${oldPriceXml}

  <!-- New Price (Main Large Price) -->
  ${newPriceXml}

  <!-- Monobank installment badge -->
  <g>
    ${monoImg ? `<image style="overflow:visible;" width="512" height="512" xlink:href="${monoImg}" transform="matrix(6.980469e-02 0 0 6.980469e-02 27.5439 375.0829)"></image>` : ''}
    <text transform="matrix(1 0 0 1 70.0807 389.2743)">
      <tspan x="0" y="0" class="st8 st1">Monobank</tspan>
      <tspan x="0" y="14.4" class="st8 st1">розстрочка</tspan>
    </text>
    <path class="st9" d="M120.7,418.7H39.4c-13.8,0-25-11.2-25-25v0c0-13.8,11.2-25,25-25h81.3c13.8,0,25,11.2,25,25v0 C145.7,407.5,134.6,418.7,120.7,418.7z"/>
  </g>

  <!-- Privatbank installment badge -->
  <g>
    ${privatImg ? `<image style="overflow:visible;" width="360" height="340" xlink:href="${privatImg}" transform="matrix(0.1111 0 0 0.1111 177.5961 374.0641)"></image>` : ''}
    <text transform="matrix(1 0 0 1 225.8994 389.2743)">
      <tspan x="0" y="0" class="st8 st1">Оплата</tspan>
      <tspan x="0" y="14.4" class="st8 st1">частинами</tspan>
    </text>
    <path class="st9" d="M269.6,418h-81.3c-13.8,0-25-11.2-25-25v0c0-13.8,11.2-25,25-25h81.3c13.8,0,25,11.2,25,25v0 C294.6,406.8,283.4,418,269.6,418z"/>
  </g>
</svg>
  `.trim();
}

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

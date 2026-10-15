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
    // If t2 starts with "Fabric" and has color, keep together
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

function generateStoreTagSvgString(item, qrDataUrl) {
  const { line1, line2 } = splitTagTitle(item.name);
  
  const pNewVal = item.price_rt || 0;
  const pOldVal = item.price_old || (pNewVal > 0 ? Math.round(pNewVal * 1.15) : 0);
  
  const hasOldPrice = pOldVal > pNewVal && pOldVal > 0;
  const pOldStr = hasOldPrice ? formatTagPrice(pOldVal) : "";
  const pNewStr = pNewVal > 0 ? formatTagPrice(pNewVal) : "Ціну уточнюйте";

  const mat = item.material || "Зносостійка тканина";
  const arm = item.armrests || "1D";
  const load = item.max_load || "120 кг";
  const war = item.warranty || "12 місяців";

  // Calculate dynamic X offsets for prices
  const oldX = 96.9 + (pOldStr.length - 5) * 22;
  const newX = 182.6 + (pNewStr.length - 5) * 42;
  
  // Font size for very large numbers (>9999)
  const isLargePrice = pNewVal > 9999;
  const newPriceStyle = isLargePrice ? ' style="font-size: 63px;"' : '';
  const oldPriceStyle = (pOldVal > 9999 ? 'font-size: 33px; ' : '') + 'text-decoration: line-through;';

  const monoImg = window.IMG_MONOBANK || "";
  const privatImg = window.IMG_PRIVAT || "";

  return `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 309 430.9" style="background:#ffffff; max-width: 100%; height: auto;" class="store-tag-svg">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: 'Myriad Pro';
        src: url('fonts/MyriadPro-Regular.ttf') format('truetype');
        font-weight: normal;
      }
      @font-face {
        font-family: 'Myriad Pro';
        src: url('fonts/MyriadPro-Bold.ttf') format('truetype');
        font-weight: bold;
      }
      .st0{font-family:'Myriad Pro', 'Montserrat', sans-serif; font-weight:normal;}
      .st1{font-size:12px; fill:#000000;}
      .st2{font-family:'Myriad Pro', 'Montserrat', sans-serif; font-weight:bold;}
      .st3{font-size:26.0883px; fill:#000000;}
      .st4{font-size:40px; fill:#000000;}
      .st5{font-size:25px; fill:#000000;}
      .st6{font-size:75.3923px; fill:#000000;}
      .st7{font-size:43.0813px; fill:#000000;}
      .st8{font-family:'Myriad Pro', 'Montserrat', sans-serif; font-weight:600;}
      .st9{fill:none;stroke:#000000;stroke-miterlimit:10;}
      .st10{fill:none;stroke:#000000;stroke-width:3.01;stroke-miterlimit:10;}
      .card-border{fill:none;stroke:#000000;stroke-width:1.5;}
    </style>
  </defs>

  <!-- Clean outer border -->
  <rect x="2" y="2" width="305" height="426.9" rx="10" ry="10" class="card-border"/>

  <!-- Title (Model & Color) -->
  <text transform="matrix(1 0 0 1 154.5 39.1885)" text-anchor="middle">
    <tspan x="0" y="0" class="st2 st3">${escapeXml(line1)}</tspan>
    <tspan x="0" y="31.3" class="st2 st3">${escapeXml(line2)}</tspan>
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
  ${hasOldPrice ? `
  <text transform="matrix(1 0 0 1 150.0576 288.2741)">
    <tspan x="0" y="0" class="st2 st4" style="${oldPriceStyle}">${pOldStr}</tspan>
    <tspan x="${oldX.toFixed(1)}" y="0" class="st2 st5"> грн</tspan>
  </text>
  ` : ''}

  <!-- New Price (Main Large Price) -->
  <text transform="matrix(1 0 0 1 31.8833 350.8818)">
    <tspan x="0" y="0" class="st2 st6"${newPriceStyle}>${pNewStr}</tspan>
    <tspan x="${newX.toFixed(1)}" y="0" class="st2 st7"> грн</tspan>
  </text>

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

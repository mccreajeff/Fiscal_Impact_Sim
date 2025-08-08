export const fmtUSD = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0,}).format;  
export const fmtCompactUSD = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", notation: "compact", compactDisplay: "short", maximumFractionDigits: 1,}).format;
export const pctFromFrac = (f) => `${f >= 0 ? '+' : ''}${(f * 100).toFixed(0)}%`;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

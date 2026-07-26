const patterns = require("../utils/iocRegex");

/**
 * Extracts unique IOCs from a block of raw text (email body, log file, OCR output, etc.)
 * Returns an object keyed by IOC type, each an array of unique string values.
 */
function extractIOCs(text = "") {
  if (!text || typeof text !== "string") {
    return { ip: [], domain: [], url: [], email: [], file_hash: [], phone: [], upi_id: [] };
  }

  const unique = (arr) => [...new Set(arr.map((v) => v.trim()).filter(Boolean))];

  const ips = unique(text.match(patterns.ipv4) || []);
  const urls = unique(text.match(patterns.url) || []);
  const emails = unique(text.match(patterns.email) || []);
  const domains = unique(
    (text.match(patterns.domain) || []).filter(
      (d) => !emails.some((e) => e.endsWith(d)) // avoid duplicating email domains as standalone domains
    )
  );
  const md5s = text.match(patterns.md5) || [];
  const sha1s = text.match(patterns.sha1) || [];
  const sha256s = text.match(patterns.sha256) || [];
  const hashes = unique([...md5s, ...sha1s, ...sha256s]);
  const phones = unique(text.match(patterns.phone) || []);

  // UPI IDs look like emails but with bank handles (e.g. name@okhdfcbank) - filter out real emails
  const knownEmailDomainHints = [".com", ".in", ".org", ".net", ".co"];
  const upiCandidates = unique(text.match(patterns.upiId) || []);
  const upiIds = upiCandidates.filter(
    (v) => !emails.includes(v) && !knownEmailDomainHints.some((hint) => v.toLowerCase().endsWith(hint))
  );

  return {
    ip: ips,
    domain: domains,
    url: urls,
    email: emails,
    file_hash: hashes,
    phone: phones,
    upi_id: upiIds,
  };
}

module.exports = { extractIOCs };

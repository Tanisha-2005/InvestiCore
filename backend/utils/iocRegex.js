// Regex patterns used to extract Indicators of Compromise from raw evidence text
module.exports = {
  ipv4: /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g,

  domain: /\b(?!(?:\d{1,3}\.){3}\d{1,3}\b)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,24}\b/g,

  url: /\bhttps?:\/\/[^\s"'<>]+/g,

  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,

  md5: /\b[a-fA-F0-9]{32}\b/g,
  sha1: /\b[a-fA-F0-9]{40}\b/g,
  sha256: /\b[a-fA-F0-9]{64}\b/g,

  // Indian phone number formats (10-digit, optional +91)
  phone: /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g,

  // UPI ID e.g. name@bankhandle
  upiId: /\b[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,49}\b/g,
};

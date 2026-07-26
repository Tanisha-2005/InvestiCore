const axios = require("axios");

const VT_BASE = "https://www.virustotal.com/api/v3";
const ABUSEIPDB_BASE = "https://api.abuseipdb.com/api/v2";
const OTX_BASE = "https://otx.alienvault.com/api/v1";

/**
 * Checks an IP address against AbuseIPDB and VirusTotal.
 */
async function checkIP(ip) {
  const results = { sources: {}, isMalicious: false, malwareScore: 0 };

  // AbuseIPDB
  try {
    if (process.env.ABUSEIPDB_API_KEY) {
      const { data } = await axios.get(`${ABUSEIPDB_BASE}/check`, {
        params: { ipAddress: ip, maxAgeInDays: 90 },
        headers: { Key: process.env.ABUSEIPDB_API_KEY, Accept: "application/json" },
      });
      const abuseScore = data?.data?.abuseConfidenceScore ?? 0;
      results.sources.abuseIPDB = {
        abuseConfidenceScore: abuseScore,
        totalReports: data?.data?.totalReports,
        countryCode: data?.data?.countryCode,
        isp: data?.data?.isp,
      };
      results.malwareScore = Math.max(results.malwareScore, abuseScore);
      if (abuseScore >= 50) results.isMalicious = true;
    }
  } catch (err) {
    results.sources.abuseIPDB = { error: err.response?.data?.errors?.[0]?.detail || err.message };
  }

  // VirusTotal
  try {
    if (process.env.VIRUSTOTAL_API_KEY) {
      const { data } = await axios.get(`${VT_BASE}/ip_addresses/${ip}`, {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY },
      });
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const vtScore = malicious > 0 ? Math.min(100, malicious * 10) : 0;
      results.sources.virusTotal = { stats, reputation: data?.data?.attributes?.reputation };
      results.malwareScore = Math.max(results.malwareScore, vtScore);
      if (malicious > 0) results.isMalicious = true;
    }
  } catch (err) {
    results.sources.virusTotal = { error: err.response?.data?.error?.message || err.message };
  }

  return results;
}

/**
 * Checks a domain against VirusTotal and AlienVault OTX.
 */
async function checkDomain(domain) {
  const results = { sources: {}, isMalicious: false, malwareScore: 0 };

  try {
    if (process.env.VIRUSTOTAL_API_KEY) {
      const { data } = await axios.get(`${VT_BASE}/domains/${domain}`, {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY },
      });
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const vtScore = malicious > 0 ? Math.min(100, malicious * 10) : 0;
      results.sources.virusTotal = { stats, categories: data?.data?.attributes?.categories };
      results.malwareScore = Math.max(results.malwareScore, vtScore);
      if (malicious > 0) results.isMalicious = true;
    }
  } catch (err) {
    results.sources.virusTotal = { error: err.response?.data?.error?.message || err.message };
  }

  try {
    if (process.env.ALIENVAULT_OTX_API_KEY) {
      const { data } = await axios.get(`${OTX_BASE}/indicators/domain/${domain}/general`, {
        headers: { "X-OTX-API-KEY": process.env.ALIENVAULT_OTX_API_KEY },
      });
      const pulseCount = data?.pulse_info?.count || 0;
      results.sources.alienVaultOTX = { pulseCount, tags: data?.pulse_info?.pulses?.map((p) => p.name)?.slice(0, 5) };
      if (pulseCount > 0) {
        results.isMalicious = true;
        results.malwareScore = Math.max(results.malwareScore, Math.min(100, pulseCount * 15));
      }
    }
  } catch (err) {
    results.sources.alienVaultOTX = { error: err.response?.data || err.message };
  }

  return results;
}

/**
 * Checks a file hash (MD5/SHA1/SHA256) against VirusTotal.
 */
async function checkFileHash(hash) {
  const results = { sources: {}, isMalicious: false, malwareScore: 0 };

  try {
    if (process.env.VIRUSTOTAL_API_KEY) {
      const { data } = await axios.get(`${VT_BASE}/files/${hash}`, {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY },
      });
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
      const vtScore = Math.round((malicious / total) * 100);
      results.sources.virusTotal = {
        stats,
        suggestedName: data?.data?.attributes?.meaningful_name,
        type: data?.data?.attributes?.type_description,
      };
      results.malwareScore = vtScore;
      if (malicious > 0) results.isMalicious = true;
    }
  } catch (err) {
    results.sources.virusTotal = { error: err.response?.data?.error?.message || err.message };
  }

  return results;
}

/**
 * Checks a URL against VirusTotal and URLScan.io.
 */
async function checkURL(url) {
  const results = { sources: {}, isMalicious: false, malwareScore: 0 };

  try {
    if (process.env.VIRUSTOTAL_API_KEY) {
      const urlId = Buffer.from(url).toString("base64").replace(/=+$/, "");
      const { data } = await axios.get(`${VT_BASE}/urls/${urlId}`, {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY },
      });
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const vtScore = malicious > 0 ? Math.min(100, malicious * 10) : 0;
      results.sources.virusTotal = { stats };
      results.malwareScore = Math.max(results.malwareScore, vtScore);
      if (malicious > 0) results.isMalicious = true;
    }
  } catch (err) {
    results.sources.virusTotal = { error: "URL not previously scanned or lookup failed" };
  }

  try {
    if (process.env.URLSCAN_API_KEY) {
      const { data } = await axios.get(`https://urlscan.io/api/v1/search/`, {
        params: { q: `page.url:"${url}"` },
        headers: { "API-Key": process.env.URLSCAN_API_KEY },
      });
      results.sources.urlScan = { resultsFound: data?.total || 0 };
    }
  } catch (err) {
    results.sources.urlScan = { error: err.message };
  }

  return results;
}

/**
 * Dispatches a single IOC to the correct checker based on type.
 */
async function lookupIOC(type, value) {
  switch (type) {
    case "ip":
      return checkIP(value);
    case "domain":
      return checkDomain(value);
    case "file_hash":
      return checkFileHash(value);
    case "url":
      return checkURL(value);
    default:
      return { sources: {}, isMalicious: false, malwareScore: 0, note: "No threat intel source configured for this IOC type" };
  }
}

module.exports = { checkIP, checkDomain, checkFileHash, checkURL, lookupIOC };

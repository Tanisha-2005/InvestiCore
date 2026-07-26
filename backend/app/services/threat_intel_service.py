import httpx
import json
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.redis import redis_service

class ThreatIntelService:
    def __init__(self):
        self.timeout = 5.0
        self.cache_ttl = 86400  # 24 Hours Cache

    def _get_cache(self, key: str) -> Optional[Dict[str, Any]]:
        cached = redis_service.get(key)
        if cached:
            try:
                return json.loads(cached)
            except Exception:
                pass
        return None

    def _set_cache(self, key: str, value: Dict[str, Any]) -> None:
        try:
            redis_service.set(key, json.dumps(value), ex=self.cache_ttl)
        except Exception:
            pass

    async def lookup_virustotal(self, ioc_value: str, ioc_type: str) -> Dict[str, Any]:
        cache_key = f"ti_vt_{ioc_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.VIRUSTOTAL_API_KEY:
            return {"source": "virustotal", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        headers = {"x-apikey": settings.VIRUSTOTAL_API_KEY}
        endpoint_map = {
            "ip": f"https://www.virustotal.com/api/v3/ip_addresses/{ioc_value}",
            "domain": f"https://www.virustotal.com/api/v3/domains/{ioc_value}",
            "hash_md5": f"https://www.virustotal.com/api/v3/files/{ioc_value}",
            "hash_sha256": f"https://www.virustotal.com/api/v3/files/{ioc_value}",
            "hash_sha1": f"https://www.virustotal.com/api/v3/files/{ioc_value}",
        }

        url = endpoint_map.get(ioc_type)
        if not url:
            return {"source": "virustotal", "status": "unsupported", "summary": f"VT unsupported type {ioc_type}", "malicious_count": 0, "total_count": 0}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
                    malicious = stats.get("malicious", 0)
                    total = sum(stats.values()) if stats else 0
                    result = {
                        "source": "virustotal",
                        "status": "success",
                        "summary": f"Flagged malicious by {malicious}/{total} detection engines.",
                        "malicious_count": malicious,
                        "total_count": total,
                        "raw_response": stats
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "virustotal", "status": "error", "summary": "Lookup timeout or network error", "malicious_count": 0, "total_count": 0}

    async def lookup_abuseipdb(self, ioc_value: str) -> Dict[str, Any]:
        cache_key = f"ti_abuseipdb_{ioc_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.ABUSEIPDB_API_KEY:
            return {"source": "abuseipdb", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        headers = {"Key": settings.ABUSEIPDB_API_KEY, "Accept": "application/json"}
        url = f"https://api.abuseipdb.com/api/v2/check?ipAddress={ioc_value}&maxAgeInDays=90"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json().get("data", {})
                    score = data.get("abuseConfidenceScore", 0)
                    reports = data.get("totalReports", 0)
                    result = {
                        "source": "abuseipdb",
                        "status": "success",
                        "summary": f"Abuse Confidence Score: {score}%, Total Reports: {reports}",
                        "malicious_count": score,
                        "total_count": 100,
                        "raw_response": data
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "abuseipdb", "status": "error", "summary": "Lookup failed", "malicious_count": 0, "total_count": 0}

    async def lookup_shodan(self, ioc_value: str) -> Dict[str, Any]:
        cache_key = f"ti_shodan_{ioc_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.SHODAN_API_KEY:
            return {"source": "shodan", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        url = f"https://api.shodan.io/shodan/host/{ioc_value}?key={settings.SHODAN_API_KEY}"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    ports = data.get("ports", [])
                    vulns = data.get("vulns", [])
                    result = {
                        "source": "shodan",
                        "status": "success",
                        "summary": f"Open ports: {ports}, Known Vulns: {len(vulns)}",
                        "malicious_count": len(vulns),
                        "total_count": len(ports) if ports else 1,
                        "raw_response": {"ports": ports, "vulns": vulns, "isp": data.get("isp")}
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "shodan", "status": "error", "summary": "Shodan lookup failed", "malicious_count": 0, "total_count": 0}

    async def lookup_otx(self, ioc_value: str, ioc_type: str) -> Dict[str, Any]:
        cache_key = f"ti_otx_{ioc_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.ALIENVAULT_OTX_API_KEY:
            return {"source": "otx", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        otx_type = "IPv4" if ioc_type == "ip" else ("domain" if ioc_type == "domain" else "file")
        url = f"https://otx.alienvault.com/api/v1/indicators/{otx_type}/{ioc_value}/general"
        headers = {"X-OTX-API-KEY": settings.ALIENVAULT_OTX_API_KEY}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    pulses = data.get("pulse_info", {}).get("count", 0)
                    result = {
                        "source": "otx",
                        "status": "success",
                        "summary": f"Associated with {pulses} Threat Intelligence Pulses",
                        "malicious_count": pulses,
                        "total_count": 10,
                        "raw_response": {"pulse_count": pulses}
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "otx", "status": "error", "summary": "OTX lookup failed", "malicious_count": 0, "total_count": 0}

    async def lookup_urlscan(self, ioc_value: str) -> Dict[str, Any]:
        cache_key = f"ti_urlscan_{ioc_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.URLSCAN_API_KEY:
            return {"source": "urlscan", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        url = f"https://urlscan.io/api/v1/search/?q=domain:{ioc_value}"
        headers = {"API-Key": settings.URLSCAN_API_KEY}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    total = data.get("total", 0)
                    result = {
                        "source": "urlscan",
                        "status": "success",
                        "summary": f"Indexed in {total} URLScan.io public scans",
                        "malicious_count": 1 if total > 0 else 0,
                        "total_count": total,
                        "raw_response": {"scans_count": total}
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "urlscan", "status": "error", "summary": "URLScan lookup failed", "malicious_count": 0, "total_count": 0}

    async def lookup_hibp(self, email_value: str) -> Dict[str, Any]:
        cache_key = f"ti_hibp_{email_value}"
        cached_result = self._get_cache(cache_key)
        if cached_result:
            return cached_result

        if not settings.HIBP_API_KEY:
            return {"source": "hibp", "status": "skipped", "summary": "API Key not configured", "malicious_count": 0, "total_count": 0}

        url = f"https://haveibeenpwned.com/api/v3/breachedaccount/{email_value}?truncateResponse=false"
        headers = {"hibp-api-key": settings.HIBP_API_KEY, "user-agent": "InvestiCore-Platform"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    breaches = resp.json()
                    result = {
                        "source": "hibp",
                        "status": "success",
                        "summary": f"Found in {len(breaches)} data breaches",
                        "malicious_count": len(breaches),
                        "total_count": len(breaches),
                        "raw_response": {"breach_count": len(breaches)}
                    }
                    self._set_cache(cache_key, result)
                    return result
        except Exception:
            pass
        return {"source": "hibp", "status": "error", "summary": "HIBP lookup failed or no breach found", "malicious_count": 0, "total_count": 0}

threat_intel_service = ThreatIntelService()

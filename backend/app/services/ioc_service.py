import re
from typing import List, Dict, Any

class IOCExtractor:
    def __init__(self):
        self.patterns = {
            "ip": re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'),
            "ipv6": re.compile(r'\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b'),
            "domain": re.compile(r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,})\b'),
            "url": re.compile(r'https?://(?:[-\w.]|(?:%[0-9a-fA-F]{2}))+[/\w\.-]*\??[\w=&\.-]*'),
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'),
            "phone": re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'),
            "hash_md5": re.compile(r'\b[a-fA-F0-9]{32}\b'),
            "hash_sha1": re.compile(r'\b[a-fA-F0-9]{40}\b'),
            "hash_sha256": re.compile(r'\b[a-fA-F0-9]{64}\b'),
            "btc": re.compile(r'\b(?:1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}\b'),
            "registry_key": re.compile(r'\b(?:HKLM|HKCU|HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER)\\[a-zA-Z0-9_\\]+\b', re.IGNORECASE),
            "mutex": re.compile(r'\b(?:Global\\|Local\\)?[a-zA-Z0-9_]{5,64}_Mutex\b', re.IGNORECASE),
            "cve": re.compile(r'\bCVE-\d{4}-\d{4,7}\b', re.IGNORECASE),
            "mitre_attack": re.compile(r'\bT\d{4}(?:\.\d{3})?\b'),
        }

        # Excluded common false positives
        self.whitelist_domains = {"example.com", "schema.org", "w3.org", "localhost", "github.com", "microsoft.com"}

    def extract(self, text: str) -> List[Dict[str, Any]]:
        if not text:
            return []

        found_iocs = []
        seen = set()

        for ioc_type, pattern in self.patterns.items():
            matches = pattern.findall(text)
            for val in matches:
                clean_val = val.strip().strip("'\"<>()[]")
                
                # Filtering logic
                if ioc_type in ["domain", "url"] and any(wd in clean_val.lower() for wd in self.whitelist_domains):
                    continue
                if ioc_type == "domain" and (clean_val.endswith(".png") or clean_val.endswith(".jpg") or clean_val.endswith(".exe")):
                    continue
                
                key = (ioc_type, clean_val)
                if key not in seen:
                    seen.add(key)
                    found_iocs.append({
                        "ioc_type": ioc_type,
                        "value": clean_val,
                        "confidence": 0.95
                    })

        return found_iocs

ioc_extractor = IOCExtractor()

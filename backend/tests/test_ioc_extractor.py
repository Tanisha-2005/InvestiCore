from app.services.ioc_service import ioc_extractor

def test_ioc_extraction():
    sample_text = (
        "Investigator note: Attacker IP 192.168.1.100 contacted malicious C2 server http://malicious-domain-update.com/payload.exe. "
        "MD5 hash of payload is e1107a4143b17bf59928b7e1d5a3c234. Target BTC wallet 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa. "
        "MITRE ATT&CK Technique T1566 and vulnerability CVE-2026-1337 detected."
    )

    results = ioc_extractor.extract(sample_text)
    extracted_types = [item["ioc_type"] for item in results]
    extracted_values = [item["value"] for item in results]

    assert "ip" in extracted_types
    assert "192.168.1.100" in extracted_values
    assert "hash_md5" in extracted_types
    assert "e1107a4143b17bf59928b7e1d5a3c234" in extracted_values
    assert "cve" in extracted_types
    assert "CVE-2026-1337" in extracted_values
    assert "mitre_attack" in extracted_types
    assert "T1566" in extracted_values

from app.services.malware_service import malware_analyzer
from app.services.evidence_service import evidence_service

def test_file_hashing():
    sample_data = b"InvestiCore Cybercrime Forensic Test Sample"
    md5, sha1, sha256 = evidence_service.calculate_hashes(sample_data)
    assert len(md5) == 32
    assert len(sha1) == 40
    assert len(sha256) == 64

def test_entropy_calculation():
    low_entropy_data = b"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    high_entropy_data = bytes([i % 256 for i in range(1000)])
    
    low_e = malware_analyzer.calculate_entropy(low_entropy_data)
    high_e = malware_analyzer.calculate_entropy(high_entropy_data)
    
    assert low_e == 0.0
    assert high_e > 7.0

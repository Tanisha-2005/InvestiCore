import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Float, Boolean, JSON, Enum
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    INVESTIGATOR = "investigator"
    ANALYST = "analyst"
    READ_ONLY = "read_only"

class CaseStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    CLOSED = "closed"
    ARCHIVED = "archived"

class CasePriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EvidenceStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class IOCStatus(str, enum.Enum):
    UNVERIFIED = "unverified"
    CLEAN = "clean"
    SUSPICIOUS = "suspicious"
    MALICIOUS = "malicious"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.INVESTIGATOR.value, nullable=False)
    totp_secret = Column(String(255), nullable=True)
    is_totp_enabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cases_created = relationship("Case", back_populates="created_by", foreign_keys="Case.created_by_id")
    cases_assigned = relationship("Case", back_populates="assigned_investigator", foreign_keys="Case.assigned_investigator_id")

class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    victim_name = Column(String(255), nullable=True)
    priority = Column(String(50), default=CasePriority.MEDIUM.value)
    status = Column(String(50), default=CaseStatus.OPEN.value)
    tags = Column(JSON, default=list)
    risk_score = Column(Float, default=0.0)
    summary_ai = Column(Text, nullable=True)
    mitre_attack_mapping = Column(JSON, default=list)
    
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    assigned_investigator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    created_by = relationship("User", foreign_keys=[created_by_id], back_populates="cases_created")
    assigned_investigator = relationship("User", foreign_keys=[assigned_investigator_id], back_populates="cases_assigned")
    evidences = relationship("Evidence", back_populates="case", cascade="all, delete-orphan")
    iocs = relationship("IOC", back_populates="case", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="case", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="case", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)  # image, pdf, email, pcap, memory, log, office, zip
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    
    md5_hash = Column(String(32), index=True)
    sha1_hash = Column(String(40), index=True)
    sha256_hash = Column(String(64), index=True)
    
    status = Column(String(50), default=EvidenceStatus.PENDING.value)
    extracted_text = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)
    summary_ai = Column(Text, nullable=True)
    
    uploaded_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="evidences")
    iocs = relationship("IOC", back_populates="evidence")

class IOC(Base):
    __tablename__ = "iocs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    evidence_id = Column(String(36), ForeignKey("evidences.id"), nullable=True)
    
    ioc_type = Column(String(50), nullable=False)  # ip, domain, url, email, phone, hash, btc, registry_key, mutex, cve, mitre_attack
    value = Column(String(512), nullable=False, index=True)
    status = Column(String(50), default=IOCStatus.UNVERIFIED.value)
    threat_score = Column(Integer, default=0)
    tags = Column(JSON, default=list)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="iocs")
    evidence = relationship("Evidence", back_populates="iocs")
    threat_intel_results = relationship("ThreatIntelResult", back_populates="ioc", cascade="all, delete-orphan")

class ThreatIntelResult(Base):
    __tablename__ = "threat_intel_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ioc_id = Column(String(36), ForeignKey("iocs.id"), nullable=False)
    source = Column(String(50), nullable=False)  # virustotal, abuseipdb, shodan, otx, urlscan, hibp
    raw_response = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    malicious_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    checked_at = Column(DateTime, default=datetime.utcnow)

    ioc = relationship("IOC", back_populates="threat_intel_results")

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String(50), nullable=False)
    source = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="timeline_events")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False)
    title = Column(String(255), nullable=False)
    report_type = Column(String(50), nullable=False)  # executive, technical, ioc
    file_format = Column(String(10), nullable=False)  # pdf, docx, markdown
    file_path = Column(String(512), nullable=False)
    generated_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(255), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

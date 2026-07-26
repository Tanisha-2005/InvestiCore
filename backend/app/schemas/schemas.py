from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "investigator"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    is_totp_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenRefresh(BaseModel):
    refresh_token: str

class TOTPSetupResponse(BaseModel):
    secret: str
    qr_uri: str

class TOTPVerifyRequest(BaseModel):
    code: str

# Case Schemas
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    victim_name: Optional[str] = None
    priority: str = "medium"
    status: str = "open"
    tags: List[str] = []

class CaseCreate(CaseBase):
    assigned_investigator_id: Optional[str] = None

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    victim_name: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    assigned_investigator_id: Optional[str] = None

class CaseResponse(CaseBase):
    id: str
    case_number: str
    risk_score: float
    summary_ai: Optional[str] = None
    mitre_attack_mapping: List[Dict[str, Any]] = []
    created_by_id: str
    assigned_investigator_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceResponse(BaseModel):
    id: str
    case_id: str
    file_name: str
    file_type: str
    file_path: str
    file_size: int
    md5_hash: Optional[str] = None
    sha1_hash: Optional[str] = None
    sha256_hash: Optional[str] = None
    status: str
    extracted_text: Optional[str] = None
    summary_ai: Optional[str] = None
    metadata_json: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# IOC Schemas
class IOCCreate(BaseModel):
    case_id: str
    evidence_id: Optional[str] = None
    ioc_type: str
    value: str
    status: str = "unverified"
    notes: Optional[str] = None

class IOCResponse(BaseModel):
    id: str
    case_id: str
    evidence_id: Optional[str] = None
    ioc_type: str
    value: str
    status: str
    threat_score: int
    tags: List[str] = []
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Threat Intel Schemas
class ThreatIntelResponse(BaseModel):
    id: str
    ioc_id: str
    source: str
    summary: Optional[str] = None
    malicious_count: int
    total_count: int
    raw_response: Dict[str, Any] = {}
    checked_at: datetime

    class Config:
        from_attributes = True

# Timeline Event Schemas
class TimelineEventCreate(BaseModel):
    case_id: str
    title: str
    description: Optional[str] = None
    event_timestamp: datetime
    event_type: str
    source: Optional[str] = None

class TimelineEventResponse(BaseModel):
    id: str
    case_id: str
    title: str
    description: Optional[str] = None
    event_timestamp: datetime
    event_type: str
    source: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# AI Request Schemas
class AIChatRequest(BaseModel):
    case_id: str
    prompt: str
    history: List[Dict[str, str]] = []

class AIRuleGenRequest(BaseModel):
    case_id: str
    rule_type: str  # yara or sigma
    artifact_text: Optional[str] = None

# Report Schemas
class ReportGenRequest(BaseModel):
    case_id: str
    title: str
    report_type: str  # executive, technical, ioc
    file_format: str  # pdf, docx, markdown

class ReportResponse(BaseModel):
    id: str
    case_id: str
    title: str
    report_type: str
    file_format: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True

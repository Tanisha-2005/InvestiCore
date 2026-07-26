from app.core.security import verify_password, get_password_hash, create_access_token, decode_token

def test_password_hashing():
    password = "SuperSecretPassword123!"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_encoding():
    user_id = "test-user-uuid-1234"
    token = create_access_token(user_id)
    payload = decode_token(token)
    assert payload.get("sub") == user_id
    assert payload.get("type") == "access"

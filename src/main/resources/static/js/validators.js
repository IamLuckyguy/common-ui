/**
 * 폼 입력 유효성 검사 관련 유틸리티 함수
 */

// 디바운스 함수 - 연속된 호출을 제한하는 함수
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 아이디 유효성 검사
function isValidUsername(username) {
    const pattern = /^[a-zA-Z0-9_]{4,50}$/;
    return pattern.test(username);
}

// 닉네임 유효성 검사
function isValidNickname(nickname) {
    return nickname.length >= 2 && nickname.length <= 50;
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 비밀번호 유효성 검사
function validatePassword(password) {
    if (!password) {
        return {
            isValid: false,
            message: '',
            strength: 0,
            color: '',
        };
    }

    // 유효한 비밀번호 조건 확인
    const hasLetter = /[a-z]/i.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    // 비밀번호 강도 계산
    let strength = 0;
    if (hasLetter) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    if (isLongEnough) strength++;
    if (password.length >= 12) strength++;

    // 기본 조건 충족 확인
    const isValidPassword = isLongEnough && hasLetter && hasNumber && hasSpecial;
    
    // 강도 메시지 설정
    let message, color;
    
    if (!isLongEnough) {
        message = '8자 이상이어야 합니다';
        color = 'var(--color-error)';
    } else if (!hasLetter || !hasNumber || !hasSpecial) {
        message = '영문, 숫자, 특수문자를 모두 포함해야 합니다';
        color = 'var(--color-error)';
    } else {
        // 기본 요구사항을 충족한 경우
        switch (strength) {
            case 3: case 4:
                message = '보통';
                color = 'orange';
                break;
            case 5:
                message = '강함';
                color = 'var(--color-success)';
                break;
        }
    }

    return {
        isValid: isValidPassword,
        message: message ? `비밀번호 강도: ${message}` : '',
        strength: strength,
        color: color
    };
}

// 인증코드 유효성 검사
function isValidVerificationCode(code) {
    return /^\d{6}$/.test(code);
}

// 서버에 아이디 중복 확인 요청
async function checkUsernameAvailability(username) {
    try {
        const response = await fetch(AppConfig.getApiUrl(`members/check-username?username=${encodeURIComponent(username)}`));
        const data = await response.json();
        
        return {
            available: data.data.available,
            message: data.data.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.',
            success: true
        };
    } catch (error) {
        console.error('아이디 검증 에러:', error);
        return {
            available: false,
            message: '서버 연결 오류. 다시 시도해주세요.',
            success: false
        };
    }
}

// 서버에 닉네임 중복 확인 요청
async function checkNicknameAvailability(nickname) {
    try {
        const response = await fetch(AppConfig.getApiUrl(`members/check-nickname?nickname=${encodeURIComponent(nickname)}`));
        const data = await response.json();
        
        return {
            available: data.data.available,
            message: data.data.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.',
            success: true
        };
    } catch (error) {
        console.error('닉네임 검증 에러:', error);
        return {
            available: false,
            message: '서버 연결 오류. 다시 시도해주세요.',
            success: false
        };
    }
}

// 서버에 닉네임 자동 생성 요청
async function generateNickname() {
    try {
        const response = await fetch(AppConfig.getApiUrl('members/generate-nickname'));
        const data = await response.json();
        
        if (response.ok && data.data) {
            return {
                nickname: data.data.nickname,
                success: true
            };
        } else {
            throw new Error('닉네임 생성에 실패했습니다.');
        }
    } catch (error) {
        console.error('닉네임 생성 에러:', error);
        return {
            nickname: null,
            success: false,
            message: error.message || '닉네임 생성에 실패했습니다.'
        };
    }
}

// 인증코드 전송 요청
async function sendVerificationCode(email) {
    try {
        const response = await fetch(AppConfig.getApiUrl('members/send-verification-code'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok && data.data.success) {
            return {
                success: true
            };
        } else {
            throw new Error(data.data.message || '인증코드 전송에 실패했습니다.');
        }
    } catch (error) {
        console.error('인증코드 전송 에러:', error);
        return {
            success: false,
            message: error.message || '인증코드 전송에 실패했습니다.'
        };
    }
}

// 이메일 인증 확인 요청
async function verifyEmail(email, verificationCode) {
    try {
        const response = await fetch(AppConfig.getApiUrl('members/verify-email'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                verificationCode
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.data.verified) {
            return {
                verified: true,
                message: data.data.message
            };
        } else {
            throw new Error(data.data.message || '인증코드가 유효하지 않습니다.');
        }
    } catch (error) {
        console.error('이메일 인증 에러:', error);
        return {
            verified: false,
            message: error.message || '이메일 인증에 실패했습니다.'
        };
    }
}

// 모듈로 내보내기
const Validators = {
    debounce,
    isValidUsername,
    isValidNickname,
    isValidEmail,
    validatePassword,
    isValidVerificationCode,
    checkUsernameAvailability,
    checkNicknameAvailability,
    generateNickname,
    sendVerificationCode,
    verifyEmail
};

/**
 * 회원 관련 유효성 검증 스크립트
 * 아이디, 비밀번호, 이메일 등 유효성 검증 및 API 호출 기능
 */

const Validators = (function() {
    // 디바운스 함수 구현
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    const result = func.apply(this, args);
                    resolve(result);
                }, wait);
            });
        };
    }
    
    // 아이디(username) 유효성 검사
    function isValidUsername(username) {
        // 영문자, 숫자, 언더스코어(_)만 허용, 4~50자
        const usernameRegex = /^[a-zA-Z0-9_]{4,50}$/;
        return usernameRegex.test(username);
    }
    
    // 닉네임 유효성 검사
    function isValidNickname(nickname) {
        // 한글, 영문자, 숫자만 허용, 2~50자
        const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,50}$/;
        return nicknameRegex.test(nickname);
    }
    
    // 비밀번호 유효성 검사
    function validatePassword(password) {
        // 비밀번호 정책: 영문, 숫자, 특수문자 조합 8자 이상
        if (!password) {
            return {
                isValid: false,
                message: '',
                color: ''
            };
        }
        
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        // 조건 충족 개수
        let conditionsMet = 0;
        if (hasLetter) conditionsMet++;
        if (hasNumber) conditionsMet++;
        if (hasSpecial) conditionsMet++;
        if (isLongEnough) conditionsMet++;
        
        // 비밀번호 강도 평가
        if (conditionsMet === 4) {
            return {
                isValid: true,
                message: '안전한 비밀번호입니다.',
                color: 'var(--color-success)'
            };
        } else if (conditionsMet === 3) {
            return {
                isValid: isLongEnough, // 길이 조건은 반드시 충족해야 함
                message: '보통 강도의 비밀번호입니다.',
                color: 'var(--color-warning)'
            };
        } else {
            let missingConditions = [];
            if (!hasLetter) missingConditions.push('영문자');
            if (!hasNumber) missingConditions.push('숫자');
            if (!hasSpecial) missingConditions.push('특수문자');
            if (!isLongEnough) missingConditions.push('8자 이상');
            
            return {
                isValid: false,
                message: `비밀번호에 ${missingConditions.join(', ')}가 필요합니다.`,
                color: 'var(--color-error)'
            };
        }
    }
    
    // 이메일 유효성 검사
    function isValidEmail(email) {
        // 기본적인 이메일 형식 검사
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    // 인증코드 유효성 검사
    function isValidVerificationCode(code) {
        // 6자리 숫자 확인
        return /^\d{6}$/.test(code);
    }
    
    // 아이디 중복 확인 API 호출
    async function checkUsernameAvailability(username) {
        try {
            const response = await fetch(AppConfig.getApiUrl(`members/check-username?username=${encodeURIComponent(username)}`));
            const data = await response.json();
            
            return {
                available: data.data?.available ?? false,
                message: data.data?.message || data.message || (data.data?.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
            };
        } catch (error) {
            console.error('아이디 중복 확인 에러:', error);
            return {
                available: false,
                message: '아이디 중복 확인 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 닉네임 중복 확인 API 호출
    async function checkNicknameAvailability(nickname) {
        try {
            const response = await fetch(AppConfig.getApiUrl(`members/check-nickname?nickname=${encodeURIComponent(nickname)}`));
            const data = await response.json();
            
            return {
                available: data.data?.available ?? false,
                message: data.data?.message || data.message || (data.data?.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.')
            };
        } catch (error) {
            console.error('닉네임 중복 확인 에러:', error);
            return {
                available: false,
                message: '닉네임 중복 확인 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 닉네임 자동 생성 API 호출
    async function generateNickname() {
        try {
            const response = await fetch(AppConfig.getApiUrl('members/generate-nickname'));
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '닉네임 생성에 실패했습니다.');
            }
            
            return {
                success: true,
                nickname: data.data.nickname
            };
        } catch (error) {
            console.error('닉네임 생성 에러:', error);
            return {
                success: false,
                message: error.message || '닉네임 생성 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 이메일 인증코드 전송 API 호출
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
            
            if (!response.ok) {
                throw new Error(data.message || '인증코드 전송에 실패했습니다.');
            }
            
            return {
                success: true,
                message: data.message || '인증코드가 전송되었습니다.'
            };
        } catch (error) {
            console.error('인증코드 전송 에러:', error);
            return {
                success: false,
                message: error.message || '인증코드 전송 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 이메일 인증 확인 API 호출
    async function verifyEmail(email, code) {
        try {
            const response = await fetch(AppConfig.getApiUrl('members/verify-email'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '이메일 인증에 실패했습니다.');
            }
            
            return {
                verified: true,
                message: data.message || '이메일 인증이 완료되었습니다.'
            };
        } catch (error) {
            console.error('이메일 인증 에러:', error);
            return {
                verified: false,
                message: error.message || '이메일 인증 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 공개 API
    return {
        debounce: debounce,
        isValidUsername: isValidUsername,
        isValidNickname: isValidNickname,
        validatePassword: validatePassword,
        isValidEmail: isValidEmail,
        isValidVerificationCode: isValidVerificationCode,
        checkUsernameAvailability: checkUsernameAvailability,
        checkNicknameAvailability: checkNicknameAvailability,
        generateNickname: generateNickname,
        sendVerificationCode: sendVerificationCode,
        verifyEmail: verifyEmail
    };
})();

// 모듈 내보내기
window.Validators = Validators;

// common-ui/resources/static/js/common.js

/**
 * 쿠키 관련 유틸리티 함수
 * 
 * 보안 강화를 위해 로컬스토리지에서 쿠키 방식으로 변경
 * 이상적으로는 HttpOnly 쿠키를 사용해야 하지만, 클라이언트에서 설정할 수 없으므로
 * 최소한 Secure 및 SameSite 플래그를 포함하여 구현
 */
const CookieUtil = {
    // 쿠키 설정
    setCookie: function(name, value, days, options = {}) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        } else if (options.maxAge) {
            expires = `; max-age=${options.maxAge}`;
        }
        
        const secure = options.secure ? '; Secure' : '';
        const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : '';
        const path = options.path ? `; path=${options.path}` : '; path=/';
        
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}${path}${secure}${sameSite}`;
    },
    
    // 쿠키 값 가져오기
    getCookie: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },
    
    // 쿠키 삭제
    deleteCookie: function(name, options = {}) {
        const path = options.path ? `; path=${options.path}` : '; path=/';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${path}`;
    }
};

/**
 * 인증 관련 유틸리티 함수
 */
const AuthUtil = {
    // 토큰 저장 - 쿠키 방식
    saveTokens: function(accessToken, refreshToken) {
        CookieUtil.setCookie('accessToken', accessToken, null, {
            maxAge: 3600, // 1시간
            secure: true,
            sameSite: 'Strict',
            path: '/'
        });
        
        CookieUtil.setCookie('refreshToken', refreshToken, null, {
            maxAge: 604800, // 7일
            secure: true,
            sameSite: 'Strict',
            path: '/'
        });
    },
    
    // 액세스 토큰 가져오기
    getAccessToken: function() {
        return CookieUtil.getCookie('accessToken');
    },
    
    // 리프레시 토큰 가져오기
    getRefreshToken: function() {
        return CookieUtil.getCookie('refreshToken');
    },
    
    // 로그아웃 - 토큰 삭제
    logout: function() {
        CookieUtil.deleteCookie('accessToken');
        CookieUtil.deleteCookie('refreshToken');
    },
    
    // 토큰의 페이로드 디코딩 (비안전한 비교용 기능)
    // 주의: 실제 사용시 서버 사이드에서 토큰 검증이 필요함
    parseToken: function(token) {
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('토큰 파싱 오류:', error);
            return null;
        }
    },
    
    // 토큰 만료 여부 확인 메소드
    isTokenExpired: function(token) {
        const payload = this.parseToken(token);
        if (!payload || !payload.exp) return true;
        
        const expirationTime = payload.exp * 1000; // 초를 밀리초로 변환
        return Date.now() >= expirationTime;
    }
};

// 전역에서 접근 가능하도록 설정
window.CookieUtil = CookieUtil;
window.AuthUtil = AuthUtil;

document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.querySelector('.btn-mobile-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // 초기 로딩 처리
    const initialLoading = document.querySelector('.initial-loading');
    // main-content에 loading 클래스가 있는지 확인
    const mainContent = document.querySelector('.main-content');
    
    // 두 로딩 스피너를 조정하기 위해 exchange 로딩 방식과 연동
    if (mainContent && mainContent.classList.contains('loading')) {
        // exchange 모듈이 로딩을 관리하고 있는 경우, 초기 로딩 숨기기
        if (initialLoading) {
            initialLoading.classList.remove('visible');
            initialLoading.style.display = 'none';
        }
    } else {
        // exchange 모듈이 로딩을 관리하지 않는 경우 (일반 페이지)
        if (initialLoading) {
            // 로딩이 완료되면 로딩 오버레이 숨기기
            setTimeout(() => {
                initialLoading.classList.remove('visible');
                // 0.3초 후 완전히 숨기기 (트랜지션 효과 후)
                setTimeout(() => {
                    initialLoading.style.display = 'none';
                }, 300);
            }, 500);
        }
    }
});
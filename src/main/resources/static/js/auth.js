/**
 * 인증 관련 기능 처리 스크립트
 * 로그인, 로그아웃, 토큰 관리 기능 구현
 */

const Auth = (function() {
    // 로그인 폼 초기화
    function initLoginForm() {
        const loginForm = document.querySelector('#loginForm');
        const loginModal = document.querySelector('#loginModal');
        const loginId = document.querySelector('#loginId');
        const loginPassword = document.querySelector('#loginPassword');
        const loginSubmitBtn = document.querySelector('#loginSubmitBtn');
        
        // 아이디, 비밀번호 입력에 따른 로그인 버튼 활성화/비활성화
        function checkLoginForm() {
            // 아이디 검증 - 4자 이상
            const validId = loginId.value.trim().length >= 4;
            // 비밀번호 검증 - 8자 이상
            const validPassword = loginPassword.value.length >= 8;
            
            // 두 값이 모두 필요
            loginSubmitBtn.disabled = !(validId && validPassword);
        }
        
        // 아이디/비밀번호 입력란 변화 감지
        if (loginId && loginPassword) {
            // 한글 입력 방지를 위한 추가 이벤트 처리
            loginId.addEventListener('input', function() {
                // 영문자, 숫자, 언더스코어만 남기고 나머지 제거
                const regex = /[^a-zA-Z0-9_]/g;
                if (regex.test(this.value)) {
                    this.value = this.value.replace(regex, '');
                }
                
                // 로그인 버튼 활성화 검사 호출
                checkLoginForm();
            });
            
            // 붙여넣기 제한
            loginId.addEventListener('paste', function() {
                setTimeout(() => {
                    // 영문자, 숫자, 언더스코어만 남기고 나머지 제거
                    this.value = this.value.replace(/[^a-zA-Z0-9_]/g, '');
                    // 입력 이벤트 트리거
                    checkLoginForm();
                }, 0);
            });
            
            loginId.addEventListener('input', checkLoginForm);
            loginPassword.addEventListener('input', checkLoginForm);
        }
        
        // 로그인 폼 제출 처리
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = {
                    username: this.loginId.value,
                    password: this.loginPassword.value
                };

                const modalLoading = document.querySelector('#modalLoading');
                
                try {
                    modalLoading.style.display = 'flex';
                    
                    const response = await fetch(AppConfig.getApiUrl('auth/login'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '로그인 실패');
                    }

                    const data = await response.json();
                    console.log('로그인 응답:', data);

                    // 로그인 성공 시 토큰 저장 - AuthUtil 사용
                    if (data.accessToken) {
                        AuthUtil.saveTokens(data.accessToken, data.refreshToken);
                    }
                    else if (data.data && data.data.accessToken) {
                        AuthUtil.saveTokens(data.data.accessToken, data.data.refreshToken);
                    }
                    else {
                        console.error('알 수 없는 로그인 응답 형식:', data);
                        throw new Error('토큰 응답 데이터가 올바르지 않습니다.');
                    }

                    // 로그인 성공 처리
                    Modal.toggle(loginModal, false);
                    setTimeout(() => {
                        // 페이지 새로고침 대신 UI를 동적으로 업데이트
                        updateUIAfterLogin(formData.username);
                    }, 300);

                } catch (error) {
                    console.error('로그인 에러:', error);
                    alert('로그인에 실패했습니다. ' + (error.message || '다시 시도해주세요.'));
                } finally {
                    modalLoading.style.display = 'none';
                }
            });
        }
    }

    // 로그인 후 UI 업데이트 함수
    async function updateUIAfterLogin(username) {
        try {
            // 사용자 정보 가져오기 API 호출
            const response = await fetch(AppConfig.getApiUrl('members/me'), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthUtil.getAccessToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('사용자 정보를 가져오는데 실패하였습니다.');
            }

            const userData = await response.json();
            const userInfo = userData.data; // 사용자 정보
            console.log('사용자 정보:', userInfo);

            // GNB 버튼 변경
            updateGNBButtons(userInfo);

            // 생략: 추가로 필요한 UI 업데이트 로직
            // 예: 사용자 프로필 표시, 알림 영역 업데이트 등

        } catch (error) {
            console.error('로그인 후 UI 업데이트 오류:', error);
        }
    }

    // GNB 내 버튼 업데이트 함수
    function updateGNBButtons(userInfo) {
        // 로그인/회원가입 버튼 요소 찾기
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');
        const gnbRight = document.querySelector('.gnb-right');
        const mobileMenuBtn = document.querySelector('.btn-mobile-menu');

        if (!gnbRight) return; // GNB 요소가 없는 경우

        // 기존 버튼을 제거
        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();

        // 로그아웃, 내정보 버튼 생성
        const myInfoBtn = document.createElement('button');
        myInfoBtn.className = 'btn-login btn-my-info'; // 로그인 버튼과 동일한 스타일 적용
        myInfoBtn.textContent = '내정보';
        myInfoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 내정보 페이지로 이동하거나 모달 표시 로직 추가
            window.location.href = '/mypage';
        });

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-signup btn-logout'; // 가입하기 버튼과 동일한 스타일 적용
        logoutBtn.textContent = '로그아웃';
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 로그아웃 처리
            handleLogout();
        });

        // 햄버거 버튼 앞에 버튼 추가
        if (mobileMenuBtn) {
            gnbRight.insertBefore(logoutBtn, mobileMenuBtn);
            gnbRight.insertBefore(myInfoBtn, logoutBtn);
        } else {
            // 또는 그냥 마지막에 추가
            gnbRight.appendChild(myInfoBtn);
            gnbRight.appendChild(logoutBtn);
        }
    }

    // 로그아웃 처리 함수
    function handleLogout() {
        // 로그아웃 API 호출
        const refreshToken = AuthUtil.getRefreshToken();
        if (refreshToken) {
            fetch(AppConfig.getApiUrl('auth/logout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthUtil.getAccessToken()}`
                },
                body: JSON.stringify({ refreshToken })
            }).catch(error => {
                console.error('로그아웃 API 오류:', error);
            });
        }

        // 로컬 토큰 삭제
        AuthUtil.logout();

        // 페이지 새로 고침
        window.location.reload();
    }

    // 페이지 로드 시 인증 상태 확인 및 UI 초기화
    async function initAuthStatus() {
        // 토큰 존재 여부 확인
        const accessToken = AuthUtil.getAccessToken();
        
        if (!accessToken) {
            // 미인증 상태 - 기본 UI 유지
            return;
        }
        
        try {
            // 토큰 유효성 확인 및 사용자 정보 가져오기
            const response = await fetch(AppConfig.getApiUrl('members/me'), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                // 사용자 정보 받아서 UI 업데이트
                updateGNBButtons(userData.data);
            } else {
                // 토큰이 유효하지 않으면 로그아웃 처리
                AuthUtil.logout();
            }
        } catch (error) {
            console.error('인증 상태 확인 오류:', error);
            // 오류 발생 시 토큰 삭제
            AuthUtil.logout();
        }
    }

    // 초기화 함수
    function init() {
        initLoginForm();
        initAuthStatus();
    }

    // 공개 API
    return {
        init: init,
        updateUI: updateUIAfterLogin,
        updateGNB: updateGNBButtons,
        logout: handleLogout
    };
})();

// 모듈 내보내기
window.Auth = Auth;

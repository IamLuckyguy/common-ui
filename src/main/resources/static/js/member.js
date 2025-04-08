/**
 * 회원 관련 기능 처리 스크립트
 * 로그인, 회원가입, 인증 관련 UI 로직 구현
 */
document.addEventListener('DOMContentLoaded', function() {
    // 모달 관련 기능 초기화
    function initModals() {
        // 모달 관련 요소
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');
        const loginModal = document.querySelector('#loginModal');
        const registerModal = document.querySelector('#registerModal');
        const showRegisterBtn = document.querySelector('#showRegisterBtn');
        const modalCloses = document.querySelectorAll('.modal-close');
        
        // 모달 토글 함수 - 애니메이션 추가
        function toggleModal(modal, show) {
            if (show) {
                // 모달 표시 시 애니메이션 추가
                modal.style.display = 'flex';
                // 강제 리플로우로 트랜지션 적용
                void modal.offsetWidth;
                modal.classList.add('active');
            } else {
                // 모달 숨기기 시 애니메이션 추가
                modal.classList.remove('active');
                
                // 애니메이션 완료 후 display 속성 변경
                setTimeout(() => {
                    if (!modal.classList.contains('active')) {
                        modal.style.display = 'none';
                    }
                }, 300); // 애니메이션 시간과 일치시킴
            }
        }

        // 모달 전환 함수 추가
        function switchToSignupModal() {
            // 로그인 모달 페이드 아웃
            loginModal.classList.remove('active');
            
            // 애니메이션 완료 후 모달 전환
            setTimeout(() => {
                loginModal.style.display = 'none';
                
                // 회원가입 모달 표시 (페이드 인)
                registerModal.style.display = 'flex';
                // 강제 리플로우로 트랜지션 적용
                void registerModal.offsetWidth;
                registerModal.classList.add('active');
            }, 300);
        }

        // 모달 외부 클릭시 닫기
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    toggleModal(this, false);
                }
            });
        });

        // 모달 닫기 버튼 이벤트
        modalCloses.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay');
                toggleModal(modal, false);
            });
        });

        // 로그인 버튼 클릭
        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleModal(loginModal, true);
            });
        }
        
        // 가입하기 버튼 클릭 - 바로 회원가입 모달 표시
        if (signupBtn && registerModal) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleModal(registerModal, true);
            });
        }

        // 회원가입 링크 클릭
        if (showRegisterBtn && registerModal) {
            showRegisterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                switchToSignupModal();
            });
        }
    }

    // 회원가입 폼 기능 초기화
    function initRegisterForm() {
        // 필요한 DOM 요소
        const regUsername = document.querySelector('#regUsername');
        const usernameHint = document.querySelector('#usernameHint');
        const usernameLoading = document.querySelector('#usernameLoading');
        
        const regNickname = document.querySelector('#regNickname');
        const nicknameHint = document.querySelector('#nicknameHint');
        const nicknameLoading = document.querySelector('#nicknameLoading');
        const generateNicknameBtn = document.querySelector('#generateNicknameBtn');
        
        const regPassword = document.querySelector('#regPassword');
        const passwordStrength = document.querySelector('#passwordStrength');
        const regPasswordConfirm = document.querySelector('#regPasswordConfirm');
        const passwordConfirmGroup = document.querySelector('#passwordConfirmGroup');
        const passwordConfirmHint = document.querySelector('#passwordConfirmHint');
        
        const regEmail = document.querySelector('#regEmail');
        const sendVerificationBtn = document.querySelector('#sendVerificationBtn');
        const verificationCode = document.querySelector('#verificationCode');
        const verifyCodeBtn = document.querySelector('#verifyCodeBtn');
        const verificationTimer = document.querySelector('#verificationTimer');
        
        const registerBtn = document.querySelector('#registerBtn');
        const registerForm = document.querySelector('#registerForm');
        
        // 타이머 변수
        let timerInterval;

        // 아이디 입력 필터링 및 유효성 검사
        if (regUsername) {
            // 키 입력 처리
            regUsername.addEventListener('keypress', function(e) {
                const char = String.fromCharCode(e.charCode);
                const pattern = /^[a-zA-Z0-9_]$/;
                
                if (!pattern.test(char)) {
                    e.preventDefault();
                }
            });
            
            // 입력값 변경 감지 
            regUsername.addEventListener('input', function() {
                const username = this.value.trim();
                
                // 인디케이터 표시 관리
                if (username) {
                    usernameLoading.style.display = 'block';
                    
                    // 기본 유효성 검사
                    if (!Validators.isValidUsername(username)) {
                        usernameHint.textContent = '영문자, 숫자, 언더스코어만 사용 가능합니다 (4~50자)';
                        usernameHint.style.color = 'var(--color-error)';
                    } else {
                        usernameHint.textContent = '유효한 형식의 아이디입니다.';
                        usernameHint.style.color = 'var(--color-success)';
                    }
                } else {
                    usernameLoading.style.display = 'none';
                    usernameHint.textContent = '';
                }
                
                // 디바운스된 중복 확인 API
                checkUsernameDebounced(username);
            });
            
            // 디바운스된 아이디 중복 체크 함수
            const checkUsernameDebounced = Validators.debounce(async function(username) {
                // 유효성 검사
                if (!username || !Validators.isValidUsername(username)) {
                    usernameLoading.style.display = 'none';
                    return;
                }
                
                // 서버에 중복 확인 요청
                const result = await Validators.checkUsernameAvailability(username);
                usernameLoading.style.display = 'none';
                
                usernameHint.textContent = result.message;
                usernameHint.style.color = result.available ? 
                    'var(--color-success)' : 'var(--color-error)';
                
            }, 1000);
        }

        // 닉네임 유효성 검사 및 중복 확인
        if (regNickname) {
            regNickname.addEventListener('input', function() {
                const nickname = this.value.trim();

                // 인디케이터 표시 관리
                if (nickname) {
                    nicknameLoading.style.display = 'block';

                    // 기본 유효성 검사
                    if (!Validators.isValidNickname(nickname)) {
                        nicknameHint.textContent = '닉네임은 2자 이상 50자 이하로 입력해주세요.';
                        nicknameHint.style.color = 'var(--color-error)';
                    } else {
                        nicknameHint.textContent = '유효한 형식의 닉네임입니다.';
                        nicknameHint.style.color = 'var(--color-success)';
                    }
                } else {
                    nicknameLoading.style.display = 'none';
                    nicknameHint.textContent = '';
                }

                // 디바운스된 중복 확인 API
                checkNicknameDebounced(nickname);
            });

            // 디바운스된 닉네임 중복 체크 함수
            const checkNicknameDebounced = Validators.debounce(async function(nickname) {
                // 유효성 검사
                if (!nickname || !Validators.isValidNickname(nickname)) {
                    nicknameLoading.style.display = 'none';
                    return;
                }

                // 서버에 중복 확인 요청
                const result = await Validators.checkNicknameAvailability(nickname);
                nicknameLoading.style.display = 'none';
                
                nicknameHint.textContent = result.message;
                nicknameHint.style.color = result.available ? 
                    'var(--color-success)' : 'var(--color-error)';
                
            }, 1000);

            // 닉네임 자동 생성
            if (generateNicknameBtn) {
                generateNicknameBtn.addEventListener('click', async function() {
                    const registerModalLoading = document.querySelector('#registerModalLoading');
                    
                    try {
                        registerModalLoading.style.display = 'flex';
                        
                        const result = await Validators.generateNickname();
                        
                        if (result.success) {
                            regNickname.value = result.nickname;
                            // 닉네임 변경 이벤트 발생시켜 유효성 검사 트리거
                            regNickname.dispatchEvent(new Event('input'));
                        } else {
                            throw new Error(result.message || '닉네임 생성에 실패했습니다.');
                        }
                    } catch (error) {
                        console.error('닉네임 생성 에러:', error);
                        alert(error.message || '닉네임 생성에 실패했습니다. 다시 시도해주세요.');
                    } finally {
                        registerModalLoading.style.display = 'none';
                    }
                });
            }
        }

        // 비밀번호 강도 체크
        if (regPassword && passwordStrength) {
            regPassword.addEventListener('input', function() {
                const password = this.value;
                
                if (!password) {
                    passwordStrength.textContent = '';
                    passwordConfirmGroup.style.display = 'none';
                    return;
                }

                // 비밀번호 유효성 검사
                const validationResult = Validators.validatePassword(password);
                
                // 비밀번호가 유효하면 비밀번호 확인란 표시
                passwordConfirmGroup.style.display = validationResult.isValid ? 'block' : 'none';
                
                // 강도 메시지 표시
                passwordStrength.textContent = validationResult.message;
                passwordStrength.style.color = validationResult.color;
                
                // 비밀번호 확인란에 입력값이 있으면 일치 여부 확인
                if (regPasswordConfirm.value) {
                    regPasswordConfirm.dispatchEvent(new Event('input'));
                }
            });
        }

        // 비밀번호 확인 일치 검사
        if (regPassword && regPasswordConfirm) {            
            regPasswordConfirm.addEventListener('input', function() {
                const password = regPassword.value;
                const confirm = this.value;
                
                if (!confirm) {
                    passwordConfirmHint.textContent = '';
                    return;
                }
                
                if (password === confirm) {
                    passwordConfirmHint.textContent = '비밀번호가 일치합니다.';
                    passwordConfirmHint.style.color = 'var(--color-success)';
                } else {
                    passwordConfirmHint.textContent = '비밀번호가 일치하지 않습니다.';
                    passwordConfirmHint.style.color = 'var(--color-error)';
                }
            });
        }

        // 이메일 유효성에 따라 인증버튼 활성화
        if (regEmail && sendVerificationBtn) {
            regEmail.addEventListener('input', function() {
                const email = this.value.trim();
                sendVerificationBtn.disabled = !Validators.isValidEmail(email);
            });
        }

        // 타이머 기능
        function startTimer(duration) {
            let timer = duration;
            clearInterval(timerInterval);

            timerInterval = setInterval(function() {
                const minutes = parseInt(timer / 60, 10);
                const seconds = parseInt(timer % 60, 10);

                verificationTimer.textContent =
                    (minutes < 10 ? "0" + minutes : minutes) + ":" +
                    (seconds < 10 ? "0" + seconds : seconds);

                if (--timer < 0) {
                    clearInterval(timerInterval);
                    verificationTimer.textContent = "시간 초과";
                    verifyCodeBtn.disabled = true;
                }
            }, 1000);
        }

        // 인증코드 전송
        if (sendVerificationBtn) {
            sendVerificationBtn.addEventListener('click', async function() {
                const email = regEmail.value.trim();
                
                if (!Validators.isValidEmail(email)) {
                    alert('유효한 이메일 주소를 입력해주세요.');
                    return;
                }
                
                const registerModalLoading = document.querySelector('#registerModalLoading');
                
                try {
                    registerModalLoading.style.display = 'flex';
                    sendVerificationBtn.disabled = true;
                    
                    const result = await Validators.sendVerificationCode(email);
                    
                    if (result.success) {
                        // 이메일 입력란 비활성화
                        regEmail.disabled = true;
                        
                        // 인증코드 입력란 표시
                        const verificationCodeContainer = document.querySelector('#verificationCodeContainer');
                        if (verificationCodeContainer) {
                            verificationCodeContainer.style.display = 'block';
                        }
                        
                        // 타이머 시작 (10분)
                        startTimer(10 * 60);
                    } else {
                        throw new Error(result.message || '인증코드 전송에 실패했습니다.');
                    }
                    
                } catch (error) {
                    console.error('인증코드 전송 에러:', error);
                    alert(error.message || '인증코드 전송에 실패했습니다. 다시 시도해주세요.');
                    sendVerificationBtn.disabled = false;
                } finally {
                    registerModalLoading.style.display = 'none';
                }
            });
        }

        // 인증코드 입력 처리
        if (verificationCode) {
            // 숫자만 입력 가능하도록 제한
            verificationCode.addEventListener('input', function() {
                // 숫자가 아닌 문자 제거
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // 6자리 입력 시 인증 버튼 활성화
                verifyCodeBtn.disabled = !Validators.isValidVerificationCode(this.value);
            });
            
            // 붙여넣기 시에도 숫자만 필터링
            verificationCode.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const filteredText = pastedText.replace(/[^0-9]/g, '').substring(0, 6);
                this.value = filteredText;
                
                // 6자리 입력 시 인증 버튼 활성화
                verifyCodeBtn.disabled = !Validators.isValidVerificationCode(this.value);
            });
        }
        
        // 이메일 인증 확인
        if (verifyCodeBtn) {
            verifyCodeBtn.addEventListener('click', async function() {
                const email = regEmail.value.trim();
                const code = verificationCode.value.trim();
                
                if (!Validators.isValidVerificationCode(code)) {
                    alert('6자리 인증코드를 입력해주세요.');
                    return;
                }
                
                const registerModalLoading = document.querySelector('#registerModalLoading');
                
                try {
                    registerModalLoading.style.display = 'flex';
                    
                    const result = await Validators.verifyEmail(email, code);
                    
                    if (result.verified) {
                        alert(result.message);
                        
                        // 타이머 중지 및 표시 변경
                        clearInterval(timerInterval);
                        verificationTimer.textContent = "인증완료";
                        verificationTimer.style.color = "var(--color-success)";
                        
                        // 인증 완료 상태 설정
                        verificationCode.dataset.verified = 'true';
                        
                        // 인증 입력란과 버튼 비활성화
                        verificationCode.disabled = true;
                        verifyCodeBtn.disabled = true;
                            
                        // 회원가입 버튼 활성화
                        registerBtn.disabled = false;
                    } else {
                        throw new Error(result.message || '인증코드가 유효하지 않습니다.');
                    }
                    
                } catch (error) {
                    console.error('이메일 인증 에러:', error);
                    alert(error.message || '이메일 인증에 실패했습니다. 다시 시도해주세요.');
                } finally {
                    registerModalLoading.style.display = 'none';
                }
            });
        }

        // 회원가입 버튼 처리
        if (registerBtn) {
            registerBtn.addEventListener('click', function() {
                // 필수 입력값 검증
                const username = regUsername.value.trim();
                const nickname = regNickname.value.trim();
                const password = regPassword.value;
                const passwordConfirmValue = regPasswordConfirm.value;
                const email = regEmail.value.trim();
                const verificationCodeValue = verificationCode.value.trim();

                if (!username || !nickname || !password || !passwordConfirmValue || !email || !verificationCodeValue) {
                    alert('모든 필수 항목을 입력해주세요.');
                    return;
                }

                if (password !== passwordConfirmValue) {
                    alert('비밀번호가 일치하지 않습니다.');
                    return;
                }
                
                // 회원가입 폼 제출 로직 실행
                registerForm.dispatchEvent(new Event('submit'));
            });
        }

        // 회원가입 제출
        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                // 인증 완료 여부 확인
                const isVerified = verificationCode && verificationCode.dataset.verified === 'true';
                
                if (!isVerified) {
                    alert('이메일 인증을 완료해주세요.');
                    return;
                }

                // 폼 데이터 준비
                const formData = {
                    username: regUsername.value.trim(),
                    nickname: regNickname.value.trim(),
                    password: regPassword.value,
                    email: regEmail.value.trim(),
                    emailVerificationCode: verificationCode.value.trim()
                };
                
                const registerModalLoading = document.querySelector('#registerModalLoading');
                const loginModal = document.querySelector('#loginModal');
                const registerModal = document.querySelector('#registerModal');

                try {
                    registerModalLoading.style.display = 'flex';

                    const response = await fetch(AppConfig.getApiUrl('members/register'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '회원가입 실패');
                    }

                    alert('회원가입이 완료되었습니다. 로그인해주세요.');
                    
                    // 로그인 모달로 전환
                    registerModal.classList.remove('active');
                    setTimeout(() => {
                        registerModal.style.display = 'none';
                        loginModal.style.display = 'flex';
                        void loginModal.offsetWidth;
                        loginModal.classList.add('active');
                    }, 300);

                    // 폼 초기화
                    this.reset();
                    
                    // 인증코드 입력란 숨기기
                    const verificationCodeContainer = document.querySelector('#verificationCodeContainer');
                    if (verificationCodeContainer) {
                        verificationCodeContainer.style.display = 'none';
                    }
                    
                    // 비밀번호 확인란 숨기기
                    passwordConfirmGroup.style.display = 'none';
                    
                    // 이메일 필드 활성화
                    regEmail.disabled = false;
                    
                    // 회원가입 버튼 비활성화
                    registerBtn.disabled = true;

                } catch (error) {
                    console.error('회원가입 에러:', error);
                    alert('회원가입에 실패했습니다. ' + (error.message || '다시 시도해주세요.'));
                } finally {
                    registerModalLoading.style.display = 'none';
                }
            });
        }
    }

    // 로그인 폼 기능 초기화
    function initLoginForm() {
        const loginForm = document.querySelector('#loginForm');
        const loginModal = document.querySelector('#loginModal');
        
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

                    // 토큰 로컬 스토리지에 저장
                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    // 로그인 성공 처리
                    loginModal.classList.remove('active');
                    setTimeout(() => {
                        loginModal.style.display = 'none';
                        // 페이지 새로고침
                        window.location.reload();
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

    // 각 기능 모듈 초기화
    initModals();
    initRegisterForm();
    initLoginForm();
});
/**
 * 회원가입 관련 기능 처리 스크립트
 * 회원가입 폼 검증, 이메일 인증, 아이디/닉네임 중복확인 등 기능 구현
 */

const Register = (function() {
    // 타이머 변수
    let timerInterval;

    // 회원가입 폼 기능 초기화
    function init() {
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
        
        initUsernameValidation(regUsername, usernameHint, usernameLoading);
        initNicknameValidation(regNickname, nicknameHint, nicknameLoading, generateNicknameBtn);
        initPasswordValidation(regPassword, passwordStrength, regPasswordConfirm, passwordConfirmGroup, passwordConfirmHint);
        initEmailValidation(regEmail, sendVerificationBtn, verificationCode, verifyCodeBtn, verificationTimer);
        initRegisterFormSubmission(registerBtn, registerForm);
    }

    // 아이디 유효성 검사 및 중복 확인 초기화
    function initUsernameValidation(regUsername, usernameHint, usernameLoading) {
        if (!regUsername) return;

        regUsername.addEventListener('input', function() {
            // 허용되지 않는 문자 필터링 (영문자, 숫자, 언더스코어만 허용)
            const regex = /[^a-zA-Z0-9_]/g;
            if (regex.test(this.value)) {
                // 현재 커서 위치 저장
                const cursorPos = this.selectionStart;
                // 문자 길이 저장
                const oldLength = this.value.length;
                
                // 허용되지 않는 문자 제거
                this.value = this.value.replace(regex, '');
                
                // 삭제된 문자 개수 계산
                const lengthDiff = oldLength - this.value.length;
                // 커서 위치 재조정
                this.setSelectionRange(cursorPos - lengthDiff, cursorPos - lengthDiff);
            }
            
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

    // 닉네임 유효성 검사 및 중복 확인 초기화
    function initNicknameValidation(regNickname, nicknameHint, nicknameLoading, generateNicknameBtn) {
        if (!regNickname) return;

        // 한글, 영문, 숫자만 허용
        // 한글 IME 입력 호환성을 위한 변수
        let isComposing = false;
        
        // IME 입력 시작 감지(한글 입력 시작)
        regNickname.addEventListener('compositionstart', function() {
            isComposing = true;
        });
        
        // IME 입력 완료 감지(한글 입력 완료)
        regNickname.addEventListener('compositionend', function() {
            isComposing = false;
            // 입력 완료 후 유효성 검사 실행
            processNicknameInput.call(this);
        });
        
        // 입력 처리 함수
        function processNicknameInput() {
            // 길이 제한
            if (this.value.length > 50) {
                this.value = this.value.substring(0, 50);
            }
            
            // 허용되지 않는 문자 필터링 (한글, 영문, 숫자만 허용)
            const regex = /[^a-zA-Z0-9가-힣]/g;
            if (regex.test(this.value)) {
                // 현재 커서 위치 저장
                const cursorPos = this.selectionStart;
                // 문자 길이 저장
                const oldLength = this.value.length;
                
                // 허용되지 않는 문자 제거
                this.value = this.value.replace(regex, '');
                
                // 삭제된 문자 개수 계산
                const lengthDiff = oldLength - this.value.length;
                // 커서 위치 재조정
                this.setSelectionRange(cursorPos - lengthDiff, cursorPos - lengthDiff);
            }
            
            const nickname = this.value.trim();

            // 인디케이터 표시 관리
            if (nickname) {
                nicknameLoading.style.display = 'block';

                // 기본 유효성 검사
                if (!Validators.isValidNickname(nickname)) {
                    nicknameHint.textContent = '닉네임은 한글, 영문, 숫자만 사용하여 2~50자 이내로 입력해주세요.';
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
        }
        
        // 일반 입력 이벤트 처리
        regNickname.addEventListener('input', function() {
            // IME 입력 중에는 처리하지 않음(한글 입력 중 간섭 방지)
            if (!isComposing) {
                processNicknameInput.call(this);
            }
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

    // 비밀번호 유효성 검사 초기화
    function initPasswordValidation(regPassword, passwordStrength, regPasswordConfirm, passwordConfirmGroup, passwordConfirmHint) {
        if (!regPassword || !passwordStrength) return;

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
            passwordConfirmGroup.style.display = validationResult.isValid ? 'flex' : 'none';
            
            // 강도 메시지 표시
            passwordStrength.textContent = validationResult.message;
            passwordStrength.style.color = validationResult.color;
            
            // 비밀번호 확인란에 입력값이 있으면 일치 여부 확인
            if (regPasswordConfirm.value) {
                regPasswordConfirm.dispatchEvent(new Event('input'));
            }
        });

        // 비밀번호 확인 일치 검사
        if (regPasswordConfirm) {            
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
    }

    // 이메일 인증 기능 초기화
    function initEmailValidation(regEmail, sendVerificationBtn, verificationCode, verifyCodeBtn, verificationTimer) {
        if (!regEmail || !sendVerificationBtn) return;

        // 이메일 유효성에 따라 인증버튼 활성화
        regEmail.addEventListener('input', function() {
            // 한글 및 다른 허용되지 않는 문자 제거
            const regex = /[^a-zA-Z0-9@._\-+]/g;
            
            // @ 문자 앞에 문자가 있는지 확인 및 처리
            if (this.value.indexOf('@') === 0) {
                // @ 문자가 제일 앞에 있는 경우, 제거
                this.value = this.value.substring(1);
            }
            
            // @ 문자 하나만 허용
            const atSymbols = this.value.match(/@/g);
            if (atSymbols && atSymbols.length > 1) {
                let firstAtPos = this.value.indexOf('@');
                this.value = this.value.substring(0, firstAtPos + 1) + 
                             this.value.substring(firstAtPos + 1).replace(/@/g, '');
            }
            
            if (regex.test(this.value)) {
                // 현재 커서 위치 저장
                const cursorPos = this.selectionStart;
                // 문자 길이 저장
                const oldLength = this.value.length;
                
                // 허용되지 않는 문자 제거
                this.value = this.value.replace(regex, '');
                
                // 삭제된 문자 개수 계산
                const lengthDiff = oldLength - this.value.length;
                // 커서 위치 재조정
                this.setSelectionRange(cursorPos - lengthDiff, cursorPos - lengthDiff);
            }
            
            // 이메일 유효성 검사
            const email = this.value.trim();
            sendVerificationBtn.disabled = !Validators.isValidEmail(email);
        });
        
        // 붙여넣기 제한
        regEmail.addEventListener('paste', function() {
            setTimeout(() => {
                // 허용되지 않는 문자 제거
                this.value = this.value.replace(/[^a-zA-Z0-9@._\-+]/g, '');
                // 유효성 검사 트리거
                const email = this.value.trim();
                sendVerificationBtn.disabled = !Validators.isValidEmail(email);
            }, 0);
        });

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
                        const registerBtn = document.querySelector('#registerBtn');
                        if (registerBtn) {
                            registerBtn.disabled = false;
                        }
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
    }

    // 회원가입 폼 제출 초기화
    function initRegisterFormSubmission(registerBtn, registerForm) {
        if (!registerBtn || !registerForm) return;

        // 회원가입 버튼 처리
        registerBtn.addEventListener('click', function() {
            // 필수 입력값 검증
            const regUsername = document.querySelector('#regUsername');
            const regNickname = document.querySelector('#regNickname');
            const regPassword = document.querySelector('#regPassword');
            const regPasswordConfirm = document.querySelector('#regPasswordConfirm');
            const regEmail = document.querySelector('#regEmail');
            const verificationCode = document.querySelector('#verificationCode');

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

        // 회원가입 제출
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const verificationCode = document.querySelector('#verificationCode');
            const loginModal = document.querySelector('#loginModal');
            const registerModal = document.querySelector('#registerModal');
            const regUsername = document.querySelector('#regUsername');
            const regNickname = document.querySelector('#regNickname');
            const regPassword = document.querySelector('#regPassword');
            const regEmail = document.querySelector('#regEmail');
            const passwordConfirmGroup = document.querySelector('#passwordConfirmGroup');

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
                Modal.switch(registerModal, loginModal);

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

    // 공개 API
    return {
        init: init
    };
})();

// 모듈 내보내기
window.Register = Register;

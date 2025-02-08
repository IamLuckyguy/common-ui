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

    // 로그인 모달
    const loginBtn = document.querySelector('.btn-login');
    const loginModal = document.querySelector('#loginModal');
    const modalClose = loginModal?.querySelector('.modal-close');

    if (loginBtn && loginModal) {
        // 로그인 버튼 클릭
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
        });

        // 모달 닫기 버튼
        modalClose?.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });

        // 모달 외부 클릭시 닫기
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // 로그인 폼 제출
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                loginId: this.loginId.value,
                loginPassword: this.loginPassword.value
            };

            try {
                const response = await fetch('https://gateway.kwt.co.kr/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('로그인 실패');
                }

                const data = await response.json();
                // 로그인 성공 처리
                loginModal.classList.remove('active');
                window.location.reload();

            } catch (error) {
                console.error('로그인 에러:', error);
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        });
    }
});
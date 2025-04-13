/**
 * 모달 관련 기능 처리 스크립트
 * 로그인, 회원가입 모달의 표시/숨김 기능 구현
 */

const Modal = (function() {
    // 모달 토글 함수 - 애니메이션 추가
    function toggleModal(modal, show) {
        if (!modal) return;
        
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

    // 모달 전환 함수
    function switchModal(fromModal, toModal) {
        // 현재 모달 페이드 아웃
        fromModal.classList.remove('active');
        
        // 애니메이션 완료 후 모달 전환
        setTimeout(() => {
            fromModal.style.display = 'none';
            
            // 새 모달 표시 (페이드 인)
            toModal.style.display = 'flex';
            // 강제 리플로우로 트랜지션 적용
            void toModal.offsetWidth;
            toModal.classList.add('active');
        }, 300);
    }

    // 모달 초기화
    function init() {
        // 모달 관련 요소
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup'); // GNB 가입하기 버튼
        const loginModal = document.querySelector('#loginModal');
        const registerModal = document.querySelector('#registerModal');
        const showRegisterBtn = document.querySelector('#showRegisterBtn');
        const modalCloses = document.querySelectorAll('.modal-close');
        
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
                console.log('가입하기 버튼 클릭');
                toggleModal(registerModal, true);
            });
        }

        // 회원가입 링크 클릭
        if (showRegisterBtn && registerModal && loginModal) {
            showRegisterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                switchModal(loginModal, registerModal);
            });
        }
    }

    // 공개 API
    return {
        init: init,
        toggle: toggleModal,
        switch: switchModal
    };
})();

// 모듈 내보내기
window.Modal = Modal;

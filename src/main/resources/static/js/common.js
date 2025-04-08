// common-ui/resources/static/js/common.js
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
    
    // 초기 로딩 처리 로직 추가
    const initialLoading = document.querySelector('.loading-overlay');
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
});
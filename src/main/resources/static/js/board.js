// 게시판 관련 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // 게시글 작성 영역 자동 높이 조절
    const writeInput = document.querySelector('.write-input');
    const submitButton = document.querySelector('.btn-submit-post');

    if (writeInput) {
        // 입력 내용에 따른 높이 자동 조절
        writeInput.addEventListener('input', function() {
            // 높이 초기화
            this.style.height = 'auto';
            // 스크롤 높이로 설정
            this.style.height = (this.scrollHeight) + 'px';

            // 버튼 활성화 상태 변경
            submitButton.disabled = this.value.trim().length === 0;
        });

        // 엔터 키 처리
        writeInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!submitButton.disabled) {
                    submitButton.click();
                }
            }
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', async function() {
            const content = writeInput.value.trim();
            if (!content) return;

            try {
                // TODO: 게시글 작성 API 호출
                console.log('게시글 작성:', content);

                // 입력창 초기화
                writeInput.value = '';
                writeInput.style.height = 'auto';
                submitButton.disabled = true;

            } catch (error) {
                console.error('게시글 작성 실패:', error);
                alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
            }
        });
    }

    // 탭 전환
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 활성 탭 변경
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // TODO: 탭에 따른 게시글 목록 불러오기
            const tabType = this.dataset.tab;
            loadPosts(tabType);
        });
    });

    // 더보기 버튼
    document.querySelectorAll('.btn-more').forEach(btn => {
        btn.addEventListener('click', function() {
            const postText = this.previousElementSibling;
            postText.classList.toggle('clamp');
            this.textContent = postText.classList.contains('clamp') ? '더보기' : '접기';
        });
    });

    // 좋아요 버튼
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', function() {
            const likeIcon = this.querySelector('.like-icon');
            const likeCount = this.querySelector('.like-count');
            const isLiked = likeIcon.textContent === '♥';

            likeIcon.textContent = isLiked ? '♡' : '♥';
            // TODO: 좋아요 API 호출
        });
    });

    // 댓글 폼 제출
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.comment-input');
            const comment = input.value.trim();

            if (comment) {
                // TODO: 댓글 작성 API 호출
                input.value = '';
            }
        });
    });
});

// 게시글 목록 불러오기 함수
async function loadPosts(tabType) {
    try {
        const response = await fetch(`/api/posts?type=${tabType}`);
        if (!response.ok) throw new Error('Failed to load posts');

        const posts = await response.json();
        // TODO: 게시글 목록 렌더링

    } catch (error) {
        console.error('Error loading posts:', error);
    }
}
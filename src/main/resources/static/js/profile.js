/**
 * 사용자 프로필 관련 기능 처리 스크립트
 * 사용자 프로필 정보 표시 및 수정 기능 구현
 */

const Profile = (function() {
    // 프로필 페이지 초기화
    function init() {
        initProfilePage();
        initProfileEditForm();
    }

    // 프로필 페이지 초기화
    function initProfilePage() {
        const profileContainer = document.querySelector('#profileContainer');
        if (!profileContainer) return;

        loadUserProfile();
    }

    // 사용자 프로필 데이터 로드
    async function loadUserProfile() {
        const profileLoading = document.querySelector('#profileLoading');
        const profileErrorMsg = document.querySelector('#profileErrorMsg');
        const profileData = document.querySelector('#profileData');
        
        if (!profileLoading || !profileErrorMsg || !profileData) return;
        
        try {
            profileLoading.style.display = 'flex';
            profileErrorMsg.style.display = 'none';
            profileData.style.display = 'none';
            
            // 사용자 정보 API 호출
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
            
            // 프로필 데이터 렌더링
            renderProfileData(userData.data);
            profileData.style.display = 'block';
            
        } catch (error) {
            console.error('프로필 로드 오류:', error);
            profileErrorMsg.textContent = error.message || '프로필 정보를 불러올 수 없습니다.';
            profileErrorMsg.style.display = 'block';
        } finally {
            profileLoading.style.display = 'none';
        }
    }

    // 프로필 데이터 렌더링
    function renderProfileData(userInfo) {
        const profileUsername = document.querySelector('#profileUsername');
        const profileNickname = document.querySelector('#profileNickname');
        const profileEmail = document.querySelector('#profileEmail');
        const profileCreatedAt = document.querySelector('#profileCreatedAt');
        const profileStatus = document.querySelector('#profileStatus');
        
        if (profileUsername) profileUsername.textContent = userInfo.username || '-';
        if (profileNickname) profileNickname.textContent = userInfo.nickname || '-';
        if (profileEmail) profileEmail.textContent = userInfo.email || '-';
        
        // 날짜 포맷팅
        if (profileCreatedAt && userInfo.createdAt) {
            const date = new Date(userInfo.createdAt);
            profileCreatedAt.textContent = date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // 상태 표시
        if (profileStatus) {
            let statusText = '-';
            let statusClass = '';
            
            switch (userInfo.status) {
                case 'ACTIVE':
                    statusText = '활성';
                    statusClass = 'status-active';
                    break;
                case 'INACTIVE':
                    statusText = '비활성';
                    statusClass = 'status-inactive';
                    break;
                case 'PENDING':
                    statusText = '대기중';
                    statusClass = 'status-pending';
                    break;
                case 'LOCKED':
                    statusText = '잠김';
                    statusClass = 'status-locked';
                    break;
                default:
                    statusText = userInfo.status || '-';
            }
            
            profileStatus.textContent = statusText;
            profileStatus.className = `profile-status ${statusClass}`;
        }
    }

    // 프로필 수정 폼 초기화
    function initProfileEditForm() {
        const profileEditBtn = document.querySelector('#profileEditBtn');
        const profileEditForm = document.querySelector('#profileEditForm');
        const profileEditModal = document.querySelector('#profileEditModal');
        const profileEditSubmitBtn = document.querySelector('#profileEditSubmitBtn');
        const profileEditCancelBtn = document.querySelector('#profileEditCancelBtn');
        
        if (!profileEditBtn || !profileEditForm) return;
        
        // 프로필 수정 버튼 클릭
        profileEditBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // 현재 사용자 정보 가져와서 폼에 채우기
            try {
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
                const userInfo = userData.data;
                
                // 폼 필드에 데이터 채우기
                const editNickname = document.querySelector('#editNickname');
                if (editNickname) editNickname.value = userInfo.nickname || '';
                
                // 모달 표시
                if (profileEditModal) {
                    Modal.toggle(profileEditModal, true);
                }
                
            } catch (error) {
                console.error('프로필 정보 로드 오류:', error);
                alert('프로필 정보를 불러올 수 없습니다. 다시 시도해주세요.');
            }
        });
        
        // 취소 버튼 클릭
        if (profileEditCancelBtn && profileEditModal) {
            profileEditCancelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                Modal.toggle(profileEditModal, false);
            });
        }
        
        // 프로필 수정 폼 제출
        if (profileEditForm) {
            profileEditForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const editNickname = document.querySelector('#editNickname');
                if (!editNickname) return;
                
                const nickname = editNickname.value.trim();
                if (!nickname) {
                    alert('닉네임을 입력해주세요.');
                    return;
                }
                
                const profileEditLoading = document.querySelector('#profileEditLoading');
                
                try {
                    if (profileEditLoading) profileEditLoading.style.display = 'flex';
                    
                    const response = await fetch(AppConfig.getApiUrl('members'), {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${AuthUtil.getAccessToken()}`
                        },
                        body: JSON.stringify({ nickname })
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '프로필 수정에 실패했습니다.');
                    }
                    
                    // 프로필 수정 성공
                    alert('프로필이 성공적으로 수정되었습니다.');
                    
                    // 모달 닫기
                    if (profileEditModal) {
                        Modal.toggle(profileEditModal, false);
                    }
                    
                    // 프로필 데이터 다시 로드
                    loadUserProfile();
                    
                } catch (error) {
                    console.error('프로필 수정 오류:', error);
                    alert('프로필 수정에 실패했습니다. ' + (error.message || '다시 시도해주세요.'));
                } finally {
                    if (profileEditLoading) profileEditLoading.style.display = 'none';
                }
            });
        }
    }

    // 공개 API
    return {
        init: init,
        loadProfile: loadUserProfile
    };
})();

// 모듈 내보내기
window.Profile = Profile;

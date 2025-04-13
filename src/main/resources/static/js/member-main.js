/**
 * 회원 관련 기능 통합 스크립트
 * 모든 회원 관련 모듈을 초기화하고 관리
 */

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모듈 초기화
    Modal.init();     // 모달 관련 기능 초기화
    Auth.init();      // 인증 관련 기능 초기화
    Register.init();  // 회원가입 관련 기능 초기화
    Profile.init();   // 프로필 관련 기능 초기화
    
    // 기타 회원 관련 기능 초기화
    initMemberFeatures();
});

// 추가적인 회원 관련 기능 초기화
function initMemberFeatures() {
    // 비밀번호 변경 기능 초기화
    initPasswordChange();
    
    // 회원 탈퇴 기능 초기화
    initMemberWithdrawal();
}

// 비밀번호 변경 기능 초기화
function initPasswordChange() {
    const passwordChangeBtn = document.querySelector('#passwordChangeBtn');
    const passwordChangeForm = document.querySelector('#passwordChangeForm');
    const passwordChangeModal = document.querySelector('#passwordChangeModal');
    
    if (!passwordChangeBtn || !passwordChangeForm) return;
    
    // 비밀번호 변경 버튼 클릭
    passwordChangeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (passwordChangeModal) {
            Modal.toggle(passwordChangeModal, true);
        }
    });
    
    // 비밀번호 변경 폼 제출
    passwordChangeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const currentPassword = document.querySelector('#currentPassword');
        const newPassword = document.querySelector('#newPassword');
        const newPasswordConfirm = document.querySelector('#newPasswordConfirm');
        
        if (!currentPassword || !newPassword || !newPasswordConfirm) return;
        
        // 필수 입력값 검증
        if (!currentPassword.value || !newPassword.value || !newPasswordConfirm.value) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // 새 비밀번호 유효성 검사
        const passwordValidation = Validators.validatePassword(newPassword.value);
        if (!passwordValidation.isValid) {
            alert(passwordValidation.message);
            return;
        }
        
        // 새 비밀번호 일치 확인
        if (newPassword.value !== newPasswordConfirm.value) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        
        const passwordChangeLoading = document.querySelector('#passwordChangeLoading');
        
        try {
            if (passwordChangeLoading) passwordChangeLoading.style.display = 'flex';
            
            const response = await fetch(AppConfig.getApiUrl('members/password'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthUtil.getAccessToken()}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword.value,
                    newPassword: newPassword.value
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.');
            }
            
            // 비밀번호 변경 성공
            alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
            
            // 모달 닫기
            if (passwordChangeModal) {
                Modal.toggle(passwordChangeModal, false);
            }
            
            // 로그아웃 처리
            setTimeout(() => {
                Auth.logout();
            }, 1000);
            
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            alert('비밀번호 변경에 실패했습니다. ' + (error.message || '다시 시도해주세요.'));
        } finally {
            if (passwordChangeLoading) passwordChangeLoading.style.display = 'none';
            
            // 폼 초기화
            passwordChangeForm.reset();
        }
    });
    
    // 취소 버튼 클릭
    const passwordChangeCancelBtn = document.querySelector('#passwordChangeCancelBtn');
    if (passwordChangeCancelBtn && passwordChangeModal) {
        passwordChangeCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            Modal.toggle(passwordChangeModal, false);
            passwordChangeForm.reset();
        });
    }
}

// 회원 탈퇴 기능 초기화
function initMemberWithdrawal() {
    const withdrawalBtn = document.querySelector('#withdrawalBtn');
    const withdrawalForm = document.querySelector('#withdrawalForm');
    const withdrawalModal = document.querySelector('#withdrawalModal');
    
    if (!withdrawalBtn || !withdrawalForm) return;
    
    // 회원 탈퇴 버튼 클릭
    withdrawalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (withdrawalModal) {
            Modal.toggle(withdrawalModal, true);
        }
    });
    
    // 회원 탈퇴 폼 제출
    withdrawalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const withdrawalPassword = document.querySelector('#withdrawalPassword');
        const withdrawalConfirm = document.querySelector('#withdrawalConfirm');
        
        if (!withdrawalPassword || !withdrawalConfirm) return;
        
        // 필수 입력값 검증
        if (!withdrawalPassword.value) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        
        // 탈퇴 확인 체크
        if (!withdrawalConfirm.checked) {
            alert('탈퇴 확인에 동의해주세요.');
            return;
        }
        
        // 최종 확인
        if (!confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }
        
        const withdrawalLoading = document.querySelector('#withdrawalLoading');
        
        try {
            if (withdrawalLoading) withdrawalLoading.style.display = 'flex';
            
            const response = await fetch(AppConfig.getApiUrl('members/me'), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthUtil.getAccessToken()}`
                },
                body: JSON.stringify({
                    password: withdrawalPassword.value
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.');
            }
            
            // 회원 탈퇴 성공
            alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
            
            // 모달 닫기
            if (withdrawalModal) {
                Modal.toggle(withdrawalModal, false);
            }
            
            // 로그아웃 처리
            Auth.logout();
            
        } catch (error) {
            console.error('회원 탈퇴 오류:', error);
            alert('회원 탈퇴에 실패했습니다. ' + (error.message || '다시 시도해주세요.'));
        } finally {
            if (withdrawalLoading) withdrawalLoading.style.display = 'none';
            
            // 폼 초기화
            withdrawalForm.reset();
        }
    });
    
    // 취소 버튼 클릭
    const withdrawalCancelBtn = document.querySelector('#withdrawalCancelBtn');
    if (withdrawalCancelBtn && withdrawalModal) {
        withdrawalCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            Modal.toggle(withdrawalModal, false);
            withdrawalForm.reset();
        });
    }
}

/**
 * 애플리케이션 설정 관리
 * 개발, 테스트, 운영 환경에 따라 호스트 주소를 구성
 */
const AppConfig = {
    // 현재 환경 (development, staging, production)
    ENV: 'development',
    
    // API 호스트 목록
    API_HOSTS: {
        development: 'http://localhost:8081',
        staging: 'https://stage-api.kwt.co.kr',
        production: 'https://api.kwt.co.kr'
    },
    
    // 환경에 따른 API 호스트 반환
    getApiHost: function() {
        return this.API_HOSTS[this.ENV] || this.API_HOSTS.development;
    },
    
    // 특정 서비스에 대한 API URL 생성
    getApiUrl: function(path) {
        return `${this.getApiHost()}/${path}`;
    }
};

// 배포 환경일 경우 production으로 설정 (HTML에 production 클래스가 있는지 확인)
if (document.documentElement.classList.contains('production')) {
    AppConfig.ENV = 'production';
} else if (document.documentElement.classList.contains('staging')) {
    AppConfig.ENV = 'staging';
}

// 전역에서 접근 가능하도록 설정
window.AppConfig = AppConfig; 
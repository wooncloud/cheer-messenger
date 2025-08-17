<script lang="ts">
  import { onMount } from 'svelte';
  import { canInstallPWA, showInstallPrompt, isPWAInstalled, isOnline, setupNetworkListener } from '$lib/pwa';
  
  let showInstallButton = false;
  let showUpdateButton = false;
  let isInstalled = false;
  let isOnlineStatus = true;
  let showOfflineToast = false;
  
  onMount(() => {
    // PWA 설치 상태 확인
    isInstalled = isPWAInstalled();
    showInstallButton = canInstallPWA() && !isInstalled;
    
    // 네트워크 상태 초기화
    isOnlineStatus = isOnline();
    
    // PWA 관련 이벤트 리스너
    const handleInstallable = () => {
      if (!isInstalled) {
        showInstallButton = true;
      }
    };
    
    const handleInstalled = () => {
      showInstallButton = false;
      isInstalled = true;
    };
    
    const handleUpdateAvailable = () => {
      showUpdateButton = true;
    };
    
    // 네트워크 상태 변경 리스너
    const handleOnline = () => {
      isOnlineStatus = true;
      showOfflineToast = false;
    };
    
    const handleOffline = () => {
      isOnlineStatus = false;
      showOfflineToast = true;
      // 3초 후 토스트 자동 숨김
      setTimeout(() => showOfflineToast = false, 3000);
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('pwa:installable', handleInstallable);
    window.addEventListener('pwa:installed', handleInstalled);
    window.addEventListener('pwa:updateavailable', handleUpdateAvailable);
    
    // 네트워크 리스너 설정
    const cleanupNetwork = setupNetworkListener(handleOnline, handleOffline);
    
    // 클린업
    return () => {
      window.removeEventListener('pwa:installable', handleInstallable);
      window.removeEventListener('pwa:installed', handleInstalled);
      window.removeEventListener('pwa:updateavailable', handleUpdateAvailable);
      cleanupNetwork();
    };
  });
  
  async function handleInstall() {
    const installed = await showInstallPrompt();
    if (installed) {
      showInstallButton = false;
      isInstalled = true;
    }
  }
  
  function handleUpdate() {
    window.location.reload();
  }
</script>

<!-- PWA 설치 버튼 -->
{#if showInstallButton && !isInstalled}
  <button
    on:click={handleInstall}
    class="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
    aria-label="앱 설치"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
    앱 설치
  </button>
{/if}

<!-- PWA 업데이트 버튼 -->
{#if showUpdateButton}
  <button
    on:click={handleUpdate}
    class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
    aria-label="앱 업데이트"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    새 버전 업데이트
  </button>
{/if}

<!-- 오프라인 인디케이터 -->
<div class="fixed top-4 right-4 z-40">
  <div id="online-status" class="hidden">
    <!-- 온라인/오프라인 상태는 JavaScript에서 제어 -->
  </div>
</div>

<style>
  /* PWA 설치 애니메이션 */
  @keyframes slideInFromBottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  button {
    animation: slideInFromBottom 0.3s ease-out;
  }
</style>
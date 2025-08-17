// PWA 관련 유틸리티 함수들

/**
 * Service Worker 등록
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    
    // Service Worker 업데이트 확인
    registration.addEventListener('updatefound', () => {
      console.log('Service Worker update found');
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 새 버전이 설치되었음을 사용자에게 알림
            showUpdateAvailable();
          }
        });
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * PWA 설치 가능 여부 확인 및 설치 프롬프트 표시
 */
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * PWA 설치 프롬프트 이벤트 리스너 등록
 */
export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // 설치 버튼 표시 등의 UI 업데이트
    showInstallButton();
  });
  
  // 앱이 설치되었을 때
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    hideInstallButton();
  });
}

/**
 * PWA 설치 프롬프트 표시
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }
  
  try {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    console.log('Install prompt result:', choiceResult.outcome);
    deferredPrompt = null;
    
    return choiceResult.outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt failed:', error);
    return false;
  }
}

/**
 * PWA 설치 가능 여부 확인
 */
export function canInstallPWA(): boolean {
  return deferredPrompt !== null;
}

/**
 * PWA 설치됨 여부 확인
 */
export function isPWAInstalled(): boolean {
  // Standalone mode에서 실행 중인지 확인
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
}

/**
 * 설치 버튼 표시 (실제 구현은 UI 컴포넌트에서)
 */
function showInstallButton() {
  // 커스텀 이벤트 발생시켜 UI 컴포넌트에서 처리
  window.dispatchEvent(new CustomEvent('pwa:installable'));
}

/**
 * 설치 버튼 숨김
 */
function hideInstallButton() {
  window.dispatchEvent(new CustomEvent('pwa:installed'));
}

/**
 * 업데이트 가능 알림 표시
 */
function showUpdateAvailable() {
  window.dispatchEvent(new CustomEvent('pwa:updateavailable'));
}

/**
 * Service Worker 업데이트 적용
 */
export function applyServiceWorkerUpdate() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
  
  // 페이지 새로고침
  window.location.reload();
}

/**
 * 오프라인 상태 확인
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 네트워크 상태 변경 감지
 */
export function setupNetworkListener(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // 클린업 함수 반환
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
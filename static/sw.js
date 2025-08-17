// Cheeract PWA Service Worker
const VERSION = '1.0.0';
const CACHE_NAME = `cheeract-v${VERSION}`;
const STATIC_CACHE_NAME = `cheeract-static-v${VERSION}`;
const DYNAMIC_CACHE_NAME = `cheeract-dynamic-v${VERSION}`;

// 허용된 도메인 목록 (보안 강화)
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://dmmgtcwrtjlwxgxmomrm.supabase.co'
];

// 캐시할 정적 리소스들
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/stats', 
  '/profile',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 캐시 만료 시간 설정 (밀리초)
const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7일
const MAX_CACHE_SIZE = 50; // 최대 캐시 항목 수

// 캐시 크기 제한 함수
async function limitCacheSize(cache, maxSize) {
  const keys = await cache.keys();
  if (keys.length > maxSize) {
    // 오래된 항목부터 삭제
    const sortedKeys = keys.sort((a, b) => {
      const aTime = a.headers.get('date') || '0';
      const bTime = b.headers.get('date') || '0';
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    });
    
    const deletePromises = sortedKeys
      .slice(0, keys.length - maxSize)
      .map(key => cache.delete(key));
    
    await Promise.all(deletePromises);
  }
}

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).catch((error) => {
      console.error('Failed to cache static assets:', error);
    })
  );
  
  // 새 service worker를 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 이전 버전의 캐시 삭제
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 모든 탭에서 새 service worker 제어
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 허용된 출처의 요청만 처리 (보안 강화)
  if (!ALLOWED_ORIGINS.includes(url.origin)) {
    return;
  }
  
  // API 요청은 네트워크 우선 전략 (보안을 위해 더 엄격한 검증)
  if (url.pathname.startsWith('/api/') || 
      url.hostname === 'dmmgtcwrtjlwxgxmomrm.supabase.co' || 
      url.hostname.endsWith('.supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공적인 응답을 동적 캐시에 저장
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 반환
          return caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 오프라인 페이지 반환 (향후 구현 가능)
            if (request.destination === 'document') {
              return caches.match('/');
            }
          });
        })
    );
    return;
  }
  
  // 정적 리소스는 캐시 우선 전략
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 캐시에 없으면 네트워크 요청
      return fetch(request).then((response) => {
        // 성공적인 응답을 캐시에 저장
        if (response.status === 200) {
          const responseClone = response.clone();
          
          // 정적 리소스는 정적 캐시에, 나머지는 동적 캐시에
          const cacheName = STATIC_ASSETS.includes(url.pathname) 
            ? STATIC_CACHE_NAME 
            : DYNAMIC_CACHE_NAME;
            
          caches.open(cacheName).then(async (cache) => {
            // 캐시 크기 제한 및 만료된 항목 정리
            await limitCacheSize(cache, MAX_CACHE_SIZE);
            cache.put(request, responseClone);
          });
        }
        
        return response;
      }).catch(() => {
        // 오프라인일 때 기본 페이지 반환
        if (request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});

// 백그라운드 동기화 (향후 확장 가능)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 백그라운드에서 처리할 작업
      console.log('Performing background sync...')
    );
  }
});

// 푸시 알림 처리 (향후 확장 가능)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 칭찬이 도착했습니다!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '보기',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Cheeract', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // 알림만 닫기
  } else {
    // 기본 동작: 앱 열기
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
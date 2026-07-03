// 那須ハイランドパークガイド — オフライン用サービスワーカー
const CACHE = "nasuhai-guide-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./map.jpg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];
// のりもの・食事の写真（無ければ静かにスキップ＝インストールは失敗させない）
const PHOTOS = [
  "./img/a1.jpg","./img/a2.jpg","./img/a3.jpg","./img/a4.jpg","./img/a7.jpg","./img/a8.jpg","./img/a9.jpg","./img/a10.jpg",
  "./img/a11.jpg","./img/a12.jpg","./img/a13.jpg","./img/a14.jpg","./img/a15.jpg","./img/a16.jpg","./img/a17.jpg","./img/a18.jpg",
  "./img/a19.jpg","./img/a20.jpg","./img/a21.jpg","./img/a22.jpg","./img/a23.jpg","./img/a24.jpg","./img/a25.jpg","./img/a26.jpg",
  "./img/a27.jpg","./img/a28.jpg","./img/a29.jpg","./img/a30.jpg","./img/a31.jpg","./img/a32.jpg","./img/a33.jpg","./img/a34.jpg",
  "./img/a35.jpg","./img/a36.jpg","./img/a37.jpg","./img/a38.jpg","./img/a39.jpg","./img/a40.jpg","./img/a41.jpg",
  "./img/rA.jpg","./img/rB.jpg","./img/rC.jpg","./img/rF.jpg","./img/rG.jpg","./img/rK.jpg",
  "./img/dA1.jpg","./img/dA2.jpg","./img/dA3.jpg","./img/dB1.jpg","./img/dB2.jpg","./img/dB3.jpg",
  "./img/dC1.jpg","./img/dC2.jpg","./img/dC3.jpg","./img/dF1.jpg","./img/dF2.jpg","./img/dF3.jpg",
  "./img/dG1.jpg","./img/dG2.jpg","./img/dG3.jpg","./img/dK1.jpg","./img/dK2.jpg","./img/dK3.jpg"
];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS).then(() => Promise.all(PHOTOS.map((p) => c.add(p).catch(() => {})))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});

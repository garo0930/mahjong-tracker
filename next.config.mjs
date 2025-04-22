import nextPwa from 'next-pwa';

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const config = {
  reactStrictMode: true,
  // 他のNext.js設定があればここに追加
};

export default withPWA(config);

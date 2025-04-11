import { withPWA } from 'next-pwa';

const config = {
  reactStrictMode: true,
  // 他に必要な設定があればここに追記
};

export default withPWA({
  ...config,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});

import nprogress from "nprogress";

/** 开始全屏加载进度条 */
export const beginFullLoading = () => {
  nprogress.start();
};

/** 结束全屏加载进度条 */
export const endFullLoading = () => {
  nprogress.done();
};

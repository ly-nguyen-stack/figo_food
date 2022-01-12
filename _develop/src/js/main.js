import 'picturefill';
import 'smoothscroll-for-websites';
import * as objectFitImages from 'object-fit-images';
// import { pathToRegexp } from 'path-to-regexp';

// js/tsどっちでもこんな感じで読めます
import VhController from './utils/logic/vh-controller';
import AnchorLink from './utils/ui/anchor-link';
import DeviceWatcher from './utils/logic/device-watcher';
import MatchHeight from './utils/match-height';

new VhController();

// break-pointによるPC/SP判別機能。 詳細はdevice-watcher.tsを見てみよう。
new DeviceWatcher();

/**
 * ページによってcode-splitされたJSを振り分ける仕組み
 *
 * @return {any} - module
 */
// const getComponent = async () => {
// const pathname = window.location.pathname;

// webpackChunkNameは重要で、その名前のjsが書き出されるのでページ毎に指定して下さい。
// 例） news/ なら webpackChunkName: "news"
// if (pathToRegexp('/').exec(pathname)) {
//   await import(/* webpackChunkName:"index" */ './pages/index/index').then((module) => {
//     new module.default();
//   });
// }

/* example
 * https://github.com/pillarjs/path-to-regexp
 * http://forbeslindesay.github.io/express-route-tester/
 * :aaa は何かしか変数のように入るの意。 e.g. /news/1/ => /news/:id/
 * :aaa? は何かしか変数が入るがoptional. e.g. /news/ or /news/1/ => /news/:id?/
 */
// };
export default class Main {
  constructor() {
    // アンカーリンク。固定ヘッダー分引くとかにも対応している。
    // 使い方はanchor-link.ts参照。
    new AnchorLink();
    objectFitImages();
    // getComponent();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Main();
});

window.addEventListener('load', () => {
  const el = document.querySelectorAll('.matchHeight');
  new MatchHeight(el);
});

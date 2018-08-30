/*
* @Author: pengweifu
* @Date:   2018-08-30 21:29:56
* @Last Modified by:   pengweifu
* @Last Modified time: 2018-08-30 22:09:54
*/
import template from './index.html';
import './style.less';

export default class {
  constructor(container) {
    this.container = container;
    this.load();
    this.container.addEventListener('onbeforeunload', () => {
      this.unload();
    });
  }

  load() {
    this.container.innerHTML = template;
  }

  unload() {
  }
}

// 引入 router
import router from '@/router';

// 引入 html 模板，会被作为字符串引入
import template from './index.html';
import Header from '@/components/header';

// 引入 css
import './style.less';

// 导出类
export default class {
  constructor(container) {
    this.container = container;
    this.load();
    this.container.addEventListener('onbeforeunload', () => {
      this.unload();
    });
  }

  load() {
    const wrapper = document.createElement('div');
    const head = document.createElement('div');
    const main = document.createElement('div');
    wrapper.classList.add('wrapper');
    head.classList.add('header');
    main.classList.add('main');

    new Header(head);
    main.innerHTML = template;
    wrapper.appendChild(head);
    wrapper.appendChild(main);
    this.container.innerHTML = '';
    this.container.appendChild(wrapper);
    this.container.querySelector('.foo').classList.add('fa', 'fa-fw', 'fa-home');
    this.container.querySelector('.foo__gobar').addEventListener('click', this.router);
  }

  unload() {
    this.container.querySelector('.foo__gobar').removeEventListener('click', this.router);
  }

  router() {
    router.go('/bar');
  }
}

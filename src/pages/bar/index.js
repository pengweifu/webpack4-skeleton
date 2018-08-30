import router from '@/router';
import template from './index.html';
import Header from '@/components/header';
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
    this.container.querySelector('.bar__gofoo').addEventListener('click', this.router);
  }

  unload() {
    this.container.querySelector('.bar__gofoo').removeEventListener('click', this.router);
  }

  router() {
    router.go('/foo');
  }
}

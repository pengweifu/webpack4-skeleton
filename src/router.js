// 引入页面文件
const routes = {
  '/foo': () => import('./pages/foo'),
  '/bar': () => import('./pages/bar'),
};

class Router {
  start() {
    window.addEventListener('popstate', () => {
      this.load(window.location.pathname);
    });

    this.load(window.location.pathname);
  }

  go(path) {
    window.history.pushState({}, '', path);
    this.load(path);
  }

  async load(path) {
    if (path === '/' || path === '' || path.indexOf('index.html') > -1) {
      this.path = '/bar';
    } else {
      this.path = path;
    }
    if (typeof routes[this.path] !== 'function') {
      console.log(routes[this.path], routes, this.path);
    } else {
      const View = (await routes[this.path]()).default;
      new View(document.getElementById('app'));
    }
  }
}

export default new Router();

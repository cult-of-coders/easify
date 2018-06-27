import EasyLoaderAgent, { LoaderEvents } from './EasyLoaderAgent';
import { Agent } from 'react-molecule';
import { observable, toJS } from 'mobx';

export default class EasyPagerAgent extends Agent {
  loaderAgent: EasyLoaderAgent;

  config: {
    agent: string;
    perPage: number;
    count(filters: any);
  };

  store: { total: number; currentPage: number; perPage: number } = observable({
    total: 0,
    currentPage: 0,
    perPage: null,
  });

  prepare() {
    const loaderAgent = this.molecule.getAgent(this.config.agent || 'loader');

    if (!loaderAgent) {
      throw new Error(`We could not find a loader agent in the molecule`);
    }

    this.loaderAgent = loaderAgent;

    this.store.perPage = this.config.perPage || 10;

    loaderAgent.on(LoaderEvents.LOADING, ({ options }) => {
      const { perPage, currentPage } = this.store;
      Object.assign(options, {
        limit: perPage,
        skip: currentPage * perPage,
      });
    });
  }

  init() {
    this.loaderAgent.on(LoaderEvents.SELECTORS_CHANGED, () => {
      this.changePage(0, false);
      this.count();
    });

    this.count();
  }

  count = () => {
    const loaderStore = toJS(this.loaderAgent.store);

    this.isDebug() && console.log('Counting with: ', loaderStore);

    this.config.count(loaderStore.filters).then(count => {
      this.store.total = count;
    });
  };

  clean() {
    // TODO: propper cleaning
  }

  changePage(number, andLoad = true) {
    this.store.currentPage = number;
    andLoad && this.loaderAgent.load();
  }

  changePerPage(number) {
    this.store.perPage = number;
    this.loaderAgent.load();
  }
}

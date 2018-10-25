import { Agent } from 'react-molecule';
import { observable, toJS } from 'mobx';
import EasyLoaderAgent, { LoaderEvents } from './EasyLoaderAgent';

class EasyLoadMoreAgent extends Agent {
  loaderAgent: EasyLoaderAgent;

  // This variable becomes true whenever the selectors inside the molecule change
  // It becomes false again after the data has been loaded
  duringSelectorsChangedProcess: boolean = false;

  config: {
    initialItemsCount: number;
    loadItemsCount: number;
    agent?: string;
    count: (filters) => Promise<number>;
  };

  store = observable({
    totalLoaded: 0,
    hasMore: undefined,
    totalCount: 0,
  });

  prepare() {
    const loaderAgent = this.molecule.getAgent(this.config.agent || 'loader');
    this.loaderAgent = loaderAgent;

    loaderAgent.on(LoaderEvents.LOADING, ({ options }) => {
      const { initialItemsCount, loadItemsCount } = this.config;

      // If the selectors have changed we basically need to fully reload the initial items count
      if (this.duringSelectorsChangedProcess) {
        Object.assign(options, {
          limit: initialItemsCount,
          skip: 0,
        });

        return;
      }

      const { totalLoaded } = this.store;

      Object.assign(options, {
        limit: totalLoaded === 0 ? initialItemsCount : loadItemsCount,
        skip: totalLoaded,
      });
    });

    loaderAgent.on(LoaderEvents.LOADED, payload => {
      const { data } = toJS(loaderAgent.store);

      if (!this.duringSelectorsChangedProcess) {
        payload.data = [...data, ...payload.data];
      } else {
        this.duringSelectorsChangedProcess = false;
      }

      this.store.totalLoaded = payload.data.length;
      this.updateHasMore();
    });
  }

  init() {
    this.loaderAgent.on(LoaderEvents.SELECTORS_CHANGED, () => {
      this.duringSelectorsChangedProcess = true;

      Object.assign(this.store, {
        totalLoaded: 0,
        hasMore: undefined,
        totalCount: 0,
      });

      this.count();
    });

    this.count();
  }

  count = () => {
    const loaderStore = toJS(this.loaderAgent.store);

    this.isDebug() &&
      console.log('Load-more counting for store: ', loaderStore);

    this.config.count(loaderStore.filters).then(count => {
      this.store.totalCount = count;
      this.updateHasMore();
    });
  };

  load() {
    return this.loaderAgent.load();
  }

  isLoading() {
    return this.loaderAgent.store.loading;
  }

  private updateHasMore() {
    this.store.hasMore = this.store.totalLoaded < this.store.totalCount;
  }
}

export default EasyLoadMoreAgent;

import { observable, toJS } from 'mobx';
import React, { Component } from 'react';
import { withMolecule, Agent } from 'react-molecule';
import PropTypes from 'prop-types';

export const LoaderEvents = {
  INIT: 'easify.loader.init.before',

  UPDATE: 'easify.loader.filters.update',
  OVERRIDE: 'easify.loader.filters.override',

  FILTERS_CHANGE: 'easify.loader.filters.change',
  OPTIONS_CHANGE: 'easify.loader.options.change',
  SELECTORS_CHANGE: 'easify.loader.selectors.change',
  SELECTORS_CHANGED: 'easify.loader.selectors.changed',

  LOADING: 'easify.loader.data.loading',
  LOADED: 'easify.loader.data.loaded',
  ERROR: 'easify.loader.data.error',
};

export type UpdateFilters = {
  filters?: any;
  options?: any;
};

export default class EasyLoaderAgent extends Agent {
  static Events = LoaderEvents;

  public store: any = observable({
    loading: true,
    data: [],
    error: null,
    filters: {},
    options: {},
  });

  prepare() {
    if (this.config.filters) {
      this.store.filters = this.config.filters;
    }
    if (this.config.options) {
      this.store.options = this.config.options;
    }
  }

  async init() {
    return this.load();
  }

  async load() {
    this.store.loading = true;

    const { filters, options } = toJS(this.store);

    this.emit(LoaderEvents.LOADING, { filters, options });

    // do loading
    try {
      this.isDebug() &&
        console.log(`Loader started loading with: `, { filters, options });

      const data = await this.config.load({
        filters,
        options,
      });

      const payload = { data };

      // Be careful here, we do it like this because we allow to modify the payload
      // It can end-up being quite different, like for example append results instead of storing them
      this.emit(LoaderEvents.LOADED, payload);

      Object.assign(this.store, {
        data: payload.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      Object.assign(this.store, {
        loading: false,
        error,
      });

      this.emit(LoaderEvents.ERROR, { error });
    }
  }

  override({ filters, options }: UpdateFilters) {
    const store = this.store;

    this.emit(LoaderEvents.SELECTORS_CHANGE, { filters, options });

    if (filters) {
      this.emit(LoaderEvents.FILTERS_CHANGE, { filters });
      store.filters = filters;
    }
    if (options) {
      this.emit(LoaderEvents.OPTIONS_CHANGE, { options });
      store.options = options;
    }

    this.load();
  }

  update({ filters, options }: UpdateFilters) {
    const store = this.store;

    this.emit(LoaderEvents.SELECTORS_CHANGE, { filters, options });

    if (filters) {
      this.emit(LoaderEvents.FILTERS_CHANGE, { filters });
      store.filters = Object.assign({}, store.filters, filters);
    }

    if (options) {
      this.emit(LoaderEvents.OPTIONS_CHANGE, { options });
      store.options = Object.assign({}, store.options, options);
    }

    this.emit(LoaderEvents.SELECTORS_CHANGED, { filters, options });

    this.load();
  }
}

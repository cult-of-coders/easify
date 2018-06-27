import { MoleculeModel } from 'react-molecule';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import './enzyme.config';
import { EasyLoaderAgent } from '../agents';
import { LoaderEvents } from './../agents/EasyLoaderAgent';
import { toJS } from 'mobx';

describe('EasyLoaderAgent', () => {
  it('Should load with propper configuration', done => {
    const agent = new EasyLoaderAgent({
      molecule: {} as MoleculeModel,
      filters: { test: 1 },
      options: { test: 2 },
      load: () =>
        new Promise<any>((resolve, reject) => {
          resolve([{ _id: 1, name: 'Johnas Smith' }]);
        }),
    });

    agent.prepare();

    assert.equal(1, agent.config.filters.test);
    assert.equal(2, agent.config.options.test);

    agent.on(LoaderEvents.LOADED, payload => {
      assert.lengthOf(payload.data, 1);
      agent.clean();
      done();
    });

    agent.on(LoaderEvents.ERROR, ({ error }) => {
      done(error);
    });

    agent.init();
  });

  it('Should properly work with override()', async () => {
    const dataSet1 = [{ _id: 1, name: 'Brown John' }];

    const dataSet2 = [{ _id: 2, name: 'Brown Smith' }];

    const agent = new EasyLoaderAgent({
      molecule: {} as MoleculeModel,
      filters: {
        context: 1,
      },
      load: ({ filters, options }) =>
        new Promise<any>((resolve, reject) => {
          resolve(filters.context === 1 ? dataSet1 : dataSet2);
        }),
    });

    await agent.init();

    const promise = new Promise((resolve, reject) => {
      agent.on(LoaderEvents.LOADED, payload => {
        try {
          assert.equal('Brown Smith', payload.data[0].name);
        } catch (e) {
          reject(e);
        }

        resolve();
      });
    });

    agent.override({
      filters: {
        context: 2,
      },
    });

    return promise;
  });

  it('Should properly work with update()', async () => {
    const dataSet1 = [{ _id: 1, name: 'Brown John' }];

    const dataSet2 = [{ _id: 2, name: 'Brown Smith' }];

    const agent = new EasyLoaderAgent({
      molecule: {} as MoleculeModel,
      filters: {
        context: 1,
      },
      load: ({ filters, options }) =>
        new Promise<any>((resolve, reject) => {
          resolve(filters.context && !filters.update ? dataSet1 : dataSet2);
        }),
    });

    await agent.init();

    const promise = new Promise((resolve, reject) => {
      agent.on(LoaderEvents.LOADED, payload => {
        try {
          assert.equal('Brown Smith', payload.data[0].name);
        } catch (e) {
          reject(e);
        }

        resolve();
      });
    });

    agent.update({
      filters: {
        update: true,
      },
    });

    return promise;
  });
});

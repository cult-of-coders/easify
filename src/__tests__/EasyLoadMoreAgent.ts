import { MoleculeModel } from 'react-molecule';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import './enzyme.config';
import { EasyLoaderAgent, EasyLoadMoreAgent } from '../agents';
import { LoaderEvents } from './../agents/EasyLoaderAgent';
import { toJS } from 'mobx';

describe('EasyLoadMore', () => {
  it('Should load with propper configuration', done => {
    done();

    // To implement
    return;

    const agents = {
      loader: molecule =>
        new EasyLoaderAgent({
          molecule: molecule,
          filters: { test: 1 },
          options: { test: 2 },
          load: () =>
            new Promise<any>((resolve, reject) => {
              resolve([{ _id: 1, name: 'Johnas Smith' }]);
            }),
        }),
      loadMore: molecule =>
        new EasyLoadMoreAgent({
          molecule,
          count: () => new Promise<number>((resolve, reject) => resolve(1000)),
        }),
    };

    const molecule = new MoleculeModel({
      agents,
    });

    molecule.init();

    const { loader, loadMore } = molecule.agents;
  });
});

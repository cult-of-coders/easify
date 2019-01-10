# Easify

[![Build Status](https://travis-ci.org/cult-of-coders/easify.svg?branch=master)](https://travis-ci.org/cult-of-coders/easify)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

The idea of easify is to simplify the following:

- Creating tables with sort and pagination
- Making life easy around building filters for your lists
- Creating lists of data with load more

Using [react-molecule](https://github.com/cult-of-coders/react-molecule) to power the awesomeness. Please make sure you understand how it works, so you can reason about this package as well.

Start toying around with it here: https://codesandbox.io/s/2l5lvl1nn

## Install

The peer dependencies:
`npm install --save react-molecule mobx mobx-react react-paginate simpl-schema`

The package:
`npm install --save easify`

## The Agents

So, our James Bonds are:

- Loader - handles data loading and updates his own internal store
- Pager - modifies options on Loader so that it behaves correctly
- LoadMore - modifies options on Loader so that it behaves correctly

So the pager and the loadMore agent act as plugins for the Loader, they hook into it to manipulate the `{filters, options}` and the data which is stored.

Here is how you can instantiate them:

```jsx
import { EasyLoaderAgent, EasyList } from 'easify';

// We have to pass a way to load the object to our easy loader, and that function needs to return a promise.
const load = ({ filters, options }) =>
  // The filters and options here can be from other agents
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          _id: 'XXX',
          name: 'John Smith',
        },
        {
          _id: 'YYY',
          name: 'John Brown',
        },
      ]);
    }, 500);
  });

const MyList = () => (
  <Molecule agents={{ loader: EasyLoaderAgent.factory({ load }) }}>
    <EasyList>
      {({ data, loading, molecule }) => {
        return data.map(item => <Item item={item} key={item._id} />);
      }}
    </EasyList>
  </Molecule>
);
```

We can now start interracting and have a Pagination for our EasyList:

```jsx
import { EasyLoaderAgent, EasyPagerAgent, EasyList, EasyPager } from 'easify';

const count = filters =>
  new Promise(({ resolve, reject }) => {
    setTimeout(() => {
      resolve(2);
    }, 500);
  });

const MyList = () => {
  const agents = {
    loader: EasyLoaderAgent.factory({ load }),
    pager: EasyPagerAgent.factory({ count, perPage: 10 }),
  };
  return (
    <Molecule agents={agents}>
      <EasyPager />
      <EasyList>
        {({ data, loading, molecule }) => {
          return data.map(item => <Item item={item} key={item._id} />);
        }}
      </EasyList>
    </Molecule>
  );
};
```

## EasyList & Load More

You can paginate, but you can also apply the load more concept like this:

```jsx
import {
  EasyLoaderAgent,
  EasyLoadMoreAgent,
  EasyList,
  EasyPager,
} from 'easify';

const MyList = () => {
  const agents = {
    loader: EasyLoaderAgent.factory({ load }),
    loadMore: EasyLoadMoreAgent.factory({
      count,
      initialItemsCount: 20,
      loadItemsCount: 10,
    }),
  };

  return (
    <Molecule agents={agents}>
      <EasyList>
        {({ data, loading, molecule }) => {
          return data.map(item => <Item item={item} key={item._id} />);
        }}
      </EasyList>

      <EasyLoadMore />
    </Molecule>
  );
};
```

## EasyTable & Pager

Most of the times you would want to use the `Pager` with an actual table.

`EasyTable` is a component that accepts a `model` which understands how to render the fields, and it also supports sorting.

```jsx
import {
  EasyLoaderAgent,
  EasyLoadMoreAgent,
  EasyList,
  EasyPagerAgent,
} from 'easify';

const tableModel = {
  // React needs to know the key of an array, so we need to uniquely identify an object
  key(({object})) {
    return item._id;
  },

  fields: [
    {
      label: 'First Name',
      resolve: 'firstName',
      sort: 'firstName' // The field it should sort on, if not specified it will not have sorting ability
    },
    {
      label: 'Id',
      // Resolve can also be a function that returns a React renderable
      resolve({ object }) {
        return <span className="make-it-red">{object._id}</span>
      }
    },
    {
      label: 'Actions',
      resolve({ object }) {
        return <a href={`/edit/${object._id}`}>Edit</a>;
      },
    }
  ],
}

const MyList = () => {
  const agents = {
    loader: EasyLoaderAgent.factory({ load }),
    pager: EasyPagerAgent.factory({ count }),
  };

  return (
    <Molecule agents={agents}>
      <EasyTable model={tableModel} />
      <EasyPager />
    </Molecule>
  );
};
```

## EasyFilters

Now it's time to filter, whether you want to search stuff or just have a bar with all sorts of filtering, you want this to be done nicely. Note that due to `react-molecule` nature, EasyFilters work with `EasyList` and `EasyTable` and `Pager`

We'll show first a simple example where we search stuff in an input:

```jsx
const MyList = () => {
  return (
    <Molecule agents={agents}>
      <EasyFilters>
        {({ doFilter }) => {
          return (
            <input
              placeholder="Type here to search"
              onKeyUp={e => doFilter({ name: e.target.value })}
            />
          );
        }}
      </EasyFilters>
      <hr />
      <EasyTable model={tableModel} />
      <EasyPager />
    </Molecule>
  );
};
```

The `doFilter` function will override the current existing filters on the LoaderAgent. And they will end-up in your `load()` function to reload the data again.

EasyFilters also supports `simpl-schema` definitions. Which can make it work very nicely with [uniforms](https://github.com/vazco/uniforms)

```jsx
import SimpleSchema from 'simpl-schema';
import { AutoForm } from 'uniforms/bootstrap4';

const FilterSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
    easify: {
      toFilter(value) {
        return {
          firstName: {
            $regex: value,
            $options: 'i',
          },
        };
      },
    },
  },
});

// We're passing the schema to EasyFilters as well, because it can read from the `toFilter`
// This makes your life super easy when you have large filter forms, or even when you have simple ones
// No matter how you choose to position them
const MyList = () => {
  return (
    <Molecule agents={agents}>
      <EasyFilters schema={FilterSchema}>
        {({ onSubmit }) => (
          <AutoForm onSubmit={onSubmit} schema={FilterSchema} />
        )}
      </EasyFilters>
      <hr />
      <EasyTable model={tableModel} />
      <EasyPager />
    </Molecule>
  );
};
```

## Hack the views

Almost all elements can be hackable. They are stored in the global registry meaning you can override them, for example, you want to override the Table Header ? No problem:

```jsx
import { Registry } from 'react-molecule';

Registry.blend({
  EasyTableHead: props => <thead className="myCustomTheadClass" {...props} />,
});
```

How did I find out the name ? Well, the easiest way is the use `React DevTools` to check the component name. And almost all components can be hacked. If not, you can look into the `atoms` folder and look for `registry.tsx` files.

## Conclusion ?

We're now engineering on a scale that should not be possible. We have to continue to make things simple, intuitive, and for everyone. We hope that easify is going to make your life easier!

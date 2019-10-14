# Easify

[![Build Status](https://travis-ci.org/cult-of-coders/easify.svg?branch=master)](https://travis-ci.org/cult-of-coders/easify)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Easify is API Agnostic and Extremely Hackable and helps you do the following:

- Creating simple lists with filters
- Creating tables with sort, pagination, search-bars, custom filters
- Creating load more lists

...by being **completely agnostic** to the way you fetch your data.

Start toying around with it here: https://codesandbox.io/s/2l5lvl1nn

## Install

The peer dependencies:
`npm install --save react-molecule mobx mobx-react simpl-schema`

The package:
`npm install --save easify`

## The Agents

[Agents](https://github.com/cult-of-coders/react-molecule/blob/master/docs/API.md#agent) are the part where we store logic. Easify brings you the mighty 3:

- Loader - handles data loading and updates his own internal store
- Pager - modifies options on Loader so that it behaves correctly
- LoadMore - modifies options on Loader so that it behaves correctly

A simple example is illustrated below, how from a `Promise` we render our data.

```jsx
import { molecule } from "react-molecule";
import { EasyLoaderAgent, EasyList } from "easify";

// We have to pass a way to load the object to our easy loader, and that function needs to return a promise.
const load = ({ filters, options }) =>
  // The filters and options here can be from other agents
  // Based on these filters you perform the api requests
  // For pagination inside options we pass {limit, skip}
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          _id: "XXX",
          name: "John Smith"
        },
        {
          _id: "YYY",
          name: "John Brown"
        }
      ]);
    }, 500);
  });

const MyList = molecule(
  () => {
    return {
      loader: EasyLoaderAgent.factory({ load })
    };
  },
  () => (
    <EasyList>
      {({ data, loading, molecule }) => {
        return data.map(item => <Item item={item} key={item._id} />);
      }}
    </EasyList>
  )
);
```

## Pagination

To add pagination, we need a way of counting the data, based on the same filters that data is being loaded against.

```jsx
import { EasyLoaderAgent, EasyPagerAgent, EasyList, EasyPager } from "easify";

const count = filters =>
  new Promise(({ resolve, reject }) => {
    setTimeout(() => {
      resolve(10);
    }, 500);
  });

const MyList = molecule(
  () => ({
    loader: EasyLoaderAgent.factory({ load }),
    pager: EasyPagerAgent.factory({ count, perPage: 10 })
  }),
  () => {
    return (
      <>
        <EasyPager />
        <EasyList>
          {({ data, loading, molecule }) => {
            return data.map(item => <Item item={item} key={item._id} />);
          }}
        </EasyList>
      </>
    );
  }
);
```

## Load More

If we want to build a list that contains load more, we simply swap-out Pager, and plug-in LoadMore agents and atoms.

```jsx
import {
  EasyLoaderAgent,
  EasyLoadMoreAgent,
  EasyList,
  EasyPager
} from "easify";

const MyList = molecule(
  () => {
    return {
      agents: {
        loader: EasyLoaderAgent.factory({ load }),
        loadMore: EasyLoadMoreAgent.factory({
          count,
          initialItemsCount: 20,
          loadItemsCount: 10
        })
      }
    };
  },
  () => {
    return (
      <>
        <EasyList>
          {({ data, loading, molecule }) => {
            return data.map(item => <Item item={item} key={item._id} />);
          }}
        </EasyList>

        <EasyLoadMore />
      </>
    );
  }
);
```

## EasyTable & Pager

A place where this package shows the powers of Molecule is when you build a reactive complex table.

`EasyTable` is a component that accepts a `model` which understands how to render the fields, and it also supports sorting.

```jsx
import {
  EasyLoaderAgent,
  EasyLoadMoreAgent,
  EasyList,
  EasyPagerAgent
} from "easify";

const tableModel = {
  // React needs to know the key of an array, so we need to uniquely identify an object
  key({ object }) {
    return object._id;
  },

  fields: [
    {
      label: "First Name",
      resolve: "firstName",
      sort: "firstName" // The field it should sort on, if not specified it will not have sorting ability
    },
    {
      label: "Id",
      // Resolve can also be a function that returns a React renderable
      resolve({ object }) {
        return <span className="make-it-red">{object._id}</span>;
      }
    },
    {
      label: "Actions",
      resolve({ object }) {
        return <a href={`/edit/${object._id}`}>Edit</a>;
      }
    }
  ]
};

const MyList = molecule(
  () => {
    return {
      agents: {
        loader: EasyLoaderAgent.factory({ load }),
        pager: EasyPagerAgent.factory({ count })
      }
    };
  },
  () => {
    return (
      <>
        <EasyTable model={tableModel} />
        <EasyPager />
      </>
    );
  }
);
```

## Filtering your data

Now it's time to filter, whether you want to search stuff or just have a bar with all sorts of filtering, you want this to be done nicely. Note that due to `react-molecule` nature, EasyFilters work with `EasyList` and `EasyTable` and `Pager`

We'll show first a simple example where we search stuff in an input:

```jsx
const MyList = () => {
  return (
    <>
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
    </>
  );
};
```

The `doFilter` function will override the current existing filters on the LoaderAgent. And they will end-up in your `load()` function to reload the data again.

EasyFilters also supports `simpl-schema` definitions. Which can make it work very nicely with [uniforms](https://github.com/vazco/uniforms)

```jsx
import SimpleSchema from "simpl-schema";
import { AutoForm } from "uniforms/bootstrap4";

const FilterSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
    easify: {
      toFilter(value) {
        return {
          firstName: {
            $regex: value,
            $options: "i"
          }
        };
      }
    }
  }
});

// We're passing the schema to EasyFilters as well, because it can read from the `toFilter`
// This makes your life super easy when you have large filter forms, or even when you have simple ones
// No matter how you choose to position them
const MyList = () => {
  return (
    <>
      <EasyFilters schema={FilterSchema}>
        {({ onSubmit }) => (
          // This form is created from your Schema
          <AutoForm onSubmit={onSubmit} schema={FilterSchema} />
        )}
      </EasyFilters>
      <hr />
      <EasyTable model={tableModel} />
      <EasyPager />
    </>
  );
};
```

## Hack the views

Almost all elements can be hackable, thanks to `Molecule registry`. They are stored in the global registry meaning you can override them, for example, you want to override the Table Header ? No problem:

```jsx
import { Registry } from "react-molecule";

Registry.blend({
  EasyTableHead: props => <thead className="myCustomTheadClass" {...props} />
});
```

How did I find out the name ? Well, the easiest way is the use `React DevTools` to check the component name. And almost all components can be hacked. If not, you can look into the `atoms` folder inside this repository and look for `registry.tsx` files.

## Conclusion

Feel free to submit issues if you want to improve anything.

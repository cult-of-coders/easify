import { Registry } from 'react-molecule';
import * as React from 'react';

Registry.blend({
  EasyLoadMoreButton: ({ loadMore, hasMore }) => {
    if (!hasMore) {
      return null;
    }

    return <button onClick={loadMore}>Load More!</button>;
  },
});

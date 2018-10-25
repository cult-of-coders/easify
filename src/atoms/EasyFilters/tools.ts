export function defaultToFilter(value, name) {
  if (Array.isArray(value)) {
    return {
      [name]: { $in: value },
    };
  }

  if (value instanceof Date) {
    let startOfDay = new Date(value.getTime());
    let endOfDay = new Date(value.getTime());

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      [name]: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
  }

  // Here we need to carefully prevent null from becoming an actual filter or an empty string
  if (value === '' || value === null) {
    return null;
  }

  return {
    [name]: value,
  };
}

export function getMongoFilters(schema, values) {
  let filters = {};

  for (let KEY in values) {
    const value = values[KEY];
    const easifyOptions = schema.get(KEY, 'easify') || {};

    const toFilter = easifyOptions.toFilter || defaultToFilter;
    const filter = toFilter(value, KEY, filters);

    // If it's a falsey value we don't assign anything.
    if (filter && typeof filter === 'object') {
      Object.assign(filters, {
        ...filter,
      });
    }
  }

  return filters;
}

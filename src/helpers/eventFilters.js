const startDateFilter = (a, b) => {
  if (a.startDate > b.startDate) { return 1; }
  if (a.startDate < b.startDate) { return -1; }
  return 0;
};

const eventTitleFilter = (a, b) => {
  if (a.title > b.title) return 1;
  if (a.title < b.title) return -1;
  return 0;
};

const filterEvents = (sortingFilter, events, ...argv) => {
  // by default, filter by the starting date in ascending order
  events.sort(startDateFilter);

  switch (sortingFilter) {
    case 'date-asc': {
      // return events.sort(startDateFilter);
      break;
    }

    case 'date-desc': {
      // return events.sort(startDateFilter).reverse();
      return events.reverse();
    }

    case 'title-asc': {
      return events.sort(eventTitleFilter);
    }

    case 'title-desc': {
      return events.sort(eventTitleFilter).reverse();
    }

    case 'chapter': {
      const chapterUuid = argv[0];
      if (chapterUuid.length < 1) return events;

      return events.filter(event => event.location.member.chapterUuid === chapterUuid);
    }

    case 'category': {
      const category = argv[1];
      if (category.length < 1) return events;

      return events.filter(event => event.category === category);
    }

    default: { // no-op to make eslint happy
      break;
    }
  }

  return events;
};

export default filterEvents;

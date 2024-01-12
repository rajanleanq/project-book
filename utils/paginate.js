const PaginateQuery = async (mongoQuery, req) => {
  let page = (req.query.page >= 1 ? req.query.page : 1) - 1;
  const resultsPerPage = req.query.results || 10;

  const results = await mongoQuery
    .limit(resultsPerPage)
    .skip(resultsPerPage * page);

  return {
    count: results.length,
    page: page + 1,
    data: results,
  };
};

export { PaginateQuery };

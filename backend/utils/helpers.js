const buildPagination = (page = 1, limit = 10) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

  return {
    offset: (safePage - 1) * safeLimit,
    limit: safeLimit,
    page: safePage,
  };
};

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  buildPagination,
  safeNumber,
};

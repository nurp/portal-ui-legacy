export const parseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

export const prepareViewerParams = (params, { location: { query } }) => ({
  after: query.after,
  first: parseIntParam(query.first, 20),
});

export const prepareNodeParams = params => ({
  id: params.id,
});

export default {
  parseIntParam,
  prepareViewerParams,
  prepareNodeParams,
};

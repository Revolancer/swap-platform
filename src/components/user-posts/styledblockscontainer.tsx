export const cleanBlockData = (data?: string) => {
  try {
    if (!data) {
      return {
        time: 1682956618189,
        blocks: [],
        version: '2.26.5',
      };
    }
    return JSON.parse(data)?.version ?? false
      ? JSON.parse(data)
      : {
          time: 1682956618189,
          blocks: [],
          version: '2.26.5',
        };
  } catch (err) {
    return {
      time: 1682956618189,
      blocks: [],
      version: '2.26.5',
    };
  }
};

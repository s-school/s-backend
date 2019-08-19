module.exports.save = async function(files, basepath, prefix) {
  return Promise.all(
    Object.keys(files).map(key => saveOne(files[key], basepath, prefix))
  );
};

const saveOne = async function(item, basepath, prefix) {
  return await saveAsync(item, basepath, prefix);
};

const saveAsync = async function(item, basepath, prefix) {
  return new Promise(function(resolve, reject) {
    const filename = `${prefix}___${item.name}`;
    const filepath = `${basepath}/${filename}`;

    const result = {
      path: filepath,
      type: item.type,
      name: item.name
    };

    item
      .mv(`public/${filepath}`)
      .then(() => resolve(result))
      .catch(err => reject(err));
  });
};

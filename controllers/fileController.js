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

    item
      .mv(filepath)
      .then(() => resolve(filepath))
      .catch(err => reject(err));
  });
};

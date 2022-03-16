const {
	compilerOptions: {paths},
} = require('./tsconfig.json');

const aliasImportGroup = Object.keys(paths).reduce((ret, k) => {
	const r = new RegExp(/\/\*$/);
	const key = k.replace(r, '');
	ret.push(`/^${key}/`);
	return ret;
}, []);

module.exports = {
  "extends": "next/core-web-vitals",
  "rules": {
    "eslintreact-hooks/exhaustive-deps": "off"
  }
}

module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb-base",
    "env": {
        "browser": true
    },
    "rules": {
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-plusplus": "off",
    }
};

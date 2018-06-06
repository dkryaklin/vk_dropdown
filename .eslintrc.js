module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb-base",
    "env": {
        "browser": true
    },
    "rules": {
        "semi": ["error", "never"],
        "no-console": ["error", { allow: ["warn", "error"] }]
    }
};

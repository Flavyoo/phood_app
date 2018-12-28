module.exports = {
    "moduleFileExtensions": ["js", "json", "vue"],
    "transform": {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "/Users/flavioandrade/Desktop/Website_Projects/phood_app/node_modules/babel-jest",
        "^.+\\.js$": "babel-jest",
    },
    "moduleNameMapper": {
      "^@/(.*)$": "/Users/flavioandrade/Desktop/Website_Projects/phood_app/src/$1"
  },
    "snapshotSerializers": [
      "jest-serializer-vue"
  ],
  "testURL": "http://localhost/",
};

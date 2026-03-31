const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("Total Likes", () => {
  const emptyList = [];

  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const biggerList = [
    { title: "React patterns", likes: 7 },
    { title: "Go To Statement Considered Harmful", likes: 5 },
    { title: "Canonical string reduction", likes: 12 },
  ];

  test(" of zero blogs", () => {
    const result=listHelper.totalLikes(emptyList);
    assert.strictEqual(result,0);
  });

  test(" of a single blog",()=>{
    const result=listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result,5)
  })

  test(" of a bigger list calculated right",()=>{
    const result=listHelper.totalLikes(biggerList);
    assert.strictEqual(result,24)
  })
});

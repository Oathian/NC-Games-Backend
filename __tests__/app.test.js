const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app.js");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
})

describe("getAllCategories", () => {
    test("status 200, getAllCategories returns an array of category objects with slug and description properties", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            });
        });
    });
});

describe("404 error message", () => {
    test("status 404, returns an error message when route does not exist", () => {
        return request(app)
        .get("/api/clifton-suspension-bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Route not found");
        });
    });
});

describe("404 error message", () => {
    test("status 404, returns an error message when route does not exist", () => {
        return request(app)
        .get("/api/clifton-suspension-bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Route not found");
        });
    });
});
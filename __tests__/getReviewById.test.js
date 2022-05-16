const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
})

describe("getReviewById", () => {
    test("status 200, getReviewById returns the corresponding category object", () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
            expect(review).toMatchObject({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(Number)
            });
        });
    });

    test("status 404, getReviewById is passed a number but there is no corresponding id", () => {
        return request(app)
        .get("/api/reviews/999999999")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    });

    test("status 400, getReviewById isn\'t passed a number", () => {
        return request(app)
        .get("/api/reviews/thisisnotanumber")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid ID");
        });
    });
});
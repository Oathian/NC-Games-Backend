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

describe("addVotes", () => {
    test("status 200, addVotes changes the votes of a review and returns the updated review", () => {
        const addedVotes = { inc_votes:20 };
        const updatedReview = {
            review_id: 1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 21
          }
        return request(app)
        .patch("/api/reviews/1")
        .send(addedVotes)
        .expect(200)
        .then(({ body: { review } }) => {
            expect(review).toMatchObject(updatedReview);
        });
    });

    test("status 400, addVotes is passed something that is not a number in the path", () => {
        const addedVotes = { inc_votes:20 };
        return request(app)
        .patch("/api/reviews/notanumber")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid path");
        });
    });

    test.only("status 400, addVotes is passed a non-number as the in_votes value", () => {
        const addedVotes = { inc_votes: "apples" };
        return request(app)
        .patch("/api/reviews/2")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Incorrect type");
        });
    });
});
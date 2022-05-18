const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app.js");
const testData = require("../db/data/test-data/index");

require("jest-sorted");

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

describe("/* 404 error message", () => {
    test("status 404, returns an error message when route does not exist", () => {
        return request(app)
        .get("/api/clifton-suspension-bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Route not found");
        });
    });
});

describe("getReviewById", () => {
    test("status 200, getReviewById returns the corresponding category object", () => {
        const testReview =   {
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5
          }
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
            expect(review).toMatchObject(testReview);
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
            expect(msg).toEqual("Invalid input");
        });
    });
});

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

    test("status 404, addVotes is passed a number but there is no corresponding id", () => {
        const addedVotes = { inc_votes:20 };
        return request(app)
        .patch("/api/reviews/9999")
        .send(addedVotes)
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    });

    test("status 400, addVotes is passed something that is not a number in the path", () => {
        const addedVotes = { inc_votes:20 };
        return request(app)
        .patch("/api/reviews/notanumber")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    });

    test("status 400, addVotes is passed a non-number as the in_votes value", () => {
        const addedVotes = { inc_votes: "apples" };
        return request(app)
        .patch("/api/reviews/2")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    });
});

describe("getAllUsers", () => {
    test("status 200, getAllUsers returns an array of user objects with username, name and avatar_url properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            });
        });
    });
});

describe("getReviewById comment count", () => {
    test("status 200, getReviewById returns the corresponding category object with a comment count", () => {
        const testReview =   {
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: "3"
          }
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
            expect(review).toMatchObject(testReview);
        });
    });
});

describe("getAllReviews", () => {
    test("status 200, getAllReviews returns an array of review objects with comment_count and all other properties", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {

            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(13);
            reviews.forEach((review) => {
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                });
            });
        });
    });

    test("status 200, getAllReviews returns an array of review objects sorted in descending order", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body : { reviews } }) => {
            expect(reviews).toBeSortedBy("created_at", { descending: true })
        });
    });
});

describe("getCommentsByReviewId", () => {
    test("status 200, getCommentsByReviewId returns an array of comment objects with all properties", () => {
        const commentsArray = [{
            comment_id: 1,
            body: 'I loved this game too!',
            votes: 16,
            author: 'bainesface',
            review_id: 2,
            created_at: "2017-11-22T12:43:33.389Z",
          },
          {
            comment_id: 4,
            body: 'EPIC board game!',
            votes: 16,
            author: 'bainesface',
            review_id: 2,
            created_at: "2017-11-22T12:36:03.389Z",
          },
          {
            comment_id: 5,
            body: 'Now this is a story all about how, board games turned my life upside down',
            votes: 13,
            author: 'mallionaire',
            review_id: 2,
            created_at: "2021-01-18T10:24:05.410Z",
          }]
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(3);
            expect(comments).toMatchObject(commentsArray);
        });
    });

    test("status 404, getCommentsByReviewId is passed a number but there is no corresponding id", () => {
        return request(app)
        .get("/api/reviews/99999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    })

    test("status 400, getCommentsByReviewId isn\'t passed a number", () => {
        return request(app)
        .get("/api/reviews/apple/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    })
    test("status 200, getCommentsByReviewId found review but no comments to show (array of 0)", () => {
        return request(app)
        .get("/api/reviews/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
        });
    })
});

describe("addComment", () => {
    test("status 201, addComment adds a comment to the comments db and returns added comment", () => {

        const testComment = { username: "bainesface", body: "I\'m not sure this is a real game..." };
        const commentOutput = { votes: 0, author: "bainesface", body: "I\'m not sure this is a real game..." }
        
        return request(app)
        .post("/api/reviews/5/comments")
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
            expect(comment).toMatchObject(commentOutput);
        });
    });

    test("status 404, addComment review_id in path does not exist", () => {

        const testComment = { username: "bainesface", body: "I wish we had this game :(" };

        return request(app)
        .post("/api/reviews/99999/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Resource not found");
        })
    })

    test("status 400, addComment body does not contain both mandatory keys", () => {

        const testComment = {};

        return request(app)
        .post("/api/reviews/6/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Invalid input");
        })

    })
    
    test("status 404, addComment a user not in the database tries to post", () => {

        const testComment = { username: "suspicious_person", body: "I shouldn\'t be here >:)" };

        return request(app)
        .post("/api/reviews/5/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Unknown user");
        })
    })
});
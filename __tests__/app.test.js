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
    test("status 200, getReviewById returns the corresponding review object", () => {
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

describe("getAllReviews queries", () => {
    test("status 200, getAllreviews when given a category as a query returns an array of reviews of that category", () => {
        const testReview =   {
            review_id: 2,
            title: 'Jenga',
            owner: 'philippaclaire9',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            category: 'dexterity',
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: "3"
          }
        return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(1);
            expect(reviews).toMatchObject([testReview]);
        })
    })

    test("status 200, getAllReviews when given a sort_by as a query returns an array of reviews sorted in DESC order", () => {
        return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(13);
            expect(reviews).toBeSortedBy("votes", { descending: true })
        })
    })

    test("status 200, getAllReviews when given an ASC order and a sort_by as a query returns an array of reviews sorted in ASC order", () => {
        return request(app)
        .get("/api/reviews?sort_by=comment_count&order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("comment_count", { ascending: true })
        })
    })

    test("status 200, getAllReviews returns an array of reviews sorted, ordered and filtered into the passed category", () => {
        return request(app)
        .get("/api/reviews?category=social_deduction&sort_by=votes&order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(11);
            expect(reviews).toBeSortedBy("votes", { ascending: true })
            reviews.forEach((review) => {
                expect(review).toMatchObject({
                    category: "social deduction"
                })
            })
        })
    })

    test("status 400, getAllReviews returns a bad request when passed an invalid sort_by query", () => {
        return request(app)
        .get("/api/reviews?sort_by=thebestestgames")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid sort by request");
        })
    })

    test("status 400, getAllReviews returns a bad request when passed an invalid order query", () => {
        return request(app)
        .get("/api/reviews?order=backwards")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid order request");
        })
    })

    test("status 404, getAllReviews returns a not found when passed a non-existent category query", () => {
        return request(app)
        .get("/api/reviews?category=apple")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        })
    })
})

describe("deleteCommentById", () => {
    test("status 204, deleteCommentById deletes a comment by a passed comment_id", () => {

        const check1 = request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(3);
        });
        //check how many comments a review has

        const del = request(app)
        .del("/api/comments/5")
        .expect(204)
        //delete a comment

        return Promise.all([check1, del]).then(() => {
            return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(2);
                comments.forEach((comment) => {
                    expect(comment.comment_id).not.toEqual(5);
                })
            });
        });
        //the length of the comment array should be 1 less as a comment was deleted, also no comment in the array has the id of the deleted comment

    });

    test("status 404, deleteCommentById returns an error when comment_id in the path does not exist", () => {
        return request(app)
        .delete("/api/comments/9999999")
        .expect(404)
        .then(({ body : { msg } }) => {
            expect(msg).toEqual("Resource not found");
        })
    });

    test("status 400, deleteCommentById returns an error when comment_id in the path is not a number", () => {
        return request(app)
        .delete("/api/comments/octopus")
        .expect(400)
        .then(({ body : { msg } }) => {
            expect(msg).toEqual("Invalid input");
        })
    });
});

describe("getEndpoints", () => {
    test("status 200, getEndpoints returns an object describing all endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: data }) => {

            expect(data).toMatchObject({
                "GET /api": {
                  "description": "serves up a json representation of all the available endpoints of the api"
                },
                "GET /api/categories": {
                  "description": "serves an array of all categories",
                  "queries": [],
                  "exampleResponse": {
                    "categories": [
                      {
                        "description": "Players attempt to uncover each other's hidden role",
                        "slug": "Social deduction"
                      }
                    ]
                  }
                },
                "GET /api/reviews": {
                  "description": "serves an array of all reviews",
                  "queries": ["category", "sort_by", "order"],
                  "exampleResponse": {
                    "reviews": [
                      {
                        "review_id": 7,
                        "title": "One Night Ultimate Werewolf",
                        "designer": "Akihisa Okui",
                        "owner": "happyamy2016",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "category": "hidden-roles",
                        "created_at": 1610964101251,
                        "votes": 5,
                        "comment_count": 0
                      }
                    ]
                  }
                },
                "GET /api/reviews/:review_id": {
                  "description": "serves a review object by review_id",
                  "queries": [],
                  "exampleResponse": {
                    "review": {
                        "review_id": 7,
                        "title": "One Night Ultimate Werewolf",
                        "designer": "Akihisa Okui",
                        "owner": "happyamy2016",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "category": "hidden-roles",
                        "created_at": 1610964101251,
                        "votes": 5,
                        "comment_count": 0
                      }
                  }
                },
                "GET /api/reviews/:review_id/comments": {
                  "description": "serves an array of comment objects by review_id",
                  "queries": [],
                  "exampleResponse": {
                    "comments": [
                      {
                        "comment_id": 1,
                        "body": "I loved this game too!",
                        "votes": 16,
                        "author": "bainesface",
                        "review_id": 2,
                        "created_at": "2017-11-22T12:43:33.389Z"
                      },
                      {
                        "comment_id": 4,
                        "body": "EPIC board game!",
                        "votes": 16,
                        "author": "bainesface",
                        "review_id": 2,
                        "created_at": "2017-11-22T12:36:03.389Z"
                      }
                    ]
                  }
                },
                "GET /api/users": {
                  "description": "serves an array of all users",
                  "queries": [],
                  "exampleResponse": {
                    "users": [
                      {
                        "username": "philippaclaire9",
                        "name": "philippa",
                        "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                      }
                    ]
                  }
                },
                "PATCH /api/reviews/:review_id": {
                  "description": "changes the votes and serves an updated review object",
                  "queries": [],
                  "body": ["inc_votes"],
                  "exampleResponse": {
                    "review": {
                      "review_id": 7,
                      "title": "One Night Ultimate Werewolf",
                      "designer": "Akihisa Okui",
                      "owner": "happyamy2016",
                      "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                      "category": "hidden-roles",
                      "created_at": 1610964101251,
                      "votes": 15,
                      "comment_count": 0
                    }
                  }
                },
                "POST /api/reviews/:review_id/comments": {
                  "description": "adds a comment to review by given review_id and serves written comment",
                  "queries": [],
                  "body": ["username", "body"],
                  "exampleResponse": {
                    "comment": { 
                      "votes": 0, 
                      "author": "bainesface", 
                      "body": "I'm not sure this is a real game..."}
                  }
                },
                "DELETE /api/comments/:comment_id": {
                  "description": "deletes a comment by comment_id"
                },
                "PATCH /api/comments/:comment_id": {
                    "description": "changes the votes and serves an updated comment object",
                    "queries": [],
                    "body": ["inc_votes"],
                    "exampleResponse": {
                      "review": {
                        body: 'I loved this game too!',
                        votes: 36,
                        author: 'bainesface',
                        review_id: 2,
                        created_at: "2017-11-22T12:43:33.389Z"
                      }
                    }
                  },
                "GET /api/users/:username": {
                  "description": "serves a user object by username",
                  "queries": [],
                  "exampleResponse": {
                    "users": {
                        "username": "philippaclaire9",
                        "name": "philippa",
                        "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                      }
                  }
                },
                "POST /api/users": {
                    "description": "adds a user to the db and serves the added user object",
                    "queries": [],
                    "body": ["username", "name", "avatar_url"],
                    "exampleResponse": {
                      "users": {
                          "username": "philippaclaire9",
                          "name": "philippa",
                          "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                        }
                    }
                },
                "POST /api/reviews": {
                    "description": "adds a review to the db and serves the added review object",
                    "queries": [],
                    "body": ["owner", "review_body", "title", "designer", "category"],
                    "exampleResponse": {
                      "review": {
                        "review_id": 14,
                        "title": "Great game",
                        "category": "social deduction",
                        "designer": "Someone else",
                        "owner": "mallionaire",
                        "review_body": "Hello, world!",
                        "review_img_url": "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                        "created_at": "2022-07-16T21:53:14.952Z",
                        "votes": 0
                      }
                    }
                },
                "DELETE /api/reviews/:review_id": {
                    "description": "deletes a review by review_id"
                },
                "POST /api/categories": {
                  "description": "adds a category to the db and serves the added category object",
                  "queries": [],
                  "body": ["slug", "description"],
                  "exampleResponse": {
                    "category": { 
                      "slug": "children's games", 
                      "description": "Games suitable for children"
                    }
                  }
                }
              })
        })
    })
})

describe("addCommentVotes", () => {
    test("status 200, addCommentVotes changes the votes of a comment and returns the updated comment", () => {
        const addedVotes = { inc_votes:20 };
        const updatedComment = {
            body: 'I loved this game too!',
            votes: 36,
            author: 'bainesface',
            review_id: 2,
            created_at: "2017-11-22T12:43:33.389Z",
          }
        return request(app)
        .patch("/api/comments/1")
        .send(addedVotes)
        .expect(200)
        .then(({ body: { newComment } }) => {
            
            expect(newComment).toMatchObject(updatedComment);
        });
    });

    test("status 404, addCommentVotes is passed a number but there is no corresponding id", () => {
        const addedVotes = { inc_votes:20 };
        return request(app)
        .patch("/api/comments/9999999")
        .send(addedVotes)
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    });

    test("status 400, addCommentVotes is passed something that is not a number in the path", () => {
        const addedVotes = { inc_votes:20 };
        return request(app)
        .patch("/api/comments/notanumber")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    });

    test("status 400, addCommentVotes is passed a non-number as the in_votes value", () => {
        const addedVotes = { inc_votes: "apples" };
        return request(app)
        .patch("/api/comments/2")
        .send(addedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    });
});

describe("getUserByUsername", () => {
    test("status 200, getUserByUsername returns the corresponding user object", () => {
        const testUser =   {
            username: 'mallionaire',
            name: 'haz',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          }
        return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then(({ body: { user } }) => {
            expect(user).toMatchObject(testUser);
        });
    });

    test("status 404, getUserByUsername is passed a username but there is no corresponding username", () => {
        return request(app)
        .get("/api/users/notausername")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    });
});

describe("postUser", () => {
    test("status 201, postUser adds a user to the users db and returns added user object", () => {

        const testUser = { username: "testUser", name: "test", avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg' };
        
        return request(app)
        .post("/api/users")
        .send(testUser)
        .expect(201)
        .then(({ body: { user } }) => {
            expect(user).toMatchObject(testUser);

            return request(app)
            .get("/api/users/testUser")
            .expect(200)
            .then(({ body: { user } }) => {
                expect(user).toMatchObject(testUser);
            });
        });
    });

    test("status 400, postUser body does not contain all mandatory keys", () => {

        const testUser = {};

        return request(app)
        .post("/api/users")
        .send(testUser)
        .expect(400)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Invalid input");
        });

    });
    
    test("status 400, postUser username is already taken", () => {

        const testUser = { username: "mallionaire", name: "test", avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg' };

        return request(app)
        .post("/api/users")
        .send(testUser)
        .expect(409)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Username already taken");
        });
    });
});

describe("postReview", () => {
    test("status 201, postReview adds a review to the reviews db and returns added review object", () => {

        const testReview = { owner: "mallionaire", review_body: "Hello, world!", title: "Great game", designer: "Someone else", category: "social deduction" };
        
        return request(app)
        .post("/api/reviews")
        .send(testReview)
        .expect(201)
        .then(({ body: { review } }) => {
            
            expect(review).toMatchObject(testReview);
            
            return request(app)
            .get(`/api/reviews/${review.review_id}`)
            .expect(200)
            .then(({ body: { review } }) => {
                expect(review).toMatchObject(testReview);
            });
        });
    });

    test("status 400, postReview body does not contain all mandatory keys", () => {

        const testReview = {};

        return request(app)
        .post("/api/reviews")
        .send(testReview)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });

    });

    test("status 404, postReview a user not in the database tries to post", () => {

        const testReview = { owner: "suspicious_person", review_body: "Hello, world!", title: "Great game", designer: "Someone else", category: "social deduction" };

        return request(app)
        .post("/api/reviews")
        .send(testReview)
        .expect(404)
        .then(({ body: {msg} }) => {
            expect(msg).toEqual("Unknown user");
        });
    });
});

describe("deleteReviewById", () => {
    test("status 204, deleteReviewById deletes a review by a passed review_id", () => {
        
        const testReview = {
            review_id: 12,
            title: "Scythe; you're gonna need a bigger table!",
            category: 'social deduction',
            designer: 'Jamey Stegmaier',
            owner: 'mallionaire',
            review_body: 'Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.',
            review_img_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
            created_at: '2021-01-22T10:37:04.839Z',
            votes: 100,
            comment_count: '0'
          };

        const check1 = request(app)
        .get("/api/reviews/12")
        .expect(200)
        .then(({ body: { review } }) => {
        
            expect(review).toMatchObject(testReview);
        });

        const del = request(app)
        .del("/api/reviews/12")
        .expect(204);

        return Promise.all([check1, del]).then(() => {
            return request(app)
            .get("/api/reviews/12")
            .expect(404)
            .then(({ body: { msg } }) => {

                expect(msg).toEqual("Resource not found");
            });
        });

    });

    test("status 404, deleteReviewById returns an error when review_id in the path does not exist", () => {
        return request(app)
        .delete("/api/reviews/9999999")
        .expect(404)
        .then(({ body : { msg } }) => {
            expect(msg).toEqual("Resource not found");
        });
    });

    test("status 400, deleteReviewById returns an error when review_id in the path is not a number", () => {
        return request(app)
        .delete("/api/reviews/octopus")
        .expect(400)
        .then(({ body : { msg } }) => {
            expect(msg).toEqual("Invalid input");
        });
    });
});

describe("postCategories", () => {
    test("status 201, postCategories adds a category to the categories db and returns added category object", () => {

        const testCategory = { slug: "Fun games", description: "So much fun" };
        
        return request(app)
        .post("/api/categories")
        .send(testCategory)
        .expect(201)
        .then(({ body: { category } }) => {
            
            expect(category).toMatchObject(testCategory);
        });
    });

    test("status 400, postCategories body does not contain all mandatory keys", () => {

        const testCategory = {};

        return request(app)
        .post("/api/categories")
        .send(testCategory)
        .expect(400)
        .then(({ body: { msg } }) => {

            expect(msg).toEqual("Invalid input");
        });

    });
});
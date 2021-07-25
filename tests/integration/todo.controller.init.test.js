const request = require("supertest");
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointUrl = '/todos/';

jest.setTimeout(80000);

let firstTodo;
let newTodoId;

describe(`${endpointUrl} endpoint`, () => {

    it("should get Todos", async () => {
        const response = await request(app).get(endpointUrl);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];

    })
    it("Get by Id" + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
    it("should throw error if todo id doesn't exist", async () => {
        const response = await request(app).get(endpointUrl + "60fbf4624af0632b9025d1ae");
        expect(response.statusCode).toBe(404);
    });

    it("post to /todos", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    });
    it("should return error 500 on post malformed data to " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done Property." });
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message: "Todo validation failed: done: Path `done` is required."
        })
    });
    it("PUT" + endpointUrl, async () => {
        const testData = { title: "test data", done: false };
        const response = await request(app).put(endpointUrl + newTodoId).send(testData);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
        expect(response.statusCode).toBe(200);
    });
    it("PUT return 404 for invalid id", async () => {
        const testData = { title: "test data", done: false };
        const response = await request(app).put(endpointUrl + "60fbf4538ef2932d41b5f0b0").send(testData);
        expect(response.statusCode).toBe(404);
    });
    it("DELETE" + endpointUrl, async () => {
        const testData = { title: "test data", done: false };
        const response = await request(app).delete(endpointUrl + newTodoId).send();
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
        expect(response.statusCode).toBe(200);
    });

    it("should return 404 error for invalid Id", async () => {
        const response = await request(app).delete(endpointUrl + "60fbf4538ef2939d41b5f0b0").send();
        expect(response.statusCode).toBe(404);
    })

})
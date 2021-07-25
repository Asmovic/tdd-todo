const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require("node-mocks-http");
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();

jest.mock('../../model/todo.model');

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("TodoController.getTodos", () => {
    it("Should have getTodos function", async () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });
    it("Should called TodoModel.find({})", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({})
    });
    it("Should return response with status 200 and all Todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("should handle error", async () => {
        const errorMessage = { message: "Error finding Todos" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe("TodoController.getTodoById", () => {
    it("should have getTodoById function", async () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });
    it("should call TodoModel.findById with route params", async () => {
        req.params.todoId = "60fbf4538ef2932d48b5f0b0";
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith("60fbf4538ef2932d48b5f0b0");
    });
    it("should return json body and response code 200", async () => {
        req.params.todoId = "60fbf4538ef2932d48b5f0b0";
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should handle error", async () => {
        const errorMessage = { message: "Error getting Data" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should return 404 if id doesn't exists", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe("TodoController.createTodo", () => {

    beforeEach(() => {
        req.body = newTodo;
    })
    it("should have createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });
    it("should call TodoModel.create", async () => {
        await TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });
    it("should return 201 status code", async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should handle error", async () => {
        const errorMessage = { message: "Done property should be called" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
});

describe("TodoController.updateTodo", () => {
    it("should have updateTodo function", async () => {
        expect(typeof TodoController.updateTodo).toBe("function");
    });
    it("should call TodoModel.findByIdAndUpdate with route params", async () => {
        req.params.todoId = "60fbf4538ef2932d48b5f0b0";
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith("60fbf4538ef2932d48b5f0b0", newTodo, {
            new: true,
            useFindAndModify: false
        })
    });
    it("should return response with json data and status code of 200", async () => {
        req.params.todoId = "60fbf4538ef2932d48b5f0b0";
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle error", async () => {
        const errorMessage = { message: "Error updating document." };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 error if TodoId doesn't exist", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
});

describe("TodoController.deleteTodo", () => {
    it("should have deleteTodo function", async () => {
        expect(typeof TodoModel.findByIdAndDelete).toBe("function");
    });
    it("should call TodoModel.findByIdAndDelete function", async () => {
        let todoId = "60fbf4538ef2932d48b5f0b0";
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    });
    it("should return status code 200 on deleting data", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle error", async () => {
        const errorMessage = { message: "Error finding Todos" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should return 404 error if id is invalid", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
})
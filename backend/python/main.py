from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client.todos_db
collection = db.todos

class ToDo(BaseModel):
    todoText: str


class Completed(BaseModel):
    completed: bool


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


todos = [
    {
        'id': 1,
        'todo': 'Handla tandkräm',
        'completed': False
    },
    {
        'id': 2,
        'todo': 'Gå hem till Bengt',
        'completed': True
    }
]

todo_id = 2

@app.get('/')
def index_get():
   return {
    'message': 'Hej hopp',
    'status': 'OK'
   } 


@app.get('/todos')
def todos_get():
    todos = list(collection.find())
    for todo in todos:
        del todo['_id']
    return todos


@app.post('/todos')
def todos_post(todo: ToDo):
    global todo_id
    todo_id += 1
    # todos.append({
    #     'id': todo_id,
    #     'todo': todo.todoText,
    #     'completed': False
    # })
    collection.insert_one({
         'id': todo_id,
         'todo': todo.todoText,
         'completed': False
     })
    return {'status': 'OK'}


@app.delete('/todos/{item_id}')
def todos_delete(item_id: int):
    idx = -1
    for i, todo in enumerate(todos):
        if todo['id'] == item_id:
            idx = i
    
    if idx > -1:
        todos.pop(idx)
    return {'status': 'OK'}


@app.patch('/todos/{item_id}')
def todos_patch(item_id: int, completed: Completed):
    for todo in todos:
        if todo['id'] == item_id:
            todo['completed'] = completed.completed
    return {'status': 'OK'}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', port=5000)
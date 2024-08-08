import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Response } from "./utils/response.js";

const database = new Database()


export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body
            const response = database.insert('tasks', {
                id: randomUUID().toString(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            })
            return res.writeHead(201).end(
                JSON.stringify(response)
            )
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {search} = req.queryParams

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)
            return res
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            const task = database.selectById('tasks', id)

            if (!task) {
                return Response(
                    res,
                    404,
                    {message: 'Not Found'}
                )
            }

            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body

            if (!title) {
                return Response(
                    res,
                    400,
                    {message: 'Title is required'}
                )
            }

            if (!description) {
                return Response(
                    res,
                    400,
                    {message: 'Description is required'}
                )
            }

            const task = database.selectById('tasks', id)

            if (!task) {
                return Response(
                    res,
                    404,
                    {message: 'Not Found'}
                )
            }

            const response = database.update(
                'tasks',
                id,
                {
                    ...task,
                    title,
                    description,
                    updated_at: new Date()
                }
            )
            return Response(res, 200, response)
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params

            const task = database.selectById(
                'tasks',
                id
            )

            if (!task) {
                return Response(
                    res,
                    404,
                    {message: 'Not Found'}
                )
            }

            const response = database.update(
                'tasks',
                id,
                {
                    ...task,
                    completed_at: task.completed_at ? null : new Date(),
                    updated_at: new Date()
                }
            )
            return Response(res, 200, response)
        }
    }
]
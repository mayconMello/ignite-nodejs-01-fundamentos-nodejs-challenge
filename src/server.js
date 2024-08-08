import http from 'node:http'
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-prams.js";
import { Response } from "./utils/response.js";


const server = http.createServer(
    async (req, res) => {
        const {method, url} = req

        try {

            await json(req, res)

            const route = routes.find(route => {
                return route.method === method &&
                    route.path.test(url)
            })

            if (route) {
                const routeParams = req.url.match(
                    route.path
                )
                const {query, ...params} = routeParams.groups
                req.params = params
                req.queryParams = query ? extractQueryParams(query) : {}
                return route.handler(req, res)
            }

            return Response(
                res,
                404,
                {message: 'Not Found'}
            )
        } catch (e) {
            console.log(e)
            return Response(
                res,
                500,
                {message: 'Internal Server Error'}
            )
        }
    })

server.listen(3333)

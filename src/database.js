import fs from 'node:fs/promises'

export class Database {
    #databaseFilename = '../db.json'

    #databasePath = new URL(
        this.#databaseFilename,
        import.meta.url
    )

    #database = {}


    constructor() {
        fs.readFile(
            this.#databasePath.pathname,
            'utf-8'
        ).then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }


    #persist() {
        fs.writeFile(
            this.#databasePath.pathname,
            JSON.stringify(this.#database)
        ).then(() => {
        })
    }

    select(table, search) {
        let data = this.#database[table] ?? []
        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key]
                        .toLowerCase()
                        .includes(
                            value.toLowerCase()
                        )
                })
            })
        }
        return data ?? []

    }

    selectById(table, id) {
        return this.#database[table].find(
            row => row.id === id
        )
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(
            row => row.id === id
        )
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
        }
        this.#persist()
    }

    update(table, id, data) {
        const newData = {id, ...data}
        const rowIndex = this.#database[table].findIndex(
            row => row.id === id
        )
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = newData
        }
        this.#persist()

        return newData
    }
}
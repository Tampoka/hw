type User = {
    id: number
    name: string
    age: number
}

type SortedBy<T> = {
    fieldName: keyof T
    direction: 'asc' | 'desc'
}

const users: User[] = [
    {id: 89, name: 'Dimych', age: 16},
    {id: 2, name: 'Bob', age: 49},
    {id: 6, name: 'Lena', age: 21},
    {id: 4, name: 'Anton', age: 34},
    {id: 9, name: 'Kori', age: 56},
    {id: 7, name: 'Joy', age: 64},
    {id: 3, name: 'lex', age: 3},
    {id: 5, name: 'Alex', age: 8},
]

const getSortedItems = <T>(items: T[], ...sortBy: SortedBy<T>[]) => {
    return [...items].sort((u1, u2) => {
            for (let sortConfig of sortBy) {
                if (u1[sortConfig.fieldName] < u2[sortConfig.fieldName]) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (u1[sortConfig.fieldName] > u2[sortConfig.fieldName]) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
            }
            return 0
        }
    )
}

console.log(getSortedItems(users,
    {fieldName: 'id', direction: 'asc'},
    {fieldName: 'name', direction: 'asc'},
    {fieldName: 'age', direction: 'desc'},
))
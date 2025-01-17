// ===== USER PARAMS
export type CreateUserParams = {
    userName: string
    firstName: string
    lastName: string
    email: string
}

export type UpdateUserParams = {
    userName: string
    firstName: string
    lastName: string
    email: string
}

// ===== EVENT PARAMS
export type CreateEventParams = {
    userName: string
    event: {
        title: string
        description: string
        timeDate: Date
    }
}
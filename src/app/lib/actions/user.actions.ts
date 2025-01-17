'use server'

import { CreateUserParams } from "../../../../types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model";

export const createUser = async (user: CreateUserParams) => {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log('there was an error creating a new user')
    }
}
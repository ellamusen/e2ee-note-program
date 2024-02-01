
import { Surreal } from 'surrealdb.js';

export const db = new Surreal();

export async function init() {

    try {
        // Connect to the database
        await db.connect('http://127.0.0.1:8000/rpc', {
            namespace: "notes",
            database: "notes"
        });
        
        // Select a specific namespace / database
        await db.use({ namespace: 'notes', database: 'notes' });

        // // Create a new person with a random id
        // let created = await db.create("person", {
        //     title: 'Founder & CEO',
        //     name: {
        //         first: 'Tobie',
        //         last: 'Morgan Hitchcock',
        //     },
        //     marketing: true,
        //     identifier: Math.random().toString(36).slice(2, 12),
        // });


        // // Select all people records
        // let people = await db.select("person");

        // console.log(people)

    } catch (e) {

        console.error('ERROR', e);

    }

}

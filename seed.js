
import db from './config/database.js';
import bcrypt from 'bcrypt';


const users = [
    {
        username: 'Ali',
        email: 'ali@gmail.com',
        password: 'Ali@12345'
    },
    {
        username: 'Ahmed',
        email: 'ahmed@gmail.com',
        password: 'Ahmed@12345'
    }
];


const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users
    (username, email, password_hash)
    VALUES (?, ?, ?)
`);

const findUser = db.prepare(`
    SELECT id FROM users WHERE email = ?
`);

for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);

    insertUser.run(
        user.username,
        user.email,
        hashedPassword
    );
}

console.log('Demo users inserted successfully!');


const ali = findUser.get('ali@gmail.com');
const ahmed = findUser.get('ahmed@gmail.com');


const documents = [
    {
        owner_id: ali.id,
        title: 'Ali Personal Notes',
        content: 'These are Ali personal notes.'
    },
    {
        owner_id: ali.id,
        title: 'Ali Project Details',
        content: 'Ali project information.'
    },
    {
        owner_id: ahmed.id,
        title: 'Ahmed Private Document',
        content: 'This document contains private information. CTF FLAG: FLAG{plain_idor_access_success}'
    },
    {
        owner_id: ahmed.id,
        title: 'Ahmed Account Information',
        content: 'This is Ahmed private account information.'
    }
];


const insertDocument = db.prepare(`
    INSERT INTO documents
    (owner_id, title, content)
    SELECT ?, ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM documents
        WHERE owner_id = ? AND title = ?
    )
`);

for (const document of documents) {
    insertDocument.run(
        document.owner_id,
        document.title,
        document.content,
        document.owner_id,
        document.title
    );
}

console.log('Demo documents inserted successfully!');


const challenges = [
    {
        title: 'Plain IDOR',
        slug: 'plain-idor',
        description: 'Access another user document by manipulating its numeric ID.',
        flag: 'FLAG{plain_idor_access_success}'
    },
    {
        title: 'Encoded IDOR',
        slug: 'encoded-idor',
        description: 'Discover why encoding document references does not provide authorization.',
        flag: 'FLAG{encoded_idor_access_success}'
    }
];

const insertChallenge = db.prepare(`
    INSERT OR IGNORE INTO challenges
    (title, slug, description, flag_value)
    VALUES (?, ?, ?, ?)
`);

for (const challenge of challenges) {
    insertChallenge.run(
        challenge.title,
        challenge.slug,
        challenge.description,
        challenge.flag
    );
}

console.log('CTF challenges inserted successfully!');

console.log('\nDatabase seeding completed!');

db.close();

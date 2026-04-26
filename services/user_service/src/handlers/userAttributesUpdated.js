import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async function handleUserUpdated(event)
{
    const {
        user_id,
        weight,
        height,
        age
    } = event;

    try {
        await pool.query(
        ` UPDATE user_profile
        SET
          weight = $1,
          height = $2,
          age = $3
        WHERE user_id = $4 `,
        [
            weight,
            height,
            age,
            user_id
        ]
        );
        console.log(`User Profile has been updated`);

    } catch (error) {
        console.error("Error updating the profile: ", error);
    }
}
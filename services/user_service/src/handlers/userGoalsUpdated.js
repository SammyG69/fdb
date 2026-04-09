import pkg from 'pkg';
const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async function handleUserGoals(event)
{
    const {
        user_id,
        weight,
        height,
        age
    } = event;

        try {
        await pool.query(
        ` UPDATE user_goals
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
        console.log(`User Goals has been updated`);

    } catch (error) {
        console.error("Error updating the Goals: ", error);
    }
}
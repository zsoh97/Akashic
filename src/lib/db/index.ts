import { Sequelize } from "sequelize";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

// The connection string from Supabase will look like:
// postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: "postgres",
	logging: false, // Set to console.log to see SQL queries
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false, // Required for Heroku/Supabase
		},
	},
});

// Test the connection
sequelize
	.authenticate()
	.then(() => console.log("Database connection established"))
	.catch((err) => console.error("Unable to connect to database:", err));

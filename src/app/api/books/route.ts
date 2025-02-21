import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");

	try {
		let results;
		if (query) {
			results = await db
				.select()
				.from(books)
				.where(
					sql`${books.title} ILIKE ${`%${query}%`} OR ${
						books.author
					} ILIKE ${`%${query}%`}`
				)
				.limit(10);
		} else {
			results = await db.select().from(books).limit(10);
		}
		return NextResponse.json(results);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch books" },
			{ status: 500 }
		);
	}
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { data: book, error } = await supabase
			.from("books")
			.select("*")
			.eq("id", params.id)
			.single();

		if (error) throw error;

		if (!book) {
			return NextResponse.json({ error: "Book not found" }, { status: 404 });
		}

		return NextResponse.json(book);
	} catch (error) {
		console.error("Error fetching book:", error);
		return NextResponse.json(
			{ error: "Failed to fetch book" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json();

		const { data: book, error } = await supabase
			.from("books")
			.update(body)
			.eq("id", params.id)
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json(book);
	} catch (error) {
		console.error("Error updating book:", error);
		return NextResponse.json(
			{ error: "Failed to update book" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { error } = await supabase
			.from("books")
			.delete()
			.eq("id", params.id);

		if (error) throw error;

		return NextResponse.json({ message: "Book deleted successfully" });
	} catch (error) {
		console.error("Error deleting book:", error);
		return NextResponse.json(
			{ error: "Failed to delete book" },
			{ status: 500 }
		);
	}
}

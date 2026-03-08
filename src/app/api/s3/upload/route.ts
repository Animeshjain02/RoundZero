import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "This upload route is deprecated. Use the authenticated media router instead.",
    },
    { status: 410 },
  );
}

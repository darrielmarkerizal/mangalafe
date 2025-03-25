import { getConnection, testConnection } from "../../../../config/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isConnected = await testConnection();

    return NextResponse.json({
      success: isConnected,
      message: isConnected
        ? "Database connected successfully!"
        : "Database connection failed",
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "API error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

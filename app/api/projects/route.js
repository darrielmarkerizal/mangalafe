import { NextResponse } from "next/server";
import Project from "../../../models/project.js";

export async function GET() {
  try {
    // Get all projects from database
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]], // Sort by newest first
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data proyek",
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    // Return error response
    console.error("Gagal mengambil data proyek:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data proyek",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

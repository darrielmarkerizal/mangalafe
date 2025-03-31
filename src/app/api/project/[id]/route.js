import { NextResponse } from "next/server";
import Project from "../../../../../models/project.js";
import Service from "../../../../../models/service.js";
import initializeAssociations from "../../../../../models/associations.js";

initializeAssociations();

export async function GET(request, { params }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID proyek harus disertakan",
        },
        { status: 400 }
      );
    }

    const project = await Project.findOne({
      where: { id: id },
      include: [
        {
          model: Service,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      ],
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Proyek tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data proyek",
        data: project,
      },
      { status: 200 }
    );
  } catch (error) {
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

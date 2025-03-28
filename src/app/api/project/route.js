import { NextResponse } from "next/server";
import Project from "../../../../models/project.js";
import ProjectService from "../../../../models/projectservice.js";
import Service from "../../../../models/service.js";
import { Op } from "sequelize";
import { sequelize } from "../../../../config/database.js";
import initializeAssociations from "../../../../models/associations.js";

initializeAssociations();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "DESC";
    const page = parseInt(searchParams.get("page")) || 1;
    const perPage = parseInt(searchParams.get("perPage")) || 10;

    const allowedSortFields = ["name", "createdAt"];
    const allowedSortOrders = ["ASC", "DESC"];

    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Parameter sortBy tidak valid. Gunakan 'name' atau 'createdAt'",
        },
        { status: 400 }
      );
    }

    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter sortOrder tidak valid. Gunakan 'ASC' atau 'DESC'",
        },
        { status: 400 }
      );
    }

    const queryOptions = {
      order: [[sortBy, sortOrder]],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: Service,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      ],
    };

    if (search) {
      queryOptions.where = {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$Services.name$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      };
    }

    const { count: totalItems, rows: projects } =
      await Project.findAndCountAll(queryOptions);

    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Data proyek tidak ditemukan",
          data: [],
          metadata: {
            currentPage: page,
            perPage,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data proyek",
        data: projects,
        metadata: {
          currentPage: page,
          perPage,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
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

export async function POST(request) {
  // Mulai transaction
  const t = await sequelize.transaction();

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await t.rollback();
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Bearer token diperlukan",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validasi field yang diperlukan
    const requiredFields = ["name", "initiator", "period", "services"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      await t.rollback();
      return NextResponse.json(
        {
          success: false,
          message: `Data berikut harus diisi: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validasi services harus array dan minimal 1
    if (!Array.isArray(body.services) || body.services.length === 0) {
      await t.rollback();
      return NextResponse.json(
        {
          success: false,
          message: "Minimal harus memilih 1 layanan",
        },
        { status: 400 }
      );
    }

    // Validasi period
    if (body.period < 2000 || body.period > 2100) {
      await t.rollback();
      return NextResponse.json(
        {
          success: false,
          message: "Periode harus berada di antara tahun 2000-2100",
        },
        { status: 400 }
      );
    }

    // Validasi service IDs exist
    const services = await Service.findAll({
      where: {
        id: body.services,
      },
      transaction: t,
    });

    if (services.length !== body.services.length) {
      await t.rollback();
      return NextResponse.json(
        {
          success: false,
          message: "Beberapa ID layanan tidak valid",
        },
        { status: 400 }
      );
    }

    // Buat project baru
    const newProject = await Project.create(
      {
        name: body.name,
        initiator: body.initiator,
        period: body.period,
        photo: body.photo || null,
      },
      { transaction: t }
    );

    // Buat relasi project-service
    await ProjectService.bulkCreate(
      body.services.map((serviceId) => ({
        projectId: newProject.id,
        serviceId: serviceId,
      })),
      { transaction: t }
    );

    // Commit transaction
    await t.commit();

    // Ambil project dengan relasinya
    const projectWithServices = await Project.findOne({
      where: { id: newProject.id },
      include: [
        {
          model: Service,
          through: { attributes: [] },
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat proyek baru",
        data: projectWithServices,
      },
      { status: 201 }
    );
  } catch (error) {
    // Hanya lakukan rollback jika transaction masih aktif
    if (t && !t.finished) {
      await t.rollback();
    }

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          error: error.errors.map((err) => err.message),
        },
        { status: 400 }
      );
    }

    console.error("Gagal membuat proyek:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat proyek",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

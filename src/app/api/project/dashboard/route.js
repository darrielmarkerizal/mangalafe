import { NextResponse } from "next/server";
import Project from "../../../../../models/project";
import Service from "../../../../../models/service";
import ProjectService from "../../../../../models/projectservice";
import { sequelize } from "../../../../../config/database.js";
import { Op } from "sequelize";

export async function GET(request) {
  try {
    // Hitung total proyek
    const totalProjects = await Project.count();

    // Dapatkan semua layanan
    const services = await Service.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Hitung jumlah proyeksi per layanan menggunakan ProjectService
    const serviceStats = await Promise.all(
      services.map(async (service) => {
        const count = await ProjectService.count({
          where: { serviceId: service.id },
        });

        return {
          id: service.id,
          name: service.name,
          count: count,
        };
      })
    );

    // Dapatkan 5 proyek terbaru (tanpa join ke Service)
    const latestProjects = await Project.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    // Tambahkan informasi layanan ke setiap proyek secara manual
    for (const project of latestProjects) {
      const projectServices = await ProjectService.findAll({
        where: { projectId: project.id },
        attributes: ["serviceId"],
      });

      const serviceIds = projectServices.map((ps) => ps.serviceId);

      if (serviceIds.length > 0) {
        const projectServiceDetails = await Service.findAll({
          where: { id: serviceIds },
          attributes: ["id", "name"],
        });

        project.dataValues.Services = projectServiceDetails;
      } else {
        project.dataValues.Services = [];
      }
    }

    // Hitung proyek per periode
    const projectsByPeriod = await Project.findAll({
      attributes: [
        "period",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["period"],
      order: [["period", "DESC"]],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil statistik proyek",
        data: {
          total: totalProjects,
          byService: serviceStats,
          byPeriod: projectsByPeriod,
          latestProjects: latestProjects,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal mengambil statistik proyek:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil statistik proyek",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

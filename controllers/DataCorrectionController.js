const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");

class DataCorrectionController {
  async dataCorrectionGet(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const city = await prisma.rawFormData.groupBy({
          by: ["city"],
          _count: {
            id: true,
          },
          orderBy: {
            _count: {
              id: "desc",
            },
          },

          take: 1,
        });

        response.success(res, "Current city with count fetched!", {
          currentCity: city,
        });
      } else {
        response.error(res, "User not already logged in.");
      }
    } catch (error) {
      console.log("error while getting users", error);
    }
  }
}

module.exports = new DataCorrectionController();

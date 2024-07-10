const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getLoggedInUser = require("../utils/getLoggedInUser");

class ApplicationReportController {
  async applicationReportGet(req, res) {
    try {
      const loggedInUser = await getLoggedInUser(req, res);

      if (loggedInUser) {
        let allApplicationReports;

        if (loggedInUser.roleId === 1) {
          allApplicationReports = await prisma.formStatus.findMany({});
        } else {
          const centerUser = await prisma.centerUser.findFirst({
            where: {
              email: loggedInUser.email,
            },
          });

          allApplicationReports = await prisma.formStatus.findMany({
            where: {
              addedBy: centerUser.id,
            },
          });
        }

        const applicationReportWithDetails = await Promise.all(
          allApplicationReports?.map(async (report) => {
            const form = await prisma.form.findFirst({
              where: {
                id: report.formId,
                status: 1,
              },
            });

            const formUser = await prisma.centerUser.findFirst({
              where: {
                id: form?.addedBy,
              },
            });

            return {
              formId: report.formId,
              formStatus: report.formStatus,
              applicationNo: report.applicationNo,
              ...form,
              user: { ...formUser },
            };
          })
        );

        response.success(res, "Fetched application reports!", {
          applicationReports: applicationReportWithDetails,
        });
      }
    } catch (error) {
      console.log("error while fetching application reports ->", error);
    }
  }
  async applicationReportFilter(req, res) {
    try {
      const loggedInUser = await getLoggedInUser(req, res);
      const { searchQuery } = req.body;

      if (loggedInUser) {
        let allApplicationReports;

        if (loggedInUser.roleId === 1) {
          allApplicationReports = await prisma.formStatus.findMany({
            where: {
              OR: [
                {
                  applicationNo: { contains: searchQuery },
                },
              ],
            },
          });

          // If no results found, fetch all records
          if (allApplicationReports.length === 0) {
            allApplicationReports = await prisma.formStatus.findMany();
          }
        } else {
          const centerUser = await prisma.centerUser.findFirst({
            where: {
              email: loggedInUser.email,
            },
          });

          allApplicationReports = await prisma.formStatus.findMany({
            where: {
              addedBy: centerUser.id,
              OR: [{ applicationNo: { contains: searchQuery } }],
            },
          });

          if (allApplicationReports.length === 0) {
            allApplicationReports = await prisma.formStatus.findMany({
              where: {
                addedBy: centerUser.id,
              },
            });
          }
        }

        const applicationReportWithDetails = await Promise.all(
          allApplicationReports?.map(async (report) => {
            const form = await prisma.form.findFirst({
              where: {
                id: report.formId,
                status: 1,
                OR: [
                  { fullName: { contains: searchQuery } },
                  { mobileNo: { contains: searchQuery } },
                  { panNo: { contains: searchQuery } },
                ],
              },
            });

            const formUser = await prisma.centerUser.findFirst({
              where: {
                id: form?.addedBy,
              },
            });
            if (form) {
              return {
                formId: report.formId,
                formStatus: report.formStatus,
                applicationNo: report.applicationNo,
                ...form,
                user: { ...formUser },
              };
            }
          })
        ).then((res) => res.filter(Boolean));

        response.success(res, "Fetched application reports!", {
          applicationReports: applicationReportWithDetails,
        });
      }
    } catch (error) {
      console.log("error while fetching application reports ->", error);
    }
  }
}

module.exports = new ApplicationReportController();

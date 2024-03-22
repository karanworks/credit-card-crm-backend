const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Abhi campaign model migrate nhi kiya hai
// Abhi campaign model migrate nhi kiya hai
// Abhi campaign model migrate nhi kiya hai
// Abhi campaign model migrate nhi kiya hai
class CampaignController {
  async campaignCreatePost(req, res) {
    try {
      const { campaignName, campaignDescription, campaignType } = req.body;

      // admin that is creating the user
      const adminId = parseInt(req.params.adminId);

      const newCampaign = await prisma.campaign.create({
        data: {
          campaignName,
          campaignDescription,
          campaignType,
          adminId,
        },
      });

      res.status(201).json({
        message: "new campaign created!",
        data: newCampaign,
      });
    } catch (error) {
      console.log("error while creating campaign ->", error);
    }
  }

  async campaignUpdatePatch(req, res) {
    try {
      const { campaignName, campaignDescription, campaignType } = req.body;
      const { campaignId } = req.params;

      // finding campaign from id
      const campaignFound = await prisma.campaign.findFirst({
        where: {
          id: parseInt(campaignId),
        },
      });

      if (campaignFound) {
        const updatedData = await prisma.campaign.update({
          where: {
            id: parseInt(campaignId),
          },
          data: {
            campaignName,
            campaignDescription,
            campaignType,
          },
        });

        res.json({
          message: "campaign updated successfully!",
          data: updatedData,
        });
      } else {
        res.json({ message: "campaign not found!" });
      }
    } catch (error) {
      console.log("error while updating campaign ", error);
    }
  }
  async campaignRemoveDelete(req, res) {
    try {
      const { campaignId } = req.params;

      console.log("delete campaign api triggered ->", campaignId);

      // finding campaign from campaignId
      const campaignFound = await prisma.campaign.findFirst({
        where: {
          id: parseInt(campaignId),
        },
      });

      if (campaignFound) {
        const deletedCampaign = await prisma.campaign.delete({
          where: {
            id: parseInt(campaignId),
          },
        });

        res.status(201).json({
          message: "campaign deleted successfully!",
          data: { deletedCampaign },
        });
      } else {
        res.status(404).json({ message: "campaign does not exist!" });
      }
    } catch (error) {
      console.log("error while deleting campaign ", error);
    }
  }
}

module.exports = new CampaignController();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeScore = async (scoreData) => {
  const childId = scoreData.childID;
  const environmentId = scoreData.environmentID;

  const startTime = new Date(scoreData.activityStartTime);
  const endTime = new Date(scoreData.activityEndTime);

  const traitsAcquireData = [
    { traitId: 1, value: scoreData.scoreToKeepSelfAwareness },
    { traitId: 2, value: scoreData.scoreToKeepSelfManagement },
    { traitId: 3, value: scoreData.scoreToKeepSocialAwareness },
    { traitId: 4, value: scoreData.scoreToKeepResponsibleDecisionMaking },
    { traitId: 5, value: scoreData.scoreToKeepRelationshipMaking },
  ];

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const childEnvironment = await prisma.ChildEnviroments.findFirst({
        where: {
          childId: childId,
          enviromentId: environmentId,
        },
      });

      if (!childEnvironment) {
        throw new Error("Child Environment not found.");
      }
      const childEnvironmentId = childEnvironment.id;

      const childEnvironmentActivity =
        await prisma.ChildEnviromentsActivity.create({
          data: {
            activityTimeStart: startTime,
            activityTimeEnd: endTime,
            ChildEnviromentsId: childEnvironmentId,
          },
        });

      const childEnvironmentActivityId = childEnvironmentActivity.id;

      const traitsAcquirePromises = traitsAcquireData.map(async (traitData) => {
        console.log({
          childEnvActivityId: childEnvironmentActivityId,
          traitId: traitData.traitId,
          value: parseFloat(traitData.value),
        });
        const traitsAcquire = await prisma.TraitsAcquire.create({
          data: {
            childEnvActivityId: childEnvironmentActivityId,
            traitId: traitData.traitId,
            value: parseFloat(traitData.value),
          },
        });

        return traitsAcquire;
      });

      await Promise.all(traitsAcquirePromises);

      return {
        childEnvironmentId: childEnvironmentId,
        childEnvironmentActivityId: childEnvironmentActivityId,
      };
    });

    return result;
  } catch (error) {
    console.error("Error storing score:", error);
    throw new Error("Error storing score.");
  }
};

const generateReports = async (req, res) => {
  const parentId = req.authData.id;

  try {
    const children = await prisma.children.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        ChildEnviroments: {
          include: {
            ChildEnviromentsActivity: {
              include: {
                TraitsAcquire: {
                  select: {
                    value: true,
                    traitId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const reports = [];

    for (const child of children) {
      const childReports = [];

      for (const childEnvironment of child.ChildEnviroments) {
        for (const childEnvironmentActivity of childEnvironment.ChildEnviromentsActivity) {
          for (const traitAcquire of childEnvironmentActivity.TraitsAcquire) {
            const trait = await prisma.traits.findUnique({
              where: {
                id: traitAcquire.traitId,
              },
              select: {
                name: true,
              },
            });

            childReports.push({
              traitName: trait.name,
              value: traitAcquire.value,
            });
          }
        }
      }

      reports.push({
        id: child.id,
        firstName: child.firstName,
        lastName: child.lastName,
        image: child.image,
        reports: childReports,
      });
    }

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Error generating reports." });
  }
};

module.exports = {
  storeScore,
  generateReports,
};

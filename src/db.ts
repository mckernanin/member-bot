import * as dynamoose from "dynamoose";
import config from "./config";

export const connect = () => {
  dynamoose.setDefaults({
    create: true,
    prefix: "Dev",
    suffix: "",
    waitForActive: true, // Wait for table to be created
    waitForActiveTimeout: 1800 // 3 minutes,
  });

  dynamoose.AWS.config.update({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey,
    region: config.aws.region
  });

  // dynamoose.local("http://localhost:8000");
};

export const Model = dynamoose.model("Corporation", {
  corporationId: Number,
  corporationName: String,
  data: String,
  createdAt: Date
});

interface CorpMemberSnapshot {
  data: string;
  corporationName: string;
  corporationId: number;
  createdAt: number;
}

export const getCorporation = async (
  corporationId: number
): Promise<CorpMemberSnapshot> => {
  const corporation = await Model.get(corporationId);
  return (corporation as any) as CorpMemberSnapshot;
};

export const updateCorporation = async (
  corporationId: number,
  data: Partial<CorpMemberSnapshot>
) => {
  const corporation = await Model.update({ corporationId }, data);
  return corporation;
};

export const createCorporation = async (data: Partial<CorpMemberSnapshot>) => {
  const corporation = new Model({
    ...data
  });
  await corporation.save();
  return corporation;
};

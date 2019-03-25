import * as dynamoose from "dynamoose";

const Corporation = dynamoose.model("Corporation", {
  corporationId: Number,
  corporationName: String,
  createdAt: Date,
  members: Array
});

interface CorpMemberSnapshot {
  members: Array<{
    id: number;
    name: string;
  }>;
  corporationName: string;
  corporationId: string;
  createdAt: Date;
}

export const connect = () => {
  dynamoose.AWS.config.update({
    accessKeyId: "AKID",
    secretAccessKey: "SECRET",
    region: "us-east-1"
  });
  dynamoose.local("http://10.0.0.108:8000");
};

export const getCorporation = async (corporationId: number) => {
  const corporation = await Corporation.get(corporationId);
  return corporation;
};

export const updateCorporation = async (
  corporationId: number,
  data: Partial<CorpMemberSnapshot>
) => {
  const corporation = await Corporation.update({ corporationId }, data);
  return corporation;
};

export const createCorporation = async (data: Partial<CorpMemberSnapshot>) => {
  const corporation = new Corporation(data);
  await corporation.save();
  return corporation;
};

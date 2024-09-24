// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { EnvType, SignClient } from "@ethsign/sign-sdk";

type Data = {
  key: string;
};

const privateKey = "0x83da451af8bb85589f0d144dae84b2b34523fa38f85478d8d5a2233e73dd95e5"; // eth private key
const tenantId = "es0025"; //sent us your publicKey to get it
const client = new SignClient(
  {
    account: privateKeyToAccount(privateKey),
    tenantId: tenantId
  },
  EnvType.prod
);

const checkContractStatus = async (contractId: string, userAddress: string) => {
  const contractInfo = await client.checkContractStatus(contractId, userAddress);
  console.log(contractInfo);
  return contractInfo;
};

const generateWebApiKey = async (contractId: string) => {
  const webApiKey = await client.generateWebApiKey(contractId);
  return webApiKey;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const key = await generateWebApiKey(
    (
      await checkContractStatus(req.body.contractId, req.body.userAddress)
    ).contractId
  );
  res.status(200).json({ key });
}

// jbettenc.eth sent you a document to sign.  Open the link and input the password to sign the contract.
// Contract Link: https://app.ethsign.xyz/contract/ES-V-FgWnYmfTpqwq1OzmTflYe

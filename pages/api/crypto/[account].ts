// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

type Data = {
  signature: string
}

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { account } = req.query;

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  const owner = new ethers.Wallet(privateKey!);

  let messageHash = "";
  let signature = "";

  // Compute message hash
  messageHash = ethers.utils.id(account as string);

  // Sign the message hash
  let messageBytes = ethers.utils.arrayify(messageHash);
  signature = await owner.signMessage(messageBytes);

  res.status(200).json({ signature })
}


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
  owner: ethers.Wallet
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const privateKey = process.env.PRIVATE_KEY;
  const owner = new ethers.Wallet(privateKey!);

  console.log("server owner: ", owner);

  res.status(200).json({owner: owner})
}


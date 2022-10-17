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
  messageHash: string,
  signature: string,
  isSuccess: boolean
}

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const allowlistedAddresses= require('allowlist.json'); 
  const { selectedAddress } = req.query;

  console.log("allowlistedAddresses: ", allowlistedAddresses);
  console.log("selectedAddress: ", selectedAddress);

  const privateKey = process.env.WALLET_PRIVATE_KEY;

  console.log("privateKey: ", privateKey);

  const owner = new ethers.Wallet(privateKey!);

  let messageHash = "";
  let signature = "";
  let isSuccess = false;

  // Check if selected address is in allowlist
  // If yes, sign the wallet's address
  if (allowlistedAddresses.includes(selectedAddress)) {
    // Compute message hash
    messageHash = ethers.utils.id(selectedAddress as string);

    // Sign the message hash
    let messageBytes = ethers.utils.arrayify(messageHash);
    signature = await owner.signMessage(messageBytes);
    isSuccess = true;
  } else {
    isSuccess = false;
  }

  res.status(200).json({ messageHash, signature, isSuccess })
}


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import redisClient from '../../../lib/redisConnection';

type Data = {
  success: boolean,
  signature: string
}

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    const { account } = req.query;

    let signature = await redisClient.get(account as string); 

    if (signature) {
      res.status(200).json({ 
        success: true,
        signature: signature 
      });
    } else {
      res.status(200).json({ 
        success: false,
        signature: "" 
      });
    }

  } catch (error) {
    console.log(error);
  }
  
}


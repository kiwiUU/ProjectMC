// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import path from 'path';

type Data = {
  success: boolean,
  proof: string[]
}

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    //update
    const data = 'tree.json';
    
    const { account } = req.query;
    const treePath = path.join(process.cwd(), 'json', data);

    const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(treePath, 'utf8')));

    let proof;

    // tree.entries()에 저장되어 있는 값은 대소문자를 구별한다. 
    for (const [i, v] of tree.entries()) {
        if (v[0] == (account as string).toLowerCase()) {
            proof = tree.getProof(i);

            return res.status(200).json({
                    success: true,
                    proof: proof
                  });
        }
    }

    res.status(200).json({
      success: false,
      proof: []
    });

  } catch (error) {
    console.log(error);
  }
  
}


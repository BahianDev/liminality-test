import {
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getAssociatedTokenAddress
} from "@solana/spl-token";
import { connection } from "../services/web3";

const getOrCreateAssociatedTokenAccount = async (payer, mintAddress, owner) => {
  let instruction;
  const address = getAssociatedTokenAddressSync(mintAddress, owner, true);

  try {
    await getAccount(connection, address);
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) {
      instruction = createAssociatedTokenAccountInstruction(
        payer,
        address,
        owner,
        mintAddress
      );
    } else {
      throw err;
    }
  }

  return { address, instruction };
};

export { getOrCreateAssociatedTokenAccount };

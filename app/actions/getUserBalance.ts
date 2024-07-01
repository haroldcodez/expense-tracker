'use server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

async function getUserBalance(): Promise<{
    balance?: number;
    error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {userId},
    });
    
    const balance = transactions.reduce((sum, transactions) => sum + transactions.amount, 0)
    return { balance };

  } catch (error) {
    return { error: "Failed to fetch the user's balance from the Database" };
  }
  
}

export default getUserBalance;
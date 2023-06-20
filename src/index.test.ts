import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { HATS_ABI } from "./abi/Hats";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("http://127.0.0.1:8545"),
});
const walletClient = createWalletClient({
  chain: mainnet,
  transport: http("http://127.0.0.1:8545"),
});
const address1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const address2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const account1 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
const account2 = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
);

describe("Create Tophat", () => {
  beforeAll(async () => {
    // Simulates a valid transaction, no reverts on the contract
    const { request } = await publicClient.simulateContract({
      address: "0x9D2dfd6066d5935267291718E8AA16C8Ab729E9d",
      abi: HATS_ABI,
      functionName: "mintTopHat",
      args: [address1, "Tophat 1 details", "Tophat 1 URI"],
      account: account1,
    });

    const hash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({ hash });
  }, 30000);

  test("Test top-hat is created", async () => {
    const res = await publicClient.readContract({
      address: "0x9D2dfd6066d5935267291718E8AA16C8Ab729E9d",
      abi: HATS_ABI,
      functionName: "viewHat",
      args: [
        BigInt(
          "0x0000000100000000000000000000000000000000000000000000000000000000"
        ),
      ],
    });

    expect(res[0]).toBe("Tophat 1 details");
    expect(res[5]).toBe("Tophat 1 URI");
  });
});

describe("Hat 1.1 is created", () => {
  beforeAll(async () => {
    // Simulates an invalid transaction, contract reverts. A SIGSEGV error happens
    const { request } = await publicClient.simulateContract({
      address: "0x9D2dfd6066d5935267291718E8AA16C8Ab729E9d",
      abi: HATS_ABI,
      functionName: "createHat",
      args: [
        BigInt(
          "0x0000000100000000000000000000000000000000000000000000000000000000"
        ),
        "1.1 details",
        3,
        address1,
        address1,
        true,
        "1.1 URI",
      ],
      account: account2,
    });

    const hash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({ hash });
  }, 30000);

  test("Test hat is created", async () => {
    const res = await publicClient.readContract({
      address: "0x9D2dfd6066d5935267291718E8AA16C8Ab729E9d",
      abi: HATS_ABI,
      functionName: "viewHat",
      args: [
        BigInt(
          "0x0000000100010000000000000000000000000000000000000000000000000000"
        ),
      ],
    });

    expect(res[0]).toBe("1.1 details");
    expect(res[1]).toBe(3);
    expect(res[2]).toBe(0);
    expect(res[3]).toBe(address1);
    expect(res[4]).toBe(address1);
    expect(res[5]).toBe("1.1 URI");
    expect(res[6]).toBe(0);
    expect(res[7]).toBe(true);
    expect(res[8]).toBe(true);
  });
});

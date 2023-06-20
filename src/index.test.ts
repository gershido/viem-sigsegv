import {
  createWalletClient,
  createPublicClient,
  http,
  Address,
  PublicClient,
  WalletClient,
  PrivateKeyAccount,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { HATS_ABI } from "./abi/Hats";

describe("Test", () => {
  let publicClient: PublicClient;
  let walletClient: WalletClient;
  let address1: Address;
  let address2: Address;
  let account1: PrivateKeyAccount;
  let account2: PrivateKeyAccount;

  beforeAll(async () => {
    address1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    address2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    account1 = privateKeyToAccount(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );
    account2 = privateKeyToAccount(
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    );

    publicClient = createPublicClient({
      chain: mainnet,
      transport: http("http://127.0.0.1:8545"),
    });

    walletClient = createWalletClient({
      chain: mainnet,
      transport: http("http://127.0.0.1:8545"),
    });

    const { request } = await publicClient.simulateContract({
      address: "0x9D2dfd6066d5935267291718E8AA16C8Ab729E9d",
      abi: HATS_ABI,
      functionName: "mintTopHat",
      args: [address2, "Tophat 1 details", "Tophat 1 URI"],
      account: account2,
    });
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

    expect(res[0]).toBe("Tophat SDK");
    expect(res[5]).toBe("Tophat URI");
  });
});

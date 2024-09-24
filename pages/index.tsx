import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  decodeOnChainData,
  DataLocationOnChain
} from "@ethsign/sp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";

export default function Home() {
  const [result, handleResult] = useState("");
  const [schemaId, handleSchemaId] = useState("");
  const [attestationId, handleAttestationId] = useState("");
  const [attestationData, handleAttestationData] = useState("");
  const [schemaData, handleSchemaData] = useState("");
  const { address } = useAccount();
  const chainId = useChainId();

  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ConnectButton />
        <button
          onClick={async () => {
            const client = new SignProtocolClient(SpMode.OnChain, {
              chain: EvmChains.baseSepolia
            });

            const res = await client.createSchema({
              name: "SDK Test",
              data: [
                { name: "contractDetails", type: "string" },
                { name: "signer", type: "address" }
              ]
            });

            handleResult(JSON.stringify(res));
          }}
        >
          Create Schema
        </button>

        <input
          className="text-black"
          id="schemaId"
          placeholder="Schema ID"
          value={schemaId}
          onChange={(e) => handleSchemaId(e.target.value)}
        />
        <button
          onClick={async () => {
            const client = new SignProtocolClient(SpMode.OnChain, {
              chain: EvmChains.baseSepolia
            });

            const res = await client.createAttestation({
              schemaId: schemaId,
              data: {
                contractDetails: "contract details",
                signer: address
              },
              indexingValue: address?.toLowerCase() ?? ""
            });

            handleResult(JSON.stringify(res));
          }}
        >
          Create Attestation
        </button>

        <input
          className="text-black"
          id="attestationId"
          placeholder="Attestation ID"
          value={attestationId}
          onChange={(e) => handleAttestationId(e.target.value)}
        />
        <button
          onClick={async () => {
            const indexService = new IndexService("testnet");

            const attId = `onchain_evm_${chainId}_${attestationId}`;
            const res = await indexService.queryAttestationList(attId);

            handleResult(JSON.stringify(res));
          }}
        >
          Get Attestation
        </button>

        <input
          className="text-black"
          id="attestationData"
          placeholder="Attestation Data"
          value={attestationData}
          onChange={(e) => handleAttestationData(e.target.value)}
        />
        <input
          className="text-black"
          id="schemaData"
          placeholder="Schema Data"
          value={schemaData}
          onChange={(e) => handleSchemaData(e.target.value)}
        />
        <button
          onClick={async () => {
            handleResult(
              JSON.stringify(decodeOnChainData(attestationData, DataLocationOnChain.ONCHAIN, JSON.parse(schemaData)))
            );
          }}
        >
          Decode Attestation Data
        </button>

        <p className="break-all">{result}</p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

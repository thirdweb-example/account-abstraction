"use client";
import React, { useState } from "react";
import { balanceOf, claimTo, getNFT } from "thirdweb/extensions/erc1155";
import {
	ConnectButton,
	MediaRenderer,
	TransactionButton,
	useActiveAccount,
	useReadContract,
} from "thirdweb/react";
import { accountAbstraction, client, editionDropTokenId } from "../constants";
import Link from "next/link";
import { arbitrumSepolia, baseSepolia } from "thirdweb/chains";
import { ThirdwebContract, getContract } from "thirdweb";
import { TxReceipt } from "../components/TxReceipt";

const GaslessHome: React.FC = () => {
	const smartAccount = useActiveAccount();

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100">
				Multichain
				<br />
				sponsored transactions
			</h1>
			<ConnectButton
				client={client}
				accountAbstraction={accountAbstraction}
				connectModal={{
					size: "compact",
				}}
			/>

			<div className="flex flex-row">
				<NFTClaimer
					receiverAddress={smartAccount?.address}
					dropContract={getContract({
						address: "0xd35F1bE71EC781400ED4b19A1fFF6e0666037189",
						chain: baseSepolia,
						client,
					})}
					tokenId={0n}
				/>
				<div className="h-auto w-[1px] bg-gray-600 mx-12 mt-8" />
				<NFTClaimer
					receiverAddress={smartAccount?.address}
					dropContract={getContract({
						address: "0x51F5ad46db789Db86647B1BC8C4aD5085efbf734",
						chain: arbitrumSepolia,
						client,
					})}
					tokenId={0n}
				/>
			</div>

			<Link href={"/"} className="text-sm text-gray-400 mt-8">
				Back to menu
			</Link>
		</div>
	);
};

type NFTClaimerProps = {
	receiverAddress?: string;
	dropContract: ThirdwebContract;
	tokenId: bigint;
};

const NFTClaimer: React.FC<NFTClaimerProps> = (props: NFTClaimerProps) => {
	const [lastTxHash, setLastTxHash] = useState<string | null>(null);
	const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
		contract: props.dropContract,
		tokenId: props.tokenId,
	});
	const { data: ownedNfts } = useReadContract(balanceOf, {
		contract: props.dropContract,
		owner: props.receiverAddress!,
		tokenId: props.tokenId,
		queryOptions: { enabled: !!props.receiverAddress },
	});
	return (
		<div className="flex flex-col my-8">
			{isNftLoading ? (
				<div className="w-full mt-24">Loading...</div>
			) : (
				<>
					{nft ? (
						<MediaRenderer client={client} src={nft.metadata.image} />
					) : null}
					{props.receiverAddress ? (
						<>
							<p className="font-semibold text-center my-2">
								You own {ownedNfts?.toString() || "0"} NFT on{" "}
								{props.dropContract.chain.name}
							</p>
							<TransactionButton
								transaction={() =>
									claimTo({
										contract: props.dropContract,
										tokenId: props.tokenId,
										to: props.receiverAddress!,
										quantity: 1n,
									})
								}
								onError={(error) => {
									alert(`Error: ${error.message}`);
								}}
								onTransactionConfirmed={async (receipt) => {
									setLastTxHash(receipt.transactionHash);
								}}
							>
								Claim!
							</TransactionButton>
							{lastTxHash && (
								<TxReceipt
									hash={lastTxHash}
									chain={props.dropContract.chain}
									onClose={() => setLastTxHash(null)}
								/>
							)}
						</>
					) : (
						<p className="text-center mt-8">
							Login to claim this NFT on {props.dropContract.chain.name}!
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default GaslessHome;

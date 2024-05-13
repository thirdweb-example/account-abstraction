"use client";
import { useState } from "react";
import {
	ConnectButton,
	TransactionButton,
	useActiveAccount,
	useActiveWalletConnectionStatus,
	useReadContract,
} from "thirdweb/react";
import {
	addSessionKey,
	getAllActiveSigners,
} from "thirdweb/extensions/erc4337";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getContract } from "thirdweb";
import {
	accountAbstraction,
	chain,
	client,
	editionDropAddress,
} from "../constants";
import Link from "next/link";

const AddSigner = () => {
	const smartAccount = useActiveAccount();
	const status = useActiveWalletConnectionStatus();
	const [walletToAdd, setWalletToAdd] = useState("");

	const { data: activeSigners } = useReadContract(getAllActiveSigners, {
		contract: getContract({
			address: smartAccount?.address!,
			chain,
			client,
		}),
		queryOptions: {
			enabled: !!smartAccount?.address,
		},
	});

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100">
				Session Keys
			</h1>
			<ConnectButton
				client={client}
				accountAbstraction={accountAbstraction}
				connectModal={{
					size: "compact",
				}}
			/>
			{status === "connected" ? (
				<div className="flex flex-col mt-8">
					<h3 className="text-lg font-bold mt-8">
						Add a scoped session key to your wallet
					</h3>
					<p className="text-sm text-gray-400">
						The key is configured to access the smart wallet with certain
						restrictions
					</p>
					<div className="flex mt-4 mb-4">
						<input
							className="rounded-lg text-black p-4 w-2/3 mr-4"
							type="text"
							placeholder="Address or ENS"
							onChange={(e) => setWalletToAdd(e.target.value)}
						/>
						<TransactionButton
							transaction={async () => {
								if (!walletToAdd) {
									throw new Error("Please enter an address");
								}
								if (!smartAccount) {
									throw new Error("Please enter an address");
								}
								return addSessionKey({
									contract: getContract({
										address: smartAccount.address,
										chain,
										client,
									}),
									account: smartAccount!,
									sessionKeyAddress: await resolveAddress({
										client,
										name: walletToAdd,
									}),
									permissions: {
										approvedTargets: [editionDropAddress],
									},
								});
							}}
						>
							Add Session Key
						</TransactionButton>
					</div>
					<h3 className="text-lg font-bold">Active session keys</h3>
					<ul>
						{activeSigners?.length ? (
							activeSigners.map((a) => (
								<li className="text-sm text-gray-400" key={a.signer}>
									{a.signer}
								</li>
							))
						) : (
							<li className="text-sm text-gray-400">
								No active session keys added
							</li>
						)}
					</ul>
				</div>
			) : (
				<p className="text-sm text-gray-400 mt-8">Login to add session keys</p>
			)}
			<Link href={"/"} className="text-sm text-gray-400 mt-8">
				Back to menu
			</Link>
		</div>
	);
};

export default AddSigner;
